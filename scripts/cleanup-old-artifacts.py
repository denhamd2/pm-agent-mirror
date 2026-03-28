#!/usr/bin/env python3
"""
Cleanup script: Retain only the N most recent files (by modification time) in specified directories.
Targets: slide specs, PRDs, story maps, prototypes (versioned .tsx files)
Usage: python3 scripts/cleanup-old-artifacts.py --keep 3 --dry-run
"""
import argparse
import os
from pathlib import Path
from typing import List

def cleanup_directory(directory: Path, pattern: str, keep_count: int, dry_run: bool) -> List[Path]:
    """Find matching files, sort by mtime, delete all but the N most recent."""
    files = sorted(directory.glob(pattern), key=lambda f: f.stat().st_mtime, reverse=True)
    
    if len(files) <= keep_count:
        return []
    
    to_delete = files[keep_count:]
    
    if dry_run:
        print(f"\n[DRY RUN] Would delete {len(to_delete)} files from {directory}:")
        for f in to_delete:
            print(f"  - {f.name}")
    else:
        print(f"\nDeleting {len(to_delete)} files from {directory}:")
        for f in to_delete:
            print(f"  - {f.name}")
            f.unlink()
    
    return to_delete

def main():
    parser = argparse.ArgumentParser(description="Cleanup old artifact files")
    parser.add_argument("--keep", type=int, default=3, help="Number of recent files to keep (default: 3)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be deleted without deleting")
    args = parser.parse_args()
    
    repo_root = Path(__file__).parent.parent
    
    # Define cleanup targets
    targets = [
        (repo_root / "docs" / "prds", "*-prd.md"),
        (repo_root / "docs" / "story-maps", "*-story-map.md"),
        (repo_root, "slides_spec*.json"),
        (repo_root / "design", "*-v[0-9]*.tsx"),
    ]
    
    total_deleted = 0
    
    for directory, pattern in targets:
        if not directory.exists():
            print(f"Skipping {directory} (does not exist)")
            continue
        
        deleted = cleanup_directory(directory, pattern, args.keep, args.dry_run)
        total_deleted += len(deleted)
    
    action = "Would delete" if args.dry_run else "Deleted"
    print(f"\n{action} {total_deleted} total files (kept {args.keep} most recent in each directory)")
    
    if args.dry_run:
        print("\nRun without --dry-run to actually delete files.")

if __name__ == "__main__":
    main()
