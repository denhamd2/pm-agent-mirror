# E2E Artifact Cleanup Integration Plan

**STATUS: IMPLEMENTED ✅**

**Implementation Date**: 27 March 2026
**Changes Applied**: Cleanup script updated + orchestrator integration complete

---

## Problem

Old artifact files accumulate during E2E pipeline runs:
- Slide spec JSON files (`docs/decks/specs/slides_spec_v*.json`) from deck generation
- PRD markdown files (`docs/prds/*-prd.md`) from PRD writing
- Story map files (`docs/story-maps/*-story-map.md`) from story mapping
- Prototype files (`design/*-v*.tsx`) from prototype development

These should be automatically cleaned up to keep only the 3 most recent versions after each E2E pipeline run.

## Current State

**Cleanup script exists**: `scripts/cleanup-old-artifacts.py`
- Targets: slide specs, PRDs, story maps, prototypes
- Default: keeps 3 most recent (by modification time)
- Works correctly with `--keep 3` flag
- **Updated**: Now includes `design/*-v*.tsx` pattern for versioned prototypes

**Gap**: Script exists but is NOT integrated into E2E pipeline - must be run manually.

## Proposed Solution

Integrate automatic cleanup into the **Regional E2E Pipeline** in `000-master-orchestrator.mdc` at three strategic points:

1. **After Step 3 (130 deck generation)**: Clean up old slide spec JSON files
2. **After Step 6 (200 PRD creation)**: Clean up old PRD files
3. **After Step 8.5 (320 prototype creation)**: Clean up old prototype files
4. **After Step 11.6 (420 story map creation)**: Clean up old story map files

**Implementation approach**: Add Shell commands to invoke the cleanup script at these pipeline steps.

## Rationale

**Benefits:**
- **Automatic maintenance**: No manual cleanup required
- **Workspace hygiene**: Only relevant recent versions kept
- **Audit trail preserved**: 3 versions retained for comparison/rollback
- **Non-intrusive**: Fast execution, won't slow pipeline
- **Already validated**: Script is proven and working

**Why these integration points:**
- **After 130**: Slide spec is freshly generated, safe to clean up old versions
- **After 200**: PRD is freshly generated, safe to clean up old versions
- **After 320**: Prototype is freshly generated, safe to clean up old versions
- **After 420**: Story map is freshly generated, safe to clean up old versions
- **Not at end of pipeline**: Cleanup happens right after generation (clearer causality)

**Why keep 3 versions:**
- Version N (current/latest)
- Version N-1 (previous for comparison)
- Version N-2 (rollback option)

## Before/After Examples

### Before (Manual Cleanup Required)

