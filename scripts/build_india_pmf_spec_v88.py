import json
import re

with open('slides_spec_v87.json') as f:
    slides = json.load(f)

# We will build a new list of slides
new_slides = []

for s in slides:
    title = ""
    p = s.get("placeholders", {})
    if "0" in p:
        t = p["0"]
        title = t.get("text", "") if isinstance(t, dict) else str(t)
        
    # C7: Remove "Validated" from theme slide titles
    if title.startswith("Validated Theme"):
        if isinstance(t, dict):
            t["text"] = title.replace("Validated Theme", "Theme")
        else:
            p["0"] = title.replace("Validated Theme", "Theme")
            
    # C3: Font size corrections (11pt -> 12pt or 14pt)
    # We'll just change all 11pt to 12pt for safety, or 14pt if it's Title Only
    for tb in s.get("text_boxes", []):
        if tb.get("font_size_pt") == 11:
            tb["font_size_pt"] = 12
        for para in tb.get("paragraphs", []):
            if para.get("font_size_pt") == 11:
                para["font_size_pt"] = 12
            txt = para.get("text", "")
            if isinstance(txt, list):
                for r in txt:
                    if r.get("font_size_pt") == 11:
                        r["font_size_pt"] = 12
                        
    # C8: Scrub internal language
    # We will do a simple string replace for the most common ones
    replacements = {
        "matrix true gaps": "competitive gaps",
        "Matrix true gap": "Competitive gap",
        "UDMF": "duplicate detection",
        "JTBD anchors": "core user needs",
        "JTBD": "core needs",
        "PLI press": "manufacturing incentives",
        "BRSR nudges": "sustainability reporting",
        "business process": "workflow",
        "triangulation": "cross-validation",
        "108": "presales data",
        "106": "ideation data",
        "P&T Idea Results Dashboard": "customer ideation data",
        "TP India": "Teleperformance",
        "TP": "Teleperformance"
    }
    
    def replace_text(text):
        if not isinstance(text, str): return text
        for k, v in replacements.items():
            text = text.replace(k, v)
        return text
        
    if isinstance(p.get("0"), dict):
        p["0"]["text"] = replace_text(p["0"].get("text", ""))
    elif isinstance(p.get("0"), str):
        p["0"] = replace_text(p["0"])
        
    for tb in s.get("text_boxes", []):
        if "text" in tb and isinstance(tb["text"], str):
            tb["text"] = replace_text(tb["text"])
        for para in tb.get("paragraphs", []):
            if "text" in para:
                if isinstance(para["text"], str):
                    para["text"] = replace_text(para["text"])
                elif isinstance(para["text"], list):
                    for r in para["text"]:
                        if "text" in r:
                            r["text"] = replace_text(r["text"])
                            
    if "speaker_notes" in s and isinstance(s["speaker_notes"], str):
        s["speaker_notes"] = replace_text(s["speaker_notes"])

    new_slides.append(s)

with open('slides_spec_v88_temp.json', 'w') as f:
    json.dump(new_slides, f, indent=2)
