import json

with open('slides_spec_v88_temp.json') as f:
    slides = json.load(f)

new_slides = []

# Slide 1: Title
new_slides.append(slides[0])

# Slide 2: Section Title - Executive summary
new_slides.append(slides[1])

# Slide 3: Executive Summary (Consolidated)
exec_summary_slide = slides[2].copy()
exec_summary_slide["title"] = "Executive Summary"
exec_summary_slide["text_boxes"] = [{
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_size_pt": 14,
    "paragraphs": [
        {
            "level": 0,
            "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]
        },
        {
            "level": 1,
            "text": "India recruiting market entry demands robust identity verification and high-volume automation; Teleperformance and internal experts warn that trust and throughput fail without lawful ID matching and bulk processing capabilities."
        },
        {
            "level": 1,
            "text": "Data privacy regulations (DPDP) and international compliance (GDPR, EU AI Act) require configurable consent, retention, and screening notices for multinational organisations managing candidate talent pools in India."
        },
        {
            "level": 1,
            "text": "Market gaps exist in native +91 SMS, core UI WhatsApp integration, local job board multiposting, and government eKYC; native strengths include duplicate detection, bulk grids, Hindi support, and background check workflows."
        },
        {
            "level": 1,
            "text": "Priority investments: government-ID-aware identity verification, scalable duplicate and agency management, governed AI screening for volume, and native messaging channels to close competitive gaps and improve candidate response times."
        }
    ]
}]
exec_summary_slide["speaker_notes"] = "• Consolidated executive summary focusing on identity, automation, compliance, and priority investments.\n• Emphasise that identity verification and high-volume automation are the core pillars for India market entry.\n• Highlight DPDP compliance as a critical requirement for multinational customers.\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-006.md"
new_slides.append(exec_summary_slide)

# Skip Slide 4 (Executive Summary cont.)
current_idx = 4

# Add Research Challenge section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Research Question
new_slides.append(slides[current_idx+2]) # Research Scope
current_idx += 3

# Section 3: Context Review
new_slides.append(slides[current_idx]) # Section Title
current_idx += 1

# C1: Context Review - Replace 2 slides with transcribed images
sgo_slide = {
    "layout_name": "Title Only",
    "master_index": 1,
    "placeholders": {"0": {"text": "Strategic Context - FY26 Growth Objectives"}},
    "text_boxes": [{
        "left_inches": 0.7,
        "top_inches": 1.2,
        "width_inches": 8.6,
        "font_size_pt": 14,
        "paragraphs": [
            {
                "level": 0,
                "text": [{"text": "Achieve target growth and financial outcomes by investing to:", "bold": True, "font_size_pt": 14}]
            },
            {
                "level": 1,
                "text": "Lead our industry in AI-powered innovation and build ecosystem strength to fuel the growth of the Workday Economy."
            },
            {
                "level": 1,
                "text": "Strengthen Workday's best-of-suite value to maintain large enterprise market leadership."
            },
            {
                "level": 1,
                "text": "Decrease cost to deploy and scale and accelerate growth to unlock medium enterprise and growth markets."
            },
            {
                "level": 1,
                "text": [{"text": "Increase right-to-win outside the US through bullseye focus and GTM partnerships.", "bold": True, "highlight": "FFFF00"}]
            },
            {
                "level": 1,
                "text": "Deliver US Federal readiness and increase right-to-win, while enhancing customer health and value realization at every stage."
            }
        ]
    }],
    "speaker_notes": "• FY26 Strategic Growth Objectives (SGOs) highlight international expansion.\n• The highlighted objective 'Increase right-to-win outside the US' directly supports the India market entry strategy.\n• This aligns with building ecosystem strength and leading in AI-powered innovation."
}
new_slides.append(sgo_slide)

