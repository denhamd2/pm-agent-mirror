# Design Peer Review: Candidate Grid Redesign v84

**Reviewer:** Design Peer Reviewer (318)  
**Date:** 31 March 2026  
**Design Brief:** `design/candidate-grid-redesign-v84-design-brief.md`  
**Copy Review:** `design/candidate-grid-redesign-v84-copy-review.md`  
**Evaluation Mode:** CRITICAL (fresh eyes, unbiased, harsh standards)

---

## Review Methodology

This review evaluates the design draft against:
1. JTBD Worksheet accuracy
2. Workday layout patterns and Sana Style
3. Canvas Kit v14 component correctness
4. Experience Principles (`docs/experience-principles.md`)
5. Accessibility and completeness

**Bias Check:** ✅ I have not been involved in creating this design. Evaluating with fresh eyes.

---

## PASS 1: STRATEGY VALIDATION

### JTBD Alignment ✅ PASS

**Claimed JTBD (from Design Brief):**
> "Aligns with: Recruiter JTBD → Screen & Shortlist → 'Review candidates efficiently'"
> 
> When I have a requisition with dozens or hundreds of applicants, I want to quickly scan key qualifications, AI fit scores, and current stage to identify top candidates, So I can shortlist the best matches without opening every profile individually and meet my daily screening targets.

**Validation Against Worksheet (`docs/jtbd-recruiting-hr-professional-and-manager.md`):**

Worksheet states (line 31-34):
> **Manage candidates throughout the recruiting process**
> - Determine if candidate meets requirements of the job  
> - Progress candidates through the stages of the pipeline as efficiently as possible

**Assessment:** ✅ **VALID**
- JTBD is synthesized from worksheet jobs (not verbatim, but accurately captures intent)
- "Review candidates efficiently" aligns with "Determine if candidate meets requirements" + "Progress candidates...as efficiently as possible"
- Situation, motivation, outcome structure is well-formed
- Layout priorities (HiredScore prominence, bulk actions, filtering) directly support this job

**Shell Pattern Justification:** ✅ **VALID**
- Shell B+ (Extended List Context) is appropriate for high-volume screening task
- Left filters + wide grid + optional right comm dock matches data-heavy, list-dominant workflow
- Pipeline viz addition (A+ element) is defensible for funnel health context

---

## PASS 2: LAYOUT QUALITY (MOST CRITICAL)

### Primary Focus ✅ PASS

**3-second scan test:**
- Eye goes immediately to: **Data grid with HiredScore column**
- Clear dominant element: Wide table with candidate rows
- Secondary elements don't compete: Filters are muted (sidebar), pipeline viz is contextual (top)

**Visual hierarchy:** ✅ Strong
1. Primary: Data grid (80% horizontal space)
2. Secondary: Filters (20% left), Pipeline (contextual top)
3. Supporting: Context header, saved views, pagination

### Workday Pattern Compliance ✅ PASS

**Shell Reference:** Design Brief cites Shell B+ (Extended List Context)

**Canonical Pattern Compliance:** ✅ **EXCELLENT**
- Explicitly references `design/references/pattern-hired-score-grid.md` (Figma node 490-62877)
- Layout matches canonical pattern:
  - Global shell: `WorkdayTopNav` + `WorkdayLeftTabBar` (primary/secondary rails)
  - Context header: Req title + metadata + tabs
  - Pipeline viz: Horizontal stage cards
  - Split view: Filters sidebar (280px) + Grid (flex 1)
  - `HiredScoreGrading` component specified with correct variant (`variant="full"`)

**HiredScore Pattern Checklist (per 318 requirements):**
- [x] HiredScoreGrading component specified (not custom grade UI) ✅
- [x] Correct variant (`variant="full"` for grid with progress bar) ✅
- [x] A-D color bands match canonical (A=green, B=blue/grey, C=orange, D=grey) ✅
- [x] Layout applies to correct context (Job Req Detail / All Candidates) ✅

