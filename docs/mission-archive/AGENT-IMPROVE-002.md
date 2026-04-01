## Mission: AGENT-IMPROVE-002 - Standardize Sliding Panel Shadow
**Status:** Complete
**Date:** 29 March 2026
**Owner:** 090-agent-improvement-advisor
**Objective:** Codify the sliding panel shadow fix (moving boxShadow from Card to Box wrapper to avoid overflow:hidden clipping) as a permanent Sana design token and document it in style guides.

**Context:** During France E2E v75 prototype work, discovered that sliding panel shadows were being clipped by `overflow: hidden` on parent containers. The fix was to apply the shadow to the Box wrapper instead of the nested Card. This pattern needs to be standardized for all future prototypes.

**Implementation:**
1. **design/components/sanaShellTheme.ts**: Added `SANA_PANEL_SHADOW` constant with layered shadow definition:
   - Primary layer: `-8px 0 32px rgba(15, 46, 102, 0.20)` (wide blur, stronger opacity)
   - Secondary layer: `-2px 0 8px rgba(15, 46, 102, 0.10)` (tight edge definition)
   
2. **design/components/CommunicationDock.tsx**: Updated to import and use `SANA_PANEL_SHADOW` constant (replaced hardcoded shadow values)

3. **design/components/index.ts**: Exported `SANA_PANEL_SHADOW` for use across all prototypes

4. **.cursor/rules/010-style-guide.mdc**: Added "Depth and Shadows" subsection documenting:
   - Card shadows (`SANA_CARD_SHADOW`, `SANA_CARD_SHADOW_LIFTED`)
   - Panel shadows (`SANA_PANEL_SHADOW`)
   - Implementation note: Apply to Box wrapper, not Card, to avoid overflow:hidden clipping

5. **design/README.md**: Added "Sliding panel depth" note explaining `SANA_PANEL_SHADOW` usage in `CommunicationDock`

**Verification:**
- ✅ `SANA_PANEL_SHADOW` exported from `design/components/index.ts`
- ✅ `CommunicationDock.tsx` imports and uses the constant
- ✅ 010-style-guide.mdc documents the pattern with rationale
- ✅ design/README.md references the standard
- ✅ Build succeeds without errors
- ✅ v75 prototype shadow still renders correctly

**Impact:**
- All future prototypes using `CommunicationDock` will automatically have proper depth shadows
- Designers (315) will reference the documented pattern in design briefs
- Developers (320) will import the constant rather than hardcoding values
- Visual reviewers (321) will validate against the documented standard
- Consistent depth treatment across all sliding panels (Email, WhatsApp, SMS, Notes, etc.)

**Artifacts:**
- Updated files: `design/components/sanaShellTheme.ts`, `design/components/CommunicationDock.tsx`, `design/components/index.ts`, `.cursor/rules/010-style-guide.mdc`, `design/README.md`
- Reference: Plan at `/Users/david.denham/.cursor/plans/standardize_panel_shadow_847b98ad.plan.md`
