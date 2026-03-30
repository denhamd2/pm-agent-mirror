---
description: Design advisory standards - Prototype versioning, Canvas Kit, Sana Style UI guidance for Agent Improvement Advisor (090)
globs:
  - ".cursor/rules/090-agent-improvement-advisor.mdc"
  - ".cursor/rules/advisory-methods/09*.md"
  - ".cursor/rules/315-design-brief-creation.mdc"
  - ".cursor/rules/320-prototype-developer.mdc"
  - ".cursor/rules/330-figma-integration.mdc"
alwaysApply: false
---

# Design Advisory Standards

## Prototype and UI standards (advisory checklist)

Use this lens whenever the user asks about **design workflow**, **prototype quality**, **visual fidelity**, **standalone copy or doc writing** (route to **319**), or **agent rules** for **315 / 318 / 319 / 320 / 321 / 330**.

**Workspace defaults (prototype bar):**
- **No yellow / warning `Banner`** used only to say data is mock, illustrative, or for PM review — use neutral **`BodyText`** or PRD/brief; reserve **`Banner`** for in-flow errors, success, or blocking validation.
- **All hub or page tabs prototyped** — every **`WorkdayLeftTabBar`** tab and every **`Tabs.Item`** gets representative Canvas Kit UI (filters, tables, actions), not stub placeholders, unless the PRD explicitly scopes a single-tab demo.
- **320 invokes Canvas Kit MCP** — `get-canvas-kit-tokens` (and token resources when needed) at build time, not guessed styling.

### Prototype Versioning and Freshness (Mandatory)

**CRITICAL RULE:** Every prototype MUST be generated fresh with a unique versioned slug URL. NEVER reuse or modify existing prototype files.

**Versioning Pattern:**
- Format: `[feature-name]-v[NN].tsx` where NN is incremented sequentially
- Example progression: `gcc-candidate-review-v54.tsx` → `gcc-candidate-review-cv-carousel-v54.tsx` (new feature) → `gcc-candidate-review-v55.tsx` (iteration)
- URL route: `http://localhost:5199/[feature-name]-v[NN]`

**When to Increment Version:**
1. **New mission/pipeline run**: Always create a new versioned file (e.g., Regional E2E mission [REGION-CODE]-E2E-015 → v55)
2. **Significant feature addition**: New versioned file (e.g., adding carousel to v54 → v55)
3. **Iteration on same feature**: New version even for refinements (v55 → v56)
4. **NEVER**: Edit existing prototype files (v54.tsx) for new work; create v55.tsx instead

**Implementation Checklist for 320:**
- [ ] Create new file: `design/[feature-name]-vNN.tsx` (never edit existing vNN-1)
- [ ] Add import to `design/main.tsx`
- [ ] Add route case to `prototypeFromLocation()` function (both pathname and hash)
- [ ] Add render case in `AppRoot()` function
- [ ] **Add slug to `design/vite.config.ts`** in `prototypeSpaSlugFallback` plugin's `slugs` Set (CRITICAL: prevents raw JS serving)
- [ ] Test route: `http://localhost:5199/[feature-name]-vNN`

**Rationale:**
- **Audit trail**: Each version is a snapshot of that pipeline's output
- **Rollback capability**: Can compare v54 vs v55 side-by-side
- **Figma capture**: Each version gets its own Figma file (no confusion about "latest")
- **Regional E2E missions**: Each E2E run (GCC-E2E-029, FRANCE-E2E-001, etc.) produces a clean versioned artifact
- **No conflicts**: Multiple prototypes can coexist for comparison or stakeholder review

**Version Tracking:**
- MISSION_LOG.md must record: `Prototype (320): design/[feature-name]-vNN.tsx (route: http://localhost:5199/[feature-name]-vNN)`
- Design Brief must reference the EXACT versioned prototype it targets
- Figma capture (330) must note which version was captured

**Anti-Pattern to Flag:**
- ❌ Editing `design/gcc-candidate-review-v54.tsx` for new work → ✅ Create `design/gcc-candidate-review-v55.tsx`
- ❌ Reusing v54 slug for v55 features → ✅ New version number for new work
- ❌ Multiple missions pointing to same prototype version → ✅ Each mission gets its own version

### Canvas Kit MCP (`user-canvas-kit-mcp`)
**Location**: `/Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/user-canvas-kit-mcp/`

- **Tools**: `get-canvas-kit-tokens`, `get-canvas-kit-upgrade-guides`
- **Resources** (via MCP fetch): colour palette, colour tokens, roles, contrast, upgrade guides
- **Expectation**: Proposals to improve prototypes should say *explicitly* that implementers must use Canvas Kit components and tokens from the MCP, not ad hoc HTML/CSS that duplicates CK patterns.

### Sana Style UI (workspace default for prototypes)
Canonical detail lives in **`010-style-guide.mdc` → Sana Style UI**. When you recommend changes, ensure **010**, **315-design-brief-creation**, **320-prototype-developer**, and **330-figma-integration** stay consistent (319-copy-review must not fight Sana or Editorial Guidelines).

**Summary for quick advisory use:**
- **Surfaces**: Predominantly **white and light grey** page backgrounds; white cards on cool grey fields. Avoid large **blue-tinted chrome blocks**; reserve stronger blue for **links, primary buttons, and focus** only.
- **Typography**: **Roboto** with Canvas Kit text components (`Heading`, `BodyText`, etc.); clear hierarchy (bold section titles, regular body, smaller secondary labels).
- **Shape**: **Pill** global search and **pill** active nav highlights; **rounded cards** (order of **16px** where not using token); main content **shell** corners up to **~24px** where appropriate; compact elements (e.g. message chips) **~12px** radius.
- **Reference**: **`design/references/sana/`** (versioned PNG + README) exemplifies target density and neutrals; cite **`010-style-guide`** in plans rather than redefining tokens from memory.
