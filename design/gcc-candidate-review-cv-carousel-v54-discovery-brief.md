# GCC Candidate Review with CV Carousel - Discovery & Design Brief (v54)

**Pipeline:** GCC-E2E-014 (Step 8–8c: **315** multi-pass → **319** → **315** final → **320**)  
**PRD:** `docs/prds/gcc-candidate-review-experience-v54-prd.md`  
**Date:** 22 March 2026  
**Status:** **PASS 1 → PASS 2** (awaiting **319** copy review before PASS 3)

---

## PASS 1: LAYOUT STRATEGIST (DESIGN THINKING)

### Jobs To Be Done (JTBD)

**Primary (from PRD):**
> When I am shortlisting **100–200** applicants on a req (Recruiter, P2 Baker Hughes), I want **one dense review surface** (summary, CV, notes) with minimal tab changes, so I can finish fair, complete reviews in less time.

**CV Carousel-specific:**
> When a candidate has uploaded **multiple documents** (CV, cover letter, portfolio), I want to **navigate between documents smoothly without closing and reopening**, so I can assess their full application package in one continuous flow.

### Shell Pattern Selection

**Pattern B+ (Modal with embedded document carousel)**

**Justification:**
- **Recruiter workflow**: High-volume req review (100+ candidates) requires **fast sequential candidate movement** AND **in-depth document review** for shortlisted candidates
- **B (Modal)**: Standard Workday pattern for focused tasks; allows **prev/next candidate** navigation while keeping grid context
- **B+**: Enhanced with **embedded horizontal carousel** for CV/documents within the modal

**Reference Layouts:**
- `design/references/recruiter-flow/` — candidate profile modal patterns
- `design/gcc-candidate-grid-v46.tsx` — existing profile modal with prev/next (add carousel enhancement)
- `design/references/sana/Sana_Style_UI-candidate-profile-whatsapp-panel.png` — neutral surface treatment for content panels

### Layout Regions

```
┌─────────────────────────────────────────────────────────────┐
│ Modal Header: Candidate Name | Job Title | Stage Badge      │
│ [Prev Candidate] [Close] [Next Candidate]                   │
├──────────────┬──────────────────────────────────────────────┤
│ LEFT         │ CENTER (PRIMARY FOCUS)                        │
│ Sidebar      │                                               │
│ (25%)        │ CV Carousel (Dominant)                        │
│              │ ┌───────────────────────────────────────┐    │
│ • Summary    │ │                                       │    │
│ • Contact    │ │   Document Viewer                     │    │
│ • Location   │ │   (Current page rendered)             │    │
│ • Stage      │ │                                       │    │
│ • Source     │ │                                       │    │
│ • Applied    │ │                                       │    │
│              │ └───────────────────────────────────────┘    │
│ [Quick       │ [← Prev Doc] Page 1 of 3 [Next Doc →]       │
│  Actions]    │                                               │
│              │ Thumbnail Rail:                               │
│              │ [CV] [Cover Letter] [Portfolio]              │
│              │                                               │
│              │ Notes & Activity (below fold)                │
└──────────────┴──────────────────────────────────────────────┘
```

### Hierarchy

1. **Primary (Dominant):** CV/Document carousel viewer — largest visual mass, center-aligned, first focus for document review
2. **Secondary:** Candidate summary sidebar (left) — persistent context while reviewing documents
3. **Tertiary:** Thumbnail rail below carousel — allows random access to any document
4. **Supporting:** Notes and activity timeline (below carousel, accessed via scroll)

### Interaction Model

**Core Interactions:**
1. **Sequential candidate review:** Prev/Next buttons in modal header (existing pattern)
2. **Document carousel navigation:**
   - **Arrow keys** (desktop): Left/Right to change documents
   - **Swipe gestures** (tablet/mobile): Swipe left/right on document viewer
   - **Thumbnail click**: Direct jump to any document