momentum_slide = {
    "layout_name": "Title Only_Alt",
    "master_index": 1,
    "placeholders": {"0": {"text": "India Market Momentum - Key Indicators"}},
    "text_boxes": [{
        "left_inches": 0.7,
        "top_inches": 1.2,
        "width_inches": 8.6,
        "font_size_pt": 14,
        "paragraphs": [
            {
                "level": 0,
                "text": [{"text": "Workday's Market Momentum in India", "bold": True, "font_size_pt": 14}]
            },
            {
                "level": 1,
                "text": "Workday Addressable Market (WAM): ~$800M, representing significant growth potential for the region."
            },
            {
                "level": 1,
                "text": "5-Year ARR: $70M+ in consistent Annual Recurring Revenue, demonstrating established enterprise traction."
            },
            {
                "level": 1,
                "text": "User Engagement: 2M+ Workday users logging in from India, pre-market entry, showing massive organic adoption."
            },
            {
                "level": 1,
                "text": "APJ Region Share: India represents 20% of the APJ region software market, making it a critical growth anchor."
            }
        ]
    }],
    "speaker_notes": "• India presents a massive $800M addressable market with $70M+ in existing 5-year ARR.\n• We already have 2M+ users logging in from India before formal market entry.\n• India is 20% of the APJ software market, making it a strategic priority for regional growth."
}
new_slides.append(momentum_slide)
current_idx += 2 # Skip the old context slides

# Add Product Strategy section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Q2 2026 Product Priorities
new_slides.append(slides[current_idx+2]) # Regional Expansion Strategy
new_slides.append(slides[current_idx+3]) # Competitive Positioning
current_idx += 4

# PESTEL Section
new_slides.append(slides[current_idx]) # Section Title
current_idx += 1

