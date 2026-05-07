import json

from slide_specs_dir import SLIDE_SPECS_DIR

_spec88 = SLIDE_SPECS_DIR / "slides_spec_v88.json"
with open(_spec88) as f:
    slides = json.load(f)

# Slide 3: Exec Summary - reduce to 3 bullets
slides[2]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India recruiting market entry demands robust identity verification and high-volume automation; Teleperformance and internal experts warn that trust and throughput fail without lawful ID matching and bulk processing capabilities."},
    {"level": 1, "text": "Data privacy regulations (DPDP) and international compliance (GDPR, EU AI Act) require configurable consent, retention, and screening notices for multinational organisations managing candidate talent pools in India."},
    {"level": 1, "text": "Priority investments: government-ID-aware identity verification, scalable duplicate and agency management, governed AI screening for volume, and native messaging channels to close competitive gaps and improve candidate response times."}
]

# SME slides: 160-180 chars
slides[35]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Identity trust is the foundation for India volume; without it, downstream processes fail.\" - Insight on KYC and resume fraud at 100K+ resumes/month scale at Accenture."},
    {"level": 1, "text": "India strategy must address localisation, regional regulations, and partner ecosystems, including interview-intelligence tools to complement native capabilities for enterprise."},
    {"level": 1, "text": "Identity verification must be treated as a first-class pillar with significant throughput investments, moving beyond basic services workarounds to handle enterprise scale."},
    {"level": 1, "text": "Internal brainstorm collateral and enablement contacts highlight the ongoing need for continuous India strategy alignment, product feedback loops, and robust identity frameworks."}
]

slides[36]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"India offers require complex tabular compensation disclosure; the current process forces dual documents and manual change tracking.\" - Insight on Lowe's volume hiring."},
    {"level": 1, "text": "Automated hire completion can inadvertently skip recruiter start-date confirmation, requiring custom fixes when automation conflicts with actual onboarding dates for Lowe's."},
    {"level": 1, "text": "India background checks often permit hiring before all packages complete, unlike US gating; parallel drug and background processes multiply integration timing issues."},
    {"level": 1, "text": "Customers demand one-click background check reinitiation, with vendor signals consumed cleanly inside standard Job Application workflow steps to maintain process velocity."}
]

slides[37]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Opt-in defaults starve our campaign reach; we need region-configurable opt-out to hit our volume targets.\" - Insight on high-volume communication barriers globally."},
    {"level": 1, "text": "Background check documents vary by stage, but current review-document steps misfit pre-interview attach-only needs, causing implementation friction and candidate drop-off."},
    {"level": 1, "text": "WhatsApp dominates candidate communication preferences; broader messaging roadmap dependencies are explicitly acknowledged as critical for India market success and engagement."},
    {"level": 1, "text": "Fraud at the 700K population scale drives the need for ID-before-interview validation; chatbots for status updates await compliant conversational channels to reduce workload."}
]

slides[38]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"We process 100-200 concurrent openings; individual clicks don't scale for mass offers and approvals.\" - Insight on Genpact's talent supply chain bottlenecks and friction."},
    {"level": 1, "text": "Genpact utilised custom extensions to bridge professional services demand fields into recruiting when standard requisition objects lacked end-to-end visibility across lifecycle."},
    {"level": 1, "text": "Impersonation risks elevate verification expectations; middleware and custom integrations appear where native background checks feel basic versus contractual client obligations."},
    {"level": 1, "text": "Weak audit trails on career site profile changes undermine background check integrity; post-offer no-shows drive demand for purchased messaging solutions to maintain engagement."}
]

slides[39]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"At 200K applications, manual duplicate resolution is impossible; we need mass purge and intelligent merge beyond two records.\" - Insight on Accenture-scale data hygiene."},
    {"level": 1, "text": "Enterprise asks include do-not-hire lists, mass purge capabilities, fraud detection, and interview-stage ID validation to manage massive applicant volumes efficiently."},
    {"level": 1, "text": "Competitive trickery narratives push for AI-assisted fraud detection with human judgement retained; validated professional network concepts signal long-term trust bets."},
    {"level": 1, "text": "Do-not-hire functionality extends beyond ex-employees, with analogues required for government and federal contexts in global enterprise deployments to ensure strict compliance."}
]