3. **Document zoom/scroll:** Scroll within document viewer for multi-page CVs
4. **Quick actions:** Stage change, add note, send message (sidebar)

### Layout Framework (A–F)

**A. JTBD Alignment:**
- ✅ Single modal surface for summary + documents reduces tab sprawl
- ✅ Carousel keeps recruiter in document review flow without modal exits
- ✅ Prev/Next candidate enables high-volume throughput

**B. Shell Pattern:**
- ✅ Pattern B+ (Modal with carousel) — proven Workday modal pattern enhanced for documents
- ✅ Maintains grid context; recruiters can close and resume from grid state

**C. Hierarchy:**
- ✅ **Clear primary focus**: Document viewer is largest, center-aligned element
- ✅ Sidebar provides context without competing for attention
- ✅ Thumbnail rail is **subordinate** to main viewer (smaller, below, neutral styling)

**D. Density:**
- ✅ High-density for recruiter speed: summary + documents in one viewport
- ✅ Progressive disclosure: Notes/activity below fold; accessed when needed

**E. Accessibility:**
- ✅ Keyboard navigation: Arrow keys for document navigation, Tab for focus management
- ✅ Screen reader: Announces document count, current position, page changes
- ✅ ARIA live regions for dynamic content updates

**F. Canvas Kit Coverage (High-Level):**
- Modal shell: Canvas Kit `Modal`
- Document viewer: Custom component (no Canvas Kit equivalent for PDF/image rendering)
- Thumbnail rail: Canvas Kit `Card` + `Flex` layout
- Navigation buttons: Canvas Kit `TertiaryButton` with `SystemIcon`
- Sidebar: Canvas Kit `Box`, `Heading`, `BodyText`, `Badge`

---

## PASS 2: UI COMPOSITION (CANVAS KIT)

### Component Mapping

**Modal Structure:**
```tsx
<Modal model={profileModal}>
  <Modal.Overlay>
    <Modal.Card width="min(92vw, 1400px)" maxHeight="90vh">
      {/* Header */}
      <Modal.Heading>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap="s" alignItems="center">
            <ToolbarIconButton icon={arrowLeftSmallIcon} aria-label="Previous candidate" onClick={goPrev} />
            <Avatar name={candidate.name} size="small" />
            <Box>
              <Heading size="small">{candidate.name}</Heading>
              <BodyText size="small" color={colors.blackPepper500}>{candidate.jobTitle}</BodyText>
            </Box>
            <StatusBadge stage={candidate.stage} />
          </Flex>
          <Flex gap="s">
            <ToolbarIconButton icon={arrowRightSmallIcon} aria-label="Next candidate" onClick={goNext} />
            <Modal.CloseIcon />
          </Flex>
        </Flex>
      </Modal.Heading>

      {/* Body: Two-column layout */}
      <Modal.Body padding="l">
        <Flex gap="l" alignItems="stretch">
          {/* LEFT: Summary Sidebar (25%) */}
          <Box width="300px" flexShrink={0}>
            <CandidateSummaryPanel candidate={candidate} />
          </Box>

          {/* CENTER: CV Carousel (75%) */}
          <Box flex={1} minWidth={0}>
            <CVCarousel documents={candidate.documents} candidateId={candidate.id} />
          </Box>
        </Flex>

        {/* BELOW FOLD: Notes & Activity */}
        <Box marginTop="xl">
          <NotesAndActivityPanel candidateId={candidate.id} />
        </Box>
      </Modal.Body>
    </Modal.Card>
  </Modal.Overlay>
</Modal>
```

