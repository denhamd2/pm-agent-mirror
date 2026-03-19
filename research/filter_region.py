#!/usr/bin/env python3
"""
Regional Filter for PMF Thematic Analysis

This script filters Customer Ideas and Win-Loss Opportunity data by target region
to prepare datasets for Braun & Clarke thematic analysis.

Usage:
    python filter_region.py <region> <ideas_csv> <opps_csv>

Example:
    python filter_region.py Japan "research/raw-data/Idea Question Responses.csv" "research/raw-data/Opportunity Detail.xlsx - Sheet 1.csv"

Author: Product Manager Agent - PMF Thematic Analysis Workflow
"""

import pandas as pd
import sys
import os
from pathlib import Path

def filter_by_region(region, ideas_path, opps_path):
    """
    Filter CSVs by target region and save filtered outputs.
    
    Args:
        region (str): Target region to filter for (e.g., "Japan", "Germany", "APAC")
        ideas_path (str): Path to Idea Question Responses CSV
        opps_path (str): Path to Opportunity Detail CSV
    
    Returns:
        tuple: (ideas_filtered DataFrame, opps_filtered DataFrame)
    """
    
    print(f"\n{'='*70}")
    print(f"PMF REGIONAL FILTER - {region.upper()}")
    print(f"{'='*70}\n")
    
    # Validate input files exist
    if not os.path.exists(ideas_path):
        print(f"❌ ERROR: Ideas file not found: {ideas_path}")
        sys.exit(1)
    
    if not os.path.exists(opps_path):
        print(f"❌ ERROR: Opportunities file not found: {opps_path}")
        sys.exit(1)
    
    # Load datasets
    print(f"📂 Loading datasets...")
    try:
        ideas_df = pd.read_csv(ideas_path)
        print(f"   ✓ Loaded {len(ideas_df):,} ideas from: {Path(ideas_path).name}")
    except Exception as e:
        print(f"❌ ERROR loading ideas file: {e}")
        sys.exit(1)
    
    try:
        opps_df = pd.read_csv(opps_path)
        print(f"   ✓ Loaded {len(opps_df):,} opportunities from: {Path(opps_path).name}")
    except Exception as e:
        print(f"❌ ERROR loading opportunities file: {e}")
        sys.exit(1)
    
    print(f"\n📊 Original dataset sizes:")
    print(f"   • Ideas: {len(ideas_df):,} records")
    print(f"   • Opportunities: {len(opps_df):,} records")
    print(f"   • Total: {len(ideas_df) + len(opps_df):,} records")
    
    # Filter Ideas by Verbatim column
    print(f"\n🔍 Filtering ideas for '{region}' mentions in Verbatim column...")
    
    if 'Verbatim' not in ideas_df.columns:
        print(f"⚠️  WARNING: 'Verbatim' column not found in ideas file.")
        print(f"   Available columns: {', '.join(ideas_df.columns[:10])}...")
        ideas_filtered = pd.DataFrame()
    else:
        ideas_filtered = ideas_df[
            ideas_df['Verbatim'].str.contains(region, case=False, na=False)
        ]
        print(f"   ✓ Found {len(ideas_filtered):,} ideas mentioning '{region}'")
    
    # Filter Opportunities by multiple columns
    print(f"\n🔍 Filtering opportunities for '{region}' mentions...")
    
    # Check which columns exist
    filter_columns = {
        'Country Specific Gap Detail': 'Country Specific Gap Detail' in opps_df.columns,
        'CI Notes': 'CI Notes' in opps_df.columns,
        'Pain point(s)': 'Pain point(s)' in opps_df.columns,
        'Proposed Solution': 'Proposed Solution' in opps_df.columns
    }
    
    available_cols = [col for col, exists in filter_columns.items() if exists]
    missing_cols = [col for col, exists in filter_columns.items() if not exists]
    
    if available_cols:
        print(f"   Searching in columns: {', '.join(available_cols)}")
    
    if missing_cols:
        print(f"   ⚠️  Missing columns (will skip): {', '.join(missing_cols)}")
    
    # Build filter dynamically based on available columns
    filters = []
    
    if filter_columns['Country Specific Gap Detail']:
        filters.append(
            opps_df['Country Specific Gap Detail'].str.contains(region, case=False, na=False)
        )
    
    if filter_columns['CI Notes']:
        filters.append(
            opps_df['CI Notes'].str.contains(region, case=False, na=False)
        )
    
    if filter_columns['Pain point(s)']:
        filters.append(
            opps_df['Pain point(s)'].str.contains(region, case=False, na=False)
        )
    
    if filter_columns['Proposed Solution']:
        filters.append(
            opps_df['Proposed Solution'].str.contains(region, case=False, na=False)
        )
    
    if filters:
        # Combine filters with OR logic
        combined_filter = filters[0]
        for f in filters[1:]:
            combined_filter = combined_filter | f
        
        opps_filtered = opps_df[combined_filter]
        print(f"   ✓ Found {len(opps_filtered):,} opportunities mentioning '{region}'")
    else:
        print(f"   ❌ No valid columns found for filtering opportunities")
        opps_filtered = pd.DataFrame()
    
    # Save filtered datasets
    print(f"\n💾 Saving filtered datasets...")
    
    output_dir = Path('research/raw-data')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    ideas_output = output_dir / f'filtered_{region.lower().replace(" ", "_")}_ideas.csv'
    opps_output = output_dir / f'filtered_{region.lower().replace(" ", "_")}_opps.csv'
    
    try:
        ideas_filtered.to_csv(ideas_output, index=False)
        print(f"   ✓ Saved {len(ideas_filtered):,} filtered ideas to: {ideas_output}")
    except Exception as e:
        print(f"   ❌ ERROR saving filtered ideas: {e}")
    
    try:
        opps_filtered.to_csv(opps_output, index=False)
        print(f"   ✓ Saved {len(opps_filtered):,} filtered opportunities to: {opps_output}")
    except Exception as e:
        print(f"   ❌ ERROR saving filtered opportunities: {e}")
    
    # Summary statistics
    print(f"\n📈 FILTERING SUMMARY")
    print(f"{'='*70}")
    print(f"Region: {region}")
    print(f"")
    print(f"Ideas:")
    print(f"   Before: {len(ideas_df):,} records")
    print(f"   After:  {len(ideas_filtered):,} records ({len(ideas_filtered)/len(ideas_df)*100:.1f}% retained)" if len(ideas_df) > 0 else "   After:  0 records")
    print(f"")
    print(f"Opportunities:")
    print(f"   Before: {len(opps_df):,} records")
    print(f"   After:  {len(opps_filtered):,} records ({len(opps_filtered)/len(opps_df)*100:.1f}% retained)" if len(opps_df) > 0 else "   After:  0 records")
    print(f"")
    print(f"Total:")
    print(f"   Before: {len(ideas_df) + len(opps_df):,} records")
    print(f"   After:  {len(ideas_filtered) + len(opps_filtered):,} records")
    print(f"{'='*70}\n")
    
    # Provide next steps
    print(f"✅ FILTERING COMPLETE")
    print(f"\n📋 Next steps:")
    print(f"   1. Review filtered datasets in research/raw-data/")
    print(f"   2. Run thematic analysis on filtered data")
    print(f"   3. Report will be generated in research/thematic-analysis/")
    print(f"\n")
    
    return ideas_filtered, opps_filtered


def main():
    """Main entry point for the script."""
    
    if len(sys.argv) != 4:
        print("\n❌ ERROR: Invalid arguments")
        print("\nUsage:")
        print("    python filter_region.py <region> <ideas_csv> <opps_csv>")
        print("\nExample:")
        print('    python filter_region.py Japan "research/raw-data/Idea Question Responses.csv" "research/raw-data/Opportunity Detail.xlsx - Sheet 1.csv"')
        print("\nCommon regions:")
        print("    • Japan")
        print("    • Germany")
        print("    • APAC")
        print("    • EMEA")
        print("    • North America")
        print("")
        sys.exit(1)
    
    region = sys.argv[1]
    ideas_path = sys.argv[2]
    opps_path = sys.argv[3]
    
    filter_by_region(region, ideas_path, opps_path)


if __name__ == "__main__":
    main()
