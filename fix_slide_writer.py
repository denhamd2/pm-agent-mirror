with open('/Users/david.denham/product-manager-agent/.cursor/skills/slide-writer/SKILL.md', 'r') as f:
    content = f.read()

old_text = """### 4. Clarity Check (Pre-Finalisation Validation)

Before producing final slide content, ensure:
- Content can be understood in under 10 seconds
- A non-technical stakeholder could repeat the key message
- No sentence requires re-reading to understand
- Language is simple, direct, and unambiguous"""

new_text = """### 4. Density Preservation (Minimum Floors)

While simplifying language, you must maintain substantive executive density:
- **Never** reduce a bullet below its slide-type minimum character floor (e.g., 160 chars for PESTEL, 140 for SME).
- If simplification drops a bullet below the floor, you MUST enrich it by combining with adjacent context or adding concrete details from the research.
- **Mandate:** Every bullet MUST contain at least one concrete anchor: a number, a date, a named entity, a participant reference, or a clear cause-impact relationship. Do not leave vague, abstract statements.

### 5. Clarity Check (Pre-Finalisation Validation)

Before producing final slide content, ensure:
- Content can be understood in under 10 seconds
- A non-technical stakeholder could repeat the key message
- No sentence requires re-reading to understand
- Language is simple, direct, and unambiguous"""

content = content.replace(old_text, new_text)

with open('/Users/david.denham/product-manager-agent/.cursor/skills/slide-writer/SKILL.md', 'w') as f:
    f.write(content)