**CVCarousel Component:**
```tsx
const CVCarousel = ({ documents, candidateId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const currentDoc = documents[currentIndex];

  // Navigation handlers
  const goToPrevDoc = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const goToNextDoc = () => setCurrentIndex(Math.min(documents.length - 1, currentIndex + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevDoc();
      if (e.key === 'ArrowRight') goToNextDoc();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <Card
      padding="zero"
      style={{
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        backgroundColor: colors.frenchVanilla100,
        boxShadow: SANA_CARD_SHADOW,
      }}
    >
      {/* Document Viewer */}
      <Box
        style={{
          height: '600px',
          backgroundColor: colors.soap100,
          borderRadius: `${SANA_CARD_RADIUS_LG} ${SANA_CARD_RADIUS_LG} 0 0`,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <DocumentViewer
          documentUrl={currentDoc.url}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </Box>

      {/* Carousel Controls */}
      <Flex
        padding="m"
        justifyContent="space-between"
        alignItems="center"
        style={{ borderBottom: `1px solid ${colors.soap300}` }}
      >
        <TertiaryButton
          icon={arrowLeftSmallIcon}
          disabled={currentIndex === 0}
          onClick={goToPrevDoc}
        >
          Previous document
        </TertiaryButton>

        <BodyText size="small" color={colors.blackPepper500}>
          {currentDoc.name} ({currentPage} of {currentDoc.totalPages})
        </BodyText>

        <TertiaryButton
          icon={arrowRightSmallIcon}
          iconPosition="end"
          disabled={currentIndex === documents.length - 1}
          onClick={goToNextDoc}
        >
          Next document
        </TertiaryButton>
      </Flex>

      {/* Thumbnail Rail */}
      <Flex
        padding="m"
        gap="s"
        style={{ overflowX: 'auto', backgroundColor: colors.frenchVanilla100 }}
      >
        {documents.map((doc, index) => (
          <Card
            key={doc.id}
            padding="s"
            onClick={() => setCurrentIndex(index)}
            style={{
              minWidth: '120px',
              cursor: 'pointer',
              border: index === currentIndex
                ? `2px solid ${colors.blueberry500}`
                : `1px solid ${colors.soap300}`,
              borderRadius: '12px',
            }}
          >
            <Box
              style={{
                height: '80px',
                backgroundColor: colors.soap200,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SystemIcon icon={documentIcon} size="large" color={colors.blackPepper400} />
            </Box>
            <BodyText size="small" marginTop="xs" style={{ textAlign: 'center' }}>
              {doc.name}
            </BodyText>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};
```

### Sana Style Application

**Neutral Backgrounds:**
- Page canvas: `SANA_PAGE_CANVAS` (light grey)
- Modal card: `colors.frenchVanilla100` (white)
- Document viewer area: `colors.soap100` (very light grey for contrast with white CV)
- Thumbnail rail: `colors.frenchVanilla100` (white to match card)

**Minimal Blue Chrome:**
- Primary blue ONLY for: selected thumbnail border, focus rings, primary action buttons (outside carousel)
- Navigation buttons: `TertiaryButton` (neutral grey, not blue)

**Rounded Corners:**
- Main carousel card: `SANA_CARD_RADIUS_LG` (~20px)
- Thumbnails: 12px (compact, conversational feel per Sana)
- Document viewer top corners: rounded to match card

**Typography:**
- Roboto font stack
- Document name: `BodyText` size="small" (11–12pt)
- Page counter: `BodyText` size="small", `color={colors.blackPepper500}`
- Heading: `Heading` size="small" for modal title

### Navigation Completeness

**All Interactions Defined:**
1. **Candidate navigation**: Prev/Next in modal header (always visible)
2. **Document navigation**: Left/Right arrows OR thumbnail click
3. **Page navigation** (within multi-page document): Scroll within viewer, OR page controls (if implemented)
4. **Quick actions** (sidebar): Stage change, add note, send message
5. **Close modal**: X button in header, ESC key
6. **Keyboard shortcuts**: 
   - Arrow Left/Right: Navigate documents
   - Up/Down: Scroll within document (native)
   - Tab: Focus management between controls
   - ESC: Close modal

