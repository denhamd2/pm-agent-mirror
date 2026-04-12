# Cleanup Old Artifacts

## Description
A standalone skill to manually clean up old generated artifacts (reports, matrices, decks, prototypes) across the workspace. It keeps the N newest files matching specific patterns in designated directories and deletes older ones, including scratch files.

**Save protection**: Prototypes saved via the Prototypes dashboard page (`docs/pm-agent-prototypes.html`) are excluded from cleanup, along with their associated PRDs, design briefs, and decks. The saved list is stored in `docs/saved-prototypes.json`.

## Trigger Phrases
- `/cleanup`
- "clean up old artifacts"
- "run cleanup"
- "delete old reports"

## Usage
Run the Python script `scripts/cleanup-old-artifacts.py` via the Shell tool.

### Arguments
- `--keep N`: (Optional) Number of newest files to keep per pattern (default: 3).
- `--dry-run`: (Optional) Show what would be deleted without actually deleting anything.

### Examples

**Default cleanup (keeps 3 newest files):**
```bash
python3 scripts/cleanup-old-artifacts.py
```

**Keep only the newest file:**
```bash
python3 scripts/cleanup-old-artifacts.py --keep 1
```

**Dry run (see what would be deleted):**
```bash
python3 scripts/cleanup-old-artifacts.py --dry-run
```

## Cleanup Targets
- Prototypes: `design/*-v[0-9]*.tsx`
- PRDs: `docs/prds/*-prd.md`
- Design briefs: `design/*-design-brief.md`
- Decks: `docs/downloads/*_Roadmap_v*.pptx`
- Story maps: `docs/story-maps/*-story-map.md`
- Slide specs: `slides_spec*.json`
- Epic drafts: `docs/epics/*-epic-draft.md`
- Regional research analyses (strategy, PESTEL, SWOT, PMF, brainstorm, gap)
- Competitive intelligence scans and briefs
- Scratch files (always deleted, no retention)

## Execution Steps
1. Determine if the user requested a specific `--keep` count or a `--dry-run`.
2. Execute the `python3 scripts/cleanup-old-artifacts.py` command with the appropriate flags using the Shell tool.
3. Report back to the user with a summary of what was deleted (or what would be deleted, in the case of a dry run), based on the script's output. Note any files that were protected by save status.