# Customer slides: 3 bullets, 200-240 chars
slides[43]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Supervisory organisation selection stayed unclear from the business at scale, so teams used random tags and operations pushed back on data quality.\" - (P1, Teleperformance) highlighting significant enterprise data hygiene issues."},
    {"level": 1, "text": "Manages specialised internal recruiting for a compact team; balances day-to-day sourcing and offers with managerial duties that compete with candidate throughput and operational efficiency, requiring streamlined system workflows."},
    {"level": 1, "text": "Core needs: keep assigned requisitions accurate, move candidates efficiently, and sustain team effectiveness without being pulled entirely into firefighting data issues and manual corrections across the wider Teleperformance programme."}
]

slides[44]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"We lost a full day fixing cost centre tables for one senior hire because the demand details were buried in email, not the system.\" - (P2, Teleperformance) illustrating the severe impact of disconnected requisition approval workflows."},
    {"level": 1, "text": "Demand and approvals often live in email first; recruiters only raise requisitions after long threads, weakening in-system approval history and significantly slowing requisition creation for critical enterprise roles."},
    {"level": 1, "text": "Core needs: accurate requisitions with visible approval status and a faster, auditable path from demand to posting so recruiters return time to candidate engagement and sourcing instead of chasing missing cost centre details."}
]

slides[45]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Policy requires three government IDs before offer, but the UX allows skips; we spend hours chasing candidates for missing documents.\" - (P3, Teleperformance) exposing critical gaps in pre-offer compliance gating."},
    {"level": 1, "text": "Confidential funnel sees ~82% join rate but 16-17% loss tied to process length and anxiety, not pay alone, before acceptance, highlighting the urgent need for streamlined pre-offer workflows and faster document collection."},
    {"level": 1, "text": "Core needs: strict document gating, reliable verification, and faster screening to reduce candidate drop-off during the lengthy pre-offer phase, especially when parsers sit near 60-70% accuracy creating massive bottlenecks."}
]

slides[46]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Every application needs manual duplicate checks; skipped checks risk agency fee fairness when duplicates are found late.\" - (P4, Teleperformance) highlighting the financial exposure of inadequate duplicate detection."},
    {"level": 1, "text": "India agency-channel hiring spans 100-150 hires per week in peaks, contributing to an 8K-9K monthly enterprise volume narrative that completely strains manual duplicate resolution processes and vendor upload approvals."},
    {"level": 1, "text": "Vendor upload approval at ~100 profiles per day implies dedicated approvers; manual duplicate checking is a massive operational bottleneck that requires intelligent automation to ensure fair agency attribution and fee integrity."}
]

slides[47]["text_boxes"][0]["paragraphs"] = [
    {"level": 1, "text": "\"Duplicate detection is our top automation need; candidates change email and phone, requiring government ID matching.\" - (P5, Teleperformance) exposing the limitations of standard email/phone matching in high-volume India hiring."},
    {"level": 1, "text": "Collective peaks near 1.5K-2K hires per week across 8-9 sites; duplicate signal does not block progression, and agency first-source attribution breaks create financial exposure that requires robust Aadhaar-class identifiers."},
    {"level": 1, "text": "At 100-150 offers per day, batch join-date moves cannot be mass-redone in-system, pushing manual legal letters; Saturday maintenance clashes with 6-day operations, demanding greater offer agility and batch processing capabilities."}
]

# Theme 1: Know Your Candidate - shorten bullet
slides[49]["text_boxes"][0]["paragraphs"][0]["text"] = "PAN, Aadhaar, and UAN anchor trust; policy needs all IDs pre-offer but UX allows skips; OTP fails and duplicate detection ignores government IDs, driving fee risk (P3-P5)."

