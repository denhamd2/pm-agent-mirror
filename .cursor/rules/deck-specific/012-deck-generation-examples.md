---
description: Deck generation examples - Agenda slides, Section Title patterns, Slide Title standards, SWOT tables
globs:
  - "docs/decks/specs/slides_spec*.json"
  - "scripts/build_*_pmf_slides*.py"
alwaysApply: false
---

# Deck Generation Examples

Detailed formatting examples for slide decks generated via Slide Deck MCP. These supplement the core standards in `010-style-guide.mdc`.

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
      "text": "1.  Section One\n\n2.  Section Two\n\n3.  Section Three"
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

### Agenda Slide Formatting Standards

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
      "text": "1.  Section One\n\n2.  Section Two\n\n3.  Section Three\n\n4.  Section Four\n\n5.  Section Five"
    }
  ]
}
```

**Formatting standards**:
- **Layout**: "Section Title" for branded gradient panel on left side
- **Heading**: "Agenda" at 20pt bold, positioned at `left: 3.7` (on white right panel)
- **Font size**: 14pt for list items (not 16pt)
- **Numbering**: Plain text format "1.  Item" with double-space indent after number
- **Spacing**: Double newlines (`\n\n`) between each numbered item for visual breathing room
- **Position**: Text boxes positioned for Section Title layout's white content area on right
- **Color**: "ink" (dark navy) for all text
- **Color**: `ink` for consistency with body content

**When to use custom agenda**:
- Default auto-generation: Quick drafts, internal reviews
- Custom explicit agenda: Executive presentations, knowledge sharing sessions, client-facing decks where readability and professionalism are critical

**Implementation note**: Insert the explicit agenda slide as position 2 in your JSON array (after TITLE slide, before first content slide). The MCP will use your explicit slide instead of auto-generating.

### Slide Title Length Standards

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

## SWOT Analysis Table Example

Complete example showing proper table structure with native bullets:

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

**Key formatting rules**:
- Single 2x2 table structure
- 9pt font size at table level
- 0.25 inch header height
- Native `paragraphs` array with `level: 1` for bullets
- No row height specification (auto-calculate)
- Consistent styling across all rows
