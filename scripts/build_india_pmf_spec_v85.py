#!/usr/bin/env python3
"""Generate slides_spec_v85.json for India INDIA-PMF-003 PMF roadmap deck."""
import json

from slide_specs_dir import SLIDE_SPECS_DIR

def section(n: str, subtitle: str) -> dict:
    return {
        "master_index": 1,
        "layout_name": "Section Title",
        "text_boxes": [{
            "left_inches": 3.3,
            "top_inches": 1.5,
            "width_inches": 5.6,
            "height_inches": 2.2,
            "font_name": "Archivo",
            "font_size_pt": 12,
            "color": "ink",
            "text": f"S E C T I O N  {n}\n{subtitle}",
        }],
    }

def title_only(title: str, paragraphs: list, alt: bool = False, font: int = 14, notes: str = "") -> dict:
    return {
        "master_index": 1,
        "layout_name": "Title Only_Alt" if alt else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [{
            "left_inches": 0.7,
            "top_inches": 1.2,
            "width_inches": 8.6,
            "height_inches": 2.8,
            "font_name": "Archivo",
            "font_size_pt": font,
            "color": "ink",
            "paragraphs": paragraphs,
        }],
        "speaker_notes": notes,
    }

def pi_run(impl: str) -> dict:
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": impl, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }

def pestel_slide(title: str, bullets: list[str], impl: str, notes: str) -> dict:
    paras = []
    for b in bullets:
        paras.append({"level": 1, "text": b})
    paras.append(pi_run(impl))
    return title_only(title, paras, alt=False, font=12, notes=notes)

slides: list = []

# 1 TITLE
slides.append({
    "master_index": 1,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "India Recruiting Product-Market Fit Research"},
        "1": {"text": "April 2026"},
    },
})

slides.append(section("0 1", "Research challenge"))

