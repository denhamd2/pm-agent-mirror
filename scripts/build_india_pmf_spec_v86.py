#!/usr/bin/env python3
"""Generate slides_spec_v86.json for India INDIA-PMF-004 PMF roadmap deck."""
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
    paras = [{"level": 1, "text": b} for b in bullets]
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

slides.append(section("0 1", "Executive summary"))

slides.append(title_only("Executive Summary", [
    {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "India wins on trust plus throughput: lawful identity and dedupe, offer and BGC choreography, and manual gates that consume roles when Teleperformance India (P1–P5) and five internal SMEs see ambiguity at extreme volume."},
    {"level": 1, "text": "DPDP, non-Aadhaar-first private hiring after the 2018 Section 57 limits, plus EU GDPR and AI Act rails, shape matching, screening, and notices for multinational tenants hosting India pipelines."},
    {"level": 1, "text": "Competitive scan shows true gaps on +91 SMS, WhatsApp in core UI, Naukri-class native multipost, and UIDAI eKYC; native strengths are UDMF, bulk grid, Hindi, consent or retention levers, and BGV business process plus Core Connector patterns."},
], notes="• Stress lawful identifiers versus customer language on Aadhaar matching.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append(title_only("Executive Summary (cont.)", [
    {"level": 0, "text": [{"text": "Strategic direction", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Priority moves: lawful identifier-aware dedupe and agency source rules; first-class BGC orchestration; governed HiredScore activation for high-volume tenants; India-safe offer lifecycle; deeper DNH, purge, and merge automation."},
    {"level": 1, "text": "Sequence channel investments with honest partner maps on boards and messaging until native parity closes RFP gaps without over-claiming government eKYC that private employers cannot mandate."},
    {"level": 1, "text": "Customer ideation quant (global TA filter) corroborates hardest pain in Communications, Offers, Candidates, and Job Requisitions, aligning with Teleperformance India interviews despite sparse India-named strings in the export."},
], alt=True, font=14, notes="• Part two keeps executive synthesis within density limits.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append(section("0 2", "Research challenge"))

slides.append(title_only("Research Question and Objectives", [
    {"level": 1, "text": "How should Workday Recruiting win India enterprise and high-volume programmes on trust, compliance, and recruiter throughput while staying honest on channels and boards?"},
    {"level": 1, "text": "Objectives: validate identity and dedupe economics, offer and BGC friction, governance off-platform, channel reality, and observability versus suite strengths and configurable privacy levers."},
    {"level": 1, "text": "Evidence: strategy context, PESTEL, SWOT, India competitive matrix and scan, SMEs (SME1–SME5), customers (P1–P5), global ideation quant (about ten thousand TA-filtered ideas), thematic synthesis with cross-source matrix."},
], alt=True, font=12, notes="• Avoid claiming presales row counts.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-004.md"))

slides.append(title_only("Research Scope and Win-Loss Data", [
    {"level": 1, "text": "Scope is India-hosted recruiting journeys for enterprise and BPO-scale programmes with Know Your Candidate and high-volume lenses from April 2026 strategy context."},
    {"level": 1, "text": "Tableau presales gap export was not available for this cycle; Win/Loss uses triangulated substitutes from competitive true-gap rows, ideation capability volumes, and Teleperformance India interviews instead of CRM severity scores."},
    {"level": 1, "text": "Full thematic write-up, PESTEL, SWOT, and eleven ranked roadmap rows live in the April 2026 India analysis markdown for detail beyond this deck."},
], notes="• Transparent boundary for leadership.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append(section("0 3", "Context review"))

slides.append(title_only("Strategic Context - Why India Now", [
    {"level": 1, "text": "India is a named Q2 scale-growth row: eight customer wins, DPDP-led compliance programmes, and local job boards through certified partner distribution rather than native board builds (strategy context, April 2026)."},
    {"level": 1, "text": "Corporate Priority 1 remains GCC readiness; India work must still clear the same bar on privacy rigour and honest channel maps without assuming GCC-only resourcing."},
    {"level": 1, "text": "Know Your Candidate and high-volume hiring are explicit mission lenses; buyers pair India growth with GDPR, EU AI Act, and DPDP diligence on consent, transfers, and automated shortlisting."},
], notes="• India row first for this deck audience.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-004.md"))

slides.append(title_only("India Market Momentum - Key Indicators", [
    {"level": 1, "text": "IMARC sizes India HR technology at approximately USD 1,210 million in 2025 toward USD 2,440 million by 2034 at 7.71% CAGR (2026–2034), citing ATS, social recruiting, cloud, AI, and mobile drivers (January 2026)."},
    {"level": 1, "text": "GCC and IT services narratives cite lakhs of annual job creation and fresher intake recovery, reinforcing campaign-style throughput as the norm for enterprise talent acquisition (trade press 2025–2026)."},
    {"level": 1, "text": "DataReportal Digital 2026 India reports about 1.03 billion internet users (70.0% penetration), 1.06 billion mobile connections (72.5% of population), and 170 million LinkedIn members, anchoring mobile-first candidate journeys (October 2025 data)."},
], alt=True, font=12, notes="• Figures are directional; reconcile definitions in-room.\n\nReferences:\n• research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-004.md"))

slides.append(section("0 4", "Product strategy"))

slides.append(title_only("Q2 2026 Product Priorities", [
    {"level": 1, "text": "India first: medium regional priority with eight Q2 wins, DPDP programmes, and local boards via Broadbean-class partners per April 2026 strategy context (no native board builds)."},
    {"level": 1, "text": "Priority 2 AI matching: activate HiredScore for high-volume tenants with human review, logging, and explainability for EU AI Act and DPDP significant-fiduciary narratives when applicable."},
    {"level": 1, "text": "Priority 3 core ATS parity plus GCC Priority 1 pattern: bulk actions, mobile recruiter, BGV integrations, Paradox where licensed; India matches proof on consent, retention, and partner-led boards."},
], notes="• Map each bullet to OKRs in quarterly markdown when challenged.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-004.md"))

slides.append(title_only("Regional Expansion Strategy", [
    {"level": 1, "text": "India: medium priority; eight customers; DPDP; local job boards; scale-growth narrative for this readout."},
    {"level": 1, "text": "GCC: high priority; ten wins; WhatsApp and SMS; nationalisation; Arabic RTL; boards via Broadbean-class partners."},
    {"level": 1, "text": "Japan: medium; five expansions; two-step offer; APPI; LINE."},
    {"level": 1, "text": "Australia: medium; three expansions; Fair Work; SEEK via Broadbean."},
], alt=True, font=12, notes="• Focal region appears first for non-GCC regional decks per style guide.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-004.md"))

slides.append(title_only("Competitive Positioning - Differentiation", [
    {"level": 1, "text": "Suite depth: HCM, Recruiting, Talent, and Learning on one record versus point ATS or payroll-first bundles."},
    {"level": 1, "text": "AI-powered: HiredScore and Paradox when activated versus manual high-volume screening and scheduling."},
    {"level": 1, "text": "Compliance-first: GDPR, EU AI Act, and global privacy posture with DPDP-ready consent, retention, purge, and audit trails."},
    {"level": 1, "text": "Vulnerabilities: niche board coverage via partners, mobile recruiter catch-up, scheduling activation not universal; message honestly on native SMS, WhatsApp, Naukri UX, and Aadhaar eKYC gaps."},
], notes="• Tie to SWOT and matrix true-gap rows.\n\nReferences:\n• research/India/strategy-context-2026-04-01-INDIA-PMF-004.md"))

slides.append(section("0 5", "PESTEL"))

slides += [
    pestel_slide("Political", [
        "Labour law consolidation toward four codes with phased 2026 commentary reshapes contracts, fixed-term parity, and social security expectations buyers must mirror from hire to HCM (Bar and Bench 2026; labour.gov.in IRC 2020).",
        "Code on Social Security 2020 and gig narratives (DD News; IANS) widen non-traditional employment types sourcing and onboarding must cover beside permanent hires.",
        "PLI press late 2025 cites Rs 2.16 lakh crore investment and about 14.39 lakh jobs, sustaining bulk hiring; MeitY sovereign cloud talk raises in-country hosting expectations (PIB; TechCircle 2026).",
    ],
        "Treat India as policy-active: flexible hiring metadata into HCM transitions, throughput for PLI and GCC-style ramps, India hosting options where sovereignty influences RFPs, without one-size employment categories.",
        "• Cite labour.gov.in for statutory anchors.\n\nReferences:\n• https://labour.gov.in/acts/industrial-relations-code-2020-31-dec-2020\n• research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-004.md"),

    pestel_slide("Economic", [
        "IMARC sizes India HR technology near USD 1,210M (2025) toward USD 2,440M (2034) at 7.71% CAGR; ATS, social recruiting, cloud, AI, and mobile are named growth drivers (January 2026).",
        "IT fresher and GCC hiring press (SightsInPlus; GCC RISE) frames sustained enterprise throughput rather than episodic hiring, supporting capital allocation to scale tooling.",
        "Workday AWS India data centre and team expansion messaging signals vendor commitment and placement flexibility that matters in data-residency conversations (newsroom July 2025).",
    ],
        "Scale justifies India-first throughput: queue-safe bulk actions, identity-aware dedupe, operational analytics; local hosting supports deals where residency gates contracts.",
        "• IMARC anchors sizing.\n\nReferences:\n• https://www.imarcgroup.com/human-resource-technology-market-india"),

    pestel_slide("Social", [
        "DataReportal Digital 2026 India: about 1.03B internet users (70.0%), 1.06B mobile connections (72.5%), 500M social identities; mobile-first apply and messaging are baseline (October 2025).",
        "About 170M LinkedIn members in India per ad tools in the same report; consumer platforms fragment while the professional graph stays concentrated for sourcing.",
        "WhatsApp is default business messaging in practice literature; open-rate comparisons to email should be framed as directional vendor guidance, not official statistics.",
    ],
        "Design mobile-first apply, SMS and WhatsApp-class partner channels for scheduling, LinkedIn-heavy sourcing, templated local comms, and explicit first-contact consent.",
        "• Pair channels with DPDP consent.\n\nReferences:\n• https://www.datareportal.com/reports/digital-2026-india"),

    pestel_slide("Technological", [
        "Deloitte India March 2026: ~40% Indian respondents report significant or full AI usage versus ~28% global; product, strategy, ops, and marketing lead at-scale adoption.",
        "~68% prioritise security and compliance for AI scale; ~39% cite regulatory integration as top challenge versus speed-only narratives.",
        "ICRIER-linked press (Feb 2026) notes AI shifting junior hiring while hybrid skills rise; DC and sovereign AI infra stories support in-country latency expectations.",
    ],
        "Activate HiredScore and scheduling where demanded; pair with audit logs, human review, explainable workflows, and DPDP notices for automated shortlisting under fiduciary scrutiny.",
        "• Deloitte press primary anchor.\n\nReferences:\n• https://www.deloitte.com/in/en/about/press-room/indian-enterprises-lead-global-peers-in-at-scale-ai-adoption-across-most-functions.html"),

    pestel_slide("Environmental", [
        "No recruiting-specific environmental statute; listed employers still face SEBI BRSR workforce and inclusion disclosure pressure that hiring metrics can support (filing season 2025).",
        "BRSR nudges reportable diversity metrics upstream from payroll; green-jobs press shifts sector skill mixes more than it forces ATS compliance features today.",
        "DATA GAP: weak authoritative link from environmental regulation to recruiting SKU scope; treat sustainability modules as watch-list, not a FY27 ATS build priority.",
    ],
        "Stay secondary on environmental SKUs; enable diversity metrics from hiring into BRSR narratives; monitor green-skills taxonomies for packs not heavy sustainability builds.",
        "• Reporting enabler positioning.\n\nReferences:\n• research/India/pestel-analysis-India-2026-04-01-INDIA-PMF-004.md"),

    pestel_slide("Legal", [
        "DPDP Act 2023: fiduciaries and principals, consent and duties, breach notification, Board enforcement; Rules 2025 cover notices, children, grievances, transfers (Mondaq summaries).",
        "Rule 15 cross-border commentary often cites May 2027 planning horizon; confirm dates with counsel before commitments.",
        "SC 2018 kept Aadhaar core but struck Section 57 for private mandatory use; EU GDPR and AI Act Annex III still bind multinationals on transfers, DPIAs, and high-risk hiring AI.",
    ],
        "Ship granular consent and notices, processor governance, retention and deletion for DPDP, lawful non-Aadhaar-first identity; preserve GDPR rights tooling and human oversight for EU-affected processing.",
        "• Not legal advice.\n\nReferences:\n• https://www.mondaq.com/india/privacy-protection/1406850/the-digital-personal-data-protection-act-2023-key-implications-for-employers\n• https://gdpr-info.eu/"),
]

slides.append(section("0 6", "Competitive landscape"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive Landscape - Regional Specialists"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["Darwinbox", "AI and fabric narratives; DPDP landing pages; enterprise HRMS bundle", "Security diligence varies by buyer", "India enterprise velocity", "Omnichannel marketing pressure"],
            ["Keka", "INR packaging; multipost channels; mobile app languages; SpringVerify-style BGV guides", "Narrower global enterprise depth", "Mid-market India", "Local board expectations"],
            ["Zoho Recruit", "Twilio SMS; Marketplace WhatsApp; Zia mobile; TCO bundle", "Enterprise RFP depth vs global HCM", "SMB and self-serve India", "Marketplace identity apps"],
            ["greytHR / PeopleStrong", "Payroll adjacency; omnichannel stats; campus and volume editorial", "Global template comparisons", "Bundled HRMS India", "High-volume positioning"],
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
    "speaker_notes": "• Ground in matrix v1.10 INDIA-PMF-004.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Competitive Landscape - Global Platforms"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            ["SAP SuccessFactors", "SmartRecruiters embedded narrative Mar 2026; incumbency in MNC India", "Innovation perception vs best-of-breed ATS", "Large India enterprise", "Tight AI story"],
            ["Oracle Fusion", "Agentic and Career Coach India copy; ERP footprint", "Cost and complexity", "GCC and enterprise India", "SMS and WhatsApp marketing"],
            ["iCIMS", "Frontline AI Spring 2026; SMS, WhatsApp, web flows", "Suite adjacency vs Workday HCM", "BPO high-volume India", "Omnichannel bar"],
            ["Greenhouse plus Naukri", "Productised Naukri integration; in-ATS posting UX benchmark", "Not a full HCM suite", "Board UX reference", "Contrast with multiposter workaround"],
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
    "speaker_notes": "• Align to scan dated 01 April 2026.\n\nReferences:\n• research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-004.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive SWOT - Workday in India"}},
    "tables": [{
        "rows": [
            ["Strengths", "Weaknesses"],
            ["Suite hire-to-retire coherence; native UDMF; BGV via Job Application BP plus Core Connector and Studio; configurable consent, retention, purge; Hindi; bulk grid; in-country AWS India hosting narrative", "True gaps: native +91 SMS; native WhatsApp in core Recruiting UI; native UIDAI Aadhaar eKYC; OOTB Naukri-class multipost without multipartner or Studio; mobile recruiter partial parity; advanced semantic AI behind licence boundaries"],
            ["Opportunities", "Threats"],
            ["Eight-customer India row; IMARC HR tech expansion; DPDP phased readiness as trust differentiator; HiredScore activation for high volume; partner-led boards and CPaaS runbooks", "Regional suite TCO bundles; SAP, Oracle, iCIMS 2026 AI and omnichannel press; DPDP penalties and SDF duties; fraud discourse raising KYC demo bars without lawful Aadhaar defaults"],
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
    "speaker_notes": "• Source is Step 3 SWOT file, not thematic report.\n\nReferences:\n• research/India/swot-analysis-India-2026-04-01-INDIA-PMF-004.md",
})

slides.append(section("0 7", "Win / Loss"))

slides.append(title_only("Win/Loss - Presales Data Scope", [
    {"level": 1, "text": "No Tableau presales gap export was ingested for this India cycle; severity-weighted loss themes from CRM extracts are therefore unavailable."},
    {"level": 1, "text": "The following three slides substitute structured views from competitive true-gap rows, global ideation capability volumes, and Teleperformance India interview evidence so leadership still sees a gap narrative."},
    {"level": 1, "text": "When India presales rows resume, regenerate classic theme, chart, and proxy slides to reconcile qualitative views with logged opportunity reasons."},
], notes="• Transparent boundary; do not invent CRM counts.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss - Ideation Pain Index"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms", "Job Reqs", "Apply Flow", "Candidates", "Offers", "BGC"],
        "series": [{"name": "Idea volume (TA filter)", "values": [1464, 1407, 1405, 1220, 926, 199]}],
        "title": "Global TA ideation volume by capability (approx.)",
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
            {"level": 1, "text": "About ten thousand Talent Acquisition-filtered ideas (export 30 March 2026) show Communications, Job Requisitions, Offers, and Candidates in the hardest sentiment-and-effort quadrant alongside Applications."},
            {"level": 1, "text": "India-named strings were not found in the flattened export; treat counts as global reinforcement of capability buckets that interviews already stress."},
            {"level": 1, "text": "Use this chart as a Win/Loss proxy for where product pain concentrates when presales rows are missing."},
        ],
    }],
    "speaker_notes": "• Values from 106 theme validation matrix.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss - True Gap Themes"}},
    "tables": [{
        "rows": [
            ["Gap theme", "Classification", "India buyer signal"],
            ["+91 SMS in Workday Messaging", "True gap", "RFP contrast versus Zoho, Oracle, iCIMS omnichannel copy"],
            ["WhatsApp in core Recruiting UI", "True gap", "Social norm per SMEs; compliance governance still required"],
            ["Naukri-class native multipost", "True gap", "Greenhouse plus Naukri benchmark; Broadbean or Studio workaround"],
            ["UIDAI Aadhaar eKYC native", "True gap", "Competitor marketplace narratives versus 2018 lawful posture"],
            ["UDMF and BGV framework", "Native strength", "Anchor Know Your Candidate story on lawful attributes and vendor DPAs"],
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
    "speaker_notes": "• Classifications from competitive matrix and deployment validation thread cited in thematic report.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
})

slides.append(title_only("Win/Loss - Customer Deal Patterns", [
    {"level": 1, "text": "P1 and P2: manual duplicate checks and vendor upload approval consume FTEs at thousands of profiles daily; cooling-off and first-source agency credit expectations are not fully automated in today’s configuration."},
    {"level": 1, "text": "P5: government ID and OTP fragility, partial gating, and specialised-funnel attrition tied to process length raise offer-stage risk beyond feature checklists alone."},
    {"level": 1, "text": "P3 and P4: req governance, supervisory org defaults, and SLA ageing live in email and Excel, weakening auditability even when hires complete in Workday."},
], alt=True, font=12, notes="• Quote verbatim lines from 105 file in presenter script.\n\nReferences:\n• research/India/105-user-research-findings.md"))

slides.append(section("0 8", "Ideation hub"))

slides.append(title_only("Ideation Hub - Overview", [
    {"level": 1, "text": "P&T Idea Results Dashboard export dated 30 March 2026 yields about ten thousand ideas with the Talent Acquisition linked filter on the Product Features model."},
    {"level": 1, "text": "Aggregate sentiment on the export gauge is modestly negative (about -0.163) with hard effort (about -1.23), signalling systemic workaround pain rather than isolated complaints."},
    {"level": 1, "text": "Verbatim row-level text is limited in the materialised scratch dump; quantitative voice leans on capability volume, sentiment, and effort indices from dashboard sheets."},
], alt=True, font=12, notes="• Exact N from 106 report.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub - Top Capability Volumes"}},
    "charts": [{
        "chart_type": "column",
        "categories": ["Comms", "Job Reqs", "Apply", "Candidates", "Offers", "Compliance"],
        "series": [{"name": "Volume", "values": [1464, 1407, 1405, 1220, 926, 851]}],
        "title": "TA ideas by capability (rounded volumes)",
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
            {"level": 1, "text": "Communications and Offers combine high N with very hard effort indices, mirroring Teleperformance India pain on notifications and offer documents."},
            {"level": 1, "text": "Compliance and Data Privacy sits at 851 ideas with negative sentiment, supporting DPDP-first roadmaps without claiming India-only row counts."},
            {"level": 1, "text": "Volumes are global indices; pair with India interviews for regional prioritisation, not standalone proof of India-only prevalence."},
        ],
    }],
    "speaker_notes": "• Compliance volume from theme validation matrix.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md",
})

slides.append(title_only("Ideation Hub: Key Themes", [
    {"level": 0, "text": [{"text": "Offers and compensation visibility", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Internal ideas ask for requisition-scoped compensation visibility before offer business process steps, echoing India tabular disclosure and early comp visibility pain."},
    {"level": 1, "text": "Localisation opt-in by country of work still fails early internal-candidate pay visibility needs according to long-form workaround text in the export."},
    {"level": 0, "text": [{"text": "Apply, location, and screening scale", "bold": True, "font_size_pt": 14}]},
    {"level": 1, "text": "Candidates struggle to signal intended work location at apply, complicating pay transparency and retention rules across EU, US, and Canada contexts noted in ideation strings."},
    {"level": 1, "text": "Bulk screening time-savers appear explicitly, aligning with Teleperformance India seven-hundred-applicant queues and parser accuracy asks."},
], alt=True, font=11, notes="• Quotes are global ideation, not TP verbatims.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md"))

slides.append(title_only("Ideation Hub - Data Limitations", [
    {"level": 1, "text": "String search for India, Aadhaar, and DPDP returned no hits in flattened workbook text; this export cannot claim India-specific ideation prevalence beyond interview-led themes."},
    {"level": 1, "text": "Row-level Idea Question Responses were not fully materialised in the scratch dump; use matrices and sampled long-form strings, not exhaustive verbatim mining."},
    {"level": 1, "text": "Re-export with geography metadata if India-only quant becomes a gating decision; until then ideation is global reinforcement of capability pain."},
], notes="• Prevents over-claiming India counts.\n\nReferences:\n• research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md"))

slides.append(section("0 9", "Internal SMEs"))

slides.append(title_only("Internal SME Interviews - Experts", [
    {"level": 1, "text": "Five Workday experts span product leadership, field readiness, global services, India enterprise architecture (Genpact), and strategic customer engagement (Accenture-scale) from 2024–2025 notes."},
    {"level": 1, "text": "Purpose: triangulate fraud, BGC orchestration, India offer disclosure, mass ops, WhatsApp norms, consent models, and DNH or purge automation before customer readout."},
    {"level": 1, "text": "Internal views supplement Teleperformance India; slides use SME1–SME5 labels with names only in presenter notes."},
    {"level": 1, "text": "Timing spans January 2025 through November 2024 leadership sessions; note fidelity varies from summary notes to richer transcripts per file."},
], notes="• Presenter map: SME1 Bernie; SME2 Fabiola Navarro; SME3 Santosh Gulia; SME4 David Lodola; SME5 David Phillips.\n\nReferences:\n• research/India/105-sme-research-findings.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "SME Interview Participants"}},
    "tables": [{
        "rows": [
            ["SME ID", "Role", "Context"],
            ["SME1", "VP, Talent Product Management", "Product leadership; India FY27; KYC and fraud"],
            ["SME2", "Sr. Product Advisor, Field Readiness", "Lowe’s volume; India offer and BGC"],
            ["SME3", "Sr. Functional Consultant, Global Services", "India deployments; comms and documents"],
            ["SME4", "Enterprise Architect, India Services", "Genpact talent supply chain; mass hire"],
            ["SME5", "Director, Strategic Customer Engagement", "Accenture-scale India compliance"],
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
    "speaker_notes": "• Align IDs to 105 participant table.\n\nReferences:\n• research/India/105-sme-research-findings.md",
})

sme_bullets = [
    ("SME1 - VP, Talent Product", [
        "KYC and resume fraud discussed at roughly one hundred thousand resumes per month scale with Accenture as a heavy example; banking-grade trust framing is explicit in leadership notes.",
        "FY27 India focus, address localisation, regulations, and partners including interview-intelligence ecosystem signals complement native roadmap depth.",
        "Hypothesis: identity trust is a first-class India pillar with throughput investments, not only services workarounds; P1–P2 echo duplicate urgency at Teleperformance India scale.",
        "Internal brainstorm collateral and enablement contacts were flagged for ongoing India strategy loops in source notes.",
    ]),
    ("SME2 - Field Readiness Advisor", [
        "India offers need tabular, formula-heavy compensation disclosure; two documents to candidates and change cycles track to legal expectations.",
        "Auto-complete hire can skip recruiter start-date confirmation; Extend-style fixes appear when automation conflicts with date truth.",
        "India BGC may hire before all packages complete versus US gating; parallel drug and background multiply reinitiate and integration timing issues.",
        "Customers want one-click BGC reinitiate with vendor signals consumed cleanly inside Job Application business process steps.",
    ]),
    ("SME3 - Global Services FC", [
        "BGC documents vary by stage but review-document steps misfit pre-interview attach-only needs; candidate-home attachment flexibility with job versus candidate scope recurs in implementations.",
        "Opt-in defaults starve India campaign reach at volume; region-configurable opt-out plus per-email unsubscribe are the fastest fixes in services notes.",
        "WhatsApp dominates candidate links and scheduling appetite; Paradox and broader messaging roadmap dependencies are acknowledged explicitly in services notes.",
        "Fraud at seven-lakh population-scale examples drove ID-before-interview and interviewer confirmation; chatbots for status await compliant conversational channels.",
    ]),
    ("SME4 - Enterprise Architect", [
        "Genpact used Extend to bridge professional services demand fields into recruiting when standard requisition objects lacked talent supply chain visibility end to end.",
        "Mass hire stories cite one hundred to two hundred concurrent openings with too many individual clicks; bulk offers, agreements, and approvals remain friction points.",
        "Impersonation elevates verification expectations; Tydy middleware plus custom integration appeared where native BGC felt basic versus contractual client obligations.",
        "Weak audit on career site name or phone changes undermines BGC integrity; post-offer no-show drove purchased messaging; HiredScore internal rotation visuals surfaced as limited.",
    ]),
    ("SME5 - Strategic Customer CE", [
        "Accenture-scale asks: do-not-hire, mass purge, merge beyond two duplicates, fraud detection, interview-stage ID validation.",
        "Notes cite roughly two hundred thousand duplicate context and about half of India applications potentially outside Workday; validate per account.",
        "Competitive trickery narratives push AI-assisted detection with human judgement retained; validated professional network concept signals long-term trust bets.",
        "DNH extends beyond ex-employees with analogues for Singapore government and US federal contexts in engagement notes.",
    ]),
]

for i, (stitle, blist) in enumerate(sme_bullets):
    paras = [{"level": 1, "text": b} for b in blist]
    slides.append(title_only(stitle, paras, alt=(i % 2 == 1), font=11, notes="• Detailed quotes live in internal transcript files listed in 105.\n\nReferences:\n• research/India/105-sme-research-findings.md"))

slides.append(section("1 0", "Primary research"))

slides.append(title_only("1:1 Customer Interviews - Enterprise", [
    {"level": 1, "text": "Five recruiters across Teleperformance India high-volume frontline and specialist or confidential programmes from December 2025 onsite sessions; employer name retained for credibility per research standards."},
    {"level": 1, "text": "Participants appear as P1–P5 on slides; quotes are paraphrased from Step 8 findings to balance density with fidelity for VP audiences."},
    {"level": 1, "text": "Coverage spans seasonal ramps, agency fees and intake, supervisory organisation gaps, reporting outside Workday, leadership ID policy, and notification noise at thousands of tasks."},
    {"level": 1, "text": "Following slides give one participant each with quote-led bullets and jobs-to-be-done anchors from the same research file."},
], alt=True, font=12, notes="• Anonymisation standard: P1–P5 only on slides.\n\nReferences:\n• research/India/105-user-research-findings.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Customer Interview Participants"}},
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Frontline hiring lead, North and East India", "Teleperformance India"],
            ["P2", "Recruiting manager, agent hiring", "Teleperformance India"],
            ["P3", "Recruitment manager, specialised internal team", "Teleperformance India"],
            ["P4", "Recruitment manager, reqs and onboarding", "Teleperformance India"],
            ["P5", "Leadership and confidential hiring", "Teleperformance India"],
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
    "speaker_notes": "• Segment labels from 105 table.\n\nReferences:\n• research/India/105-user-research-findings.md",
})

cust = [
    ("P1 - Hiring Lead, TP India", [
        "NTID and onboarding delays during peak July go-live cost business days; seasonal ramps (e.g. Diwali, e-commerce) amplify sensitivity to downtime and credential lag.",
        "Duplicate management must exceed first name, phone, and email; P1 wants automation using lawful government identifiers where legal models permit, not shadow processes.",
        "Offer changes after ready-for-hire for dates or pay cannot be reflected in-system; manual workarounds are legally sensitive at roughly fifteen hundred to two thousand hires per week peaks.",
    ]),
    ("P2 - Recruiting Mgr, TP India", [
        "Every application still triggers manual duplicate checks; skipped steps risk fee fairness and compliance across hundreds of agency relationships at enterprise scale.",
        "Vendor upload approval means opening each profile; three to four hundred agencies times ten to twenty daily uploads consume FTEs tied to rehire and deletion constraints.",
        "Regenerate offer cannot fix compensation after acceptance; early go-live saw large cohorts with hundreds of mismatches; Saturday maintenance windows hurt India six-day working weeks materially.",
    ]),
    ("P3 - Rec Mgr, TP Specialist", [
        "Reqs arrive via email before Workday; global, India CHR, and business approvals stay outside the system, slowing JR creation and weakening approval audit trails.",
        "Recruiters carry cost centre, line of business, and client margin data hiring managers should own when demand stays email-first, inflating non-recruiting workload.",
        "JTBD: hiring-manager-originated reqs with correct org and in-system approvals so recruiters focus on candidates instead of email archaeology and rework.",
    ]),
    ("P4 - Rec Mgr, TP Onboarding", [
        "Leadership ageing and SLA views live in Excel and Thrive; Workday is not trusted as the single pane for req health despite live reqs residing in the system.",
        "Approval and document proof sits in email and spreadsheets, complicating who approved what under audit pressure, slowing executive questions, and hiding owners when reqs stall before offers.",
        "JTBD: hiring-manager approvals and compensation visibility inside Workday before offer release, plus actionable req lists without daily spreadsheet exports for leadership reviews.",
    ]),
    ("P5 - Leadership Hiring, TP", [
        "Three government IDs are required before offer but UX allows partial progress, causing multi-day recruiter chase, re-offer cycles, and weak policy visibility for leadership.",
        "Specialised funnel sees about eighty-two to eighty-three percent join while sixteen to seventeen percent attrition ties partly to process length before acceptance, beyond pay alone.",
        "OTP failures on ID steps drive tickets; no recruiter-triggered email when offers are ready; no DocuSign in tenant forces screenshot audits; email beats SMS or WhatsApp for executive evidence.",
    ]),
]

for i, (ctitle, cblist) in enumerate(cust):
    paras = [{"level": 1, "text": b} for b in cblist]
    slides.append(title_only(ctitle, paras, alt=(i % 2 == 0), font=11, notes="• Verbatim strings: see 105 file for exact wording.\n\nReferences:\n• research/India/105-user-research-findings.md"))

slides.append(section("1 1", "Thematic analysis"))

theme_slides = [
    ("Validated Theme 1: Identity", [
        {"level": 0, "text": [{"text": "Know Your Candidate and source integrity", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Trust breaks when duplicates, agency credit, and ID proof stay manual or poorly specified; buyers want automation while law blocks mandatory private Aadhaar eKYC post Section 57."},
        {"level": 1, "text": "Fee disputes, fraud, and FTEs on per-candidate gates appear at BPO scale for P1–P2 and in Accenture-style SME stories."},
        {"level": 1, "text": "Steer UDMF toward lawful IDs, cooling-off, first-source agency rules, multi-way merge, auditable history; avoid government eKYC over-claims."},
    ]),
    ("Validated Theme 2: BGC", [
        {"level": 0, "text": [{"text": "BGC, documents, vendors", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "India needs flexible gating, reinitiate, parallel packages, and upfront vendor data; review-document flows misfit when stages need attach-only patterns."},
        {"level": 1, "text": "Double entry to portals and blocked offers when OTP or ID fail appear with P5 and Genpact middleware stories."},
        {"level": 1, "text": "Steer: first-class BGC orchestration with India versus US profiles, legible vendor status, less re-keying inside Core Connector patterns."},
    ]),
    ("Validated Theme 3: Offers", [
        {"level": 0, "text": [{"text": "Offer and hire lifecycle", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Tabular India compensation collides with regenerate limits and acknowledgement-only acceptance; P1, P2, P5 cite manual letters, screenshots, and multi-day renegotiations."},
        {"level": 1, "text": "Mass offer corrections create compliance risk when hundreds of offers land daily in peak spans without controlled in-system revision."},
        {"level": 1, "text": "Steer: lawful post-accept revision, rescind and regenerate rules, recruiter notifications on acceptance, partner e-sign where licensed."},
    ]),
    ("Validated Theme 4: Governance", [
        {"level": 0, "text": [{"text": "Governance and observability", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "Reqs and approvals live in email; supervisory org defaults fail for matrixed clients; ageing sits in Excel; generic task mail hides milestones."},
        {"level": 1, "text": "Audit trails and time-to-req suffer even when downstream hire steps still complete inside Workday."},
        {"level": 1, "text": "Steer: in-flow approvals, guided hiring manager req creation, ageing analytics, task routing by req or recruiter, region-aware maintenance comms."},
    ]),
    ("Validated Theme 5: Channels", [
        {"level": 0, "text": [{"text": "Channels and consent", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": "WhatsApp is default in SME notes; competitive scan confirms native gap; opt-in defaults clash with India volume; OTP fails on ID steps."},
        {"level": 1, "text": "RFP risk rises on messaging parity versus Zoho, Oracle, and iCIMS until gaps narrow with compliant architecture."},
        {"level": 1, "text": "Steer: native +91 and WhatsApp when strategy allows; interim CPaaS and Paradox honesty; region-configurable consent; note P5 email preference for executive offers."},
    ]),
]
for i, (ttitle, tparas) in enumerate(theme_slides):
    slides.append(title_only(ttitle, tparas, alt=(i % 2 == 1), font=12, notes="• Thematic report INDIA-004.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": [
            ["Theme", "SME", "Customer", "Ideation", "Convergence"],
            ["T1 Identity / dedupe / source", "Strong", "Strong", "Candidates high N", "Strong"],
            ["T2 BGC / documents", "Strong", "Strong (P5, P2)", "BGC negative sentiment", "Strong"],
            ["T3 Offer / hire lifecycle", "Strong", "Very strong", "Offers high pain", "Very strong"],
            ["T4 Governance / analytics", "Strong", "Strong (P3–P4)", "Reqs plus comms", "Strong"],
            ["T5 Channels / consent", "Strong", "Mixed (P5 email)", "Comms hardest", "Partial"],
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
    "speaker_notes": "• Matrix transcribed from thematic report Phase 4.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md",
})

slides.append(section("1 2", "Full funnel"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Gap Analysis"}},
    "tables": [{
        "rows": [
            ["Funnel stage", "Validated gap", "Evidence", "Product response"],
            ["Attract / post", "Naukri-class native multipost", "Matrix true gap; P4 parse friction", "Broadbean validation; Studio if needed"],
            ["Apply / intake", "Lawful dedupe and source rules", "P1–P2; SME5 scale", "UDMF extensions; cooling-off; merge >2"],
            ["Screen / verify", "ID step reliability and BGC orchestration", "P5 OTP; SME2–4", "Reinitiate; parallel packages; regional gating"],
            ["Offer / close", "Post-accept revision and notifications", "P1–P2–P5", "Controlled regenerate; milestone mail"],
            ["Govern / report", "In-flow approvals and SLA views", "P3–P4", "Guided reqs; ageing dashboards"],
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
    "speaker_notes": "• Funnel labels illustrative; tailor per account workshops.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md",
})

slides.append(section("1 3", "Roadmap"))

recs = [
    ("Recommendation 1: Lawful dedupe", [
        "Problem and evidence: manual duplicate work and last-touch source credit break fee fairness at agency scale; P1–P2 and SME5 cite merge limits and fraud; ideation Candidates bucket shows very hard effort at high volume.",
        "Recommendation: extend UDMF with lawful identifier matching, cooling-off, first-source agency rules, multi-candidate merge, auditable history, and no mandatory private-sector Aadhaar eKYC positioning in GTM.",
        "Why now: India eight-win scale row plus DPDP minimisation; thematic RICE score about 2125 with indicative reach five thousand recruiters and effort six person-months.",
        "Success: reduce median calendar time lost to duplicate and ID subprocesses by roughly ten to fifteen percent in year one where customers instrument baselines.",
    ]),
    ("Recommendation 2: BGC orchestration", [
        "Problem and evidence: BGC and ID steps fragment across vendors, process timing, and OTP fails; P5 and P2 report blocked offers and portal double entry; SMEs want reinitiate and India hire-before-BGC flexibility.",
        "Recommendation: ship one-click BGC reinitiate, parallel packages, India versus US gating profiles, upfront candidate data to vendors inside Job Application BP and Core Connector patterns.",
        "Why now: core ATS parity mission; thematic RICE about 1920 with indicative reach four thousand and effort five person-months.",
        "Success: compress offer-to-ready-to-hire calendar time by roughly eight to twelve percent on programmes that measure sub-stages.",
    ]),
    ("Recommendation 3: Governed HiredScore", [
        "Problem and evidence: seven-hundred-plus applications per posting exhaust manual screening; P5 cites parser limits; SMEs raise fraud; Q2 Priority 2 AI matching betas need defensible governance not raw automation.",
        "Recommendation: activate HiredScore for India high-volume tenants with human review queues, transparency copy, logging, explainability with Legal under EU AI Act and DPDP significant-fiduciary expectations.",
        "Why now: direct Priority 2 alignment; thematic RICE about 1604 with indicative reach twenty-five hundred and effort three person-months focused on activation wrap.",
        "Success: deliver roughly fifteen to twenty-five percent recruiter screening efficiency gains for activated beta tenants across year one cohorts.",
    ]),
    ("Recommendation 4: Offer lifecycle", [
        "Problem and evidence: pay and start-date changes after acceptance are hard in-system; P1, P2, P5 hit regenerate limits; SMEs cite tabular India pay; ideation Offers shows nine hundred plus rows at high pain.",
        "Recommendation: controlled post-accept revision where lawful, paired rescind and regenerate rules, recruiter notifications on acceptance, audit-grade evidence paths, and partner e-sign only where tenants license it.",
        "Why now: ATS parity plus DPDP transparency pressure; thematic RICE about 902 with indicative reach thirty-five hundred and effort eight person-months.",
        "Success: cut manual offer exceptions by roughly thirty to fifty percent where revised workflows roll out with operational discipline.",
    ]),
    ("Recommendation 5: DNH and purge depth", [
        "Problem and evidence: enterprises need stronger DNH, compliant mass purge, and multi-way merge to keep volume in Workday; Accenture-scale SME narrative and P2 vendor rules force compliance workarounds today.",
        "Recommendation: deepen DNH and blacklist automation, mass application purge with legal guardrails, patterns for multinational programmes including cross-border analogues from SME engagements.",
        "Why now: platform trust for India scale; thematic RICE about 488 with indicative reach three thousand and effort ten person-months pending Legal gates on purge.",
        "Success: raise in-system application share by roughly five to ten percent where purge and DNH changes unblock throughput, validated per account.",
    ]),
]

for i, (rtitle, rparas) in enumerate(recs):
    paras = [{"level": 1, "text": t} for t in rparas]
    slides.append(title_only(rtitle, paras, alt=(i % 2 == 1), font=11, notes="• Legal review on purge and Aadhaar-adjacent flows.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Roadmap Summary - All Recommendations"}},
    "tables": [{
        "rows": [
            ["#", "Title", "RICE", "Effort"],
            ["1", "Lawful dedupe and source governance", "2125", "6 PM"],
            ["2", "BGC orchestration", "1920", "5 PM"],
            ["3", "Governed HiredScore activation", "1604", "3 PM"],
            ["4", "India offer lifecycle upgrades", "902", "8 PM"],
            ["5", "DNH, purge, blacklist depth", "488", "10 PM"],
            ["6", "Profile change audit trail", "984", "4 PM"],
            ["7", "Task intelligence and notifications", "1040", "5 PM"],
            ["8", "Req ageing and SLA reporting", "700", "6 PM"],
            ["9", "Native +91 SMS", "550", "18 PM"],
            ["10", "Native WhatsApp core UI", "378", "20 PM"],
            ["11", "Guided hiring manager req creation", "840", "5 PM"],
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
    "speaker_notes": "• Full table in thematic report; pick five for deep dives in-room.\n\nReferences:\n• research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Bumper Slide",
})

out = str(SLIDE_SPECS_DIR / "slides_spec_v86.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(slides)} slides to {out}")
