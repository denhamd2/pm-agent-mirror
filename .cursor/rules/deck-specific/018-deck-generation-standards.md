---
description: Deck Generation standards for Slide Deck MCP (typography, layout, formatting)
globs:
  - "docs/decks/specs/slides_spec*.json"
  - ".cursor/rules/110-slide-generator.mdc"
  - ".cursor/rules/130-pmf-slide-generator.mdc"
alwaysApply: false
---

# Deck Generation

**Applies to**: All slide decks generated via Slide Deck MCP (`user-slide-deck-mcp`), including **110-slide-generator** (short decks) and **130-pmf-slide-generator** (full PMF roadmap decks).

**This section is the CANONICAL source** for slide typography, layout, and formatting. Individual deck generator rules (110, 130) reference these standards and add deck-specific logic only (e.g., PESTEL depth requirements, framework selection).

## Slide Content Guidelines
- Use British English spelling throughout
- **Maximum lines per slide**: Never exceed 7-8 total lines of text per slide (including main bullets, sub-bullets, and product implications) to prevent vertical overflow.
- **Bullet length**: Keep individual bullets to 1-2 lines maximum. If a bullet wraps to a 3rd line, rewrite it to be more concise.
- Replace em-dashes with hyphens or commas
- Keep bullets concise; avoid run-on sentences
- Title case for slide titles
- Sentence case for bullet points
- Numbers: use commas for thousands (e.g., 9,922 not 9922)
- Percentages: 79% (no space before %)

## Typography Standards (Workday Slide Deck MCP)

**Canvas dimensions:**
- Canvas: 10.0in x 5.63in
- Title bar: Top ~1.2in (layout placeholder)
- Body content starts: `top_inches: 1.2`

**Font family:**
- All slides: "Archivo"
- Layout title placeholder: ~14pt bold (inherited from template)

**Body text font sizing by content density (VP AUDIENCE - LARGER TEXT REQUIRED):**
- **16pt**: Sparse slides (≤3 bullets, emphasis/key takeaway slides, 1/2 Headline content)
- **14pt**: **Standard slides (4-6 bullets) - Default for most content**
- **12pt**: Dense slides only (>6 bullets, comprehensive tables, PESTEL deep-dive with Product implication)

**In-slide subheadings:**
- **14pt bold** via run-level formatting in `paragraphs`
- Examples: Executive summary blocks, theme titles, section headers within body
- Supporting bullets inherit text box default size

**Section Title layout (divider slides):**
- Text box position: `left_inches: 3.3`, `top_inches: 1.5`, `width_inches: 5.6`, `height_inches: 2.2`
- **CRITICAL**: Do NOT use `paragraphs` array for Section Title slides. It triggers the auto-agenda extraction bug.
- Use a single `"text"` string with a newline (`\n`).
- Example: `"text": "S E C T I O N  0 1\nSection Name"`
- Apply formatting via text_box properties (`font_size_pt: 12`, `color: "ink"`) at the box level.

**Body text box (Title Only / Title Only_Alt layouts):**
- Standard dimensions: `left_inches: 0.7`, `top_inches: 1.2`, `width_inches: 8.6`, `height_inches: 2.8`
- Increase `height_inches` only for tables, charts, or unavoidably dense slides

**Bullets - use `paragraphs` structure:**
- Prefer `text_boxes[].paragraphs` with `level: 1` for native PowerPoint bullets
- Avoid single `text` string with Unicode `•` characters
- Engine applies native bullets automatically when `level ≥ 1`

**Color palette:**
- Text colors: `ink` (dark navy, primary), `ballpoint`, `water_cooler`, `blue_sky`, `pencil`, `paper`, `laptop` (grey, de-emphasis), `staple`, `desk`
- **Always use `"ink"` for body text** - branded backgrounds are LIGHT, not dark

**Product Implication (PESTEL and similar slides):**
- Format: **12pt bold** + **yellow highlight** (`FFFF00`)
- Implementation: Use run-level formatting in `paragraphs`:
  ```json
  {
    "level": 0,
    "text": [
      {"text": "Product implication: ", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"},
      {"text": "Implication text here.", "bold": true, "font_size_pt": 12, "highlight": "FFFF00"}
    ]
  }
  ```
- Start with "Product implication:" prefix
- 12pt retained for dense PESTEL context even when standard slides use 14pt

## Formatting
- Content position: Body text `top_inches: 1.2` (not 1.6) to avoid excess gap below title

## Speaker Notes (MANDATORY for content slides)
- Add `speaker_notes` to every content slide except: TITLE, Section Title, Bumper Slide
- Format: Bullet-pointed presenter guidance, then a "References:" section with live, working URLs
- Example:
```
"speaker_notes": "• Key point to emphasise.\n• Second talking point.\n\nReferences:\n• Source name: https://example.com/live-link"
```

