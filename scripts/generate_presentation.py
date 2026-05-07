#!/usr/bin/env python3
"""
Generate presentation from slides_spec.json using the Workday slide engine.
Normalizes the slides_spec format (placeholders array, content array) to the
engine's expected format (placeholders object, text_boxes with font_size_pt).
"""

import json
import os
import re
import sys
from pathlib import Path

from slide_specs_dir import SLIDE_SPECS_DIR

REPO_ROOT = Path(__file__).resolve().parents[1]

# Add wday-slidemcp to path (override with WDAY_SLIDEMCP_ROOT)
WDAY_ROOT = os.environ.get("WDAY_SLIDEMCP_ROOT", str(Path.home() / "mcp-servers" / "wday-slidemcp"))
sys.path.insert(0, WDAY_ROOT)

from engine.slide_engine import create_presentation as _create_presentation


def parse_text_to_paragraphs(text: str, base_font_size: int = 11) -> list[dict]:
    """
    Parse plain text into structured paragraphs with bullets, sub-headers, and bold.
    - Lines starting with • or - become bullet level 1
    - Lines starting with   • or   - become bullet level 2
    - Short lines after blank (or first line) become bold sub-headers (level 0)
    - Numbered lines (1. 2. etc.) become level 1
    """
    lines = text.split("\n")
    paragraphs = []
    prev_blank = True

    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            prev_blank = True
            continue

        if stripped.startswith("• ") or stripped.startswith("- "):
            content = stripped[2:].strip()  # Remove bullet char — use native PowerPoint bullets
            level = 2 if line.startswith("  ") else 1
            paragraphs.append({"text": content, "level": level, "font_size_pt": base_font_size})
            prev_blank = False
        elif re.match(r"^\d+\.\s", stripped):
            content = re.sub(r"^\d+\.\s", "", stripped)
            paragraphs.append({"text": content, "level": 1, "font_size_pt": base_font_size})
            prev_blank = False
        else:
            # Product implication: 1-sentence paragraph below the list, bold, same size as bullets, highlighted yellow (PESTEL slides)
            is_product_implication = stripped.lower().startswith("product implication:")
            if is_product_implication:
                paragraphs.append({
                    "text": {"text": stripped, "bold": True, "highlight": "FFFF00", "font_size_pt": base_font_size},
                    "level": 0,
                    "font_size_pt": base_font_size,
                })
                prev_blank = False
                continue
            is_header = prev_blank and len(stripped) < 75 and (
                stripped.endswith(":") or
                "|" not in stripped or
                (stripped[0].isupper() and not stripped.endswith("."))
            )
            if is_header:
                paragraphs.append({
                    "text": {"text": stripped, "bold": True, "font_size_pt": 12},
                    "level": 0,
                })
            else:
                # Non-header body lines: treat as bullet for consistency
                paragraphs.append({
                    "text": stripped,
                    "level": 1,
                    "font_size_pt": base_font_size,
                })
            prev_blank = False

    return paragraphs


def normalize_slide(slide: dict) -> dict:
    """Convert slides_spec format to engine format."""
    out = {
        "master_index": slide.get("master_index", 1),
        "layout_name": slide.get("layout_name", "Title Only"),
    }

    # Placeholders: array [{"index": 0, "text": "..."}] -> object {"0": {"text": "..."}}
    # Strip "| Workday Confidential N" from titles — keep only the actual slide title
    def clean_title(t: str) -> str:
        if isinstance(t, str):
            return re.sub(r"\s*\|\s*Workday Confidential\s+\d+\s*$", "", t).strip()
        return t

    ph_list = slide.get("placeholders", [])
    if isinstance(ph_list, list):
        ph_obj = {}
        for item in ph_list:
            idx = item.get("index")
            text = item.get("text", "")
            if idx is not None:
                cleaned = clean_title(text) if isinstance(text, str) else text
                ph_obj[str(idx)] = {"text": cleaned} if isinstance(cleaned, str) else cleaned
        out["placeholders"] = ph_obj
    elif isinstance(ph_list, dict):
        out["placeholders"] = ph_list
    else:
        out["placeholders"] = {}

    # Content: array of {type, text, left_inches, ...} -> text_boxes with paragraphs
    content_list = slide.get("content", [])
    if content_list:
        text_boxes = []
        for c in content_list:
            if c.get("type") != "text":
                continue
            base_font = c.get("font_size", c.get("font_size_pt", 11))
            left = c.get("left_inches", 0.7)
            top = c.get("top_inches", 1.2)
            width = c.get("width_inches", 8.6)
            height = c.get("height_inches", 2.8)

            if "paragraphs" in c:
                paras = c["paragraphs"]
            else:
                text = c.get("text", "")
                paras = parse_text_to_paragraphs(text, base_font)

            tb = {
                "left_inches": left,
                "top_inches": top,
                "width_inches": width,
                "height_inches": height,
                "font_name": c.get("font_name", "Archivo"),
                "color": c.get("color", "ink"),
                "paragraphs": paras,
            }
            text_boxes.append(tb)
        out["text_boxes"] = text_boxes
    elif slide.get("text_boxes"):
        out["text_boxes"] = slide["text_boxes"]
    else:
        out["text_boxes"] = []

    for key in ("icons", "tables", "charts", "images"):
        if key in slide:
            out[key] = slide[key]

    # Speaker notes
    if "speaker_notes" in slide:
        out["speaker_notes"] = slide["speaker_notes"]
    elif "notes" in slide:
        out["notes"] = slide["notes"]

    return out


def get_next_version(downloads_dir: str, base_name: str) -> int:
    """Find highest existing version for base_name and return next version number."""
    pattern = re.compile(rf"^{re.escape(base_name)}_v(\d+)\.pptx$")
    max_v = 0
    for f in os.listdir(downloads_dir):
        m = pattern.match(f)
        if m:
            max_v = max(max_v, int(m.group(1)))
    return max_v + 1


def main():
    import argparse
    default_spec = str(SLIDE_SPECS_DIR / "slides_spec.json")
    parser = argparse.ArgumentParser(description="Generate presentation from slides_spec.json")
    parser.add_argument(
        "--spec",
        default=default_spec,
        help="Path to the slides spec JSON file (default: docs/decks/specs/slides_spec.json)",
    )
    args = parser.parse_args()

    template_path = os.path.join(WDAY_ROOT, "Workday Corporate Google Slides Template.pptx")
    slides_json_path = args.spec
    downloads_dir = os.environ.get("PM_DECK_OUTPUT_DIR", str(Path.home() / "Downloads"))
    base_name = "GCC_Recruiting_PMF_Roadmap"
    version = get_next_version(downloads_dir, base_name)
    output_path = os.path.join(downloads_dir, f"{base_name}_v{version}.pptx")

    if not os.path.exists(template_path):
        print(f"ERROR: Template not found: {template_path}")
        sys.exit(1)
    if not os.path.exists(slides_json_path):
        print(f"ERROR: Slides spec not found: {slides_json_path}")
        sys.exit(1)

    with open(slides_json_path) as f:
        raw_slides = json.load(f)

    slides = [normalize_slide(s) for s in raw_slides]

    try:
        saved = _create_presentation(
            template_path=template_path,
            slides=slides,
            output_path=output_path,
        )
        print(f"SUCCESS: Presentation saved to {saved}")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
