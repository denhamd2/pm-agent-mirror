import json

with open('slides_spec_v90.json') as f:
    slides = json.load(f)

# Fix Slide 34 (Internal SME Interviews - Experts) - classified as "sme"
for p in slides[33]["text_boxes"][0]["paragraphs"]:
    if "text" in p and len(p["text"]) > 220:
        p["text"] = p["text"][:217] + "..."

with open('slides_spec_v90.json', 'w') as f:
    json.dump(slides, f, indent=2)
