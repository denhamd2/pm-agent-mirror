import json

with open('slides_spec_v89.json') as f:
    slides = json.load(f)

# SME Slides (35-39)
slides[35]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Identity Trust", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Identity trust is the foundation for India volume; without it, downstream processes fail.\" - Insight on KYC and resume fraud at 100K+ resumes/month scale at Accenture."},
    {"level": 1, "text": "Identity verification must be treated as a first-class pillar with significant throughput investments, moving beyond basic services workarounds to handle enterprise scale at Accenture."},
    {"level": 0, "text": [{"text": "Theme 2: Ecosystem Integration", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "India strategy must address localisation, regional regulations, and partner ecosystems, including interview-intelligence tools to complement native capabilities for enterprise customers."},
    {"level": 1, "text": "Internal brainstorm collateral and enablement contacts highlight the ongoing need for continuous India strategy alignment, product feedback loops, and robust identity frameworks."}
]

slides[36]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Offer Complexity", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"India offers require complex tabular compensation disclosure; the current process forces dual documents and manual change tracking.\" - Insight on Lowe's volume hiring."},
    {"level": 1, "text": "Automated hire completion can inadvertently skip recruiter start-date confirmation, requiring custom fixes when automation conflicts with actual onboarding dates for Lowe's."},
    {"level": 0, "text": [{"text": "Theme 2: Background Check Integration", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "India background checks often permit hiring before all packages complete, unlike US gating; parallel drug and background processes multiply integration timing issues."},
    {"level": 1, "text": "Customers demand one-click background check reinitiation, with vendor signals consumed cleanly inside standard Job Application workflow steps to maintain process velocity."}
]

slides[37]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Communication Channels", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"Opt-in defaults starve our campaign reach; we need region-configurable opt-out to hit our volume targets.\" - Insight on high-volume communication barriers globally."},
    {"level": 1, "text": "WhatsApp dominates candidate communication preferences; broader messaging roadmap dependencies are explicitly acknowledged as critical for India market success and engagement."},
    {"level": 0, "text": [{"text": "Theme 2: Pre-Interview Gating", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Background check documents vary by stage, but current review-document steps misfit pre-interview attach-only needs, causing implementation friction and candidate drop-off."},
    {"level": 1, "text": "Fraud at the 700K population scale drives the need for ID-before-interview validation; chatbots for status updates await compliant conversational channels to reduce workload."}
]

slides[38]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Mass Action Friction", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"We process 100-200 concurrent openings; individual clicks don't scale for mass offers and approvals.\" - Insight on Genpact's talent supply chain bottlenecks and friction."},
    {"level": 1, "text": "Genpact utilised custom extensions to bridge professional services demand fields into recruiting when standard requisition objects lacked end-to-end visibility across lifecycle."},
    {"level": 0, "text": [{"text": "Theme 2: Verification Integrity", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Impersonation risks elevate verification expectations; middleware and custom integrations appear where native background checks feel basic versus contractual client obligations at Genpact."},
    {"level": 1, "text": "Weak audit trails on career site profile changes undermine background check integrity; post-offer no-shows drive demand for purchased messaging solutions to maintain engagement."}
]

slides[39]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Theme 1: Duplicate Resolution", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "\"At 200K applications, manual duplicate resolution is impossible; we need mass purge and intelligent merge beyond two records.\" - Insight on Accenture-scale data hygiene."},
    {"level": 1, "text": "Enterprise asks include do-not-hire lists, mass purge capabilities, fraud detection, and interview-stage ID validation to manage massive applicant volumes efficiently at Accenture."},
    {"level": 0, "text": [{"text": "Theme 2: Trust and Compliance", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Competitive trickery narratives push for AI-assisted fraud detection with human judgement retained; validated professional network concepts signal long-term trust bets for enterprise customers."},
    {"level": 1, "text": "Do-not-hire functionality extends beyond ex-employees, with analogues required for government and federal contexts in global enterprise deployments to ensure strict compliance."}
]

# Theme Slides (49-53)
# We need to expand each to 5 bullets: Insight, Quote, Data/Customer, Impact, Implication
slides[49]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Know Your Candidate", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "PAN, Aadhaar, and UAN anchor trust; policy needs all IDs pre-offer but UX allows skips; OTP fails and duplicate detection ignores government IDs."},
    {"level": 1, "text": "\"Policy requires three government IDs before offer, but the UX allows skips; we spend hours chasing candidates for missing documents.\" - (P3, Teleperformance)"},
    {"level": 1, "text": "Teleperformance and Accenture report severe bottlenecks, with hundreds of applications per requisition requiring manual review due to 60-70% parser accuracy."},
    {"level": 1, "text": "Business impact: Chase cycles, escalations, and financial exposure when duplicates do not block or honour first-source rules at thousands of profiles per day."},
    {"level": 1, "text": "Product implications: Lawful gating, duplicate detection on permitted IDs, partner eKYC or offline XML, fraudulent application detection alignment, DPDP-minimised notices."}
]

slides[50]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "High Volume", "bold": True, "font_size_pt": 12}]},
    {"level": 1, "text": "Peaks near 1.5K-2K hires per week and 2K-3K+ agency profiles per day; duplicate review fills days; vendor upload approval bottlenecks severely limit throughput."},
    {"level": 1, "text": "\"Every application needs manual duplicate checks; skipped checks risk agency fee fairness when duplicates are found late.\" - (P4, Teleperformance)"},
    {"level": 1, "text": "Accenture and Genpact process 100-200 concurrent openings and 200K applications, making individual clicks and manual duplicate resolution impossible to scale."},
    {"level": 1, "text": "Business impact: FTEs wasted on manual checks, credential delays at go-live, and lost business days when bulk tools lag behind seasonal hiring ramps."},
    {"level": 1, "text": "Product implications: Duplicate queues, merge beyond two records, mass disposition, HiredScore activation for volume, and a stronger bulk grid for India templates."}
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

with open('slides_spec_v90.json', 'w') as f:
    json.dump(slides, f, indent=2)
