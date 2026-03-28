#!/usr/bin/env python3
"""
Parse customer names from interview transcript filenames.
Format: Interview_P[N]_[FirstName]_[LastName]_[Company].txt
Output: JSON lookup {P1: "FirstName LastName, Company", ...}
"""

import json
import re
from pathlib import Path
from typing import Dict


def parse_participant_names(transcript_dir: Path) -> Dict[str, str]:
    """Parse participant names from transcript filenames."""
    participants = {}
    pattern = re.compile(r'Interview_P(\d+)_([^_]+)_([^_]+)_([^.]+)\.txt')
    
    for filepath in transcript_dir.glob('Interview_P*.txt'):
        match = pattern.match(filepath.name)
        if match:
            p_num, first, last, company = match.groups()
            participants[f'P{p_num}'] = f'{first} {last}, {company}'
    
    return participants


if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: python3 parse_participant_names.py <transcript_dir>')
        sys.exit(1)
    
    transcript_dir = Path(sys.argv[1])
    names = parse_participant_names(transcript_dir)
    print(json.dumps(names, indent=2))