# Recommendations: enrich bullets to 160-220 chars
slides[58]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "ID policy demands pre-offer IDs but gating and OTP are weak; manual duplicate resolution limits scale and creates significant compliance and fee risks for enterprise customers."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3 and P5 (Teleperformance) need lawful duplicate detection on government IDs; SME5 cites Accenture-scale 200K duplicate challenges and impersonation risks in high-volume hiring."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Implement duplicate detection and application gating for PAN, Aadhaar, UAN where permitted, with DPDP consent and partner eKYC integration to ensure robust identity verification."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "New market entry and trust buying demand robust identity verification; critical for enterprise adoption and compliance in the rapidly formalising India talent acquisition market."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Time to Hire: Reduce ID chase loops by 5-10% on India high-volume baselines, improving overall candidate throughput and reducing recruiter administrative burden."}
]

slides[59]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Thousands of profiles per day need duplicate review; agency first-source rules break fees, and vendor upload approval does not scale for massive enterprise talent supply chains."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P4 and P5 (Teleperformance) cite manual review bottlenecks; SME4 notes Genpact mass hire friction; SME5 highlights merge limits capped at two records causing issues at Accenture."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Productise duplicate queues, first-source agency attribution, multi-way merge, mass disposition with compliance guardrails, and faster vendor-upload UX for high-volume operations."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India scale growth priority requires core ATS parity for high-volume operations to compete effectively against regional specialists who already offer these bulk processing tools."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Recruiter Efficiency: Cut manual duplicate review time by 50% on pilot cohorts, returning thousands of hours annually to candidate engagement and strategic sourcing."}
]

slides[60]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "700+ applications per requisition exhaust manual screening; parser limits force manual review, significantly delaying time-to-hire for volume roles and frustrating recruiters."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3 (Teleperformance) cites 60-70% parser accuracy driving manual review; SME1 notes 100K+ resume scale at Accenture requires intelligent screening to maintain process velocity."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Enable repeatable HiredScore activation with reviewer queues, ensuring governance for EU AI Act and India AI expectations before broad rollout to multinational enterprise customers."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Q2 Priority 2 demands AI matching ROI on high-volume India IT and BPO templates to maintain competitive differentiation against AI-native regional and global ATS competitors."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Time to Shortlist: 30% reduction on pilot requisitions versus control groups, accelerating the top of the hiring funnel and improving overall candidate conversion rates."}
]

slides[61]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Lack of native WhatsApp and +91 SMS in core UI forces recruiters to use personal devices or external tools, losing audit trails and critical compliance tracking for DPDP."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Competitive gaps identified against regional specialists; PESTEL Social shows WhatsApp as default; SME3 confirms WhatsApp dominates candidate links across global deployments."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Deliver native candidate WhatsApp messaging for India with DPDP consent, logging, opt-out, and template governance to ensure compliance and improve candidate engagement."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India scale priority requires omnichannel parity to compete effectively in enterprise RFPs and meet candidate communication expectations in a mobile-first talent market."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Candidate Response Rate: Increase from 15% (email) to 70% (WhatsApp) on pilot campaigns, dramatically reducing chase time and improving recruiter operational efficiency."}
]

slides[62]["text_boxes"][0]["paragraphs"] = [
    {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Compensation or start-date shifts after acceptance force manual legal letters at batch scale, compounding offer-to-join risk and administrative burden for high-volume teams."},
    {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P3-P5 (Teleperformance) cite regenerate friction; SME2 notes Lowe's volume requires complex tabular compensation disclosure and dual documents that break standard workflows."},
    {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Expand controlled offer and employment agreement regeneration, cautious batch updates, and candidate notifications that preserve audit trails for strict Legal and compliance review."},
    {"level": 0, "text": [{"text": "Why Now", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Core ATS parity requirement to support India's high-volume operating reality and reduce candidate drop-off during the critical offer phase where competitors currently excel."},
    {"level": 0, "text": [{"text": "Success Metrics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Offer Renegotiation Time: Reduce manual processing delays by 40% on governed pilots, improving the candidate onboarding experience and reducing overall time-to-hire."}
]

with open(_spec88, 'w') as f:
    json.dump(slides, f, indent=2)