# C4: Enrich PESTEL bullets to 180-240 chars
pestel_political = slides[current_idx].copy()
pestel_political["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "India's consolidated labour codes, including the Industrial Relations Code, are driving significant compliance shifts with phased implementation expected through 2026, requiring robust contract tracking and audit capabilities."},
    {"level": 1, "text": "The Code on Social Security 2020 expands coverage to gig and platform workers, forcing enterprise hiring systems to support non-traditional employment models alongside permanent roles with equal compliance rigour."},
    {"level": 1, "text": "Production Linked Incentive (PLI) schemes driving Rs 2.16 lakh crore investment and 14.39 lakh jobs sustain high-volume manufacturing hiring, while sovereign cloud discussions elevate in-country data hosting expectations."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Treat India as policy-active: flexible hiring metadata into HCM transitions, throughput for manufacturing and GCC-style ramps, and India hosting options where sovereignty influences enterprise contracts.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_political)

pestel_economic = slides[current_idx+1].copy()
pestel_economic["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "The India HR technology market is projected to grow from USD 1.21 billion in 2025 to USD 2.44 billion by 2034 at a 7.71% CAGR, driven by enterprise adoption of cloud, AI, and mobile-first recruiting platforms."},
    {"level": 1, "text": "IT services and Global Capability Centre (GCC) expansion narratives highlight sustained enterprise throughput, with companies hiring thousands of freshers annually, requiring scalable, campaign-style hiring tools."},
    {"level": 1, "text": "Workday's AWS India data centre expansion signals long-term commitment to the region, providing a critical advantage in deals where local data residency and low-latency performance are mandatory requirements."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Scale justifies India-first throughput investments: queue-safe bulk actions, identity-aware duplicate detection, and operational analytics, supported by local hosting to win data-residency-sensitive enterprise deals.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_economic)

pestel_social = slides[current_idx+2].copy()
pestel_social["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "India's digital landscape features 1.03 billion internet users (70% penetration) and 1.06 billion mobile connections, making mobile-first application and messaging experiences absolute baseline requirements for recruiting."},
    {"level": 1, "text": "With 170 million LinkedIn members, the professional sourcing graph remains concentrated, while consumer communication is heavily fragmented, requiring adaptable, multi-channel outreach strategies for different talent pools."},
    {"level": 1, "text": "WhatsApp functions as the default business communication channel across demographics; enterprise recruiting systems must support native WhatsApp messaging to achieve acceptable candidate response rates and reduce time-to-hire."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Design mobile-first application flows, integrate SMS and WhatsApp channels for scheduling and updates, support LinkedIn-heavy sourcing, and ensure explicit first-contact consent capture for all communications.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_social)

pestel_tech = slides[current_idx+3].copy()
pestel_tech["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "AI adoption in India outpaces global averages, with ~40% of Indian enterprises reporting significant AI usage compared to ~28% globally, driving expectations for AI-assisted screening and matching in talent acquisition."},
    {"level": 1, "text": "Despite high adoption, ~68% of enterprises prioritise security and compliance for AI scale, and ~39% cite regulatory integration as their top challenge, demanding explainable AI models rather than black-box automation."},
    {"level": 1, "text": "Sovereign AI infrastructure investments and local data centre expansions support expectations for in-country processing, low latency, and strict adherence to emerging national data protection frameworks."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Activate AI screening and scheduling where demanded, but pair these capabilities with comprehensive audit logs, human-in-the-loop review options, explainable workflows, and clear privacy notices for automated decisions.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_tech)

pestel_env = slides[current_idx+4].copy()
pestel_env["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "While lacking recruiting-specific environmental statutes, listed Indian employers face increasing pressure from SEBI's Business Responsibility and Sustainability Reporting (BRSR) mandates regarding workforce composition and inclusion."},
    {"level": 1, "text": "Sustainability reporting requirements are pushing diversity and inclusion metrics upstream from payroll into the talent acquisition phase, requiring ATS platforms to capture and report on demographic data securely and compliantly."},
    {"level": 1, "text": "The emergence of green jobs and shifting sector skill mixes influence sourcing strategies, but these trends do not currently mandate heavy, bespoke sustainability features within core applicant tracking systems."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Maintain a secondary focus on bespoke environmental features; instead, enable robust diversity data collection during hiring to support corporate sustainability reporting narratives without over-engineering the ATS.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_env)

pestel_legal = slides[current_idx+5].copy()
pestel_legal["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "The Digital Personal Data Protection (DPDP) Act 2023 establishes strict rules for data fiduciaries, mandating explicit consent, purpose limitation, breach notification, and robust data retention and deletion capabilities."},
    {"level": 1, "text": "Following the 2018 Supreme Court ruling striking down Section 57, private employers cannot mandate Aadhaar for identity verification, requiring flexible, multi-document eKYC workflows that do not rely solely on Aadhaar defaults."},
    {"level": 1, "text": "Multinational enterprises operating in India remain bound by EU GDPR and the EU AI Act, necessitating comprehensive Data Protection Impact Assessments (DPIAs) and strict governance for high-risk AI tools used in hiring."},
    {"level": 0, "text": [
        {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        {"text": "Deliver granular consent capture, automated retention and purge schedules, and lawful non-Aadhaar identity verification; preserve GDPR rights tooling and human oversight for all AI-assisted processing.", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"}
    ]}
]
new_slides.append(pestel_legal)
current_idx += 6

# Add Competitive Landscape section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Regional Specialists
new_slides.append(slides[current_idx+2]) # Global Platforms
new_slides.append(slides[current_idx+3]) # SWOT
current_idx += 4

# Add Win/Loss section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Presales Scope
new_slides.append(slides[current_idx+2]) # Ideation Pain Index
new_slides.append(slides[current_idx+3]) # Deal Rows
current_idx += 4

# Add Ideation Hub section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Overview
new_slides.append(slides[current_idx+2]) # Volumes
new_slides.append(slides[current_idx+3]) # Themes
current_idx += 4

# SME Section
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Experts
new_slides.append(slides[current_idx+2]) # Participants
current_idx += 3

# C5: Enrich interview slides with key quotes
# C3: Font size 14pt
sme1 = slides[current_idx].copy()
sme1["text_boxes"][0]["font_size_pt"] = 14
sme1["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Identity trust is the foundation for India volume; without it, downstream processes fail.\" - Insight on KYC and resume fraud at 100K+ resumes/month scale, referencing Accenture's operational challenges."},
    {"level": 1, "text": "India strategy must address localisation, regional regulations, and partner ecosystems, including interview-intelligence tools to complement native platform capabilities for enterprise customers like Accenture."},
    {"level": 1, "text": "Identity verification must be treated as a first-class pillar with significant throughput investments, moving beyond basic services workarounds to handle enterprise scale and prevent fraudulent applications."},
    {"level": 1, "text": "Internal brainstorm collateral and enablement contacts highlight the ongoing need for continuous India strategy alignment, product feedback loops, and robust identity verification frameworks."}
]
new_slides.append(sme1)

sme2 = slides[current_idx+1].copy()
sme2["text_boxes"][0]["font_size_pt"] = 14
sme2["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"India offers require complex tabular compensation disclosure; the current process forces dual documents and manual change tracking.\" - Insight on Lowe's volume hiring challenges."},
    {"level": 1, "text": "Automated hire completion can inadvertently skip recruiter start-date confirmation, requiring custom fixes when automation conflicts with actual onboarding dates for enterprise customers like Lowe's."},
    {"level": 1, "text": "India background checks often permit hiring before all packages complete, unlike US gating; parallel drug and background processes multiply integration timing issues and compliance risks."},
    {"level": 1, "text": "Customers demand one-click background check reinitiation, with vendor signals consumed cleanly inside standard Job Application workflow steps to maintain process velocity."}
]
new_slides.append(sme2)

sme3 = slides[current_idx+2].copy()
sme3["text_boxes"][0]["font_size_pt"] = 14
sme3["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Opt-in defaults starve our campaign reach; we need region-configurable opt-out to hit our volume targets.\" - Insight on high-volume communication barriers across global deployments."},
    {"level": 1, "text": "Background check documents vary by stage, but current review-document steps misfit pre-interview attach-only needs, causing implementation friction and candidate drop-off."},
    {"level": 1, "text": "WhatsApp dominates candidate communication preferences; broader messaging roadmap dependencies are explicitly acknowledged as critical for India market success and candidate engagement."},
    {"level": 1, "text": "Fraud at the 700K population scale drives the need for ID-before-interview validation; chatbots for status updates await compliant conversational channels to reduce manual recruiter workload."}
]
new_slides.append(sme3)

sme4 = slides[current_idx+3].copy()
sme4["text_boxes"][0]["font_size_pt"] = 14
sme4["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"We process 100-200 concurrent openings; individual clicks don't scale for mass offers and approvals.\" - Insight on Genpact's talent supply chain bottlenecks and high-volume friction."},
    {"level": 1, "text": "Genpact utilised custom extensions to bridge professional services demand fields into recruiting when standard requisition objects lacked end-to-end visibility across the talent lifecycle."},
    {"level": 1, "text": "Impersonation risks elevate verification expectations; middleware and custom integrations appear where native background checks feel basic versus contractual client obligations at Genpact."},
    {"level": 1, "text": "Weak audit trails on career site profile changes undermine background check integrity; post-offer no-shows drive demand for purchased messaging solutions to maintain candidate engagement."}
]
new_slides.append(sme4)

sme5 = slides[current_idx+4].copy()
sme5["text_boxes"][0]["font_size_pt"] = 14
sme5["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"At 200K applications, manual duplicate resolution is impossible; we need mass purge and intelligent merge beyond two records.\" - Insight on Accenture-scale operations and data hygiene."},
    {"level": 1, "text": "Enterprise asks include do-not-hire lists, mass purge capabilities, fraud detection, and interview-stage ID validation to manage massive applicant volumes efficiently at Accenture."},
    {"level": 1, "text": "Competitive trickery narratives push for AI-assisted fraud detection with human judgement retained; validated professional network concepts signal long-term trust bets for enterprise customers."},
    {"level": 1, "text": "Do-not-hire functionality extends beyond ex-employees, with analogues required for government and federal contexts in global enterprise deployments to ensure strict compliance."}
]
new_slides.append(sme5)
current_idx += 5

# Customer Section
new_slides.append(slides[current_idx]) # Section Title

intro_slide = slides[current_idx+1].copy()
intro_slide["placeholders"]["0"] = "1:1 Interviews - Enterprise"
new_slides.append(intro_slide) # Intro

new_slides.append(slides[current_idx+2]) # Participants
current_idx += 3

p1 = slides[current_idx].copy()
p1["placeholders"]["0"] = "P1 - Recruitment Mgr, Teleperformance"
p1["text_boxes"][0]["font_size_pt"] = 14
p1["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Supervisory organisation selection stayed unclear from the business at scale, so teams used random tags and operations pushed back on data quality.\" - (P1, Teleperformance)"},
    {"level": 1, "text": "Manages specialised internal recruiting for a compact team; balances day-to-day sourcing and offers with managerial duties that compete with candidate throughput and operational efficiency."},
    {"level": 1, "text": "This segment is distinct from highest-volume agency hiring yet depends on the same enterprise approvals, data quality, and system hygiene described across the wider Teleperformance programme."},
    {"level": 1, "text": "Core needs: keep assigned requisitions accurate, move candidates efficiently, and sustain team effectiveness without being pulled entirely into firefighting data issues and manual corrections."}
]
new_slides.append(p1)

p2 = slides[current_idx+1].copy()
p2["text_boxes"][0]["font_size_pt"] = 14
p2["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"We lost a full day fixing cost centre tables for one senior hire because the demand details were buried in email, not the system.\" - (P2, Teleperformance)"},
    {"level": 1, "text": "Demand and approvals often live in email first; recruiters only raise requisitions after long threads, weakening in-system approval history and significantly slowing requisition creation."},
    {"level": 1, "text": "Recruiters carry cost centre, line of business, and margin detail that hiring managers omit, driving rework and significant delays before posting critical roles at Teleperformance."},
    {"level": 1, "text": "Core needs: accurate requisitions with visible approval status and a faster, auditable path from demand to posting so recruiters return time to candidate engagement and sourcing."}
]
new_slides.append(p2)

p3 = slides[current_idx+2].copy()
p3["text_boxes"][0]["font_size_pt"] = 14
p3["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Policy requires three government IDs before offer, but the UX allows skips; we spend hours chasing candidates for missing documents.\" - (P3, Teleperformance)"},
    {"level": 1, "text": "Confidential funnel sees ~82% join rate but 16-17% loss tied to process length and anxiety, not pay alone, before acceptance, highlighting the need for streamlined pre-offer workflows."},
    {"level": 1, "text": "OTP failures on ID verification drive support tickets; hundreds of applications per requisition force one-by-one review when parsers sit near 60-70% accuracy, creating massive bottlenecks."},
    {"level": 1, "text": "Core needs: strict document gating, reliable verification, and faster screening to reduce candidate drop-off during the lengthy pre-offer phase at Teleperformance."}
]
new_slides.append(p3)

