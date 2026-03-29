#!/usr/bin/env python3
"""
Cleanup script: Retain only the N most recent files (by modification time) in specified directories.
Targets: slide specs, PRDs, story maps, prototypes, research analyses, design briefs, epic drafts
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

def cleanup_scratch_files(repo_root: Path, regions: List[str], dry_run: bool) -> int:
    """Delete ALL scratch files (temp working files don't need retention)."""
    total = 0
    for region in regions:
        for subfolder in ["brainstorm-analysis", "gap-analysis"]:
            scratch_dir = repo_root / "research" / region / subfolder
            if scratch_dir.exists():
                deleted = cleanup_directory(scratch_dir, "_scratch-*.md", keep_count=0, dry_run=dry_run)
                total += len(deleted)
    return total

def main():
    parser = argparse.ArgumentParser(description="Cleanup old artifact files")
    parser.add_argument("--keep", type=int, default=3, help="Number of recent files to keep (default: 3)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be deleted without deleting")
    args = parser.parse_args()
    
    repo_root = Path(__file__).parent.parent
    
    # Define cleanup targets (original 4)
    targets = [
        (repo_root / "docs" / "prds", "*-prd.md"),
        (repo_root / "docs" / "story-maps", "*-story-map.md"),
        (repo_root, "slides_spec*.json"),
        (repo_root / "design", "*-v[0-9]*.tsx"),
    ]
    
    # Add regional research analysis files
    regions = ["GCC", "India", "France", "Germany", "Japan", "UK", "Canada", "Australia"]
    for region in regions:
        region_path = repo_root / "research" / region
        if region_path.exists():
            targets.extend([
                (region_path, "strategy-context-*.md"),
                (region_path, "pestel-analysis-*.md"),
                (region_path, "swot-analysis-*.md"),
                (region_path / "thematic-analysis", "*-PMF-Analysis*.md"),
                (region_path / "brainstorm-analysis", "202*-brainstorm-analysis*.md"),
                (region_path / "gap-analysis", "202*-gap-analysis*.md"),
            ])
            # Add win-loss-analysis if it exists (deprecated 107)
            if (region_path / "win-loss-analysis").exists():
                targets.append((region_path / "win-loss-analysis", "202*-win-loss-analysis*.md"))
    
    # Add competitive intelligence files
    comp_regions = ["gcc", "in", "fr", "de", "jp", "uk", "ca", "au"]
    for region_code in comp_regions:
        comp_path = repo_root / "research" / "competitive" / region_code
        if comp_path.exists():
            targets.extend([
                (comp_path, "*-competitive-scan-*.md"),
                (comp_path, "e2e-ci-brief-*.md"),
            ])
    
    # Add design and epic artifacts
    targets.extend([
        (repo_root / "design", "*-design-brief.md"),
        (repo_root / "docs" / "epics", "*-epic-draft.md"),
    ])
    
    total_deleted = 0
    
    for directory, pattern in targets:
        if not directory.exists():
            continue
        
        deleted = cleanup_directory(directory, pattern, args.keep, args.dry_run)
        total_deleted += len(deleted)
    
    # Special: cleanup scratch files (keep 0)
    scratch_deleted = cleanup_scratch_files(repo_root, regions, args.dry_run)
    total_deleted += scratch_deleted
    
    action = "Would delete" if args.dry_run else "Deleted"
    print(f"\n{action} {total_deleted} total files (kept {args.keep} most recent in each directory)")
    
    if args.dry_run:
        print("\nRun without --dry-run to actually delete files.")

if __name__ == "__main__":
    main()
