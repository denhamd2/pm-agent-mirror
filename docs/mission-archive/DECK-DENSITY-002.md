## Mission: DECK-DENSITY-002 - Restore SME & Recommendation Slide Density
**Status:** Complete
**Owner:** 090 Agent Improvement Advisor
**Created:** 31 March 2026
**Last Updated:** 31 March 2026
**Priority:** Critical (blocking future deck generation quality)

**Objective:** Restore SME and Recommendation slide density to v81 levels after over-correction in DECK-DENSITY-001 made content too sparse; add SME name anonymization.

**Problem Identified:** India PMF deck v83 showed under-density after DECK-DENSITY-001 fix:
- SME slides: 6 bullets (dropped from 7-8 in v81)
- Recommendation slides: 3 bullets (collapsed from 10-item 5-part structure in v81)
- SME names: Real names shown on slides (should be anonymized like P1-P5 customer format)

**Root Causes:**
1. DECK-DENSITY-001 over-corrected bullet count targets (6-7 too low for SME/Recommendations)
2. Character limits too restrictive (120-140 chars vs 160-220 in v81)
3. Recommendation 5-part structure not enforced (collapsed to simple bullets)
4. SME anonymization not implemented (inconsistent with customer P1-P5 pattern)

**Implemented Solution:**
- [x] Restored SME slides to **7-8 bullets at 160-200 characters each** (matching v81 density)
- [x] Added **SME name anonymization**: SME1, SME2, etc. on slides/tables; real names in speaker notes only
- [x] Restored Recommendation slides to **5-part structure** (Problem, Evidence, Recommendation, Why Now, Success Metrics) = **10 paragraph items total** (5 subheaders + 5 bullets)
- [x] Increased Recommendation character limits to **180-240 chars per bullet** (matching v81 richness)
- [x] Updated Customer Interview density verification to **7-8 bullets at 180-220 chars** (already correct in v83)
- [x] Updated both `130-pmf-slide-generator.mdc` and `010-style-guide.mdc` for consistency
- [x] Regenerated India deck as v84 with all fixes applied

**Impact:**
- **SME slides**: 7-8 bullets with rich 160-200 char content (v81 parity restored)
- **Recommendation slides**: Full 5-part structure with 10 items, 180-240 chars (v81 parity restored)
- **SME anonymization**: Consistent with P1-P5 customer format
- **v84 deck**: 64 slides with correct density (no overspill, no underspill)

**Rationale:** v83 density was too sparse for executive audience; v81 had correct balance of detail without overflow. Permanent fix ensures all future PMF roadmap decks match v81/v84 density standards.

**Related Artifacts:**
- Updated rules: `130-pmf-slide-generator.mdc` (lines 698-716, 925-977, 1139, 1140-1150, 1201-1220), `010-style-guide.mdc` (line 59)
- v84 deck: `~/Downloads/India_Recruiting_PMF_Roadmap_v84.pptx` (64 slides)
- v84 spec: `docs/decks/specs/slides_spec_v84.json`
- Previous versions for comparison: v81 (correct density), v82 (too sparse), v83 (too sparse)

---