## Agenda Slide & Section Title Pattern (Critical Fix)

**Problem**: The Slide Deck MCP auto-generates an agenda slide by extracting text from Section Title slides. This can create duplicate agendas or malformed agenda text.

**Solution**: Use plain `text` property (not `paragraphs`) in Section Title slides to prevent auto-extraction while still rendering section names.

### Custom Agenda Slide (Recommended Pattern)

When you need custom agenda formatting (numbered list, specific font size, positioning):

```json
{
  "master_index": 1,
  "layout_name": "Section Title",
  "text_boxes": [
    {
      "left_inches": 3.7,
      "top_inches": 0.4,
      "width_inches": 3.8,
      "height_inches": 0.4,
      "font_name": "Archivo",
      "font_size_pt": 20,
      "bold": true,
      "color": "ink",
      "alignment": "left",
      "text": "Agenda"
    },
    {
      "left_inches": 4.2,
      "top_inches": 1.2,
      "width_inches": 5.0,
      "height_inches": 4.0,
      "font_name": "Archivo",
      "font_size_pt": 14,
      "color": "ink",
      "alignment": "left",
      "text": "1. Section One\n\n2. Section Two\n\n3. Section Three"
    }
  ]
}
```

**Key points**:
- Use `"layout_name": "Section Title"` for branded gradient panel on left
- Two text boxes: one for "Agenda" heading (20pt bold), one for numbered list (14pt)
- Position for Section Title layout: `left_inches: 3.7+` (on white right panel)
- Use `"text":` with plain numbered lines (not `"paragraphs"` array)
- Double newlines (`\n\n`) create spacing between items
- Font size 14pt for readability (not 16pt)

### Section Title Slides (Anti-Extraction Pattern)

To display section names WITHOUT triggering auto-agenda extraction:

```json
{
  "master_index": 1,
  "layout_name": "Section Title",
  "text_boxes": [
    {
      "left_inches": 3.3,
      "top_inches": 1.5,
      "width_inches": 5.6,
      "height_inches": 2.2,
      "font_name": "Archivo",
      "font_size_pt": 12,
      "color": "ink",
      "text": "S E C T I O N  0 1\nSection Name"
    }
  ]
}
```

**Critical**: Use `"text":` with newline (`\n`), **NOT** `"paragraphs": [...]`

**Why this works**:
- The MCP extraction code only reads `tb.get("paragraphs", [])` 
- Plain `text` property renders visually but is **not extracted** for auto-agenda
- Prevents duplicate agendas while showing section names

**FORBIDDEN patterns**:
- ❌ Using `paragraphs` array in Section Title slides (triggers auto-extraction)
- ❌ Using `placeholders` in Section Title slides (also triggers auto-extraction)
- ❌ Omitting section names entirely (creates blank divider slides)
- ❌ Using "Blank White Background" layout for agenda (not standard layout)

## Agenda Slide Formatting Standards

**Default behavior**: The Slide Deck MCP auto-generates an agenda slide (slide 2) from Section Title placeholders and slide titles.

**Custom agenda formatting** (branded Section Title layout with 14pt numbered list):

Override the auto-generation by explicitly defining slide 2 in your JSON spec:

```json
{
  "master_index": 1,
  "layout_name": "Section Title",
  "text_boxes": [
    {
      "left_inches": 3.7,
      "top_inches": 0.4,
      "width_inches": 3.8,
      "height_inches": 0.4,
      "font_name": "Archivo",
      "font_size_pt": 20,
      "bold": true,
      "color": "ink",
      "alignment": "left",
      "text": "Agenda"
    },
    {
      "left_inches": 4.2,
      "top_inches": 1.2,
      "width_inches": 5.0,
      "height_inches": 4.0,
      "font_name": "Archivo",
      "font_size_pt": 14,
      "color": "ink",
      "alignment": "left",
      "text": "1. Section One\n\n2. Section Two\n\n3. Section Three\n\n4. Section Four\n\n5. Section Five"
    }
  ]
}
```

**Formatting standards**:
- **Layout**: "Section Title" for branded gradient panel on left side
- **Heading**: "Agenda" at 20pt bold, positioned at `left: 3.7` (on white right panel)
- **Font size**: 14pt for list items (not 16pt)
- **Numbering**: Plain text format "1. Item" with double-space indent after number
- **Spacing**: Double newlines (`\n\n`) between each numbered item for visual breathing room
- **Position**: Text boxes positioned for Section Title layout's white content area on right
- **Color**: "ink" (dark navy) for all text
- **Color**: `ink` for consistency with body content