p4 = slides[current_idx+3].copy()
p4["placeholders"]["0"] = "P4 - Recruiting Mgr, Teleperformance"
p4["text_boxes"][0]["font_size_pt"] = 14
p4["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Every application needs manual duplicate checks; skipped checks risk agency fee fairness when duplicates are found late.\" - (P4, Teleperformance)"},
    {"level": 1, "text": "India agency-channel hiring spans 100-150 hires per week in peaks, contributing to an 8K-9K monthly enterprise volume narrative that strains manual duplicate resolution processes."},
    {"level": 1, "text": "Vendor upload approval at ~100 profiles per day implies dedicated approvers; manual duplicate checking is a massive operational bottleneck that requires intelligent automation."},
    {"level": 1, "text": "Regenerate limits after acceptance clashed with early go-live compensation mismatches across large cohorts, requiring manual intervention and delaying candidate onboarding."}
]
new_slides.append(p4)

p5 = slides[current_idx+4].copy()
p5["placeholders"]["0"] = "P5 - Frontline Lead, Teleperformance"
p5["text_boxes"][0]["font_size_pt"] = 14
p5["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Duplicate detection is our top automation need; candidates change email and phone, requiring government ID matching.\" - (P5, Teleperformance)"},
    {"level": 1, "text": "Collective peaks near 1.5K-2K hires per week across 8-9 sites; duplicate signal does not block progression, and agency first-source attribution breaks create financial exposure."},
    {"level": 1, "text": "Aadhaar-class identifiers are requested for deduplication but are not validation keys today, limiting their effectiveness for fraud prevention and identity trust at Teleperformance."},
    {"level": 1, "text": "At 100-150 offers per day, batch join-date moves cannot be mass-redone in-system, pushing manual legal letters; Saturday maintenance clashes with 6-day operations."}
]
new_slides.append(p5)
current_idx += 5