**No Placeholders:**
- All tabs/sections have defined content (summary, documents, notes)
- Empty states for: "No documents uploaded" (show message + upload prompt if permissions allow)

### Shared Components

**From `design/components/`:**
- `WorkdayTopNav`: Top global navigation (not in modal, but in parent grid page)
- `WorkdayLeftTabBar`: Hub navigation (parent page, not in modal)
- `SANA_PAGE_CANVAS`, `SANA_CARD_RADIUS_LG`, `SANA_CARD_SHADOW`: Theme tokens
- Form controls: If sidebar has filters/inputs, use `FormSelect`, `FormTextInput` from SharedFormControls.tsx

**Canvas Kit:**
- `Modal`, `Modal.Overlay`, `Modal.Card`, `Modal.Heading`, `Modal.CloseIcon`, `Modal.Body`
- `Card`, `Box`, `Flex`
- `Heading`, `BodyText`
- `TertiaryButton`, `ToolbarIconButton`
- `SystemIcon` (for arrows, document icon)
- `Avatar`, `Badge` (for candidate header)

### UX Principles

**Progressive Disclosure:**
- Primary: Document carousel (immediate, above fold)
- Secondary: Notes and activity (below fold, accessed via scroll)
- Tertiary: Advanced filters or actions (if applicable, in sidebar collapsed sections)

**Recognition over Recall:**
- Thumbnail rail provides **visual recognition** of all documents
- Document names visible at all times
- Current position indicated clearly ("Page 1 of 3")

**Efficiency for High-Frequency Tasks:**
- **Keyboard shortcuts** for power users (arrows for documents, ESC to close)
- **Touch gestures** for tablet recruiters (swipe)
- **Minimal clicks**: 1 click to open modal, 0 clicks to see first CV, arrow/swipe to see additional docs

### No Breadcrumbs Rule

**CRITICAL:** Do NOT implement breadcrumbs or chevron path strips in the prototype. Per `010-style-guide.mdc`:
> **No breadcrumbs in prototypes (hard rule)**: In `design/*.tsx` (and any future prototype entrypoints), do not import or render Canvas Kit `Breadcrumbs`, and do not build ad hoc hierarchy strips (labels separated by chevrons or slashes meant to read like a path, e.g. `Recruiting › Reqs › …`). No exceptions.

Instead, use:
- Modal title with candidate name (clear context)
- Grid remains visible behind modal (implicit hierarchy)
- "Previous/Next candidate" buttons provide navigation (not breadcrumbs)

---

## PASS 2 OUTPUT: Copy Inventory (for 319 Review)

### Buttons and CTAs

**Modal Header:**
- Previous candidate: "Previous candidate" (aria-label)
- Next candidate: "Next candidate" (aria-label)
- Close: (icon only, standard Canvas Kit Modal close)

**Carousel Navigation:**
- Previous document: "Previous document"
- Next document: "Next document"

**Sidebar Quick Actions:**
- Move to stage: "Move to screen" (or stage name, e.g. "Move to interview")
- Add note: "Add note"
- Send message: "Send message" (if WhatsApp/comm dock integration)

### Form Labels and Help Text

(Sidebar summary panel — read-only fields, labels only)
- Location: "Location"
- Stage: "Stage"
- Source: "Source"
- Applied date: "Applied"

### Error Messages

**Document Loading:**
- Failed to load document: "Unable to load this document. It may have been removed or you may not have access. Open in a new tab or contact support."
- Network error: "Connection lost while loading document. Check your network and try again."

**Empty State:**
- No documents uploaded: "No CV or documents uploaded yet. If you expected to see a CV, check that the candidate completed their application."

### Success/Confirmation

**Document Viewed:**
- (Silent success; telemetry logs view)

**Stage Changed:**
- (Handled by parent grid component; outside carousel scope)

### Empty States