**When to use custom agenda**:
- Default auto-generation: Quick drafts, internal reviews
- Custom explicit agenda: Executive presentations, knowledge sharing sessions, client-facing decks where readability and professionalism are critical

**Implementation note**: Insert the explicit agenda slide as position 2 in your JSON array (after TITLE slide, before first content slide). The MCP will use your explicit slide instead of auto-generating.

## Slide Title Length Standards

**Constraint hierarchy** (applies to ALL slide titles except TITLE and Bumper Slide):
- **Hard limit**: 45 characters (including spaces) — titles longer than this WILL wrap to second line
- **Target**: 40 characters or fewer — ensures comfortable single-line fit with margin
- **Word limit**: 6-8 words maximum — forces clarity and scan-ability

**Why these limits?**
- Template width (10in) + 14pt Archivo bold font = ~45 character practical maximum for reliable single line
- Titles wrapping to 2 lines overlap body content and look unprofessional
- Short titles = higher impact and easier scanning (McKinsey/BCG best practice)
- **Practical evidence**: Titles at 47-48 chars wrap in practice despite 60 char theoretical limit

**Title writing guidelines**:
- Lead with the key insight or takeaway
- Use active voice and strong verbs
- Remove filler words: "Overview of", "Introduction to", "Discussion about"
- Use colons or em-dashes to add context concisely
- Abbreviate where clear: "Practices & Guidelines" not "Practices and Guidelines"
- Eliminate redundant words: "Process" not "The Process"

**Before/After Examples**:

| Before (Too Long) | Chars | After (Optimized) | Chars |
|---|---|---|---|
| Customer Research Programme - GCC Enterprise | 47 | GCC Customer Research Programme | 32 |
| Leading Practices & Operational Guidelines dd | 48 | Operational Practices & Guidelines | 36 |
| Introduction to the Purge Planning Process | 47 | Purge Planning Process | 23 |
| Overview of Data Architecture and Security | 44 | Data Architecture & Security | 32 |
| Discussion on Scheduling for Minimal Disruption | 51 | Scheduling for Minimal Disruption | 38 |
| Understanding the Automation Capabilities | 44 | Automation Capabilities | 26 |
| Best Practices for Performance and Batching | 47 | Performance & Batching Best Practices | 42 |

**Enforcement (for slide generation agents)**:
- **45+ characters**: REWRITE required — title will wrap, looks unprofessional
- **40-45 characters**: FLAG for optional rewrite — may wrap depending on word breaks
- **Under 40 characters**: APPROVED — clean single-line fit

**Title length check workflow**:
1. Before generating slide spec, review all title text
2. Count characters (including spaces) for each title
3. Rewrite any exceeding 45 characters using guidelines above
4. Consider rewriting 40-45 character titles for maximum impact
5. Verify final spec has no titles >45 characters before calling MCP

## Chart Styling
- **One label per bar:** Use exactly one series for simple bar/column charts so each category has one bar and one Y-axis label. For stacked bars, use `bar_stacked`.
- **Font sizes:** Always set `category_axis_font_size_pt: 9`, `value_axis_font_size_pt: 9`, `title_font_size_pt: 10` to keep chart text readable

## Table Styling
- **Font size:** Use 7-10pt for table content to maximize readability while fitting content
  - **Standard tables**: 8-9pt for VP-friendly readability
  - **SWOT Analysis**: **9pt ONLY** - set at table level to ensure consistency across all cells
  - **Competitive Landscape tables (Regional Specialists, Global Platforms)**: **8pt ONLY** - set at table level only
- **Headers:** Navy background (`ink` color) with white text (`paper` color)
- **Header height:** **MUST be `header_height_inches: 0.25`** for compact, professional headers (especially SWOT analysis)
  - **CRITICAL**: Do NOT omit this property - default header heights are too tall
  - **Note**: This only controls header row height; content rows auto-size based on text
- **SWOT Analysis tables:** Use **SINGLE 2x2 table** with all four quadrants (Strengths|Weaknesses in first content row, Opportunities|Threats in second content row)
  - **CRITICAL - Font size**: Set `font_size_pt: 9` at table level (NOT 10pt) - this ensures consistent 9pt rendering for all cells
  - **CRITICAL - No row heights**: Do NOT specify `height_inches` for content rows - let PowerPoint auto-calculate based on content for compact, balanced layout
  - **CRITICAL - Consistent row styling**: ALL content rows (Strengths/Weaknesses AND Opportunities/Threats) must have identical styling - no special background colors or text colors for different quadrant rows