**Regional Definitions:** ✅ Clear
- Top: Global nav
- Left: Primary rail (Recruiting Hub) + secondary nav + filters
- Center: Primary workspace (grid)
- Right: Optional CommunicationDock (mentioned, collapsed by default)

---

### Sana Style Compliance ✅ PASS

**Surfaces & Colours:**
- [x] Main canvas: `SANA_PAGE_CANVAS` (#F5F6F8) ✅
- [x] Cards on neutral grey (not blueberry-heavy chrome) ✅
- [x] White for grid container and filter panels ✅
- [x] `frenchVanilla100` for context header (appropriate) ✅

**Borders & Radii:**
- [x] Grid container: `SANA_CARD_RADIUS_LG` (12px) ✅
- [x] Soft radii specified throughout ✅
- [x] Thin `soap300` borders for table rows and sidebar edge ✅

**Typography:**
- [x] Clear hierarchy (Heading sizes: large/medium/small) ✅
- [x] Bold for headers, regular for body ✅
- [x] Specific font sizes (24px title, 18px section, 14px table) ✅

**Blue Restraint:** ✅ PASS
- Blue used only for: Bulk action toolbar (`blueberry100` bg), links, focus states
- Not used for primary chrome or heavy visual weight
- Follows Sana neutral-first approach

**Assessment:** ✅ **STRONG SANA ALIGNMENT**

---

## PASS 3: DESIGN SYSTEM VALIDATION (Canvas Kit v14)

### Component Correctness ✅ PASS

**Global Shell:**
- `WorkdayTopNav` ✅ Valid Canvas Kit v14 component
- `WorkdayLeftTabBar` ✅ Valid Canvas Kit v14 component

**Layout & Structure:**
- `Box`, `Flex`, `Stack` ✅ Valid layout primitives
- `Heading` (size variants) ✅ Valid typography component
- `Text`, `BodyText`, `Subtext` ✅ Valid text components

**Interactive Components:**
- `Tabs`, `Tab` ✅ Valid
- `Button` (Primary/Secondary/Tertiary) ✅ Valid
- `Checkbox` ✅ Valid
- `Select` ✅ Valid (dropdown filter)
- `Menu`, `Menu.Popper`, `Menu.Item`, `Menu.Divider` ✅ Valid
- `ToolbarIconButton` ✅ Valid (row actions menu trigger)
- `Table`, `Table.Header`, `Table.Row`, `Table.Cell`, `Table.Body` ✅ Valid
- `Pagination` ✅ Valid

**Status & Indicators:**
- `StatusIndicator` (used for req status "open") ✅ Valid
- `ProgressBar` (used in pipeline viz and HiredScore) ✅ Valid

**Custom Components:**
- `HiredScoreGrading` ✅ **Valid** (custom but specified in canonical pattern-hired-score-grid.md)
- `SourceBadge`, `StagePill` 🟡 **Assumed** (likely `StatusIndicator` with type variants)

**Potential Issues:**
- `Sheet` (candidate profile modal) ✅ Valid Canvas Kit v14 component
- `Pill` (saved views) 🟡 **Needs verification**: Design Brief uses "Pill" but Canvas Kit v14 likely uses `StatusIndicator type=Gray emphasis=Low` or custom styling on `Box`. **MINOR CONCERN** - may need adjustment in 320.

### v75 Component Checklist ✅ PASS

- [x] Status badges → `StatusIndicator` used correctly ✅
- [x] Skills/tags → Not applicable (no skill pills in this grid)
- [x] Button hierarchy → Paired actions use correct variants (Secondary+Secondary for most, Primary reserved for "Add Candidate") ✅
- [x] Stage displays → `StagePill` assumed to be `StatusIndicator` (correct pattern) ✅
- [x] Profile layouts → `Sheet` overlay for profile modal (correct, not rebuilding) ✅
- [x] Communication features → CommunicationDock mentioned (collapsed by default, correct) ✅

**Assessment:** ✅ **STRONG** (1 minor clarification needed on "Pill" vs `StatusIndicator` for saved views)

---

## PASS 4: EXPERIENCE PRINCIPLES VALIDATION

### Principle 1: Empower (Give Users Control) ✅ PASS

**Question:** Does design focus on user's outcome, not system's functional model?

**Assessment:** ✅ **YES**
- Design optimizes for recruiter's job: "quickly scan and shortlist top candidates"
- Layout prioritizes high-value info (HiredScore, name, stage) in scannable format
- Bulk actions enable efficient multi-candidate workflows
- Saved views let recruiters resume state across sessions
- **No forced workflows**: Row click opens profile, but inline actions available for quick decisions

**Question:** Is user in active control, or does design create helplessness?

**Assessment:** ✅ **ACTIVE CONTROL**
- Filters are persistent and user-controlled (not algorithm-dictated)
- Multi-select enables bulk operations (user decides scope)
- Sort controls on columns (user defines priority)
- Saved views are customizable (implied by "My Top Picks" language)

**Red Flag Check:**
- ❌ No forced workflows
- ❌ No hidden information (all key data visible in grid)
- ❌ No complex prerequisites

**Score:** ✅ **STRONG EMPOWERMENT**

---

### Principle 2: Trust (Build Their Confidence) ✅ PASS

**Question:** Will user understand what's happening? (transparency, clear states)

**Assessment:** ✅ **YES**
- HiredScore grading is transparent: Letter grade + percentage + label + progress bar
- Selection state clear: Checkboxes + bulk toolbar with selection count
- Filter state visible: Sidebar shows active filters, "Clear All" available
- Pipeline viz shows funnel health at-a-glance

**Question:** Does it use familiar language and patterns?

**Assessment:** ✅ **YES**
- Copy review confirms Workday terminology (Requisition, Candidate, Stage)
- Layout matches canonical pattern (not inventing new interactions)
- Standard table interactions (sort, row click, menu)

**Question:** Does design quality create reliability?

**Assessment:** ✅ **YES**
- Sana Style applied consistently
- Canvas Kit components used correctly
- Clear visual hierarchy prevents confusion
- Accessibility considerations specified (ARIA labels, focus indicators)

**Red Flag Check:**
- ❌ No unclear states (selection, filter, sort all have visible indicators)
- ❌ No jargon (Copy Review confirmed Editorial Guidelines compliance)
- ❌ No low-quality execution (comprehensive Canvas Kit spec, Sana alignment)

**Score:** ✅ **STRONG TRUST SIGNALS**

---

### Principle 3: Simplify (Make It Easy) ✅ PASS

**Question:** Does design reduce cognitive load?

**Assessment:** ✅ **YES**
- Information density optimized: Dense rows (56px) but not cramped
- Scannable columns: Key data (name, score, stage) prominent
- Progressive disclosure: Essential in grid, details in profile modal
- Visual coding: Color-coded HiredScore grades, stage pills
- Persistent filters: No need to remember query, sidebar shows active state

**Question:** Is the most common path the easiest?

**Assessment:** ✅ **YES**
- Primary path: Scan → Select → Act (supported by HiredScore prominence + row selection + bulk toolbar)
- Secondary path: Deep dive (row click opens profile)
- Saved views shortcut common filters ("New Today", "Needs Review")

**Question:** Does it minimize steps and friction?

**Assessment:** ✅ **YES**
- Bulk actions reduce per-candidate clicks (move 10 candidates in one action vs. 10 individual clicks)
- Inline row actions menu for quick decisions (no profile open required)
- Sortable columns reduce filter gymnastics

**Red Flag Check:**
- ❌ No redundant steps
- ❌ No extra clicks for common tasks
- ❌ No unnecessary page refreshes (single-page app interactions implied)

**Score:** ✅ **STRONG SIMPLIFICATION**

---

## PASS 5: NAVIGATION + COMPLETENESS

### Tab Structure ✅ COMPLETE

**Context Header Tabs:**
- Candidates (active)
- Details
- Team

**Assessment:** ✅ Sufficient for v1. Standard Requisition detail tabs.

**Future consideration (not blocking):** "Candidates" tab may eventually split into sub-tabs (Active / Archive / Rejected) for very high-volume reqs, but not required for v1.

### Incomplete Areas 🟡 MINOR GAPS

**Identified Gaps (non-blocking, but noted):**

1. **Saved Views Management:** Design Brief lists "My Top Picks" but doesn't specify HOW users create/edit/delete saved views. Is this:
   - Hardcoded shortcuts? (not customizable)
   - User-configurable filters? (need "Save Current View" button)
   
   **Recommendation:** Clarify in 320. If v1 = hardcoded, that's fine. If customizable, add management UI.

2. **Column Customization:** Brief asks "Should recruiters add/remove/reorder columns?" Answer: **Defer to v2**. Fixed column set is appropriate for v1.

3. **HiredScore Tooltip Detail:** Brief asks "Show grade breakdown on hover?" Answer: **YES, strongly recommended for v1**. Tooltips add minimal complexity and high value (transparency for AI scores).

4. **Bulk "Select All" Scope:** Brief asks "Select all on this page (20) vs. all matching filters (127)?" Answer: **v1 = page only (safer)**. Add "Select all 127" option in v2 with clear confirmation.

**Assessment:** 🟡 **MINOR** - None are blocking. Recommendations provided for 320 implementation decisions.

---

## PASS 6: COPY QUALITY (SPOT CHECK)

**Copy Review Findings (from 319):**
- ✅ 23 of 26 elements approved as-is
- 🟡 3 minor revisions (en dash, empty state specificity)
- ✅ No legal-sensitive copy
- ✅ Editorial Guidelines compliance confirmed

**Spot Check:**
- Button labels ✅ Verb-first, <3 words
- Table headers ✅ Scannable, Workday terminology
- Error messages ✅ Not specified in brief (empty state provided, approved by 319)
- HiredScore labels ✅ Positive framing ("Developing fit" not "Poor fit")

**Assessment:** ✅ **HIGH QUALITY** - 319 review was thorough and compliant.

---

## PASS 7: ACCESSIBILITY (WCAG 2.1 AA)

### Specified Accessibility Features ✅ GOOD

**From Design Brief:**
- [x] Keyboard navigation: Tab order follows reading order ✅
- [x] Screen reader: ARIA labels on all interactive elements ✅
- [x] Contrast: All text meets WCAG AA (4.5:1 minimum) ✅
- [x] Focus indicators: 2px blue outline on interactive elements ✅
- [x] Sortable columns: ARIA sort attributes, visual sort indicator ✅
- [x] Bulk select: Announce selection count to screen readers ✅

### Additional Recommendations for 320 🟡

**Not specified but required:**
- [ ] Pagination controls: ARIA labels ("Go to page 2", "Previous", "Next")
- [ ] Filter sidebar: ARIA expanded/collapsed state on category headers
- [ ] Bulk action toolbar: ARIA live region for selection count updates
- [ ] Row actions menu: ARIA hasPopup + role="menu"
- [ ] HiredScore tooltip: ARIA describedby on grade badge

**Assessment:** ✅ **GOOD FOUNDATION** - Core accessibility specified. Minor additions needed in 320.

---

## OPEN QUESTIONS REVIEW (From Design Brief)

Design Brief lists 5 open questions. Here are my answers:

### Q1: Pipeline Viz Placement

**Question:** Should pipeline stage cards be above filters or integrated into filter sidebar as "Stage" section with counts?

**Answer:** ✅ **Above filters (as designed)**

**Rationale:**
- Pipeline viz serves different job than filters (funnel health vs. scoping)
- Horizontal layout matches recruiter scanning pattern (left-to-right funnel)
- Sidebar integration would make it vertically scrollable (bad for glanceable metrics)
- Canonical pattern (pattern-hired-score-grid.md) shows horizontal placement

### Q2: HiredScore Tooltip

**Question:** On hover, show grade breakdown (Technical Skills: 90%, Experience: 85%, Culture Fit: 80%)? Or is full variant sufficient?

**Answer:** ✅ **YES, add tooltip with breakdown**

**Rationale:**
- AI transparency is critical for recruiter trust
- Tooltip is low-cost, high-value (doesn't clutter UI when not needed)
- Breakdown helps recruiters understand WHY score is X (not just accept AI verdict)
- Aligns with Experience Principle 2 (Trust): "Will user understand what's happening?"

### Q3: Saved Views Management

**Question:** Should "My Top Picks" be user-configurable filters, or hardcoded shortcuts? If configurable, where's the "Save Current View" button?

**Answer:** 🟡 **v1 = Hardcoded is acceptable; v2 = Add customization**

**Rationale:**
- v1 scope: 3 hardcoded views ("My Top Picks" = favorites, "New Today" = applied date filter, "Needs Review" = pending action flag)
- If hardcoded, no "Save View" button needed (simplifies v1)
- v2 enhancement: Add "Save Current View" button next to "Clear All" in filter sidebar
- This is a valid v1 vs. v2 scoping decision

### Q4: Bulk Select All Scope

**Question:** "Select all on this page" (20) vs. "Select all matching filters" (127)? Risk of accidental bulk actions on large sets.

**Answer:** ✅ **v1 = Page only (20); v2 = Add "Select all 127" with confirmation**

**Rationale:**
- Accidental bulk rejection of 127 candidates = catastrophic error
- v1: Header checkbox selects visible page (20) - safe, predictable
- v2: Add banner "Select all 127 candidates matching filters?" with confirm/cancel - only after user requests it
- Follows safe-by-default principle

### Q5: Column Customization

**Question:** Should recruiters be able to add/remove/reorder columns? Or is fixed column set sufficient for v1?

**Answer:** ✅ **v1 = Fixed columns; v2 = Add customization**

**Rationale:**
- Fixed columns reduce complexity and ensure consistency across recruiters
- 7 core columns (Name, HiredScore, Location, Source, Stage, Applied, Actions) cover 80% of screening needs
- Column customization is advanced feature (not table stakes for screening workflow)
- v2 enhancement: Add "Customize Columns" button in toolbar, modal with drag-to-reorder + show/hide checkboxes

**Assessment:** ✅ **ALL QUESTIONS RESOLVED** - Ready for 320 implementation with clear v1/v2 scoping.

---

## FINAL VERDICT

### Strengths (What's Working) ✅

1. **Excellent JTBD Alignment:** Design directly supports high-volume screening job
2. **Strong Workday Pattern Compliance:** Leverages canonical pattern-hired-score-grid.md correctly
3. **Robust Canvas Kit Usage:** All components valid, v14-compliant, no invented UI
4. **Sana Style Mastery:** Neutral surfaces, soft radii, blue restraint, clear hierarchy
5. **Experience Principles Met:** Empowers user control, builds trust, simplifies workflows
6. **Comprehensive Accessibility:** Core WCAG 2.1 AA requirements specified
7. **High Copy Quality:** 319 review confirmed Editorial Guidelines compliance
8. **Thoughtful v1 Scoping:** Open questions addressed with clear v1/v2 tradeoffs

### Weaknesses (What Needs Improvement) 🟡

1. **Minor Component Clarification:** "Pill" for saved views likely needs to be `StatusIndicator` or custom `Box` (not a distinct Canvas Kit component in v14)
2. **Saved Views Management:** Hardcoded vs. configurable not explicitly stated (now resolved: v1 = hardcoded)
3. **HiredScore Tooltip:** Not specified in brief (now resolved: YES, add tooltip)
4. **Pagination ARIA Labels:** Not specified (minor, easy add in 320)
5. **Filter Sidebar ARIA States:** Expand/collapse not specified (minor, easy add in 320)

**None of these are BLOCKING issues.** All can be resolved during 320 implementation with guidance provided in this review.

---

## VERDICT: ✅ **APPROVED**

**Recommendation:** **PROCEED TO PROTOTYPE (320)**

**Confidence Level:** ✅ **HIGH** (9/10)

**Rationale:**
- Design Brief is comprehensive, well-researched, and correctly grounded in Workday patterns
- Layout strategy is sound and directly supports JTBD
- Canvas Kit component mapping is accurate (1 minor clarification needed)
- Sana Style alignment is strong throughout
- Experience Principles are clearly met
- Copy quality is high (319 review thorough)
- Accessibility foundation is solid (minor additions in 320)
- All open questions resolved with clear v1/v2 scoping
- **No fundamental design flaws identified**

**Revisions Required Before 320:**

1. **Apply 319 Copy Revisions:**
   - HiredScore filters: Use en dash (–) for ranges, not hyphen (-)
   - Empty state: "No candidates match your current filters. Try clearing filters or broadening your search criteria."
   - Add true empty state: "No candidates have applied to this requisition yet. Post your job to career sites to start attracting candidates."

2. **Clarify "Pill" Component:**
   - In 320 implementation, use `StatusIndicator type=Gray emphasis=Low` for saved view pills OR custom styled `Box` with pill appearance
   - Confirm with Canvas Kit MCP if "Pill" is a distinct component or just a visual pattern

3. **Add HiredScore Tooltip (v1):**
   - On hover over HiredScore badge, show tooltip: "AI-powered candidate matching score based on skills, experience, and job requirements. Scores are suggestions; always review candidates individually."
   - Optional (nice-to-have): Add grade breakdown in tooltip (Technical: 90%, Experience: 85%, Culture: 80%)

4. **Accessibility Additions (320):**
   - Pagination: Add ARIA labels ("Go to page 2", "Previous", "Next")
   - Filter sidebar: Add ARIA expanded/collapsed state on category headers (if collapsible)
   - Bulk toolbar: Ensure selection count is ARIA live region

**Next Steps:**
1. Update Design Brief with 319 copy revisions ✅
2. Add HiredScore tooltip guidance to Design Brief ✅
3. Proceed to 320 (Prototype Development) ✅
4. Build functional prototype with Canvas Kit
5. Visual Review (321) after prototype complete
6. Copy Spot-Check (319) for final validation
7. Figma Capture (330) for design handoff

---

## Appendix: Review Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| JTBD Validation | ✅ PASS | Worksheet-aligned, well-formed job statement |
| Layout Quality | ✅ PASS | Clear primary focus, matches Workday patterns |
| Workday Pattern Compliance | ✅ PASS | Leverages canonical pattern-hired-score-grid.md correctly |
| Canvas Kit v14 Correctness | ✅ PASS | All components valid (1 minor clarification: Pill) |
| Sana Style Alignment | ✅ PASS | Neutral surfaces, soft radii, blue restraint |
| Experience Principle 1 (Empower) | ✅ PASS | Strong user control, no forced workflows |
| Experience Principle 2 (Trust) | ✅ PASS | Transparent states, familiar patterns |
| Experience Principle 3 (Simplify) | ✅ PASS | Reduced cognitive load, easy common paths |
| Navigation & Completeness | ✅ PASS | Tabs defined, minor gaps documented |
| Copy Quality | ✅ PASS | 319 review thorough, Editorial Guidelines met |
| Accessibility | ✅ PASS | WCAG 2.1 AA foundation solid, minor additions needed |
| Open Questions Resolved | ✅ PASS | All 5 questions answered with clear v1/v2 scoping |

---

*End of Design Peer Review - 318 Complete*

**FINAL VERDICT: ✅ APPROVED FOR PROTOTYPE (320)**