slides.append(title_only("Executive Summary", [
    {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Trust and volume converge: identity, deduplication, and source integrity are economic risks at Teleperformance India scale, not back-office hygiene."},
    {"level": 1, "text": "Offer and BGC break under strict ID policy: OTP friction and weak offer-accepted signals sit atop native BGV strengths."},
    {"level": 1, "text": "True gaps on +91 SMS, WhatsApp core UI, UIDAI eKYC, and Naukri multipost; counter with suite depth, UDMF, Hindi, bulk grid, and honest partner maps."},
    {"level": 1, "text": "Steer: consented identifier-aware dedupe, bulk automation with activated screening, BGC reinitiate with vendor status, intake gates, milestone alerts."},
], notes="• Land trust plus throughput as one narrative.\n• Cite DPDP phased rules and labour code timing.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append(section("0 2", "Research challenge"))

slides.append(title_only("Research Question and Objectives", [
    {"level": 1, "text": "How should Workday Recruiting win India enterprise and high-volume programmes on trust, compliance, and recruiter throughput?"},
    {"level": 1, "text": "Objectives: validate funnel friction, channel reality, identity and dedupe needs, offer or BGC flexibility, and governance gaps versus global suite strengths."},
    {"level": 1, "text": "Methods: strategy context, PESTEL, SWOT, competitive intelligence, five internal SMEs (SME1–SME5), five customer voices (P1–P5), ideation quant, thematic synthesis with triangulation."},
    {"level": 1, "text": "Scope: India-hosted recruiting; presales gap exports were not available for this cycle (Win/Loss section notes the data gap explicitly)."},
], alt=True, font=12, notes="• Keep language executive; avoid methodology jargon in-room.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-003.md"))

slides.append(section("0 3", "Context review"))

slides.append(title_only("Strategic Context - Why India Now", [
    {"level": 1, "text": "India is a Q2 scale-growth row: eight wins, DPDP programmes, local boards via certified partners (April–June 2026 priorities)."},
    {"level": 1, "text": "GCC stays corporate Priority 1; India proof must stay credible inside the same portfolio."},
    {"level": 1, "text": "Buyers pair India growth with GDPR, EU AI Act, and DPDP dual-stack diligence on consent and transfers."},
], notes="• Emphasise India row without overclaiming resourcing versus GCC.\n\nReferences:\n• strategy/markdown/product-priorities-q2-2026.md"))

slides.append(title_only("India Market Momentum - Key Indicators", [
    {"level": 1, "text": "ATS market about USD 0.30B (2024) toward USD 0.50B by 2033 near 7.2% CAGR (IMARC 2025 narrative)."},
    {"level": 1, "text": "Public cloud SaaS growth supports ATS replacement and AI uptake (IDC India press via trade coverage)."},
    {"level": 1, "text": "Digital 2025 India: about 806M internet users, 55.3% penetration, 1.12B mobile connections, median age about 28.8 (DataReportal Jan 2025)."},
], alt=True, font=12, notes="• Use statistics as directional; definitions vary by analyst.\n\nReferences:\n• research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-003.md"))

slides.append(section("0 4", "Product strategy"))

slides.append(title_only("Q2 2026 Product Priorities", [
    {"level": 1, "text": "India first: scale growth with eight wins, DPDP compliance programmes, and local boards through Broadbean-class partner validation per product strategy (not native board builds)."},
    {"level": 1, "text": "Priority 2 AI candidate matching: HiredScore activation, beta tenants, time-to-fill signals; India high-volume shortlisting maps strongly when disclosure and human oversight are credible."},
    {"level": 1, "text": "Priority 3 core ATS parity: bulk actions, mobile recruiter experience, BGV integrations, scheduling friction reduction via Paradox where activated."},
    {"level": 1, "text": "Priority 1 GCC readiness stays top at company level; India mirrors the playbook on compliance fit, messaging norms, and distribution partners rather than GCC-only features."},
], notes="• Focal region leads; corporate priorities follow with India relevance.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-003.md"))

slides.append(title_only("Regional Expansion Strategy", [
    {"level": 1, "text": "India: high priority for scale growth; DPDP; local job boards; eight Q2 wins (strategy table)."},
    {"level": 1, "text": "GCC: market entry; ten wins; messaging and nationalisation; Arabic RTL; boards via Broadbean."},
    {"level": 1, "text": "Japan: deepen penetration; two-step offer; APPI; LINE; five expansions."},
    {"level": 1, "text": "Australia: maintain leader position; Fair Work; SEEK; three expansions."},
], alt=True, font=12, notes="• India row at top for this deck audience.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-003.md"))

slides.append(title_only("Competitive Positioning - Differentiation", [
    {"level": 1, "text": "Suite depth: HCM plus Recruiting plus Talent plus Learning versus point ATS or payroll-adjacent bundles."},
    {"level": 1, "text": "AI-powered: activated HiredScore and Paradox versus manual high-volume workflows."},
    {"level": 1, "text": "Compliance-first: GDPR, EU AI Act, and global privacy posture with DPDP-ready consent, retention, and purge configuration."},
    {"level": 1, "text": "Enterprise scale: Fortune 500 patterns, security, global rollouts; vulnerabilities include job board coverage via partners, mobile recruiter catch-up, and scheduling activation coverage."},
], notes="• Tie messaging to honest gap list on channels and boards.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-003.md"))

slides.append(section("0 5", "PESTEL"))

slides += [
pestel_slide("Political", [
    "Four labour codes including Industrial Relations Code 2020 commenced Union-wide 21 November 2025 per Mondaq legal summaries; dispute and strike rules consolidated for covered plants.",
    "Social Security Code 2020 frames gig and platform workers and aggregator obligations; talent models must span FT, contract, and platform patterns (India Briefing; PIB).",
    "Digital India keeps UID-linked rails politically sensitive; mishandled identity data creates regulatory and reputational risk for employers and vendors.",
], "Ship auditable hire-to-onboard steps, flexible worker types, and voluntary DPDP-aligned identity flows without coercive Aadhaar rails.",
"• Anchor on November 2025 labour code commencement reporting.\n\nReferences:\n• https://www.mondaq.com/india/employee-rights-labour-relations/1710882/central-government-notifies-commencement-of-all-four-labour-codes-effective-21-november-2025"),

pestel_slide("Economic", [
    "FY26 GDP growth narratives near 7.2–7.3% in Indian press citing IMF and World Bank support hiring intent despite global uncertainty (Economic Times, early 2026).",
    "IMARC sizes India ATS near USD 0.30B (2024) toward USD 0.50B by 2033 at about 7.2% CAGR with AI and compliance drivers (IMARC 2025).",
    "IDC India public cloud commentary shows SaaS-led growth and AI platform uptake, pulling enterprise ATS replacement cycles.",
], "Win enterprise and captive India accounts with high-volume throughput, DPDP plus labour packaging, and AI activation that satisfies EU risk reviewers.",
"• Cite IMARC and IDC as directional market signals.\n\nReferences:\n• https://www.imarcgroup.com/india-applicant-tracking-system-market"),

pestel_slide("Social", [
    "DataReportal Digital 2025 India: about 806M internet users (55.3%), 491M social identities, 1.12B mobile connections, median age about 28.8 (January 2025).",
    "WhatsApp is default messaging for much of the workforce; chat-led orchestration competes with email-first enterprise defaults.",
    "Fraud and verification discourse (AuthBridge; HireRight India) shows material discrepancy rates; employers want proofing without mandatory private Aadhaar (SC 2018; 2019 amendment).",
], "Design mobile-first journeys, high concurrent volumes, and messaging-aware orchestration with duplicate resistance, verification hooks, and DPDP-transparent consent.",
"• DataReportal is primary stats anchor for digital India.\n\nReferences:\n• https://www.datareportal.com/reports/digital-2025-india"),

pestel_slide("Technological", [
    "IDC India narratives show rapid AI platform uptake alongside SaaS growth, importing global vendor roadmaps into local enterprises.",
    "IMARC ATS page ties mobile cloud momentum to analytics competition; LinkedIn stats cited there show recruiters see AI speeding hiring.",
    "India stack spans voluntary Aadhaar, offline verification post-2019, PAN and mobile IDs for BGV; boards stay partner-led per Broadbean-first strategy.",
], "Activate AI matching and scheduling with India disclosure; deepen BGV, assessment, and board partners; avoid mandatory Aadhaar product paths.",
"• Reference UIDAI amendment landing for legal framing on voluntary use.\n\nReferences:\n• https://uidai.gov.in/en/about-uidai/legal-framework/12066-amendment-act-2019.html"),

pestel_slide("Environmental", [
    "No recruiting-specific environmental product law; pressure is indirect via SEBI BRSR and ESG disclosures tied to workforce metrics.",
    "BRSR drives gender, training, and human-capital metrics that depend on hiring and mobility data quality.",
    "DATA GAP: weak public link from green-skills hiring to ATS features in India this scan; still feed accurate diversity reporting for listed employers.",
], "Keep environmental secondary for recruiting SKUs but surface hiring-sourced diversity and human-capital metrics; monitor BRSR for future climate skills disclosure.",
"• Position as reporting enabler not climate feature build.\n\nReferences:\n• https://www.bseindia.com/ (listing ecosystem for BRSR examples)"),

pestel_slide("Legal", [
    "Puttaswamy (2017) anchored privacy as a fundamental right ahead of DPDP Act 2023 and Data Protection Board enforcement.",
    "DPDP Rules 2025 summaries show phased duties into 2026–2027 for consent detail, security, and consent managers; confirm dates in legal packs.",
    "Section 33 penalty bands cite large rupee caps; Aadhaar stays voluntary for private recruiting per SC 2018 and 2019 amendment; GDPR Chapter V and EU AI Act still bind EU-affected processing.",
], "Ship DPDP-ready notice, consent, rights, retention, and breach playbooks on phased dates; optional Aadhaar via partners; keep GDPR and AI governance for multinational tenants.",
"• Disclaimer: research not legal advice.\n\nReferences:\n• https://gdpr-info.eu/\n• https://www.uidai.gov.in/en/legal-framework/aadhaar-act.html"),
]

slides.append(section("0 6", "Competitive landscape"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive Landscape - Regional Specialists"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["Keka", "INR tiers; 15+ channel multipost; six regional languages on app; SpringVerify BGV guides", "Narrower global enterprise depth vs suite vendors", "Mid-market and high-volume India", "RFP benchmark on local boards"],
            ["Darwinbox", "AI and Microsoft fabric; DPDP landing pages; enterprise HRMS bundle", "Security diligence varies by buyer", "India enterprise time-to-value", "Omnichannel marketing pressure"],
            ["Zoho Recruit", "Twilio SMS; Marketplace WhatsApp; Zia mobile; TCO bundle", "Enterprise RFP depth vs global HCM", "SMB and self-serve India", "Marketplace Aadhaar or PAN style apps"],
            ["PeopleStrong / greytHR", "Omnichannel stats; payroll adjacency; Zwayam Amplify Naukri-class lists", "Global template comparisons", "Bundled HRMS India", "Campus and volume editorial"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Ground in in-competitive-matrix.md v1.9.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Competitive Landscape - Global Platforms"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["SAP SuccessFactors", "SmartRecruiters embedded narrative Mar 2026; incumbency", "Innovation perception vs best-of-breed ATS", "MNC India RFP staple", "AI story tightens"],
            ["Oracle Fusion", "Agentic and Recruiting Booster press; ERP footprint", "Cost and complexity", "Large India enterprise", "Mar 2026 India announcements"],
            ["iCIMS", "Frontline AI Spring 2026; SMS and web flows", "Suite adjacency vs Workday HCM", "BPO high-volume", "Omnichannel bar"],
            ["Workable", "Naukri partner integration; SMB UX", "Limited India suite depth", "Board posting UX benchmark", "Contrast with multiposter workaround"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Align to scan headlines.\n\nReferences:\n• research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-003.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive SWOT - Workday in India"}},
    "tables": [{
        "rows": [
            ["Strengths", "Weaknesses"],
            ["Suite hire-to-retire coherence; native BGV business process and connectors; UDMF; DPDP-style consent, retention, purge; Hindi; bulk grid; baseline matching", "True gaps: native +91 SMS; native WhatsApp in core UI; native UIDAI Aadhaar eKYC; OOTB Naukri-class multipost; mobile recruiter partial parity; advanced semantic AI SKU-bound"],
            ["Opportunities", "Threats"],
            ["India eight-customer row; DPDP phased readiness as trust differentiator; campus rebound; partner-led boards and CPaaS runbooks; MNC dual-stack GDPR and AI Act story", "Local suite TCO; SAP and Oracle AI press; DPDP penalties; RFP loss if channels or Aadhaar overclaimed; fraud discourse raising KYC bar"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.0,
        "width_inches": 9.3,
        "font_size_pt": 9,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Single four-quadrant table; semicolon-separated cells.\n\nReferences:\n• research/India/swot-analysis-India-2026-04-01-INDIA-PMF-003.md",
})

slides.append(section("0 7", "Win / Loss"))

slides.append(title_only("Win/Loss Analysis", [
    {"level": 1, "text": "No presales win-loss gap export was available for this India research cycle; severity-weighted CRM extracts were not ingested."},
    {"level": 1, "text": "Gap prioritisation therefore relies on customer interviews (P1–P5), internal SMEs (SME1–SME5), competitive matrix true-gap rows, ideation capability scores, and strategy context."},
    {"level": 1, "text": "When exports resume, add standard gap-theme, chart, and proxy slides to align loss reasons with investment cases."},
], notes="• Transparent data boundary; avoid fabricating presales stats.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append(section("0 8", "Ideation hub"))

slides.append(title_only("Ideation Hub - Overview", [
    {"level": 1, "text": "P&T Idea Results Dashboard export 30 March 2026: over 10k Talent Acquisition-filtered ideas; aggregate sentiment modestly negative on export gauge."},
    {"level": 1, "text": "Verbatim grid is a limited sample; quantitative voice uses capability volume, sentiment, and effort from Product Capability Volume sheet."},
    {"level": 1, "text": "No India-only rows found in this snapshot; ideation amplifies interview themes rather than replacing India-specific quotes."},
], alt=True, font=12, notes="• Exact N and gauge value in markdown source.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub - Top Capability Volumes"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms / Notifications", "Job Requisitions", "Apply Flow", "Candidates", "Offers"],
        "series": [{"name": "Idea volume", "values": [1464, 1407, 1405, 1220, 926]}],
        "title": "TA-filtered ideas by capability (approx. volume)",
        "left_inches": 0.5,
        "top_inches": 1.35,
        "width_inches": 9.0,
        "height_inches": 3.2,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "text_boxes": [{
        "left_inches": 0.7,
        "top_inches": 4.75,
        "width_inches": 8.6,
        "height_inches": 0.75,
        "font_name": "Archivo",
        "font_size_pt": 11,
        "color": "ink",
        "paragraphs": [
            {"level": 1, "text": "Communications and Offers sit in the highest pain cluster by sentiment and workaround effort alongside Candidates and Prospects."},
            {"level": 1, "text": "Mass Action Capabilities shows relatively less negative sentiment, aligning with bulk-investment tractability in interviews."},
        ],
    }],
    "speaker_notes": "• Values from 106 theme validation matrix.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md",
})

slides.append(title_only("Ideation Hub: Key Themes", [
    {"level": 0, "text": [{"text": "Apply, attachments, screening", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Block unsupported resume types at apply when they break grading; matches India parser hygiene pain."},
    {"level": 1, "text": "Multi-location posting needs validation that stays reportable for controllers."},
    {"level": 0, "text": [{"text": "Recruiter experience", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Candidate notes on grids and bundled exports cut compare friction at volume."},
], alt=True, font=11, notes="• Quotes paraphrased from 106 sample; cite full text in appendix.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md"))

slides.append(section("0 9", "Primary research"))

slides.append(title_only("Internal SME Interviews - Experts", [
    {"level": 1, "text": "Five Workday experts spanning product leadership, strategic customer engagement at scale, India enterprise architecture, field readiness, and global services implementations (November 2024–July 2025 notes)."},
    {"level": 1, "text": "Purpose: triangulate implementation reality, fraud and volume patterns, BGC depth, consent models, and channel norms before customer readout."},
    {"level": 1, "text": "Internal views supplement; they do not replace Teleperformance India customer evidence on the same themes."},
    {"level": 1, "text": "Labels SME1–SME5 are used on slides; names appear only in presenter notes for internal audiences."},
], notes="• Internal-only attribution in notes: Bernie; David Phillips; David Lodola; Fabiola Navarro; Santosh Gulia.\n\nReferences:\n• research/India/105-sme-research-findings.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "SME Interview Participants"}},
    "tables": [{
        "rows": [
            ["SME ID", "Role", "Context"],
            ["SME1", "VP, Talent Product Management", "Product leadership; India focus; KYC and fraud"],
            ["SME2", "Director, Strategic Customer Engagement", "Accenture-scale India patterns"],
            ["SME3", "Enterprise Architect, India Services", "Genpact; PSA and BGC depth"],
            ["SME4", "Sr. Product Advisor, Field Readiness", "Lowe's volume; offer and BGC"],
            ["SME5", "Sr. Functional Consultant, Global Services", "India deployments; NA scope with India"],
        ],
        "left_inches": 0.5,
        "top_inches": 1.2,
        "width_inches": 9.0,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Map IDs to names offline.\n\nReferences:\n• research/India/105-sme-research-findings.md",
})

sme_bullets = [
    ("SME1 - VP, Talent Product", [
        "KYC framed as banking-grade trust; resume fraud discussed at very large monthly volumes with named large-account examples.",
        "High-volume hiring is central; FY27 India focus, address localisations, and regulations raised alongside ecosystem partners.",
        "BrightHire noted as upcoming interview and skills partner path versus net-new verification builds.",
        "Hypothesis: bundle fraud and KYC narrative with throughput investments for India wins.",
        "Triangulation: customer interviews reinforce dedupe and agency economics at Teleperformance India scale.",
    ]),
    ("SME2 - Director, Strategic CE", [
        "Structured gaps: do-not-hire list auto-disposition; mass application purge; merge limited to two records versus hundreds of thousands of duplicates.",
        "Fraud and application trickery at scale; interview-stage ID validation demand distinct from BGV vendor flows.",
        "Roughly half of India applications may sit outside Workday for internal compliance reasons; needs clarification per account.",
        "Market characterised as competitive; India sometimes deprioritised in roadmaps, increasing administrative load.",
        "AI raised as lever for volume behaviours and detection at enterprise scale.",
    ]),
    ("SME3 - Enterprise Architect", [
        "Mass hiring waves with too many clicks; cohort same-day starts; worksheets adoption gaps for these flows.",
        "Impersonation risk drives identity verification demand; native BGC seen as light versus middleware; upfront capture to avoid double entry.",
        "Career site changes to name, address, and phone tracked weakly; security and compliance exposure.",
        "High offer-accept to no-show; high-touch messaging purchased; about sixty percent internal fills via resource managers.",
        "Extend and PSA bridges; HiredScore internal rotation gaps noted for services firms.",
    ]),
    ("SME4 - Field Readiness Advisor", [
        "India offer compensation is repeatedly heavy: complex tables, calculated fields, two documents to candidates.",
        "Start-date churn conflicts with auto-complete hire; Extend-based correction flows used.",
        "India BGC gating can be more flexible than US forward movement; parallel drug and background with integration timing issues.",
        "Customers want easy BGC reinitiate; complex business process rules when vendor signals lag.",
        "Many attachments across ID, photo, and passport; tension on what must live inside Workday.",
    ]),
    ("SME5 - Global Services FC", [
        "Variable BGC documents across stages; review-document steps poor fit for attach-only needs; candidate attachment hub demand.",
        "Marketing opt-in email starves reach at volume; opt-out with unsubscribe and regional configurability suggested.",
        "WhatsApp dominant; links for scheduling; Paradox acknowledged; chatbot status ideas.",
        "Large India hiring scale with fake interviewee risk; ID proof before interview patterns.",
        "OTP and government ID flows must be reliable; custom integrations often vendor-dependent.",
    ]),
]

for i, (stitle, blist) in enumerate(sme_bullets):
    paras = [{"level": 1, "text": b} for b in blist]
    slides.append(title_only(stitle, paras, alt=(i % 2 == 1), font=11, notes="• Presenter: see 105 SME file for name mapping and quotes.\n\nReferences:\n• research/India/105-sme-research-findings.md"))

slides.append(title_only("1:1 Customer Interviews - Enterprise", [
    {"level": 1, "text": "Five recruiters across Teleperformance India high-volume frontline and specialist or confidential programmes (December 2025 sessions)."},
    {"level": 1, "text": "Anonymised as P1–P5 with employer retained for enterprise credibility; quotes paraphrased lightly for readability in 105 findings."},
    {"level": 1, "text": "Coverage spans agency intake, seasonal ramps, req governance, reporting outside Workday, and leadership KYC policy."},
    {"level": 1, "text": "One slide per participant follows with quote-led bullets and jobs-to-be-done framing."},
], alt=True, font=12, notes="• Respect anonymisation on all customer-visible assets.\n\nReferences:\n• research/India/105-user-research-findings.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Customer Interview Participants"}},
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Recruitment lead, agent hiring", "Teleperformance India"],
            ["P2", "Senior manager, frontline recruiting", "Teleperformance India"],
            ["P3", "Recruitment manager, specialised team", "Teleperformance India"],
            ["P4", "Recruitment manager, reqs and onboarding", "Teleperformance India"],
            ["P5", "Recruitment manager, leadership / confidential", "Teleperformance India"],
        ],
        "left_inches": 0.5,
        "top_inches": 1.2,
        "width_inches": 9.0,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Teleperformance retained by research standard.\n\nReferences:\n• research/India/105-user-research-findings.md",
})

cust = [
    ("P1 - Rec Lead, Teleperformance", [
        "Manual duplicate checks on referral, vendor, and social intake; risk when recruiters skip steps at India scale.",
        "Vendor upload approval clashes with rehire rules; cannot remove checkbox without blocking legitimate re-applications.",
        "Supervisory organisation choice for mass reqs reflects business clarity gaps; framed as process plus product coordination.",
        "JTBD: protect agency economics and source integrity without a dedicated all-day duplicate role.",
    ]),
    ("P2 - Sr Mgr, Teleperformance", [
        "Peak-season ID and provisioning delays hurt onboarding; candidates wait on Workday fixes; business days lost.",
        "Thousands of agency profiles daily; one recruiter can spend entire days on duplicate checks; strong automation ask.",
        "Government ID collected at apply but not driving dedupe; Aadhaar called out as desired matching signal.",
        "Saturday maintenance windows clash with India six-day week; material productivity cost at stated scale.",
    ]),
    ("P3 - Rec Mgr, Teleperformance", [
        "Requisitions and approvals run email-first with manual codes; friction on cost centre and legal entity fields.",
        "Recruiters absorb master data complexity hiring managers should own; back-and-forth on wrong LOB.",
        "Referral lookup scattered; name collisions force manual disambiguation across records.",
        "JTBD: in-system accurate reqs so time goes to candidates not email archaeology.",
    ]),
    ("P4 - Rec Mgr, Teleperformance", [
        "Leadership reporting and SLA aging live in Excel and Thrive; Workday not trusted as single pane for req health.",
        "Wants hiring manager approvals inside Workday before offers; compensation approval in one place.",
        "Seven-hundred-applicant queues with per-profile open workflow; asks mandatory resume and knock-out questions.",
        "Cannot parse or bulk upload from Naukri or LinkedIn; career site shows many non-open reqs for link generation.",
    ]),
    ("P5 - Rec Mgr, Teleperformance", [
        "Three government IDs required before offer but UX allows partial progress; policies consume visibility; recruiter chase.",
        "Aadhaar OTP failures drive tickets; candidates drop from long repeat steps; specialised join rate about eighty-two percent.",
        "Thousands of generic tasks; no targeted mail on offer accepted; DocuSign not integrated; screenshot audit burden.",
        "Email preferred over SMS or WhatsApp for compliance-sensitive offer communications; contrasts with messaging roadmap elsewhere.",
    ]),
]

for i, (ctitle, cblist) in enumerate(cust):
    paras = [{"level": 1, "text": b} for b in cblist]
    slides.append(title_only(ctitle, paras, alt=(i % 2 == 0), font=11, notes="• Use verbatim quotes from 105 file in presenter script.\n\nReferences:\n• research/India/105-user-research-findings.md"))

slides.append(section("1 0", "Thematic analysis"))

slides.append(title_only("Validated Themes 1-2", [
    {"level": 0, "text": [{"text": "KYC: identity, dedupe, integrity", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "SME and customer convergence on fraud and agency economics; IDs collected but not always in match rules."},
    {"level": 1, "text": "Steer: configurable matching with consented identifiers and DPDP guardrails."},
    {"level": 0, "text": [{"text": "HVH: mass intake", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Agency-scale uploads and manual review; P4 seven-hundred-applicant queues without gates."},
    {"level": 1, "text": "Steer: bulk duplicate rules plus activated screening with clear SKU story."},
], font=11, notes="• Three bullets per theme pattern.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append(title_only("Validated Themes 3-4", [
    {"level": 0, "text": [{"text": "Offer, BGC, compliance", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "P5 three-ID policy versus UX leak; OTP friction; SMEs want reinitiate and vendor status legibility."},
    {"level": 1, "text": "Steer: BGC reinitiate, mandatory field UX, governed offer changes."},
    {"level": 0, "text": [{"text": "Comms and consent", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Opt-in clashes with India volume; P5 prefers email evidence; tasks hide milestones."},
    {"level": 1, "text": "Steer: region-aware consent with legal review; contextual milestone alerts."},
], alt=True, font=11, notes="• Flag channel strategy tension explicitly.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append(title_only("Validated Theme 5", [
    {"level": 0, "text": [{"text": "Workflows and analytics", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Email-first reqs, Thrive and Excel SLAs, parse friction from Naukri or LinkedIn."},
    {"level": 1, "text": "Steer: in-product approvals, req aging reports, Broadbean validation per deal; Studio only if partner gap."},
], notes="• Align to product context on boards.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": [
            ["Theme", "SME", "P1–P5", "Ideation", "Convergence"],
            ["KYC / dedupe", "Strong", "Strong", "Apply flow; Candidates", "High"],
            ["HVH / bulk", "Strong", "Strong", "Mass actions", "High"],
            ["Offer / BGC", "Strong", "Strong (P4–P5)", "Offers", "High"],
            ["Comms / consent", "Med (SME5)", "Med (P5)", "Communications", "Moderate"],
            ["Workflows / analytics", "Med", "Med (P3–P4)", "Job reqs", "Moderate"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.05,
        "width_inches": 9.3,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Matrix from thematic report Phase 4.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md",
})

slides.append(section("1 1", "Full funnel"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Gap Analysis"}},
    "tables": [{
        "rows": [
            ["Funnel stage", "Validated gap", "Evidence", "Product response"],
            ["Attract / post", "Naukri-class native multipost", "Matrix true gap; P4 parse friction", "Broadbean validation; Studio if needed"],
            ["Apply / intake", "Dedupe and source integrity", "P1–P2; SME2 scale", "UDMF rules; bulk automation"],
            ["Screen / assess", "Attachment types vs screening", "106 sample; parser pain", "HiredScore gating; hygiene"],
            ["Offer / BGC", "Mandatory ID UX; reinitiate", "P5; SME4–5", "BGC UX; vendor status"],
            ["Close / notify", "Milestone alerts", "P5 tasks", "Contextual notifications"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.05,
        "width_inches": 9.3,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Funnel labels are illustrative; tailor per account.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md",
})

slides.append(section("1 2", "Roadmap"))

recs = [
    ("Recommendation 1: BGC reinitiate and status", [
        "Problem: recruiters forward bespoke integration emails when vendor timing breaks business process rules.",
        "Evidence: P5 escalation patterns; SME4 parallel checks and integration forwards.",
        "Recommendation: productise guided BGC reinitiate with latest vendor status on candidate and application.",
        "Why now: Priority 3 parity and India KYC; RICE score about 1800; reach about 4000 per quarter; effort 4 pm.",
        "Success metric: time to hire on BGC-hold candidates in India high-volume cohorts.",
    ]),
    ("Recommendation 2: Apply intake gating", [
        "Problem: hundreds of unqualified applications per req when resumes and knock-outs are optional.",
        "Evidence: P4 seven-hundred-applicant review; ideation career site friction.",
        "Recommendation: job application template controls for required resume and knock-out questions.",
        "Why now: Priority 3 ATS parity; RICE about 1772; reach about 4500; effort 4 pm.",
        "Success metric: qualified apply rate or applications reviewed per req per week.",
    ]),
    ("Recommendation 3: Milestone notifications", [
        "Problem: thousands of generic tasks hide offer accepted and comparable milestones.",
        "Evidence: P5 manual follow-up; leadership compliance needs auditable comms.",
        "Recommendation: contextual recruiter alerts for offer accepted and key milestones.",
        "Why now: NPS at scale; RICE about 1688; reach about 5000; effort 5 pm.",
        "Success metric: lag from offer accept to hire complete; fewer missed SLAs.",
    ]),
    ("Recommendation 4: Mandatory government ID UX", [
        "Problem: policy requires PAN, Aadhaar, UAN before offer but UX allows partial progress.",
        "Evidence: P5 three-ID policy versus field consumption; OTP failures.",
        "Recommendation: align steps so mandated IDs are truly required with re-editable capture and clear errors.",
        "Why now: India scale row plus DPDP; RICE about 1575; reach about 3500; legal review on Aadhaar framing.",
        "Success metric: completion rate on offer-stage ID steps; fewer recruiter tickets.",
    ]),
    ("Recommendation 5: Bulk duplicate automation", [
        "Problem: per-upload manual checks consume full recruiter days at agency scale.",
        "Evidence: P1 vendor checkbox; P2 thousands of profiles per day narrative.",
        "Recommendation: bulk actions and rules for agency-sourced duplicates and disposition.",
        "Why now: high-volume hiring plus Priority 3 bulk; RICE about 1467; reach about 4000; effort 6 pm.",
        "Success metric: recruiter hours per hire on agency channel.",
    ]),
]

for i, (rtitle, rparas) in enumerate(recs):
    paras = [{"level": 1, "text": t} for t in rparas]
    slides.append(title_only(rtitle, paras, alt=(i % 2 == 1), font=11, notes="• Expand with legal flags on Aadhaar where noted.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Roadmap Summary - All Recommendations"}},
    "tables": [{
        "rows": [
            ["#", "Title", "RICE", "Effort"],
            ["1", "BGC reinitiate and vendor status", "1800", "4 pm"],
            ["2", "Apply intake gating", "1772", "4 pm"],
            ["3", "Milestone notifications", "1688", "5 pm"],
            ["4", "Mandatory government ID UX", "1575", "5 pm"],
            ["5", "Bulk duplicate automation", "1467", "6 pm"],
            ["6", "HiredScore attachment gating", "1458", "3 pm"],
            ["7", "UDMF government-ID matching", "1417", "9 pm"],
            ["8", "Region-aware marketing consent", "1350", "8 pm"],
            ["9", "Req SLA reports", "788", "8 pm"],
            ["10", "Candidate attachment hub", "650", "10 pm"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.05,
        "width_inches": 9.3,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Full fifteen-row table lives in markdown report; slide shows top ten for readability.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Bumper Slide",
})

out = str(SLIDE_SPECS_DIR / "slides_spec_v85.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(slides)} slides to {out}")