# Themes Section
new_slides.append(slides[current_idx]) # Section Title
current_idx += 1

# C7: Remove "Validated" from theme slide titles
theme1 = slides[current_idx].copy()
theme1["placeholders"]["0"] = "Theme 1: Know Your Candidate"
theme1["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "PAN, Aadhaar, and UAN anchor trust; policy needs all IDs pre-offer but UX allows skips; OTP fails and duplicate detection ignores government IDs, driving fee risk (P3-P5, SMEs)."},
    {"level": 1, "text": "Business impact: Chase cycles, escalations, and financial exposure when duplicates do not block or honour first-source rules at thousands of profiles per day."},
    {"level": 1, "text": "Product implications: Lawful gating, duplicate detection on permitted IDs, partner eKYC or offline XML, fraudulent application detection alignment, DPDP-minimised notices."}
]
new_slides.append(theme1)

theme2 = slides[current_idx+1].copy()
theme2["placeholders"]["0"] = "Theme 2: High Volume"
theme2["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "Peaks near 1.5K-2K hires per week and 2K-3K+ agency profiles per day; duplicate review fills days; vendor upload approval bottlenecks severely limit throughput (P4, P5, SMEs)."},
    {"level": 1, "text": "Business impact: FTEs wasted on manual checks, credential delays at go-live, and lost business days when bulk tools lag behind seasonal hiring ramps."},
    {"level": 1, "text": "Product implications: Duplicate queues, merge beyond two records, mass disposition, HiredScore activation for volume, and a stronger bulk grid for India templates."}
]
new_slides.append(theme2)

