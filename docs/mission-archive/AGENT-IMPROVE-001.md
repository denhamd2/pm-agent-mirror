## Mission: AGENT-IMPROVE-001 - Integrate v75 Quality Standards into Agent Rules
**Status:** Complete
**Date:** 28 March 2026
**Owner:** 090-agent-improvement-advisor
**Objective:** Integrate content richness, visual indicator patterns, and Sana styling standards demonstrated in `france-whatsapp-omnichannel-engagement-v75.tsx` into agent rules (315, 319, 320, 321) to ensure consistent world-class quality for all future prototypes.

**Context:** FR-E2E-002 prototype (v75) achieved significantly higher content quality and visual polish than previous prototypes. User requested these improvements be codified into rules for consistency.

**Rule Updates Implemented:**
1. **320-prototype-developer.mdc** (Content Richness Standards):
   - Added "Content richness standards" section (point 4) with patterns for status badges, skill chips, timeline indicators, clickable links, and document attachments
   - Added "Sana Color Roles" quick reference with semantic color usage guidelines (active/success/inactive/text hierarchy/interactive elements)
   - Includes code examples for each pattern

2. **315-ux-designer.mdc** (Visual Indicators Specification):
   - Added "Visual Indicators Specification (for 320 implementation)" as point 7 in PASS 2
   - Requires designers to explicitly specify: status badges, icons, chips/tags, avatars, completion indicators, and metadata formatting
   - Ensures 320 has clear implementation guidance for visual richness

3. **321-prototype-visual-reviewer.mdc** (Content Quality Checklist):
   - Added "Content Quality" section to visual review checklist
   - Validates: rich content depth, visual indicators, metadata layers, structured formatting, clickable styling, professional polish
   - Includes specific checks for status badges, skill chips, timeline indicators, document styling

4. **319-doc-writer.mdc** (Visual Indicator Copy):
   - Added point 3a: "Visual Indicator Copy (Status Badges, Chips, Labels)"
   - Reviews copy within status badges, skill chips, timeline labels, metadata
   - Validates sentence case, consistency, and terminology
   - Links to 315 PASS 2 and 320 patterns

**Artifacts:**
- Updated rules: `.cursor/rules/315-ux-designer.mdc`, `.cursor/rules/319-doc-writer.mdc`, `.cursor/rules/320-prototype-developer.mdc`, `.cursor/rules/321-prototype-visual-reviewer.mdc`
- Reference prototype: `design/france-whatsapp-omnichannel-engagement-v75.tsx`

**Impact:** Future prototypes will automatically include:
- Realistic, production-quality content (not wireframe placeholders)
- Semantic visual indicators (status badges, chips, icons, avatars)
- Structured metadata layers (timestamps, sources, file info)
- Consistent Sana styling and Canvas Kit usage
- Professional polish across all tabs

**Next:** Apply these updated rules starting with next prototype mission (any new E2E or standalone prototype request).