**No documents:**
- Heading: "No documents uploaded"
- Body: "This candidate hasn't uploaded a CV or cover letter yet. They may have only filled out the application form."
- CTA: (None; recruiter cannot upload on behalf of candidate)

### Loading States

**Document loading:**
- "Loading document…" (spinner + text)

**Page loading (within document):**
- "Loading page {N}…"

### Legal/Consent

(Not applicable to CV carousel; no consent flows in document viewer)

### Accessibility (ARIA)

**Document navigation:**
- Live region announcement: "Now viewing {document name}, page {N} of {total pages}"
- Navigation button states: disabled state communicated to screen readers
- Thumbnail rail: "Document thumbnails" (group label)

**Keyboard hints:**
- (Optional tooltip or help text): "Use arrow keys to navigate between documents"

---

## CHECKPOINT: 319 Copy Review Required

**Status:** PASS 2 complete. Copy inventory above is ready for **319-doc-writer** review.

**Next:** Orchestrator invokes **319** to review copy against Editorial Guidelines. If **319** identifies legal-sensitive copy (unlikely in carousel context, but possible for audit/privacy messaging), **060-legal-advisor** will be invoked.

**After 319 approval:** Proceed to PASS 3 (Peer Review) and PASS 4 (Finalize) within this same Discovery Brief document.

---

## PASS 3: PEER REVIEW

**Reviewer Role:** Design Peer (315 switching to review mode)  
**Date:** 22 March 2026  
**Copy Review Input:** `design/gcc-candidate-review-cv-carousel-v54-copy-review-319.md` (APPROVED with optional refinements)

### Strategy Validation ✅

**JTBD Alignment:**
- ✅ Primary JTBD clearly addressed: "one dense review surface" with minimal tab changes
- ✅ CV Carousel-specific JTBD: "navigate between documents smoothly without closing and reopening"
- ✅ Recruiter workflow matches: high-volume req review (100+ candidates) with in-depth document assessment

**Shell Pattern Justification:**
- ✅ Pattern B+ (Modal with carousel) is appropriate for focused document review
- ✅ Recruiter workflow evidence supports modal choice (grid context preserved)
- ✅ Carousel enhancement is justified by multi-document use case (CV + cover letter + portfolio)

**Verdict:** STRONG STRATEGY FOUNDATION

### Layout Quality ✅✅✅ (MOST IMPORTANT)

**Primary Focus:**
- ✅ **Clear within 3 seconds**: Document carousel is visually dominant (largest element, center-aligned, ~75% width)
- ✅ **Single focal point**: Eye goes immediately to document viewer (not competing elements)

**Workday Pattern Matching:**
- ✅ Matches existing modal patterns (see `design/gcc-candidate-grid-v46.tsx`)
- ✅ Left sidebar + center content is standard Workday two-column layout
- ✅ Thumbnail rail pattern is familiar (similar to image galleries in other Workday surfaces)

**Region Definition:**
- ✅ Left sidebar: Clearly defined, fixed width (300px), persistent context
- ✅ Center carousel: Dominant, fluid width, primary focus
- ✅ Thumbnail rail: Subordinate, below main viewer, scannable

**Visual Competition:**
- ✅ No competing elements: Sidebar is intentionally de-emphasized with neutral styling
- ✅ Carousel controls are subordinate to document viewer (smaller buttons, neutral color)
- ✅ Hierarchy is crystal clear: Document > Candidate summary > Thumbnails > Notes (below fold)

**Generic vs Distinctive:**
- ✅ **Distinctive**: CV carousel is a recognisable pattern (similar to image carousels in e-commerce, document viewers)
- ✅ **Not generic**: Combination of Workday modal + carousel is specific and purposeful
- ✅ **Feels like Workday**: Uses Canvas Kit components and Sana neutral surfaces

**Verdict:** EXCELLENT LAYOUT — Clear hierarchy, strong focal point, feels native to Workday

### Design System Validation ✅