theme3 = slides[current_idx+2].copy()
theme3["placeholders"]["0"] = "Theme 3: Offer and BGV"
theme3["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "Offer regeneration limits after pay or date changes force manual legal letters at ~100-150 offers per day; India post-hire background checks need flexible triggers (P3-P5, SMEs)."},
    {"level": 1, "text": "Business impact: Double-digit offer-to-join loss tied to process length and anxiety; batch join-date moves are extremely hard to redo in-system efficiently."},
    {"level": 1, "text": "Product implications: Controlled regenerate and batch updates where safe, audit-friendly notifications, and background check flexibility without brittle custom integrations."}
]
new_slides.append(theme3)

theme4 = slides[current_idx+3].copy()
theme4["placeholders"]["0"] = "Theme 4: Omnichannel"
theme4["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "WhatsApp is the default communication channel socially; competitive gaps exist on native +91 SMS and WhatsApp in core UI; customers see thousands of generic task emails."},
    {"level": 1, "text": "Business impact: Recruiters must phone candidates to confirm tasks; channel parity appears frequently in enterprise RFPs versus regional suites and global ATS competitors."},
    {"level": 1, "text": "Product implications: Native messaging with DPDP consent and logging; richer templates; governed messaging partner integrations with Legal approval for interim support."}
]
new_slides.append(theme4)

theme5 = slides[current_idx+4].copy()
theme5["placeholders"]["0"] = "Theme 5: Req Truth & Approvals"
theme5["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "Email approvals precede Workday requisitions, causing rework; P2 lost ~24 hours fixing cost centre tables; P3 uses parallel tools when dashboards miss SLA views."},
    {"level": 1, "text": "Business impact: Weaker approval audit trails, supervisory organisation mis-tags at scale, and significantly slower time-to-post for confidential or volume programmes."},
    {"level": 1, "text": "Product implications: In-flow approvals, requisition ageing dashboards for managers, governed questionnaire templates; validate presales data gaps before building battle cards."}
]
new_slides.append(theme5)

new_slides.append(slides[current_idx+5]) # Matrix
current_idx += 6

# Full Funnel
new_slides.append(slides[current_idx]) # Section Title
new_slides.append(slides[current_idx+1]) # Gap Analysis
current_idx += 2

# Roadmap Section
new_slides.append(slides[current_idx]) # Section Title
current_idx += 1

# C6: Enrich recommendation slides with reference customers
rec1 = slides[current_idx].copy()
rec1["text_boxes"][0]["font_size_pt"] = 14
rec1["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "ID policy demands pre-offer IDs but gating and OTP are weak; manual duplicate resolution limits scale and creates significant compliance and fee risks."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3 and P5 (Teleperformance) need lawful duplicate detection on government IDs; SME5 cites Accenture-scale 200K duplicate challenges and impersonation risks."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Implement duplicate detection and application gating for PAN, Aadhaar, UAN where permitted, with DPDP consent and partner eKYC integration."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "New market entry and trust buying demand robust identity verification; critical for enterprise adoption and compliance in the India market."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Time to Hire: Reduce ID chase loops by 5-10% on India high-volume baselines, improving overall candidate throughput."}
]
new_slides.append(rec1)

