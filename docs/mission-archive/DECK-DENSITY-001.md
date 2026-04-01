## Mission: DECK-DENSITY-001 - Fix Slide Overspill in PMF Roadmap Decks
**Status:** Complete
**Owner:** 090 Agent Improvement Advisor
**Created:** 31 March 2026
**Last Updated:** 31 March 2026
**Priority:** Critical (blocking future deck generation quality)

**Objective:** Eliminate vertical text overflow on PMF roadmap slides by implementing character limits, bullet count caps, and pre-generation density validation in 130-pmf-slide-generator.mdc and 010-style-guide.mdc.

**Problem Identified:** India PMF deck v76 showed overspill on multiple slide types:
- PESTEL slides: 5 bullets (2-3 sentences each) + 50+ word Product implication = 15 rendered lines (exceeds 7-8 line max by 2×)
- Executive Summary: 5 dense bullets = 11 rendered lines, last bullet cut off
- Validated Themes: 3 themes with sub-bullets = 13+ rendered lines exceeding 7-8 line maximum

**Root Causes:**
1. Bullet COUNT rules didn't match RENDERED LINE reality (5 bullets × 2.5 avg lines ≠ 5 lines)
2. Product implication not counted in line budget (50+ words = 3-4 additional lines)
3. No character limits per bullet (unpredictable text wrapping)
4. No pre-generation validation (density checked by bullet count only)

**Implemented Solution:**
- [x] Added PRE-GENERATION DENSITY VALIDATION section to 130-pmf-slide-generator.mdc with rendered line formula, slide-specific density targets, pre-flight check protocol, and overflow mitigation options
- [x] Reduced PESTEL bullet count from 5 to 4 with 120-140 character limit per bullet
- [x] Reduced PESTEL Product implication from 50+ words to 40-50 words (hard max 70 words / 2 lines)
- [x] Added Executive Summary density cap (4 bullets max, 180 chars each, target 7-8 rendered lines)
- [x] Added Customer Interview density cap (6-7 bullet lines total, 140 chars per bullet)
- [x] Reduced SME slides from 7-8 to 6-7 bullet lines with 120 char limits
- [x] Reduced Validated Themes from 3-4 themes to 2 themes per slide (100 chars per bullet)
- [x] Added Recommendations density cap (5 bullets hard cap with section-specific character limits: Problem 120 chars, Evidence 120 chars, Recommendation 140 chars, Why Now 100 chars, Success Metrics 140 chars)
- [x] Updated 010-style-guide.mdc "Slide Content Guidelines" with character limit hierarchy, rendered line calculation method, and overflow indicators
- [x] Added "Density Validation Examples" subsection to 010-style-guide.mdc with 4 before/after examples (PESTEL, Executive Summary, Validated Themes, Customer Interview)
- [x] Added "DENSITY OVERSPILL EXAMPLES" section to 130-pmf-slide-generator.mdc (line 1212+) with 4 complete JSON before/after patterns

**Impact:**
- **7-line target enforced** across all content slide types
- **Character limits** prevent unpredictable text wrapping (120-180 chars per bullet type)
- **Pre-flight validation** catches overflow before MCP call (audit 5-7 representative slides)
- **Mitigation options** documented (tighten language, split slides, move to speaker notes)
- **Zero overspill** expected on all future PMF roadmap decks

**Rationale:** Overspill wastes generation time, requires deck regeneration, and degrades executive presentation quality. Pre-flight validation and character-based limits create predictable rendered line counts. Blocked India v77+ generation until implemented.

**Related Artifacts:**
- Plan: `.cursor/plans/fix_slide_density_overspill_31mar2026.plan.md`
- Updated rules: `130-pmf-slide-generator.mdc`, `010-style-guide.mdc`
- Evidence: Four overspill screenshots from India PMF deck v76 (PESTEL Technological, PESTEL Economic, Executive Summary, Validated Themes)