**Canvas Kit Compliance:**
- ✅ All components are valid Canvas Kit or custom (document viewer)
- ✅ Modal: Canvas Kit `Modal`, `Modal.Overlay`, `Modal.Card`, `Modal.Heading`
- ✅ Layout: Canvas Kit `Box`, `Flex`
- ✅ Typography: Canvas Kit `Heading`, `BodyText`
- ✅ Buttons: Canvas Kit `TertiaryButton`, `ToolbarIconButton`
- ✅ Icons: Canvas Kit `SystemIcon`

**Custom Components:**
- ⚠️ `DocumentViewer`: Custom component (no Canvas Kit equivalent for PDF/image rendering)
- ✅ Justified: Core functionality requires PDF.js or similar; no Canvas Kit alternative

**Invented UI:**
- ✅ NONE: All UI is either Canvas Kit or custom with clear justification

**Sana Style:**
- ✅ Neutral backgrounds: `SANA_PAGE_CANVAS`, `colors.frenchVanilla100`, `colors.soap100`
- ✅ Minimal blue: Only for selected state (thumbnail border) and focus rings
- ✅ Rounded corners: `SANA_CARD_RADIUS_LG` (~20px), 12px for thumbnails
- ✅ Typography: Roboto with Canvas Kit text components

**Verdict:** DESIGN SYSTEM COMPLIANT

### Navigation + Completeness ✅

**All Tabs Defined:**
- ✅ Modal sections: Summary (left sidebar), Documents (center carousel), Notes/Activity (below fold)
- ✅ No placeholder sections

**Interaction Coverage:**
- ✅ Candidate navigation: Prev/Next in header
- ✅ Document navigation: Arrow buttons, thumbnail clicks, keyboard shortcuts, swipe gestures
- ✅ Page navigation: Scroll within document viewer
- ✅ Quick actions: Stage change, add note, send message (sidebar)
- ✅ Modal close: X button, ESC key

**Empty States:**
- ✅ Defined: "No documents uploaded" with clear messaging

**Loading States:**
- ✅ Defined: "Loading document…", "Loading page {N}…"

**Error States:**
- ✅ Defined: Document load failure, network error

**Verdict:** COMPLETE COVERAGE — All states and interactions defined

### Copy Quality ✅

**Per 319 Review:**
- ✅ All copy APPROVED by 319-doc-writer
- ✅ Sentence case throughout
- ✅ Action-oriented CTAs
- ✅ Error messages provide problem + solution
- ✅ Neutral, professional tone
- ✅ Accessibility: ARIA labels for all icon-only buttons

**Terminology Consistency:**
- ✅ "Document" used consistently (not mixing "file", "attachment")
- ✅ "Candidate" used consistently (not "applicant")
- ✅ "Stage" used consistently (standard Workday term)

**Verdict:** EXCELLENT COPY — Meets Editorial Guidelines

### Experience Principles ✅

**Empower (Give Users Control):**
- ✅ Recruiters control navigation: Prev/Next candidate, document selection, page scrolling
- ✅ Outcome-focused: "Review documents efficiently" not "click through tabs"
- ✅ Multiple navigation methods: Arrows, thumbnails, keyboard, swipe (user chooses)

**Trust (Build Their Confidence):**
- ✅ Transparent: Document name and page count always visible
- ✅ Familiar: Carousel pattern is recognisable (e-commerce, galleries)
- ✅ Reliable: Clear error messages, loading states

**Grow (Enable Them To Change):**
- ✅ Easy to iterate: Adding documents to carousel is straightforward (candidate uploads more)
- ✅ No re-training debt: Carousel is intuitive (arrows, thumbnails = universal patterns)

**Verdict:** PRINCIPLES ALIGNED

---

## PASS 4: FIX OR REJECT