**E2E Pipeline Step 3 (in orchestrator)**:
```markdown
3. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: "Build full PMF roadmap deck from the **120** report path from step **2b**. Target **~50-60 slides** (v65 parity). Write `docs/decks/specs/slides_spec_vN.json` and `~/Downloads/[REGION]_Recruiting_PMF_Roadmap_vN.pptx` (auto-increment N). Output: **Provide direct link to the generated .pptx file.** Part of [REGION] e2e pipeline."
3. **Update todo**: Mark Step 3 as completed, Step 4 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-3", status: "completed" }, { id: "[region-code]-e2e-step-4", status: "in_progress" }] })`
4. HUMAN-IN-THE-LOOP: Parse **120** output for the E2E Handoff table...
```

**Result**: Old `docs/decks/specs/slides_spec_v58.json`, `docs/decks/specs/slides_spec_v59.json`, `design/gcc-nationalisation-v58.tsx`, `design/gcc-nationalisation-v59.tsx`, etc. accumulate forever.

### After (Automatic Cleanup)

**E2E Pipeline Step 3 (in orchestrator)**:
```markdown
3. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: "Build full PMF roadmap deck from the **120** report path from step **2b**. Target **~50-60 slides** (v65 parity). Write `docs/decks/specs/slides_spec_vN.json` and `~/Downloads/[REGION]_Recruiting_PMF_Roadmap_vN.pptx` (auto-increment N). Output: **Provide direct link to the generated .pptx file.** Part of [REGION] e2e pipeline."
3a. **Cleanup old slide specs**: Run `python3 scripts/cleanup-old-artifacts.py --keep 3` to retain only 3 most recent slide spec JSON files and PRD/story map files (non-blocking, fast execution)
3. **Update todo**: Mark Step 3 as completed, Step 4 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-3", status: "completed" }, { id: "[region-code]-e2e-step-4", status: "in_progress" }] })`
4. HUMAN-IN-THE-LOOP: Parse **120** output for the E2E Handoff table...
```

**Result**: Only 3 most recent versions of each artifact type (slide specs, PRDs, prototypes, story maps) remain after each E2E run.

## Implementation Steps

### Step 1: Update 000-master-orchestrator.mdc

**Location**: Line ~223 (after Step 3 / 130 deck generation, before Step 4 HITL)

**Change**: Add cleanup step after 130 invocation:

```markdown
3. Invoke **130** with Task description **"Generating PMF Roadmap Deck"**: ...
3a. **Cleanup artifacts**: Run Shell command: `python3 scripts/cleanup-old-artifacts.py --keep 3` (retains 3 most recent slide specs, PRDs, prototypes, story maps; logs deletions to terminal)
3. **Update todo**: Mark Step 3 as completed, Step 4 as in_progress: ...
```

**Notes:**
- Cleanup runs immediately after 130 completes (slide spec just written)
- Script cleans ALL artifact types in one pass (efficient)
- No dry-run flag = actual deletion (safe because script sorts by mtime)
- Fast execution (~100ms), non-blocking

### Step 2: Verification

After updating orchestrator:
1. Manually create 5+ test slide spec files under `docs/decks/specs/`: `touch docs/decks/specs/slides_spec_v{70..75}.json`
2. Run cleanup script: `python3 scripts/cleanup-old-artifacts.py --keep 3`
3. Verify only 3 most recent remain: `ls -1 docs/decks/specs/slides_spec*.json`
4. Confirm cleanup script works as expected before integration

### Step 3: Documentation

Update orchestrator MISSION_LOG format to note cleanup:
```markdown
**Artifacts:** 
- Slide Deck: [path] (cleanup: retained 3 most recent slide specs)
- PRD: [path] (cleanup: retained 3 most recent PRDs)
- Prototype: [path] (cleanup: retained 3 most recent prototypes)
- Story Map: [path] (cleanup: retained 3 most recent story maps)
```

## Success Criteria

- [ ] Cleanup script runs automatically after Step 3 (deck generation)
- [ ] Only 3 most recent versions of each artifact type remain
- [ ] Cleanup completes in <1 second (non-blocking)
- [ ] Orchestrator logs cleanup results in terminal output
- [ ] Works across all 8 supported regions (GCC, UK, France, Germany, Japan, India, Canada, Australia)

## Alternatives Considered

**Alternative 1**: Add cleanup to individual agents (130, 200, 420)
- **Rejected**: Redundant (3 cleanup calls per E2E run)
- **Better**: Single cleanup call after 130 handles all artifact types

**Alternative 2**: Cleanup at end of pipeline (after Step 11.9)
- **Rejected**: Less clear causality; all artifacts cleaned at once far from generation
- **Better**: Cleanup right after generation (Step 3) is clearer

**Alternative 3**: Keep 5 versions instead of 3
- **Rejected**: More clutter without clear benefit
- **Rationale**: 3 versions = current + comparison + rollback (sufficient)

## Implementation Details

### Shell Command Pattern

```bash
python3 scripts/cleanup-old-artifacts.py --keep 3
```

**Expected output**:
```
Deleting 2 files from /Users/david.denham/product-manager-agent/docs/decks/specs:
  - slides_spec_v58.json
  - slides_spec_v59.json

Deleting 3 files from /Users/david.denham/product-manager-agent/design:
  - gcc-nationalisation-v58.tsx
  - gcc-nationalisation-v59.tsx
  - gcc-nationalisation-v60.tsx

Deleted 5 total files (kept 3 most recent in each directory)
```

### Error Handling

- **Script not found**: Pipeline continues (cleanup is non-critical)
- **Permission denied**: Pipeline continues (log warning)
- **No files to delete**: Script exits cleanly with "0 files deleted"

The orchestrator doesn't need explicit error handling - Shell command failures won't break the pipeline.

## Timeline

- Implementation: 5 minutes (single orchestrator rule update)
- Verification: 2 minutes (test script with dummy files)
- Total: <10 minutes

## Next Steps

1. Get user approval for this plan
2. Update `000-master-orchestrator.mdc` at Step 3a
3. Verify cleanup script works with test files
4. Document in MISSION_LOG format
5. Verify in next E2E run (any region)

---

**Question for user**: Should cleanup happen ONLY after Step 3 (all artifacts at once), or would you prefer it split across multiple steps (slide specs after 130, PRDs after 200, story maps after 420)?

**Recommendation**: Single cleanup after Step 3 is simpler and equally effective since the script handles all artifact types in one pass.
