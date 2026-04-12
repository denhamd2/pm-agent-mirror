with open('/Users/david.denham/product-manager-agent/.cursor/rules/010-style-guide.mdc', 'r') as f:
    content = f.read()

old_text = """ - **Calculation method**: `rendered_lines = bullet_count × avg_lines_per_bullet + subheaders + product_implication_lines`
 - **Overflow indicators**: If any bullet exceeds character limit by >20%, or total rendered lines > 7, content MUST be split across 2 slides or moved to speaker notes.
 - **Bullet length**: Keep individual bullets to 1-2 lines maximum. If a bullet wraps to a 3rd line, rewrite it to be more concise."""

new_text = """ - **Calculation method**: `rendered_lines = bullet_count × avg_lines_per_bullet + subheaders + product_implication_lines`
 - **Overflow indicators**: If any bullet exceeds character limit by >20%, or total rendered lines > 7, content MUST be split across 2 slides or moved to speaker notes.
 - **Bullet length**: Keep individual bullets to 1-2 lines maximum. If a bullet wraps to a 3rd line, rewrite it to be more concise.

### Minimum Density Floor
- Each slide type's character range is a **floor-to-ceiling band**, not just a ceiling.
- If the median bullet length falls below the floor, the content is too thin and must be enriched with concrete details (metrics, named entities, dates).
- **Minimum L1 bullet counts**: PESTEL (3), Exec Summary (3), Customer (3), SME (4), Themes (3), Recommendation (4), Default (3).
- The validator enforces **both** the floor (min_chars, min_l1) and ceiling (max_chars, max_l1) as **blocking errors**."""

content = content.replace(old_text, new_text)

with open('/Users/david.denham/product-manager-agent/.cursor/rules/010-style-guide.mdc', 'w') as f:
    f.write(content)