**Evaluation Criteria:**
- Layout: ⛔ Generic? ✅ NO — Distinctive, purpose-built
- Hierarchy: ⛔ Unclear? ✅ NO — Crystal clear focal point
- Alignment: ⛔ Not aligned to references? ✅ NO — Matches Workday modal patterns
- Junior design: ⛔ Yes? ✅ NO — Professional, production-ready

**Decision:** ✅ **APPROVED** — No fixes required

**Rationale:**
- Layout is strong with clear hierarchy
- Design system is fully compliant
- Copy is approved by 319
- All states and interactions are defined
- Feels native to Workday Recruiting

**ONE REFINEMENT (Optional):**
Per 319 Quick Win #1, consider shortening button labels:
- "Previous document" → "Previous" (visible) + aria-label="Previous document"
- "Next document" → "Next" (visible) + aria-label="Next document"

**Implementation Note:** 320 may apply this refinement but it is NOT required for approval.

---

## Final Discovery & Design Brief

**Summary:**
This Discovery & Design Brief defines a **CV carousel** embedded within a **unified candidate review modal** for Workday Recruiting. The carousel enables recruiters to navigate between multiple documents (CV, cover letter, portfolio) without exiting the modal, reducing context switching and improving review efficiency.

**Key Design Decisions:**

1. **Pattern B+ (Modal with Carousel):** Proven Workday modal pattern enhanced with horizontal document carousel
2. **Two-column layout:** Left sidebar (candidate summary) + center dominant (document carousel)
3. **Thumbnail rail:** Provides random access to any document; subordinate to main viewer
4. **Keyboard + touch navigation:** Arrow keys, swipe gestures, thumbnail clicks
5. **Sana Style:** Neutral backgrounds, minimal blue chrome, rounded corners
6. **Canvas Kit compliance:** All components are Canvas Kit or custom with justification
7. **Progressive disclosure:** Notes/activity below fold; primary focus on documents

**Target Users:**
- Primary: Corporate/regional recruiters reviewing 50–200+ candidates per req (GCC context)
- Secondary: Hiring managers consuming recruiter shortlists
- Tertiary: Mobile candidates uploading multiple documents

**Performance Considerations:**
- Lazy-load document pages (first page priority, full document on demand)
- Thumbnail images can be low-resolution previews (100–120px height)
- Consider PDF.js or similar library for client-side PDF rendering
- Progressive enhancement: Fallback to download links if rendering fails

**Accessibility:**
- Keyboard navigation: Arrow keys for documents, Tab for focus management, ESC to close
- Screen reader: ARIA live regions announce document changes, button states communicated
- WCAG AA compliance: Color contrast, focus indicators, keyboard operability

**Implementation Scope (for 320):**
- Build `CVCarousel` component with document viewer, navigation controls, thumbnail rail
- Integrate into unified review modal (from grid context)
- Apply approved copy from 319 review
- Implement keyboard shortcuts and swipe gesture handlers (basic; touch refinement can iterate)
- Add loading, error, and empty states per defined copy

---

## Final Verdict: ✅ **APPROVED**

**320-prototype-developer** may proceed to build the Canvas Kit prototype from this Discovery Brief and PRD.

**Artifacts for 320:**
- Discovery Brief: `design/gcc-candidate-review-cv-carousel-v54-discovery-brief.md`
- Copy Review: `design/gcc-candidate-review-cv-carousel-v54-copy-review-319.md` (approved copy)
- PRD: `docs/prds/gcc-candidate-review-experience-v54-prd.md`

**Next Step:** 320 builds prototype → 319 spot-checks implemented copy → 330 captures to Figma

---

**References:**
- PRD: `docs/prds/gcc-candidate-review-experience-v54-prd.md`
- JTBD: `docs/jtbd-recruiting-hr-professional-and-manager.md`
- Experience Principles: `docs/experience-principles.md`
- Style Guide: `.cursor/rules/010-style-guide.mdc` (Sana Style UI)
- Canvas Kit MCP: `/Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/user-canvas-kit-mcp/`
