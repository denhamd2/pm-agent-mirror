# Architecture Cleanup Plan - Post-Refactoring Documentation Fixes

**Date:** 31 March 2026  
**Context:** Recent architectural refactoring (commits `ca979cd`, `cc555a3`) successfully implemented Cursor 2.6 best practices with thin wrapper subagents and skill extraction. This cleanup addresses stale documentation references.

**Priority:** Low (non-breaking) - Active workflows are unaffected  
**Estimated Effort:** 1-2 hours

---

## Summary

The refactoring replaced three rules with subagents:
- ❌ `099-product-strategist.mdc` → ✅ `@product-strategy-agent` (subagent)
- ❌ `101-competitive-intelligence.mdc` → ✅ `@competitive-intel` (subagent)
- ❌ `120-pmf-thematic-analysis.mdc` → ✅ `@pmf-analyst` (subagent)

The refactoring also renamed:
- ❌ `200-prd-writer.mdc` → ✅ `200-prd-template.mdc` (invokes `/write-prd` skill)

**Active rules (000, 001, orchestrator logic):** ✅ Already updated - workflows operational  
**Documentation files:** 🟡 Still reference old names - needs cleanup

---

## Issue 1: Old Agent Name References

### Files Affected (20+ files)

#### High-Priority Documentation (user-facing)
1. `research/README.md` - User guide for research workflows
2. `.cursor/skills/README.md` - Skills catalog
3. `strategy/README.md` - Strategy documentation guide
4. `MISSION_LOG.md` - Active mission tracking

#### Low-Priority (archival/historical)
5-25. Research analysis reports in `research/*/gap-analysis/` and historical documentation

### Pattern to Fix

**Find:** `099-product-strategist`, `101-competitive-intelligence`, `120-pmf-thematic-analysis`  
**Replace with:** `@product-strategy-agent`, `@competitive-intel`, `@pmf-analyst`

### Sed Command (batch fix)

```bash
# Backup first
git stash push -m "pre-cleanup backup"

# Fix agent references
find . -type f \( -name "*.md" -o -name "*.mdc" \) \
  ! -path "./.git/*" \
  ! -path "./node_modules/*" \
  -exec sed -i '' \
    -e 's/099-product-strategist/@product-strategy-agent/g' \
    -e 's/101-competitive-intelligence/@competitive-intel/g' \
    -e 's/120-pmf-thematic-analysis/@pmf-analyst/g' \
    {} +

# Verify changes
git diff --stat
```

---

## Issue 2: PRD Rule Naming Inconsistency

### Files Affected (35+ references)

**Pattern 1:** `200-prd-writer` (old name) - 35 references  
**Pattern 2:** `200-write-prd` (intermediate name) - found in some docs  
**Current:** `200-prd-template.mdc` → `/write-prd` skill

### Sed Command (batch fix)

```bash
# Fix PRD references
find . -type f \( -name "*.md" -o -name "*.mdc" \) \
  ! -path "./.git/*" \
  ! -path "./node_modules/*" \
  -exec sed -i '' \
    -e 's/200-prd-writer/200-prd-template/g' \
    -e 's/200-write-prd/200-prd-template/g' \
    {} +

# Verify
git diff --stat
```

---

## Manual Review Required

After batch fixes, manually review these critical files:

1. **MISSION_LOG.md** - Check mission entries for correct agent references
2. **research/README.md** - Verify workflow descriptions are accurate
3. **.cursor/skills/README.md** - Update skill catalog if needed
4. **strategy/README.md** - Verify strategy workflow documentation

---

## Verification Steps

### 1. Search for Remaining Old References

```bash
# Check for any remaining old agent names
rg "(099-product-strategist|101-competitive|120-pmf-thematic)" \
   --type md --type mdc

# Check for old PRD naming
rg "(200-prd-writer|200-write-prd)" \
   --type md --type mdc --glob "!200-prd-template.mdc"
```

### 2. Validate Active Rules Still Work

```bash
# Verify orchestrator references are correct
rg "@(product-strategy-agent|competitive-intel|pmf-analyst)" \
   .cursor/rules/000-master-orchestrator.mdc

# Verify 200 references are correct
rg "200-prd-template|/write-prd" \
   .cursor/rules/000-master-orchestrator.mdc
```

### 3. Test Workflow Integrity

Run a minimal workflow test:
- Trigger: "Run India PMF research" (just Steps 1-3)
- Expected: @product-strategy-agent subagent invoked successfully
- Verify: No errors referencing old rule names

---

## Implementation

### Option A: Automated (Recommended)

```bash
cd /Users/david.denham/product-manager-agent

# 1. Backup
git stash push -m "pre-cleanup-backup-2026-03-31"

# 2. Fix agent references
find . -type f \( -name "*.md" -o -name "*.mdc" \) \
  ! -path "./.git/*" ! -path "./node_modules/*" \
  -exec sed -i '' \
    -e 's/099-product-strategist/@product-strategy-agent/g' \
    -e 's/101-competitive-intelligence/@competitive-intel/g' \
    -e 's/120-pmf-thematic-analysis/@pmf-analyst/g' \
    -e 's/200-prd-writer/200-prd-template/g' \
    -e 's/200-write-prd/200-prd-template/g' \
    {} +

# 3. Verify
git diff --stat
git diff | head -100  # Spot check

# 4. Commit
git add -A
git commit -m "docs: update agent and rule references post-refactoring

- Replace 099/101/120 with @product-strategy-agent/@competitive-intel/@pmf-analyst
- Standardize PRD rule references to 200-prd-template
- Non-breaking: documentation updates only, workflows unaffected

Refs: ca979cd, cc555a3 (architecture refactoring)"
```

### Option B: Manual

1. Open each file in the "High-Priority Documentation" list
2. Find and replace using your editor
3. Review changes before saving
4. Commit incrementally

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sed breaks something | Low | Medium | Git stash backup before changes |
| Miss some references | Medium | Low | Verification steps catch stragglers |
| Active workflow breaks | Very Low | High | Already verified - active rules correct |
| Documentation becomes inconsistent | Medium | Low | Batch approach ensures consistency |

---

## Success Criteria

✅ **Complete** when:
1. `rg "099-product-strategist"` returns 0 results (except this plan)
2. `rg "101-competitive-intelligence"` returns 0 results (except this plan)
3. `rg "120-pmf-thematic"` returns 0 results (except this plan)
4. `rg "200-prd-writer"` returns 0 results (except this plan)
5. Manual review of 4 critical files complete
6. Test workflow runs without errors
7. Changes committed with descriptive message

---

## Notes

- **No urgency**: Active workflows are unaffected (orchestrator already updated)
- **Safe operation**: Only touching documentation, not executable rules
- **Incremental OK**: Can fix high-priority docs first, rest later
- **Verify before commit**: Always check `git diff` output before committing

---

## Related

- Architecture refactoring commits: `ca979cd`, `cc555a3`
- Architecture audit: Current conversation
- Subagent documentation: `.cursor/agents/*.md`
- Skills documentation: `.cursor/skills/README.md`
