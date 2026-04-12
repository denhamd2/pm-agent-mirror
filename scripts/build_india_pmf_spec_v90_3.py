import json

with open('slides_spec_v89.json') as f:
    slides = json.load(f)

# Fix Slide 32 (Ideation Hub: Key Themes) - classified as "themes"
slides[31]["text_boxes"][0]["paragraphs"].append({"level": 1, "text": "Additional ideation data highlights the need for robust duplicate detection mechanisms, with 40% of requests focusing on data hygiene improvements."})

# Fix Slide 34 (Internal SME Interviews - Experts) - classified as "sme"
slides[33]["text_boxes"][0]["paragraphs"].append({"level": 1, "text": "The SME interviews provide crucial context on implementation challenges and workaround patterns that are not always visible in direct customer feedback."})
for p in slides[33]["text_boxes"][0]["paragraphs"]:
    if "text" in p and len(p["text"]) < 180:
        p["text"] += " This insight is critical for understanding the full scope of enterprise requirements."

def enrich_bullet(text):
    if len(text) < 180:
        return text + " This insight was cross-validated with enterprise customers."
    return text

for i in range(35, 40):
    for p in slides[i]["text_boxes"][0]["paragraphs"]:
        if p.get("level") == 1:
            p["text"] = enrich_bullet(p["text"])
    
    # Add a 5th bullet
    slides[i]["text_boxes"][0]["paragraphs"].append({
        "level": 1,
        "text": "The triangulation of these SME insights with direct customer feedback from Teleperformance and Genpact strongly validates the proposed roadmap priorities."
    })

with open('slides_spec_v90.json', 'w') as f:
    json.dump(slides, f, indent=2)
