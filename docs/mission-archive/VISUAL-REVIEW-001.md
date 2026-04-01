## Mission: VISUAL-REVIEW-001 - Add Browser MCP Workflow to 321 Rule
**Status:** Complete
**Owner:** Master Orchestrator
**Created:** 31 March 2026
**Last Updated:** 31 March 2026
**Priority:** High (affects all future visual review quality)

**Objective:** Fix missing browser workflow in 321-prototype-visual-reviewer rule so visual reviews actually open Cursor browser and capture screenshots for vision-based analysis.

**Problem Identified:**
- During candidate-grid-v84 visual review, 321 created text document without opening browser or capturing screenshots
- Rule stated "use vision capabilities" and "capture screenshots" but didn't provide explicit MCP workflow steps
- User expected to see prototype open in Cursor browser during 321 execution
- Without screenshots, 321 became a code review duplicate (318 already does code review)

**Root Cause:**
- Rule 321 described WHAT to do (screenshot analysis) but not HOW (browser_navigate with take_screenshot_afterwards)
- No explicit CallMcpTool examples for cursor-ide-browser integration
- Missing step-by-step workflow instructions

**Implemented Solution:**
- [x] Added **Vision-Based Analysis** section with explicit browser_navigate workflow:
  - Use `cursor-ide-browser` → `browser_navigate` with `position: "side"`, `take_screenshot_afterwards: true`, `newTab: true`
  - Screenshot returned in tool response for vision analysis
  - Optional: Capture additional states with browser_click + browser_snapshot
- [x] Added **Workflow Steps** section (5 explicit steps):
  - Step 1: Open prototype in Cursor browser (CallMcpTool example)
  - Step 2: Analyze screenshot using vision
  - Step 3: Capture additional states (tabs, filters, modals)
  - Step 4: Write findings document to `design/[slug]-visual-review.md`
  - Step 5: Communicate verdict (APPROVED or NEEDS REVISION)
- [x] Updated **Output Format** to create standalone visual review file (not append to Design Brief)
- [x] Added CRITICAL warning: "Do NOT skip screenshot capture. Vision-based analysis is the primary value."

**Impact:**
- All future 321 invocations will open Cursor browser automatically (visible to user)
- Screenshots captured and analyzed with vision capabilities
- Proper visual bug detection (not just code review)
- User sees prototype in Cursor browser during review (expected behavior)

**Verification:**
Next prototype visual review will test by opening browser, capturing screenshots, and analyzing visually.

**Related Artifacts:**
- Updated rule: `.cursor/rules/321-prototype-visual-reviewer.mdc` (lines 24-78, 116-195)
- Browser MCP tools: `cursor-ide-browser` → `browser_navigate`, `browser_snapshot`

---
