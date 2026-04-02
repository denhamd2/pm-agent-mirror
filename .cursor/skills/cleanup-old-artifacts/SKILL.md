# Cleanup Old Artifacts

## Description
A standalone skill to manually clean up old generated artifacts (reports, matrices, decks) across the workspace. It keeps the N newest files matching specific patterns in designated directories and deletes older ones, including scratch files.

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

## Execution Steps
1. Determine if the user requested a specific `--keep` count or a `--dry-run`.
2. Execute the `python3 scripts/cleanup-old-artifacts.py` command with the appropriate flags using the Shell tool.
3. Report back to the user with a summary of what was deleted (or what would be deleted, in the case of a dry run), based on the script's output.
