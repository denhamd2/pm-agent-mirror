with open('/Users/david.denham/product-manager-agent/.cursor/rules/130-pmf-slide-generator.mdc', 'r') as f:
    content = f.read()

# Update table
table_old = """| Slide Type | Max Bullets | Chars/Bullet | Product Impl | Target Lines | Validation |
|------------|-------------|--------------|--------------|--------------|------------|
| PESTEL     | 4           | 180-240 chars | 50 words (2 lines) | 7-8 | BLOCKING   |
| Executive Summary | 4 | 200-250 chars | n/a          | 7-8         | BLOCKING   |
| Customer (P1-P5) | 3-4 | 180-220 chars | n/a          | 7         | BLOCKING   |
| SME (SME1-SME5) | 5-6 | 160-200 chars | n/a          | 7-8         | BLOCKING   |
| Validated Themes | 2 themes | 140-180 chars/bullet | n/a | 7-8    | BLOCKING   |
| Recommendations | 4-5 sections | 160-220 chars | n/a | 7-8         | BLOCKING   |
| Strategy Context | 4-5 | 180-220 chars | n/a | 7-8 | ADVISORY   |"""

table_new = """| Slide Type | Max Bullets | Min Chars/Bullet | Max Chars/Bullet | Product Impl | Target Lines | Validation |
|------------|-------------|------------------|------------------|--------------|--------------|------------|
| PESTEL     | 4           | 160 chars        | 240 chars        | 50 words (2 lines) | 7-8 | BLOCKING   |
| Executive Summary | 4 | 180 chars        | 250 chars        | n/a          | 7-8         | BLOCKING   |
| Customer (P1-P5) | 3-4 | 160 chars        | 220 chars        | n/a          | 7         | BLOCKING   |
| SME (SME1-SME5) | 5-6 | 140 chars        | 200 chars        | n/a          | 7-8         | BLOCKING   |
| Validated Themes | 2 themes | 120 chars        | 180 chars        | n/a | 7-8    | BLOCKING   |
| Recommendations | 4-5 sections | 140 chars        | 220 chars        | n/a | 7-8         | BLOCKING   |
| Strategy Context | 4-5 | 140 chars        | 220 chars        | n/a | 7-8 | ADVISORY   |"""

content = content.replace(table_old, table_new)

# Update Pre-Flight Check
preflight_old = """3. **Validation threshold**:
   - If ANY slide > 8 rendered lines: **STOP and revise content** before MCP call (exception: 8.5 lines allowed for Executive Summary with 14pt font and complex synthesis)
   - If 2+ slides = 8-9 lines (borderline): Flag for manual review, proceed with caution"""

preflight_new = """3. **Validation threshold**:
   - **Maximum Density Check**: If ANY slide > 8 rendered lines: **STOP and revise content** before MCP call (exception: 8.5 lines allowed for Executive Summary with 14pt font and complex synthesis)
   - **Minimum Density Check**: If ANY audited slide has median bullet length below `Min Chars/Bullet`: **STOP and enrich content** before MCP call
   - If 2+ slides = 8-9 lines (borderline): Flag for manual review, proceed with caution"""

content = content.replace(preflight_old, preflight_new)

# Update SLIDE DENSITY STANDARD
density_old = """**Sparse slide detection:**
If a slide has ≤3 bullets with no quotes, metrics, or named entities:
→ Expand using synthesis and context from the report
→ OR explicitly label DATA GAP with detailed speaker notes explaining the limitation"""

density_new = """**Sparse slide detection:**
If a slide has ≤3 bullets with no quotes, metrics, or named entities, OR if the median bullet length falls below the validator's `min_chars` hard floor:
→ Expand using synthesis and context from the report (add concrete details, metrics, named entities)
→ OR explicitly label DATA GAP with detailed speaker notes explaining the limitation"""

content = content.replace(density_old, density_new)

with open('/Users/david.denham/product-manager-agent/.cursor/rules/130-pmf-slide-generator.mdc', 'w') as f:
    f.write(content)
