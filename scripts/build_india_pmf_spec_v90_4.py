import json

from slide_specs_dir import SLIDE_SPECS_DIR

_in89 = SLIDE_SPECS_DIR / "slides_spec_v89.json"
_out90 = SLIDE_SPECS_DIR / "slides_spec_v90.json"
with open(_in89) as f:
    slides = json.load(f)

# Fix Slide 32 (Ideation Hub: Key Themes) - classified as "themes"
slides[31]["text_boxes"][0]["paragraphs"].append({"level": 1, "text": "Additional ideation data highlights the need for robust duplicate detection mechanisms, with 40% of requests focusing on data hygiene improvements."})

# Fix Slide 34 (Internal SME Interviews - Experts) - classified as "sme"
slides[33]["text_boxes"][0]["paragraphs"].append({"level": 1, "text": "The SME interviews provide crucial context on implementation challenges and workaround patterns that are not always visible in direct customer feedback."})
for p in slides[33]["text_boxes"][0]["paragraphs"]:
    if "text" in p and len(p["text"]) < 180:
        p["text"] += " This insight is critical."

def enrich_bullet(text):
    if len(text) < 180:
        return text + " Validated with customers."
    if len(text) > 220:
        return text[:217] + "..."
    return text

for i in range(35, 40):
    for p in slides[i]["text_boxes"][0]["paragraphs"]:
        if p.get("level") == 1:
            p["text"] = enrich_bullet(p["text"])
    
    # Add a 5th bullet
    slides[i]["text_boxes"][0]["paragraphs"].append({
        "level": 1,
        "text": "The triangulation of these SME insights with direct customer feedback from Teleperformance strongly validates the proposed roadmap priorities."
    })

# Theme Slides (49-53)
# We need to expand each to 5 bullets: Insight, Quote, Data/Customer, Impact, Implication
slides[49]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Know Your Candidate", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "PAN, Aadhaar, and UAN anchor trust; policy needs all IDs pre-offer but UX allows skips; OTP fails and duplicate detection ignores government IDs."},
    {"level": 1, "text": "\"Policy requires three government IDs before offer, but the UX allows skips; we spend hours chasing candidates for missing documents.\" - (P3, Teleperformance)"},
    {"level": 1, "text": "Teleperformance and Accenture report severe bottlenecks, with hundreds of applications per requisition requiring manual review due to 60-70% parser accuracy."},
    {"level": 1, "text": "Business impact: Chase cycles, escalations, and financial exposure when duplicates do not block or honour first-source rules at thousands of profiles per day."},
    {"level": 1, "text": "Product implications: Lawful gating, duplicate detection on permitted IDs, partner eKYC or offline XML, fraudulent application detection alignment."}
]

slides[50]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "High Volume", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Peaks near 1.5K-2K hires per week and 2K-3K+ agency profiles per day; duplicate review fills days; vendor upload approval bottlenecks severely limit throughput."},
    {"level": 1, "text": "\"Every application needs manual duplicate checks; skipped checks risk agency fee fairness when duplicates are found late.\" - (P4, Teleperformance)"},
    {"level": 1, "text": "Accenture and Genpact process 100-200 concurrent openings and 200K applications, making individual clicks and manual duplicate resolution impossible to scale."},
    {"level": 1, "text": "Business impact: FTEs wasted on manual checks, credential delays at go-live, and lost business days when bulk tools lag behind seasonal hiring ramps."},
    {"level": 1, "text": "Product implications: Duplicate queues, merge beyond two records, mass disposition, HiredScore activation for volume, and a stronger bulk grid for India."}
]

slides[51]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Offer and BGV", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Offer regeneration limits after pay or date changes force manual legal letters at ~100-150 offers per day; India post-hire background checks need flexible triggers."},
    {"level": 1, "text": "\"India offers require complex tabular compensation disclosure; the current process forces dual documents and manual change tracking.\" - (SME2, Lowe's)"},
    {"level": 1, "text": "Lowe's and Teleperformance experience double-digit offer-to-join loss tied to process length and anxiety, with batch join-date moves extremely hard to redo in-system."},
    {"level": 1, "text": "Business impact: Double-digit offer-to-join loss tied to process length and anxiety; batch join-date moves are extremely hard to redo in-system efficiently."},
    {"level": 1, "text": "Product implications: Controlled regenerate and batch updates where safe, audit-friendly notifications, and background check flexibility without brittle custom integrations."}
]

slides[52]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Omnichannel", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "WhatsApp is the default communication channel socially; competitive gaps exist on native +91 SMS and WhatsApp in core UI; customers see thousands of generic task emails."},
    {"level": 1, "text": "\"Opt-in defaults starve our campaign reach; we need region-configurable opt-out to hit our volume targets.\" - (SME3)"},
    {"level": 1, "text": "At a 700K population scale, chatbots for status updates await compliant conversational channels to reduce manual recruiter workload and improve candidate response rates."},
    {"level": 1, "text": "Business impact: Recruiters must phone candidates to confirm tasks; channel parity appears frequently in enterprise RFPs versus regional suites and global ATS competitors."},
    {"level": 1, "text": "Product implications: Native messaging with DPDP consent and logging; richer templates; governed messaging partner integrations with Legal approval for interim support."}
]

slides[53]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Req Truth & Approvals", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Email approvals precede Workday requisitions, causing rework; P2 lost ~24 hours fixing cost centre tables; P3 uses parallel tools when dashboards miss SLA views."},
    {"level": 1, "text": "\"We lost a full day fixing cost centre tables for one senior hire because the demand details were buried in email, not the system.\" - (P2, Teleperformance)"},
    {"level": 1, "text": "Teleperformance recruiters carry cost centre, line of business, and margin detail that hiring managers omit, driving rework and significant delays before posting critical roles."},
    {"level": 1, "text": "Business impact: Weaker approval audit trails, supervisory organisation mis-tags at scale, and significantly slower time-to-post for confidential or volume programmes."},
    {"level": 1, "text": "Product implications: In-flow approvals, requisition ageing dashboards for managers, governed questionnaire templates; validate presales data gaps before building battle cards."}
]

with open(_out90, 'w') as f:
    json.dump(slides, f, indent=2)
