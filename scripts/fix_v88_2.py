import json

from slide_specs_dir import SLIDE_SPECS_DIR

_spec88 = SLIDE_SPECS_DIR / "slides_spec_v88.json"
with open(_spec88) as f:
    slides = json.load(f)

# Slide 61 (Recommendation 3)
slides[60]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "700+ applications per requisition exhaust manual screening; parser limits force manual review, significantly delaying time-to-hire for volume roles and frustrating recruiters."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3 (Teleperformance) cites 60-70% parser accuracy driving manual review; SME1 notes 100K+ resume scale at Accenture requires intelligent screening to maintain process velocity."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Enable repeatable HiredScore activation with reviewer queues, ensuring governance for EU AI Act and India AI expectations before broad rollout to enterprise customers."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Q2 Priority 2 demands AI matching ROI on high-volume India IT and BPO templates to maintain competitive differentiation against AI-native regional ATS competitors."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Time to Shortlist: 30% reduction on pilot requisitions versus control groups, accelerating the top of the hiring funnel and improving overall candidate conversion."}
]

# Slide 63 (Recommendation 5)
slides[62]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Compensation or start-date shifts after acceptance force manual legal letters at batch scale, compounding offer-to-join risk and administrative burden for high-volume teams."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3-P5 (Teleperformance) cite regenerate friction; SME2 notes Lowe's volume requires complex tabular compensation disclosure and dual documents that break standard workflows."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Expand controlled offer and employment agreement regeneration, cautious batch updates, and candidate notifications that preserve audit trails for strict Legal review."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Core ATS parity requirement to support India's high-volume operating reality and reduce candidate drop-off during the critical offer phase where competitors excel."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Offer Renegotiation Time: Reduce manual processing delays by 40% on governed pilots, improving the candidate onboarding experience and reducing overall time-to-hire."}
]

with open(_spec88, 'w') as f:
    json.dump(slides, f, indent=2)
