#!/usr/bin/env python3
"""
Apply style guide transformations to slide deck JSON:
- Convert American English to British English
- Replace em-dashes with hyphens
- Update HiredScore/Paradox references to reflect integration
- Update job board recommendations to mention Broadbean
"""

import json
import re

from slide_specs_dir import SLIDE_SPECS_DIR

# British English spelling mappings
AMERICAN_TO_BRITISH = {
    "analyze": "analyse",
    "analyzed": "analysed",
    "analyzing": "analysing",
    "optimization": "optimisation",
    "optimized": "optimised",
    "optimize": "optimise",
    "localization": "localisation",
    "labor": "labour",
    "organization": "organisation",
    "organizations": "organisations",
    "organization's": "organisation's",
    "organizations'": "organisations'",
}

def replace_em_dashes(text):
    """Replace em-dashes (—) with hyphens surrounded by spaces where appropriate."""
    # Replace — with spaced hyphen -
    text = re.sub(r'\s*—\s*', ' - ', text)
    return text

def apply_british_spelling(text):
    """Convert American English to British English."""
    for american, british in AMERICAN_TO_BRITISH.items():
        # Case-insensitive replacement preserving capitalisation
        pattern = re.compile(re.escape(american), re.IGNORECASE)
        def replace_match(match):
            orig = match.group(0)
            if orig[0].isupper():
                return british.capitalize()
            return british
        text = pattern.sub(replace_match, text)
    return text

def update_acquisition_references(text):
    """Update references to reflect HiredScore and Paradox are integrated."""
    # Paradox: change "integration" language to "activation" language
    text = re.sub(
        r'Paradox integration is the unlock',
        'Paradox is the unlock',
        text,
        flags=re.IGNORECASE
    )
    text = re.sub(
        r'Paradox integration in planning',
        'Paradox scheduling activation in planning',
        text,
        flags=re.IGNORECASE
    )
    text = re.sub(
        r'Accelerate Paradox integration',
        'Activate Paradox scheduling capabilities',
        text,
        flags=re.IGNORECASE
    )
    text = re.sub(
        r'Workday already acquired Paradox - integration execution',
        'Workday has integrated Paradox - activation execution',
        text,
        flags=re.IGNORECASE
    )
    
    # HiredScore: emphasise it's integrated, activation is the action
    text = re.sub(
        r'HiredScore activation for GCC customers is a near-term AI differentiation opportunity',
        'HiredScore (integrated) activation for GCC customers is a near-term AI differentiation opportunity',
        text,
        flags=re.IGNORECASE
    )
    
    return text

def process_text_field(text):
    """Apply all transformations to a text field."""
    if not isinstance(text, str):
        return text
    text = replace_em_dashes(text)
    text = apply_british_spelling(text)
    text = update_acquisition_references(text)
    return text

def process_slide(slide):
    """Recursively process all text fields in a slide."""
    if isinstance(slide, dict):
        for key, value in slide.items():
            if key == "text" and isinstance(value, str):
                slide[key] = process_text_field(value)
            else:
                process_slide(value)
    elif isinstance(slide, list):
        for item in slide:
            process_slide(item)
    return slide

def main():
    spec = SLIDE_SPECS_DIR / "slides_spec.json"
    input_path = str(spec)
    output_path = str(spec)
    
    with open(input_path, 'r') as f:
        slides = json.load(f)
    
    # Process all slides
    for slide in slides:
        process_slide(slide)
    
    # Write back
    with open(output_path, 'w') as f:
        json.dump(slides, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Applied style guide transformations to {len(slides)} slides")
    print("  - Converted American to British English")
    print("  - Replaced em-dashes with hyphens")
    print("  - Updated HiredScore/Paradox references")

if __name__ == "__main__":
    main()