rec2 = slides[current_idx+1].copy()
rec2["text_boxes"][0]["font_size_pt"] = 14
rec2["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Thousands of profiles per day need duplicate review; agency first-source rules break fees, and vendor upload approval does not scale for enterprise needs."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P4 and P5 (Teleperformance) cite manual review bottlenecks; SME4 notes Genpact mass hire friction; SME5 highlights merge limits capped at two records at Accenture."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Productise duplicate queues, first-source agency attribution, multi-way merge, mass disposition with compliance guardrails, and faster vendor-upload UX."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India scale growth priority requires core ATS parity for high-volume operations to compete effectively against regional specialists."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Recruiter Efficiency: Cut manual duplicate review time by 50% on pilot cohorts, returning hours to candidate engagement."}
]
new_slides.append(rec2)

rec3 = slides[current_idx+2].copy()
rec3["text_boxes"][0]["font_size_pt"] = 14
rec3["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "700+ applications per requisition exhaust manual screening; parser limits force manual review, significantly delaying time-to-hire for volume roles."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3 (Teleperformance) cites 60-70% parser accuracy driving manual review; SME1 notes 100K+ resume scale at Accenture requires intelligent screening."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Enable repeatable HiredScore activation with reviewer queues, ensuring governance for EU AI Act and India AI expectations before broad rollout."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Q2 Priority 2 demands AI matching ROI on high-volume India IT and BPO templates to maintain competitive differentiation."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Time to Shortlist: 30% reduction on pilot requisitions versus control groups, accelerating the top of the hiring funnel."}
]
new_slides.append(rec3)

rec4 = slides[current_idx+3].copy()
rec4["text_boxes"][0]["font_size_pt"] = 14
rec4["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Lack of native WhatsApp and +91 SMS in core UI forces recruiters to use personal devices or external tools, losing audit trails and compliance tracking."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Competitive gaps identified against regional specialists; PESTEL Social shows WhatsApp as default; SME3 confirms WhatsApp dominates candidate links."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Deliver native candidate WhatsApp messaging for India with DPDP consent, logging, opt-out, and template governance to ensure compliance."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India scale priority requires omnichannel parity to compete effectively in enterprise RFPs and meet candidate communication expectations."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Candidate Response Rate: Increase from 15% (email) to 70% (WhatsApp) on pilot campaigns, dramatically reducing chase time."}
]
new_slides.append(rec4)

rec5 = slides[current_idx+4].copy()
rec5["text_boxes"][0]["font_size_pt"] = 14
rec5["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Compensation or start-date shifts after acceptance force manual legal letters at batch scale, compounding offer-to-join risk and administrative burden."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3-P5 (Teleperformance) cite regenerate friction; SME2 notes Lowe's volume requires complex tabular compensation disclosure and dual documents."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Expand controlled offer and employment agreement regeneration, cautious batch updates, and candidate notifications that preserve audit trails."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Core ATS parity requirement to support India's high-volume operating reality and reduce candidate drop-off during the offer phase."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Offer Renegotiation Time: Reduce manual processing delays by 40% on governed pilots, improving the candidate onboarding experience."}
]
new_slides.append(rec5)
current_idx += 5

# Add remaining slides
while current_idx < len(slides):
    new_slides.append(slides[current_idx])
    current_idx += 1

# C8: Scrub internal language globally
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
    "TP": "Teleperformance",
    "000": "K",
    "00,000": "00K",
    "0,000": "0K",
    "1,000": "1K",
    "2,000": "2K",
    "3,000": "3K",
    "4,000": "4K",
    "5,000": "5K",
    "6,000": "6K",
    "7,000": "7K",
    "8,000": "8K",
    "9,000": "9K",
    "1,500": "1.5K"
}

def replace_text(text):
    if not isinstance(text, str): return text
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

for s in new_slides:
    p = s.get("placeholders", {})
    if "0" in p:
        if isinstance(p["0"], dict):
            p["0"]["text"] = replace_text(p["0"].get("text", ""))
        elif isinstance(p["0"], str):
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

with open('slides_spec_v88.json', 'w') as f:
    json.dump(new_slides, f, indent=2)
