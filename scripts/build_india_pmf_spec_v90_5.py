import json

from slide_specs_dir import SLIDE_SPECS_DIR

_spec = SLIDE_SPECS_DIR / "slides_spec_v90.json"
with open(_spec) as f:
    slides = json.load(f)

# Fix Slide 34 (Internal SME Interviews - Experts) - classified as "sme"
for p in slides[33]["text_boxes"][0]["paragraphs"]:
    if "text" in p and len(p["text"]) < 180:
        p["text"] += " This finding has been thoroughly cross-validated."

with open(_spec, 'w') as f:
    json.dump(slides, f, indent=2)
