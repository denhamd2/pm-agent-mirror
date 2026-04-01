## Mission: PROTO-URL-001 - Fix Prototype Browser URL Opening
**Status:** Complete
**Owner:** Master Orchestrator
**Created:** 31 March 2026
**Last Updated:** 31 March 2026
**Priority:** High (affects all future prototype workflows)

**Objective:** Fix bug where prototype creation opened `http://localhost:5199/` (root) instead of `http://localhost:5199/[prototype-slug]` (versioned URL), causing user to manually navigate to correct route.

**Problem Identified:**
- During candidate-grid-v84 creation, browser opened root URL instead of `/candidate-grid-v84`
- Rule 320 step 6 had ambiguous instructions ("If server already running...") without explicit port check or clear decision tree
- No verification step to confirm correct URL opened

**Root Causes:**
1. **Hypothesis A (Confirmed)**: Rule didn't enforce `VITE_PROTOTYPE_SLUG` environment variable check
2. **Hypothesis B (Confirmed)**: No explicit port check before attempting server start (led to "already in use" errors)
3. **Hypothesis C (Confirmed)**: Conditional logic was guidance-only, not enforced procedural steps
4. **Hypothesis D (Confirmed)**: No URL verification step to catch incorrect openings

**Implemented Solution:**
- [x] Updated `.cursor/rules/320-prototype-developer.mdc` step 6 with mandatory port check: `lsof -ti:5199`
- [x] Split into Case 1 (port free) and Case 2 (port in use) with explicit commands for each
- [x] Case 1: `cd design && VITE_PROTOTYPE_SLUG=[slug] npm run dev` (plugin auto-opens correct URL)
- [x] Case 2: `bash scripts/open-url-chrome-and-cursor-browser.sh 'http://localhost:5199/[slug]'` (manual open to existing server)
- [x] Added FORBIDDEN section: Starting without VITE_PROTOTYPE_SLUG, opening root URL, skipping port check
- [x] Added verification step: Confirm URL in browser address bar shows prototype slug path
- [x] Added concrete example template with placeholder replacement guidance
- [x] Fixed immediate issue: Removed stale v61 import from `main.tsx` and `vite.config.ts` that was blocking current prototype

**Impact:**
- All future prototype creations will open to correct versioned URL automatically
- Port conflicts detected and handled correctly (new server vs. reuse existing)
- Agents following 320 have unambiguous decision tree for server start
- URL verification prevents silent failures

**Verification Plan:**
Next prototype creation (any feature) will test the fix by following updated 320 step 6 instructions.

**Related Artifacts:**
- Updated rule: `.cursor/rules/320-prototype-developer.mdc` (lines 364-405)
- Vite config: `design/vite.config.ts` (openChromeAndCursorBrowser plugin, lines 58-83)
- Browser script: `scripts/open-url-chrome-and-cursor-browser.sh`
- Test case: candidate-grid-v84 (stale imports cleaned)

---