- **SWOT content formatting**: Each cell should contain **bullet-pointed content** using native PowerPoint bullets with proper `paragraphs` array structure (NOT Unicode `\n• ` text)
  - Use `paragraphs` array with `level: 1` for each bullet point
  - Each bullet is a separate paragraph object in the array
  - PowerPoint will render native bullets automatically
  - 3-5 detailed points per quadrant for VP audience
- **Competitive Landscape table content formatting (MANDATORY)**: Use **plain text with semicolons or commas as separators** (NOT bullet-formatted text within cells)
  - ❌ FORBIDDEN: `"• Point 1\n• Point 2\n• Point 3"` in competitive tables (causes rendering inconsistency)
  - ✅ CORRECT: `"Point 1; Point 2; Point 3"` (ensures consistent 8pt rendering)
  - **Rationale**: Matches Win/Loss table pattern; prevents PowerPoint from applying default paragraph formatting that overrides table-level font sizing
  - **Exception**: SWOT tables continue to use bullet-formatted content within cells
- **Positioning:** Start tables at `top_inches: 1.0`
- **Auto-height tables:** **CRITICAL - Do NOT specify `height_inches` for tables** - omit this property entirely to allow PowerPoint to auto-calculate height based on content. This prevents fixed row heights that cause text overflow or cramping.
- **Example SWOT structure:**
```json
{
  "tables": [
    {
      "rows": [
        ["Strengths", "Weaknesses"], 
        [
          {
            "paragraphs": [
              {"level": 1, "text": "Suite integration and HCM adjacency for hire-to-retire governance"},
              {"level": 1, "text": "Compliance-first architecture with GDPR-class tooling and DPDP-aligned programme paths"},
              {"level": 1, "text": "HiredScore and Paradox differentiation when activated with governance"},
              {"level": 1, "text": "Enterprise security, audit, and multinational rollout proof points"},
              {"level": 1, "text": "Strategic alignment to India Q2 scale growth, DPDP, and partner-led boards"}
            ]
          },
          {
            "paragraphs": [
              {"level": 1, "text": "India competitive narrative requires crisp SKU clarity on SMS, WhatsApp, and AI"},
              {"level": 1, "text": "Local suite bundling and TCO pressure from India-first HR suites"},
              {"level": 1, "text": "Messaging channel fit versus WhatsApp-first culture under enterprise policy constraints"},
              {"level": 1, "text": "Job board story depends on Broadbean verification for India must-post boards"},
              {"level": 1, "text": "Table-stakes execution risk on mobile, bulk, and scheduling without Paradox activation"}
            ]
          }
        ],
        ["Opportunities", "Threats"], 
        [
          {
            "paragraphs": [
              {"level": 1, "text": "DPDP enforcement increases demand for prescriptive defaults and evidence packs"},
              {"level": 1, "text": "Q2 India eight-customer mandate creates coherent GTM story on trusted data and volume efficiency"},
              {"level": 1, "text": "Omnichannel differentiation if SMS and WhatsApp SKU plus policy story lands"},
              {"level": 1, "text": "HiredScore and Paradox activation programmes convert latent entitlement to competitive talking points"},
              {"level": 1, "text": "Bangalore and Mumbai expansion improves local execution credibility with partners"}
            ]
          },
          {
            "paragraphs": [
              {"level": 1, "text": "Darwinbox, Keka, Zoho bundle speed and INR pricing for mid-market anchoring"},
              {"level": 1, "text": "SAP and Oracle incumbency in ERP-aligned India enterprises"},
              {"level": 1, "text": "DPDP complexity and procurement elongation on legal review cycles"},
              {"level": 1, "text": "Messaging framework answers drift erodes trust if sales over-rotates incomplete research"},
              {"level": 1, "text": "Global policy forbidding casual WhatsApp may block India UX without approved enterprise channels"}
            ]
          }
        ]
      ],
      "top_inches": 1.0,
      "font_size_pt": 9,
      "header_row": true,
      "header_bg_color": "ink",
      "header_font_color": "paper",
      "header_height_inches": 0.25
    }
  ]
}
```

## Deck-Specific Rules

**Individual deck generators add specialized logic:**

**110-slide-generator.mdc** (short decks, ~10-20 slides):
- Presentation framework selection (Hero's Journey, Pyramid Principle, etc.)
- HITL questions for audience and purpose
- Framework-adaptive language

**130-pmf-slide-generator.mdc** (full PMF roadmap decks, 36-49 slides):
- PESTEL depth requirements (6+ bullets per factor, anchors, ≥22-word Product implication)
- PMF structure (Executive Summary, Win/Loss, Ideation Hub, triangulation)
- v65 parity checklist for comprehensive country analysis

**Historical reference:**
- `docs/decks/gcc-pmf-roadmap-v65-typography.md`: Technical measurements from actual v30 deck (archival; references 010 for current standards)
