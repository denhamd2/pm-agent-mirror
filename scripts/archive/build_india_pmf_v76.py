#!/usr/bin/env python3
"""Generate slides_spec_v76.json for India PMF roadmap (IN-PMF-001)."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "slides_spec_v76.json"

MI = 1


def section(num: int, subtitle: str) -> dict:
    return {
        "master_index": MI,
        "layout_name": "Section Title",
        "text_boxes": [
            {
                "left_inches": 3.3,
                "top_inches": 1.5,
                "width_inches": 5.6,
                "height_inches": 2.2,
                "font_name": "Archivo",
                "font_size_pt": 12,
                "color": "ink",
                "text": f"S E C T I O N  {num:02d}\n{subtitle}",
            }
        ],
    }


def tb(paragraphs, font_pt=14, height=2.8, top=1.2):
    return {
        "left_inches": 0.7,
        "top_inches": top,
        "width_inches": 8.6,
        "height_inches": height,
        "font_name": "Archivo",
        "font_size_pt": font_pt,
        "color": "ink",
        "paragraphs": paragraphs,
    }


def p_imp(text: str):
    return {
        "level": 0,
        "text": [
            {
                "text": "Product implication: ",
                "bold": True,
                "font_size_pt": 12,
                "highlight": "FFFF00",
            },
            {"text": text, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }


def title_only(title: str, paragraphs, alt=False, speaker=None, font_pt=14):
    slide = {
        "master_index": MI,
        "layout_name": "Title Only_Alt" if alt else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb(paragraphs, font_pt=font_pt)],
    }
    if speaker:
        slide["speaker_notes"] = speaker
    return slide


def pestel_slide(title: str, bullets: list, implication: str, refs: str):
    paras = [{"level": 1, "text": b} for b in bullets]
    paras.append(p_imp(implication))
    sn = (
        "• Anchor each bullet if challenged on sourcing.\n"
        "• Labour codes and DPDP timelines are buyer talking points.\n"
        "• Connect political narrative to documentation in offers.\n"
        "• Flag state-level variance for implementation partners.\n"
        "• Use implication to bridge to roadmap, not as slogan.\n\n"
        f"References:\n{refs}"
    )
    return title_only(title, paras, alt=False, speaker=sn, font_pt=12)


def swot_cell_bullets(lines: list):
    return {"paragraphs": [{"level": 1, "text": t} for t in lines]}


def swot_slide():
    S = [
        "Suite depth hire-to-pay fits MNC India captives wanting one template, security model, and auditability versus best-of-breed sprawl.",
        "DPDP-oriented configurable consent, retention, purge (Native per DA-IN004) supports data fiduciary narratives with customer legal design.",
        "Bulk grid actions and baseline skills matching are Native; throughput for large funnel operations.",
        "Hindi language pack Native strengthens in-country UX credibility versus English-only suites.",
        "HiredScore and Workday AI SKUs plus Paradox when licensed address semantic ranking and conversational scheduling pressure.",
    ]
    W = [
        "Native +91 SMS and native WhatsApp in core Recruiting UI are True Gaps (DA-IN004); regional suites market channels aggressively.",
        "Native direct multipost to Naukri-class boards is True Gap; Broadbean-class multiposter is operational workaround per deal.",
        "Mobile recruiter is partial versus desktop (Workaround); hurts mobile-first comparisons (Keka, Zoho).",
        "Fraud and dedupe friction at scale; customers want stronger keys (e.g. Aadhaar thinking) that must stay legally safe.",
        "Full semantic AI without extra SKUs is True Gap; Darwinbox, Keka, Zia demos can outshine baseline matching in beauty contests.",
    ]
    O = [
        "DPDP operationalisation 2025–2027 increases buyer focus on consent, retention, breach logging, and sub-processor governance.",
        "Q2 OKR on AI matching beta invites India anchor accounts in BPO, retail, tech where funnel ROI is measurable.",
        "Verification ecosystem partnerships (SpringVerify-class narratives) pull for orchestrated BGV and audit around Workday as system of record.",
        "Vendor security incidents create diligence windows where enterprise Workday can differentiate on governance when substantiated.",
        "SAP SmartRecruiters plus SuccessFactors and Oracle Fusion AI press may increase integration surface; suite coherence argument for India RFPs.",
    ]
    T = [
        "Darwinbox ~USD 140M funding (2025) and regional HCM players bundle recruiting, payroll, and Microsoft fabric; narrow mid-market pricing headroom.",
        "Zoho Recruit plus Twilio and WhatsApp ecosystem wins on TCO and omnichannel defaults where suite depth is not valued.",
        "Aggressive KYC features implying mandatory Aadhaar or covert profiling create legal exposure under DPDP and privacy jurisprudence.",
        "India AI bill trajectory and global MNC policies may mandate extra documentation, bias testing, and human oversight on matching.",
        "Slower IT budget growth could favour cheaper ATS or delay HiredScore expansion unless ROI is proven.",
    ]
    return {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Competitive SWOT - Workday in India"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [swot_cell_bullets(S), swot_cell_bullets(W)],
                    ["Opportunities", "Threats"],
                    [swot_cell_bullets(O), swot_cell_bullets(T)],
                ],
                "top_inches": 1.0,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Position strengths before acknowledging channel gaps honestly.\n"
            "• Map weaknesses to partner runbooks and roadmap timing.\n"
            "• Opportunities tie to Q2 India and DPDP runway.\n"
            "• Threats include suite competitors and diligence cost.\n"
            "• Source: swot-analysis-India-2026-03-30-IN-PMF-001.md\n\n"
            "References:\n"
            "• research/India/swot-analysis-India-2026-03-30-IN-PMF-001.md\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }


def comp_table_slide(title: str, rows: list, alt: bool):
    return {
        "master_index": MI,
        "layout_name": "Title Only_Alt" if alt else "Title Only",
        "placeholders": {"0": {"text": title}},
        "tables": [
            {
                "rows": rows,
                "left_inches": 0.35,
                "top_inches": 1.0,
                "width_inches": 9.3,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Use Native versus Workaround versus True gap language in live discussion.\n"
            "• Validate SMS paths with presales before promising geography.\n\n"
            "References:\n"
            "• research/competitive/matrices/in-competitive-matrix.md\n"
            "• research/competitive/in/in-competitive-scan-2026-03-30-IN-PMF-001.md"
        ),
    }


def recommendation_slide(
    n: int,
    short_title: str,
    problem: str,
    evidence: str,
    rec: str,
    why_now: str,
    metrics: str,
    speaker_extra: str = "",
):
    title = f"Recommendation {n}: {short_title}"
    paras = [
        {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": problem},
        {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": evidence},
        {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": rec},
        {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": why_now},
        {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": metrics},
    ]
    sn = (
        "• Keep five-part structure visible in live readout.\n"
        "• Tie evidence to named participant codes in talk track.\n"
        "• Use metrics for quarterly review.\n"
        f"{speaker_extra}\n\n"
        "References:\n"
        "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
    )
    return title_only(title, paras, alt=(n % 2 == 0), speaker=sn, font_pt=14)


slides = []

slides.append(
    {
        "master_index": MI,
        "layout_name": "TITLE",
        "placeholders": {
            "0": {"text": "India Recruiting Product-Market Fit Research"},
            "1": {"text": "March 2026"},
        },
    }
)

slides.append(section(1, "Executive summary"))
slides.append(
    title_only(
        "Executive Summary",
        [
            {
                "level": 0,
                "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": "India PMF combines industrial-scale hiring with trust risk: five internal experts and four customer voices (P1 to P4) converge on duplicate integrity, agency source economics, government ID and offer-path friction, and omnichannel versus audit-ready messaging tension.",
            },
            {
                "level": 1,
                "text": "Q2 strategy positions India for scale growth with eight wins, DPDP programmes, and local boards via certified partner distribution; AI matching and core ATS parity support high volume while GCC remains the top corporate priority for executive airtime.",
            },
            {
                "level": 1,
                "text": "Competitive intelligence confirms True Gaps on native +91 SMS, native WhatsApp in core Recruiting UI, native direct Naukri-class multipost, and full semantic AI without Workday AI or HiredScore SKUs; native Hindi, DPDP-style controls, bulk grid, and UDMF defend enterprise deals when honestly positioned.",
            },
            {
                "level": 1,
                "text": "Win-loss exports held no India-scoped rows this cycle; gap themes rely on customer interviews, internal expert interviews, competitive matrices, and macro research until CRM exports improve regional tagging.",
            },
            {
                "level": 1,
                "text": "Roadmap emphasis: entry-time duplicate and source policy with legal review on identifiers, aligned government ID and offer UX, offer revise and batch dates, India Fraud and KYC reference architecture, and HiredScore activation playbooks with governance.",
            },
        ],
        alt=True,
        speaker=(
            "• Open with scale and fraud before features.\n"
            "• Name DPDP and May 2027-oriented buyer expectations.\n"
            "• Acknowledge win-loss data gap transparently.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    )
)

slides.append(section(2, "Research challenge"))
slides.append(
    title_only(
        "Research Question and Objectives",
        [
            {
                "level": 1,
                "text": "Assess Workday Recruiting product-market fit in India for enterprise and GCC-led hiring, using strategy context, macro analysis, competitive intelligence, internal experts, and customer interviews.",
            },
            {
                "level": 1,
                "text": "Prioritise roadmap-ready actions aligned to Q2 Talent Acquisition priorities: India scale row, AI matching with governance, core ATS parity, and honest channel and board narratives.",
            },
            {
                "level": 1,
                "text": "Triangulate internal SME patterns with customer evidence to score business and customer impact using a consistent prioritisation model (reach, impact, confidence, effort).",
            },
            {
                "level": 1,
                "text": "Surface legal and compliance hooks for identifiers, messaging consent, screening AI, and background checks without substituting counsel.",
            },
        ],
        alt=False,
        speaker=(
            "• Clarify scope is India recruiting, not full HCM.\n"
            "• Note absence of ideation CSV and win-loss rows this mission.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)

slides.append(section(3, "Context review"))
slides.append(
    title_only(
        "Strategic Context - Why India Now",
        [
            {
                "level": 1,
                "text": "India is explicitly named for scale growth in Q2 with eight customer wins, DPDP readiness work, and local job board reach through partner distribution; buyers expect proof, not slides.",
            },
            {
                "level": 1,
                "text": "GCC-led technology hiring and multinational GCCs in India keep volumes high; Nasscom-scale hiring narratives favour automation, skills inference, and coordinator relief.",
            },
            {
                "level": 1,
                "text": "Enterprise committees pair suite depth with AI and omnichannel demos; phased DPDP enforcement through 2027 raises consent, notice, rights, and breach discipline as table stakes.",
            },
            {
                "level": 1,
                "text": "Fraud, forged documents, and impersonation stories in press elevate trust and identity programmes from nice-to-have to deal credibility.",
            },
        ],
        alt=True,
        speaker=(
            "• Contrast India medium priority label with customer severity.\n"
            "• Cite strategy file for OKR context.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)
slides.append(
    title_only(
        "India Market Momentum - Key Indicators",
        [
            {
                "level": 1,
                "text": "IMARC January 2026 sizes India HR technology at USD 1,210.0 million in 2025 toward USD 2,440.0 million by 2034 at about 7.71 percent CAGR 2026–2034; recruitment sits among standard solution categories in syndicated definitions.",
            },
            {
                "level": 1,
                "text": "India ATS is cited as a hundreds-of-millions USD segment through the 2030s in industry summaries; use ranges in live readouts because analyst splits differ.",
            },
            {
                "level": 1,
                "text": "MoSPI-linked press in 2025 cites about 85.5 percent of households with at least one smartphone and very high youth UPI engagement, reinforcing mobile apply and messaging buyer expectations.",
            },
            {
                "level": 1,
                "text": "Darwinbox raised about USD 140 million March 2025 per trade press, signalling sustained investment in regional suite and AI narratives that pressure enterprise RFP scoring.",
            },
            {
                "level": 1,
                "text": "DPDP Act 2023 and November 2025 rules phase-in elevate consent, retention, breach, and accountability expectations alongside competitive demos on channels and verification partners.",
            },
        ],
        alt=False,
        speaker=(
            "• Use ranges not false precision on market size.\n"
            "• Link cloud growth to integration expectations.\n\n"
            "References:\n"
            "• research/India/pestel-analysis-India-2026-03-30-IN-PMF-001.md\n"
            "• https://www.datareportal.com/reports/digital-2025-india"
        ),
    )
)

slides.append(section(4, "Product strategy"))
slides.append(
    title_only(
        "Q2 2026 Product Priorities",
        [
            {
                "level": 1,
                "text": "India scale: eight wins targeted in Q2 with DPDP compliance programmes and local job board validation through certified partner distribution; lead regional story before other priorities.",
            },
            {
                "level": 1,
                "text": "AI candidate matching: prove HiredScore ROI in beta tenants with human oversight, logging, and explainability; India volume hiring is a natural fit if consent and notices are credible.",
            },
            {
                "level": 1,
                "text": "Core ATS parity: bulk actions, mobile recruiter, background integrations, and Paradox scheduling reduce coordinator load and scheduling objections at India scale.",
            },
            {
                "level": 1,
                "text": "GCC market readiness remains the top corporate priority; India benefits from shared messaging and compliance patterns but does not own executive airtime by default.",
            },
        ],
        alt=True,
        speaker=(
            "• India-first bullet order is mandatory for this regional deck.\n"
            "• OKR: ten GCC wins, five AI beta tenants, NPS 60 recruiting.\n\n"
            "References:\n"
            "• strategy/markdown/product-priorities-q2-2026.md\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)
slides.append(
    title_only(
        "Regional Expansion Strategy",
        [
            {
                "level": 1,
                "text": "India: scale growth priority; eight wins targeted; DPDP compliance programmes; local job boards via certified partner distribution.",
            },
            {
                "level": 1,
                "text": "GCC: high priority; ten wins; WhatsApp; nationalisation; Arabic RTL; boards.",
            },
            {
                "level": 1,
                "text": "Japan: medium deepen; five expansions; two-step offer; APPI; LINE.",
            },
            {
                "level": 1,
                "text": "Australia: medium maintain; three expansions; Fair Work; SEEK via Broadbean.",
            },
        ],
        alt=False,
        speaker=(
            "• India appears first in this slide by design.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)
slides.append(
    title_only(
        "Competitive Positioning - Differentiation",
        [
            {
                "level": 1,
                "text": "Suite depth across HCM, Recruiting, Talent, and Learning versus point ATS and regional bundles.",
            },
            {
                "level": 1,
                "text": "AI-powered matching and conversational engagement when HiredScore and Paradox are activated with governance.",
            },
            {
                "level": 1,
                "text": "Compliance-first posture: extend GDPR and EU AI Act discipline to India DPDP programmes with notices, retention, and rights.",
            },
            {
                "level": 1,
                "text": "Enterprise scale: security model, global templates, and Fortune 500 workflows.",
            },
        ],
        alt=True,
        speaker=(
            "• Pair differentiation with honest gap disclosure on channels.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)

# PESTEL (source: pestel-analysis-India-2026-03-30-IN-PMF-001.md)
PESTEL = [
    (
        "Political",
        [
            "Digital India and digital public infrastructure continue to formalise how candidates and employers interact online; UPI-led mobile behaviour and eKYC-adjacent services appear in permitted contexts, shaping expectations for traceable hiring journeys by 2025–2026.",
            "State heterogeneity matters because labour and shop-floor rules vary by state; multi-site India TA must configure posting, contracts, and vendor models around state-level nuance, not only central statute.",
            "Draft Code on Social Security 2020 and evolving central rules extend social-security thinking to gig and platform workers; draft rules circulated for stakeholder comment December 2025 per trade press, increasing classification and reporting scrutiny for flexible workforce models.",
            "Make in India and manufacturing ramp narratives in 2025–2026 press describe short-window volume spikes that stress onboarding, provisioning, and TA operations for enterprise and staffing buyers.",
            "Geopolitical stability is a moderate factor; global MNCs run India as cost-arbitrage and talent hub, favouring enterprise-grade audit and data governance in vendor selection and public-sector modernisation influences private-sector RFP language on trust.",
        ],
        "Workday should treat India as a federated compliance problem by pairing central DPDP programme capabilities with configurable hiring and contingent workflows that scale across states, and by documenting high-volume ramp playbooks so professional services and customers can defend auditability during political cycles that emphasise formal employment, digital traceability, and consistent audit evidence.",
        "• Ministry of Labour Code on Social Security 2020 PDF: https://labour.gov.in/sites/default/files/ss_code_as_introduced_in_lok_sabha.pdf\n• TaxGuru draft Social Security Central Rules 2025: https://taxguru.in/corporate-law/draft-code-social-security-central-rules-2025.html\n• Economic Times MoSPI smartphone survey: https://economictimes.indiatimes.com/news/economy/indicators/85-5-indian-households-posses-at-least-one-smartphone-99-5-youth-use-upi-mospi-survey/articleshow/121495764.cms",
    ),
    (
        "Economic",
        [
            "IMARC January 2026 summary sizes India HR technology at USD 1,210.0 million in 2025, projecting USD 2,440.0 million by 2034 at about 7.71 percent CAGR 2026–2034; recruitment remains among standard solution categories in analyst taxonomies.",
            "Industry summaries cite India ATS as a hundreds-of-millions USD segment through the 2030s; use ranges in executive decks because analyst splits vary by definition.",
            "Cost-sensitive mid-market INR-packaged competitors (Keka, Zoho, Darwinbox) compress price-value expectations; enterprise deals still reward suite depth and global template control for MNC captives.",
            "High-volume economics in BPO, retail, logistics, and IT/ITES tie recruiter productivity and time-to-fill directly to margin; AI screening ROI narratives land when tied to measurable funnel metrics.",
            "Industry reporting frames bad hires and credential fraud as material cost drivers, increasing budget for verification stacks alongside ATS; Darwinbox raised about USD 140 million March 2025 trade press, signalling continued investment in AI and regional suite capability.",
        ],
        "Workday should anchor India business cases on suite TCO, hire-to-pay, and measurable throughput for high-volume segments; explicitly costing partner multipost, SMS, and verification closes the narrative gap versus cheaper ATS-only stacks. Finance and procurement teams need transparent bundles because INR-suite competitors compress headline licence costs while hiding integration load and downstream services effort.",
        "• IMARC India HR technology: https://www.imarcgroup.com/human-resource-technology-market-india\n• Entrepreneur India Darwinbox funding: https://www.entrepreneur.com/en-in/news-and-trends/hr-tech-unicorn-darwinbox-raises-usd-140-mn-to-advance/488003\n• IMARC India ATS companion: https://imarcgroup.com/india-applicant-tracking-system-market",
    ),
    (
        "Social",
        [
            "MoSPI-linked press in 2025 cites about 85.5 percent of Indian households with at least one smartphone; very high youth digital engagement reinforces mobile apply and messaging expectations for candidate journeys.",
            "SMS and WhatsApp are social norms for candidate and recruiter communication; native +91 SMS and core Recruiting WhatsApp remain True Gaps per DA-IN004, creating friction versus local ATS omnichannel stories.",
            "High-volume programmes across referral, vendor, and direct sources drive duplicate profiles, agency disputes, and manual hygiene; customer research calls for stronger dedupe while legal limits constrain unlawful mandatory Aadhaar use in private employment.",
            "Enterprise and GCC-outsourcing hiring maintain diversity and campus pipelines; trust issues around resume fraud and impersonation in gig contexts elevate verification salience for Know Your Candidate narratives.",
            "Hindi and multilingual expectations favour localised UX; Hindi is Native per DA-IN004 as important social proof in India demos, while rural internet growth expands pools but can increase address and identity verification challenges.",
        ],
        "Workday should prioritise mobile recruiter parity roadmap transparency so India buyers set correct expectations versus desktop-heavy workflows. Package partner-led omnichannel reference architectures validated by professional services, and strengthen UDMF-style duplicate governance to cut manual per-candidate checks; any government-ID matching must respect Supreme Court 2018 limits on mandatory Aadhaar for private employers and DPDP purpose limitation.",
        "• Economic Times MoSPI smartphone / UPI: https://economictimes.indiatimes.com/news/economy/indicators/85-5-indian-households-posses-at-least-one-smartphone-99-5-youth-use-upi-mospi-survey/articleshow/121495764.cms\n• research/India/105-user-research-findings.md\n• research/competitive/matrices/in-competitive-matrix.md",
    ),
    (
        "Technological",
        [
            "Cloud HRMS and ATS penetration is rising; AI features such as JD generation, matching, and analytics are table stakes in competitive demos from Darwinbox, Keka, and Zoho Zia according to competitive scan March 2026.",
            "India TA relies on job boards such as Naukri gravity, CPaaS for SMS, and WhatsApp business APIs via partners; Workday strategy remains Broadbean-first for boards with no native board build per product context.",
            "India November 2025 national AI governance narrative emphasises adaptive regulation using existing IT, consumer, and data protection law; proposed AI Ethics and Accountability Bill 2025 signals future enforceability on bias and accountability worth monitoring in Lok Sabha.",
            "Third-party BGV, digital address, and credential APIs are mature; ATS value sits in orchestration, audit logs, and data minimisation rather than replacing verification vendors.",
            "Baseline skills matching is Native while advanced semantic tier requires Workday AI or HiredScore SKUs per DA-IN004; technological honesty is required in India AI bake-offs and high-profile vendor security incidents drive enterprise procurement scrutiny.",
        ],
        "Workday should package India reference integrations including Broadbean board coverage proofs, CPaaS SMS, and optional Paradox, with logging and explainability for AI-assisted shortlisting so RFP answers stay honest on True Gaps per DA-IN004. Track India AI law trajectory and Lok Sabha progress so roadmaps align with bias testing, documentation, and human oversight expectations that enterprise buyers and EU-parent governance teams already demand.",
        "• The Hindu BusinessLine India AI governance: https://www.thehindubusinessline.com/info-tech/india-unveils-first-ai-governance-framework-opts-for-adaptive-regulation-over-new-law/article70244894.ece\n• regulations.ai India AI Bill 2025 stub: https://regulations.ai/regulations/RAI-IN-NA-ARTIFIC-2025\n• research/competitive/in/in-competitive-scan-2026-03-30-IN-PMF-001.md",
    ),
    (
        "Environmental",
        [
            "SEBI LODR drives Business Responsibility and Sustainability Reporting for listed issuers; workforce metrics including gender and training appear in BRSR Core disclosures and third-party assurance for many filers.",
            "Green hiring has limited direct ATS link; some employers track sustainability skills and ESG roles, with recruiting impact indirect via reporting exports and job taxonomy rather than core ATS differentiation.",
            "Large employers may capture commute or travel data in edge programmes; DPDP minimisation still applies and standard ATS should avoid scope creep into non-essential environmental personal data.",
            "DATA GAP: national-level statistics tying environmental regulation to recruiting software spend are weak through 2026; use company-specific ESG mandates in enterprise sales narratives rather than sector-wide recruiting-environment claims.",
        ],
        "Workday should ensure reporting and analytics can support diversity and workforce metrics customers need for BRSR and global ESG reporting handoffs into HCM by 2026. Avoid over-claiming carbon or environmental recruiting features without validated customer use cases; environmental factor strength is moderate for recruiting software, so product marketing should stay grounded in export and taxonomy support rather than green-hiring platform claims.",
        "• BSE corporate filings index: https://www.bseindia.com/\n• NSE corporate filings: https://www.nseindia.com/",
    ),
    (
        "Legal",
        [
            "Digital Personal Data Protection Act 2023 establishes data fiduciary duties, lawful processing, consent where required, purpose limitation, retention discipline, security safeguards, breach reporting to the Data Protection Board of India, and rights including access, correction, erasure, grievance, and nominate; penalties are tiered for significant data fiduciaries and breaches.",
            "Digital Personal Data Protection Rules 2025 were notified November 2025 by MeitY; commentary and phased items through 2026–2027 for consent managers and core obligations appear in Lexology and specialist trackers and product teams must follow authoritative Board dates for compliance planning.",
            "Cross-border transfers under DPDP use government notification approaches for blacklisted or whitelisted territories; enterprise customers will contract DPA terms with SaaS vendors accordingly.",
            "Employment processing requires careful mapping of notices, consent, and retention for candidates and must be designed with legal review; Native configurable privacy in Workday does not replace customer legal design.",
            "Supreme Court 2018 restricted mandatory Aadhaar authentication by private entities for contractual services; algorithmic and AI hiring risk includes EU AI Act for MNC policy and evolving India-specific AI rules requiring human oversight, documentation, and bias mitigation for screening features.",
        ],
        "Workday should lead India enterprise deals with demonstrable DPDP-aligned controls spanning notice, consent, retention, purge, audit, and sub-processor transparency, and AI human-in-the-loop patterns for screening, while legally vetting any identity field or verification integration touching Aadhaar or biometrics so Know Your Candidate features stay lawful, minimised, and proportionate to the hiring purpose.",
        "• PRS DPDP Bill track: https://prsindia.org/billtrack/the-digital-personal-data-protection-bill-2023\n• Lexology DPDP rules commentary: https://www.lexology.com/library/detail.aspx?g=8cd518f8-7b2e-4379-95bb-d91f6c873acc\n• Indian Express Aadhaar private sector: https://indianexpress.com/article/india/aadhaar-verdict-private-firms-banks-and-phones-cant-ask-for-aadhaar-linking-5376302/\n• EU AI Act explorer: https://artificialintelligenceact.eu/ai-act-explorer/",
    ),
]

slides.append(section(5, "PESTEL"))
for i, (title, bullets, impl, refs) in enumerate(PESTEL):
    slides.append(pestel_slide(title, bullets, impl, refs))

slides.append(section(6, "Competitive landscape"))
slides.append(
    comp_table_slide(
        "Competitive Landscape - Regional Specialists",
        [
            [
                "Vendor",
                "Key Strengths",
                "Key Weaknesses",
                "India fit",
                "Notes",
            ],
            [
                "Darwinbox",
                "India cloud HRMS; enterprise recruiting; Gartner MQ Challenger narrative 2025; AI and agent story; Microsoft fabric partnerships; high-volume screening marketing",
                "Mid-market to enterprise scope varies; security diligence items in trade press; not global suite depth versus Workday",
                "Strong single-vendor HRMS story",
                "Omnichannel pressure versus Workday native channel gaps",
            ],
            [
                "Keka HR",
                "15+ channel one-click posting; AI JD parsing and matching; DPDP marketing; INR pricing; payroll adjacency",
                "Narrower global template depth; enterprise process rigour perceptions",
                "Strong speed and local packaging",
                "Board-count stories need Broadbean proof response",
            ],
            [
                "Zoho Recruit",
                "Twilio SMS; marketplace WhatsApp; Zia AI on mobile 2026 content; multipost; ecosystem TCO",
                "Enterprise security and global HCM coherence versus full suite",
                "TCO and omnichannel defaults",
                "Battle card: suite depth and DPDP programme fit",
            ],
        ],
        alt=False,
    )
)
slides.append(
    comp_table_slide(
        "Competitive Landscape - Global Platforms",
        [
            [
                "Vendor",
                "Key Strengths",
                "Key Weaknesses",
                "India fit",
                "Notes",
            ],
            [
                "SAP",
                "SuccessFactors coherence; SmartRecruiters embedded narrative March 2026; enterprise incumbency",
                "Implementation and licensing complexity; competitive agility varies by account",
                "High in ERP-aligned shortlists",
                "Benchmark connected HCM and AI roadmaps",
            ],
            [
                "Oracle",
                "Fusion HCM; Recruiting Booster; agentic India press emphasis; strong enterprise benchmark",
                "Implementation friction; messaging claims need entitlement checks",
                "High where Oracle footprint deep",
                "Omnichannel demos intensify true gap pressure",
            ],
            [
                "Workday Recruiting",
                "Hindi; DPDP-style consent retention purge; bulk grid; baseline skills matching; hire-to-pay when Payroll in scope",
                "True gaps: native +91 SMS; native WhatsApp core UI; native direct Naukri multipost; full semantic AI without AI SKUs; native Paradox-grade scheduling",
                "Strong for enterprise India and GCCs",
                "Lead with suite, DPDP programme, honest partner map",
            ],
        ],
        alt=True,
    )
)
slides.append(swot_slide())

slides.append(section(7, "Win / Loss"))
slides.append(
    title_only(
        "Win/Loss - Data Availability",
        [
            {
                "level": 1,
                "text": "No win-loss export rows were available for India in this research cycle.",
            },
            {
                "level": 1,
                "text": "Gap themes rely on customer interviews, competitive intelligence, internal expert interviews, and macro-regulatory research until CRM exports add India-scoped rows and severity scores.",
            },
            {
                "level": 1,
                "text": "Next step: enrich exports with region tags to unlock gap theme charts in future readouts.",
            },
        ],
        alt=True,
        speaker=(
            "• Be transparent about evidence limits.\n"
            "• Commit to data hygiene for the next deck refresh.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    )
)

slides.append(section(8, "Ideation hub"))
slides.append(
    title_only(
        "Ideation Hub - Data Gap",
        [
            {
                "level": 1,
                "text": "No internal brainstorm or ideation CSV was provided for this mission; quantitative idea counts are therefore absent from this readout.",
            },
            {
                "level": 1,
                "text": "Themes therefore exclude quantitative internal idea counts; prioritisation leans on SME and customer interviews plus competitive intelligence.",
            },
            {
                "level": 1,
                "text": "Future cycles can add ideation overview, capability volume charts, and verbatim theme slides when source files are provided.",
            },
        ],
        alt=False,
        speaker=(
            "• Explain why ideation block is absent.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    )
)

slides.append(section(9, "SME interviews"))
slides.append(
    title_only(
        "Internal SME Interviews - Workday Experts",
        [
            {
                "level": 1,
                "text": "Five Workday internal experts across product leadership, field readiness, global services, India enterprise architecture on a Genpact programme, and strategic customer engagement on Accenture.",
            },
            {
                "level": 1,
                "text": "Coverage: fraud and KYC, India offer and compensation, background checks and documents, marketing consent reach, WhatsApp norms, mass operations including purge and merge, talent supply chain.",
            },
            {
                "level": 1,
                "text": "Timing: notes from 2025 India research programme; synthesised March 2026 for this readout.",
            },
            {
                "level": 1,
                "text": "Purpose: multi-customer implementation and product lens to cross-check customer interviews; internal views do not replace customer voice.",
            },
            {
                "level": 1,
                "text": "Limitation: selection bias toward large accounts and delivery-heavy themes; triangulate with P1 to P4 customer evidence in later sections.",
            },
        ],
        alt=True,
        speaker=(
            "• Introduce SMEs by credibility, not hierarchy alone.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
    )
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "SME Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["SME ID", "Name", "Role", "Context"],
                    [
                        "SME1",
                        "Bernie",
                        "VP, Talent Product Management",
                        "Product leadership; India focus; fraud and partnerships",
                    ],
                    [
                        "SME2",
                        "Fabiola Navarro",
                        "Sr. Product Advisor, Field Readiness",
                        "Multi-customer implementations; India in scope",
                    ],
                    [
                        "SME3",
                        "Santosh Gulia",
                        "Sr. Functional Consultant, Global Services",
                        "India and NA deployments; high-volume customers",
                    ],
                    [
                        "SME4",
                        "David Lodola",
                        "Enterprise Architect, Services, India",
                        "Genpact; talent supply chain and PSA",
                    ],
                    [
                        "SME5",
                        "David Phillips",
                        "Director, Strategic Customer Engagement",
                        "Accenture relationship; volume and compliance",
                    ],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "font_size_pt": 10,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Use table for quick credibility scan.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
    }
)


def sme_slide(sme_id: str, full_name: str, role: str, themes):
    """themes: list of (subheader, [bullets]). Title: SME{n} - Name, Role (<=45 chars)."""
    paras = []
    for sub, bullets in themes:
        paras.append(
            {
                "level": 0,
                "text": [{"text": sub, "bold": True, "font_size_pt": 14}],
            }
        )
        for b in bullets:
            paras.append({"level": 1, "text": b})
    title = f"{sme_id} - {full_name}, {role}"
    if len(title) > 45:
        title = f"{sme_id} - {full_name}"
    if len(title) > 45:
        title = title[:42] + "..."
    short = full_name.split()[0]
    return title_only(
        title,
        paras,
        alt=True,
        speaker=(
            f"• Stress {short}'s customer portfolio relevance.\n"
            "• Link to trust-stack narrative.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
        font_pt=14,
    )


slides.append(
    sme_slide(
        "SME1",
        "Bernie",
        "VP, Talent Product Management",
        [
            (
                "KYC and fraud at scale",
                [
                    "Order of 100,000 resumes per month discussed; Accenture-scale pressure elevates Know Your Candidate framing.",
                    "Partners such as BrightHire raised for interview capture and skills alignment to validation.",
                ],
            ),
            (
                "India roadmap",
                [
                    "FY27 India target opportunity noted as anchor; address localisations and explicit India gap acknowledgement in planning.",
                ],
            ),
            (
                "Customer triangulation",
                [
                    "Customer P1 and P2 duplicate and agency mechanics align with fraud and identity risk theme.",
                    "Hypothesis: unify partner and native verification story for enterprise buyers.",
                ],
            ),
        ],
    )
)
slides.append(
    sme_slide(
        "SME2",
        "Fabiola Navarro",
        "Sr. Product Advisor, Field Readiness",
        [
            (
                "India offer compensation",
                [
                    "Dense tables, many calculated fields, two candidate documents on many India projects; believed legally driven disclosure pattern.",
                    "Lowe’s India routing example shows repeated configuration churn on compensation articulation.",
                ],
            ),
            (
                "Automation versus gates",
                [
                    "Start date confirmation versus auto-complete hire conflicted; Workday Extend used to recreate start-date correction flows.",
                    "Background flexibility: India populations may move to hire before all results versus stricter US gating; reinitiate BGC easy-button demand recurs.",
                ],
            ),
            (
                "Customer triangulation",
                [
                    "Customer P2 and P4 offer volume and statutory ID pain echo configuration and throughput tension.",
                ],
            ),
        ],
    )
)
slides.append(
    sme_slide(
        "SME3",
        "Santosh Gulia",
        "Sr. Functional Consultant, Global Services",
        [
            (
                "Document capture",
                [
                    "Candidate-home attachment box vision across stages; review document pattern awkward when recruiter sends nothing first; email workaround common.",
                ],
            ),
            (
                "Consent and channels",
                [
                    "Marketing opt-in starves reach at India volume; proposes opt-out with unsubscribe and region-configurable policy.",
                    "WhatsApp ubiquitous for links; regular SMS rarer; chatbot for status and scheduling should tie to messaging roadmap.",
                ],
            ),
            (
                "Customer triangulation",
                [
                    "Customer P4 email-first audit preference contrasts with WhatsApp norm; policy-controlled optionality required.",
                ],
            ),
        ],
    )
)
slides.append(
    sme_slide(
        "SME4",
        "David L",
        "Enterprise Architect, India",
        [
            (
                "Talent supply chain",
                [
                    "Genpact-scale programme; Extend bridge between project demand and requisition fields; sixty percent internal fills; resource managers as internal recruiters.",
                ],
            ),
            (
                "Mass processing and trust",
                [
                    "Bulk offers and cohort starts at one hundred to two hundred roles; worksheets adoption gap noted.",
                    "KYC and impersonation; BGC contractual to clients; native integrations seen as basic versus middleware depth.",
                ],
            ),
            (
                "Customer triangulation",
                [
                    "Customer P2 national frontline scale reinforces industrial operations persona beyond coordinator-only stories.",
                ],
            ),
        ],
    )
)
slides.append(
    sme_slide(
        "SME5",
        "David P",
        "Director, Strategic Customer Engagement",
        [
            (
                "Five gap clusters",
                [
                    "Do-not-hire automation; mass purge; merge more than two duplicates; fraud at scale; interview ID validation.",
                    "Roughly two hundred thousand duplicate applications context discussed for Accenture-scale hiring.",
                ],
            ),
            (
                "Volume and perception",
                [
                    "Roughly half of India applications may sit outside Workday for internal compliance in some accounts; policy versus regulatory drivers need clarity.",
                    "Market perception risk that India is an afterthought amid intense competition and trickery.",
                ],
            ),
            (
                "Customer triangulation",
                [
                    "Customer P1 and P2 duplicate and source disputes align with DNH and merge narratives.",
                ],
            ),
        ],
    )
)

slides.append(section(10, "Primary research"))
slides.append(
    title_only(
        "1:1 Customer Interviews - India Enterprise",
        [
            {
                "level": 1,
                "text": "Four senior recruiting leaders from one high-volume India enterprise programme captured across two onsite group sessions in December 2025.",
            },
            {
                "level": 1,
                "text": "Organisations run national frontline and specialised hiring at very large weekly and monthly volumes with Workday as system of record for key flows.",
            },
            {
                "level": 1,
                "text": "Research conducted March 2026 synthesis from December 2025 transcripts; semi-structured depth on duplicates, offers, approvals, reporting, and channels.",
            },
            {
                "level": 1,
                "text": "Method explores hiring workflows, compliance steps, and technology gaps without substituting for legal advice on identifiers or consent.",
            },
            {
                "level": 1,
                "text": "Cross-checked with internal SME notes, competitive intelligence, and macro analysis for convergence and divergence.",
            },
            {
                "level": 1,
                "text": "Limitation: single enterprise programme in sample; additional industries needed before generalising beyond BPO-scale patterns.",
            },
        ],
        alt=True,
        speaker=(
            "• Anonymise as P1 to P4 with company name retained per policy.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    )
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Customer Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["Participant", "Role", "Company"],
                    [
                        "P1",
                        "Recruitment Manager, agent hiring",
                        "TP",
                    ],
                    [
                        "P2",
                        "Frontline Hiring Manager, North and East India",
                        "TP",
                    ],
                    [
                        "P3",
                        "Recruitment Manager, specialised hiring",
                        "TP",
                    ],
                    [
                        "P4",
                        "Recruitment Manager, leadership and confidential",
                        "TP",
                    ],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "font_size_pt": 10,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Confirm anonymisation in spoken track.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    }
)


def p_slide(pid, role_co, themes_q_jtbd):
    """themes_q_jtbd: list of dict theme, quotes list, jtbds list"""
    paras = []
    for block in themes_q_jtbd:
        paras.append(
            {
                "level": 0,
                "text": [{"text": block["theme"], "bold": True, "font_size_pt": 14}],
            }
        )
        for q in block["quotes"]:
            paras.append({"level": 1, "text": q})
        for j in block["jtbd"]:
            paras.append({"level": 1, "text": j})
    title = f"{pid} - {role_co}"
    if len(title) > 45:
        title = f"{pid} - {role_co[:40].rsplit(' ', 1)[0]}"
    return title_only(
        title,
        paras,
        alt=(pid == "P2" or pid == "P4"),
        speaker=(
            f"• Deep dive {pid} quotes in discussion.\n"
            "• Note TP programme context.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
        font_pt=14,
    )


slides.append(
    p_slide(
        "P1",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Volume and org governance",
                "quotes": [
                    '"In a week… normally the numbers would be somewhere around 100… in a month, we hire around 800… to 1,000." - seasonal scale (P1, TP).',
                    '"There is a supervisory org which you need to attach… we are randomly picking up right now." - wrong org risk (P1, TP).',
                ],
                "jtbd": [
                    "When we run peak agent hiring, I want demand tied to correct supervisory org, so governance errors do not propagate.",
                ],
            },
            {
                "theme": "Duplicate hygiene at scale",
                "quotes": [
                    '"Even if it\'s a single upload… a recruiter has to manually go check a duplicate… it takes almost the entire day." - automation gap (P1, TP).',
                ],
                "jtbd": [
                    "When vendors flood the funnel, I want system-enforced duplicate checks, so one FTE per site is not lost to checkbox hygiene.",
                    "When duplicates drive agency disputes, I want stronger matching beyond name and phone where lawful, so payment exposure drops.",
                ],
            },
        ],
    )
)
slides.append(
    p_slide(
        "P2",
        "Frontline Hiring Manager, TP",
        [
            {
                "theme": "Peak risk and recruiter centrality",
                "quotes": [
                    '"When there was a peak… we got really hit bad… delays in joining." - ramp timing (P2, TP).',
                    '"For a recruiter\'s life cycle… most of the time they spend on Workday." - workflow hub (P2, TP).',
                ],
                "jtbd": [
                    "When national frontline ramps hit, I want hiring readiness on the critical path, so client SLAs hold.",
                ],
            },
            {
                "theme": "Duplicates and agency economics",
                "quotes": [
                    '"Agency A will not get paid… we have a huge pile on such cases today." - source attribution (P2, TP).',
                ],
                "jtbd": [
                    "When agencies upload at scale, I want first-in-window source credit, so finance exposure from last-touch rules drops.",
                    "When offers change daily, I want rescind and regenerate in product, so legal stops manual letters at hundreds per day.",
                ],
            },
        ],
    )
)
slides.append(
    p_slide(
        "P3",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Join leakage and specialised volume",
                "quotes": [
                    '"82-83% [join rate]… we\'re losing about 16-17% people… only because of work." - offer friction (P3, TP).',
                    '"We need people and hiring workflows in one reliable system." - single system ask (P3, TP).',
                ],
                "jtbd": [
                    "When I run specialised pipelines, I want reliable join forecasting, so leadership sees process drop-off versus true attrition.",
                ],
            },
            {
                "theme": "Manager cadence and reporting",
                "quotes": [
                    '"There are five recruitment managers… If it\'s all Workday, they just need to come with that report." - visibility (P3, TP).',
                ],
                "jtbd": [
                    "When I lead a pod, I want hiring workflows in one system, so admin does not crowd out sourcing.",
                    "When processes break at scale, I want fast remediation, so recruiters return to candidates.",
                ],
            },
        ],
    )
)
slides.append(
    p_slide(
        "P4",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Leadership offers and India IDs",
                "quotes": [
                    '"Government identifiers… once the candidate accept all the policies suddenly it vanishes… it doesn\'t mark it as mandatory." - skippable ID UX (P4, TP).',
                    '"You cannot expect such people to just keep logging just because we have a technical bottleneck." - leadership drop-off (P4, TP).',
                ],
                "jtbd": [
                    "When I extend leadership offers, I want mandatory IDs enforced in UX aligned to policy, so renegotiation loops stop.",
                ],
            },
            {
                "theme": "Audit trail and channels",
                "quotes": [
                    '"SMS and WhatsApp is not something which can be taken into grounds… email is something." - dispute traceability (P4, TP).',
                ],
                "jtbd": [
                    "When audit asks who approved compensation, I want JR and offer approvals in Workday, so email Excel is not the record.",
                    "When disputes arise, I want traceable channel policy, so SMS and WhatsApp gaps do not break evidence stories.",
                ],
            },
        ],
    )
)

slides.append(section(11, "Thematic analysis"))


def theme_block(name, insight, impact, prod):
    return [
        {
            "level": 0,
            "text": [{"text": name, "bold": True, "font_size_pt": 14}],
        },
        {"level": 1, "text": f"Key insight and evidence: {insight}"},
        {"level": 1, "text": f"Business impact: {impact}"},
        {"level": 1, "text": f"Product implications: {prod}"},
    ]


slides.append(
    title_only(
        "Validated Themes 1-3 (Trust and Scale)",
        theme_block(
            "Trust, identity, and fraud",
            "Manual duplicate checks and agency disputes meet SME KYC narrative; P2 asks for Aadhaar-class keys under governance.",
            "Deal credibility and financial exposure when source credit is wrong; fraud stories in press raise buyer scrutiny.",
            "Treat matching, source attribution, and interview-stage checks as one trust stack with DPDP-sensitive design.",
        )
        + theme_block(
            "India offer and hire path",
            "Fabiola universal offer compensation complexity aligns with P2 hundreds of offers per day and P4 ID and OTP leakage.",
            "Joiner conversion and recruiter hours; competitor speed stories bite if auditability lags.",
            "Harden offer lifecycle, statutory task semantics, OTP reliability, and audit exports.",
        )
        + theme_block(
            "Documents and background checks",
            "SME attachment hub and reinitiate BGC themes overlap P4 disappearing identifier fields after policy acceptance.",
            "Email workarounds increase breach and minimisation risk; services cost rises.",
            "Stage-flexible candidate document capture with retention hooks.",
        ),
        alt=False,
        speaker=(
            "• Three themes per slide keeps pacing.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
        font_pt=12,
    )
)
slides.append(
    title_only(
        "Themes 4-5: Operations and Channels",
        theme_block(
            "Industrial mass operations",
            "Phillips five clusters and Lodola cohort starts align with P2 national scale context.",
            "Wins in SI and BPO segments need purge, merge, and list disposition depth.",
            "Bulk safe processes with security and audit for DPDP.",
        )
        + theme_block(
            "Channels and consent",
            "Santosh WhatsApp and opt-in starvation contrast P4 email-first compliance preference.",
            "Omnichannel demos in RFPs clash with tenant policy reality.",
            "Configurable consent models and partner messaging with logged threads.",
        ),
        alt=True,
        speaker=(
            "• Call out WhatsApp versus email tension explicitly.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
        font_pt=12,
    )
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [
            {
                "rows": [
                    [
                        "Theme",
                        "P1",
                        "P2",
                        "P3",
                        "P4",
                        "PMF impact",
                    ],
                    [
                        "Trust and fraud",
                        "Dup manual",
                        "Agency pile; Aadhaar ask",
                        "Join leakage",
                        "ID task UX",
                        "High",
                    ],
                    [
                        "Offer and hire",
                        "Volume site",
                        "100-150 offers/day",
                        "Specialised SLAs",
                        "Regenerate comp gap",
                        "High",
                    ],
                    [
                        "Documents and BGC",
                        "Vendor upload",
                        "Source rules",
                        "Reporting load",
                        "OTP and policies",
                        "Medium high",
                    ],
                    [
                        "Mass operations",
                        "—",
                        "National scale",
                        "Pod admin",
                        "Approvals offline",
                        "High BPO",
                    ],
                    [
                        "Channels",
                        "—",
                        "Workday centric",
                        "Visibility",
                        "Email audit",
                        "High policy",
                    ],
                ],
                "left_inches": 0.35,
                "top_inches": 1.0,
                "width_inches": 9.3,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Walk row by row for convergence.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    }
)

slides.append(section(12, "Gap diagnostic"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Gap Analysis"}},
        "tables": [
            {
                "rows": [
                    [
                        "Stage",
                        "Gap",
                        "Severity",
                        "Workaround",
                        "Evidence",
                        "Product implication",
                    ],
                    [
                        "Attract",
                        "India board multipost and parsing friction; hundreds of applicants per req without gating",
                        "🟡 MEDIUM",
                        "Broadbean validation per deal; external parsers",
                        "P4 sourcing narrative",
                        "Board proof programme and honest partner map",
                    ],
                    [
                        "Convert",
                        "Bridge and bot history versus clean in-product apply",
                        "🟢 LOW",
                        "Remove legacy bridge where possible",
                        "P2 historical pain",
                        "Monitor career site entry patterns",
                    ],
                    [
                        "Screen",
                        "Duplicate detection, first-source credit, and cooling-off; customers desire Aadhaar-class keys under lawful design",
                        "🟡 MEDIUM",
                        "UDMF rules and Manage Duplicate Records; auto-merge where configured; human review for suggested matches (Deployment Agent March 2026)",
                        "P1 (TP); P2 (TP)",
                        "Ship entry policy, source immutability with override, and counsel-approved identifier programme",
                    ],
                    [
                        "Schedule",
                        "Paradox-grade scheduling gap; WhatsApp norm",
                        "🟡 MEDIUM",
                        "Paradox when licensed; CPaaS paths",
                        "CI true gap; P4 email preference",
                        "Reference architecture with audit logging",
                    ],
                    [
                        "Offer",
                        "Regenerate rescind limits; acknowledgement-only offers; India ID tasks",
                        "🔴 HIGH",
                        "Manual legal letters; field workarounds",
                        "P2 P4",
                        "Offer lifecycle hardening and statutory UX",
                    ],
                    [
                        "Comply",
                        "Offline approvals; weak audit on identifiers",
                        "🟡 MEDIUM",
                        "Email evidence; screenshots",
                        "P4",
                        "In-product approvals and retention-aware tasks",
                    ],
                    [
                        "Measure",
                        "Reporting and task noise; no pipeline dashboards",
                        "🟡 MEDIUM",
                        "Excel exports; delete-all-email behaviour",
                        "P4",
                        "Actionable notifications and req-scoped tasks",
                    ],
                ],
                "left_inches": 0.3,
                "top_inches": 1.0,
                "width_inches": 9.4,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Gap severities triangulated March 2026; Deployment Agent query thread 96f25023-39d4-4554-a456-5892f0b5e814 confirms no native mass offer generation and UDMF auto-merge depends on configured rules.\n"
            "• Parity reference threads: dac6739f-1c6e-49cf-a587-a06d6a8ababc (DA-IN004); 860ceb73-de8c-4e54-a1f4-8ecfd600c374 (DA-IN-PMF-001).\n"
            "• Adjust severities after tenant-specific functional review.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }
)

slides.append(section(13, "Roadmap"))
slides.append(
    recommendation_slide(
        1,
        "Duplicate + Source",
        "Manual duplicate review at thousands of vendor profiles per day and last-approved source credit create agency non-payment disputes and dedicated FTE at each site.",
        "P2 (TP): agency payment pile and first-source failure; P1 (TP): one resource per site on duplicate checks only.",
        "Entry-time duplicate policy with first-source lock, cooling-off, and batch resolution; align UDMF rules with agency economics; keep human review on disposition.",
        "Scale and fraud narratives dominate India BPO RFPs; Q2 India win targets need a credible trust story.",
        "Manual duplicate touches per thousand hires: pilot fifty percent reduction in anchor tenant.",
        "\n• 060 compliance review flags CRITICAL RISK; legal counsel required before customer commitment on government-ID matching and automated disposition.",
    )
)
slides.append(
    recommendation_slide(
        2,
        "Government ID + Offer UX",
        "Mandatory-in-policy but skippable-in-UI government identifiers create multi-day offer loops and measurable join leakage before start date.",
        "P4 (TP): ID tasks vanish after policies; P3/P4 context: fifteen to seventeen percent drop-off tied to process friction.",
        "Align required fields across candidate UI and business process; progressive capture; OTP failure handling; lawful dedupe keys only after legal review.",
        "DPDP Rules phased timing and competitor document automation raise the bar on minimised, honest ID journeys.",
        "Offer-to-join conversion: recover three to five points in pilot where UI alignment fixes land.",
        "\n• 060 compliance review flags CRITICAL RISK; legal counsel required before customer commitment on mandatory Aadhaar-style patterns and consent design.",
    )
)
slides.append(
    recommendation_slide(
        3,
        "Offer Revise + Batch Dates",
        "Cannot regenerate offers with compensation correction after go-live errors; batch start-date updates fail at twenty-person scale during ramps.",
        "P4 (TP): four hundred to five hundred wrong compensation cases; P2 (TP): twenty-person batch start-date change blocked.",
        "Deliver revise offer including compensation; bulk start-date change where statutory rules allow; reduce manual legal letters.",
        "Peak-season go-live lessons show volume plus rigidity compounds business-day loss.",
        "Legal letter exceptions per thousand offers: down forty percent in pilot tenant.",
        "",
    )
)
slides.append(
    recommendation_slide(
        4,
        "Fraud KYC Architecture",
        "Sales and services need one reference story pairing UDMF, BGV partners, and honest limits on native government verification.",
        "Competitive matrix: SpringVerify-class UX in regional suites; DA-IN-PMF-001: Aadhaar government verification not native delivered.",
        "Publish professional services validated architecture: UDMF plus BGV orchestration plus claims reviewed with counsel; avoid native Aadhaar over-claim.",
        "Low-effort enablement unlocks deal defence without waiting for full product drops.",
        "India qualified deals with signed architecture pack: zero to seventy percent in two quarters.",
        "",
    )
)
slides.append(
    recommendation_slide(
        5,
        "HiredScore India Anchors",
        "Semantic ranking and volume screening without AI SKUs loses beauty contests against Darwinbox, Keka, and Zia demos.",
        "Strategy Q2 OKR: five AI matching beta tenants; customer context includes twelve thousand hires in eight to ten weeks seasonal ramps.",
        "Activation playbooks with measurable funnel KPIs, logging, bias testing, and recruiter-in-loop per enterprise policy.",
        "AI governance and EU AI Act expectations travel on India GCC tenants hiring into EMEA parents.",
        "Beta tenants in India volume segment: zero to three with published funnel lift metrics.",
        "\n• 060 compliance review flags CRITICAL RISK on automated screening trajectories; EU AI Act high-risk duties; legal counsel required before customer commitment.",
    )
)

handoff_rows = [
    [
        "#",
        "Title",
        "Action",
        "Reach",
        "Impact",
        "Confidence",
        "Effort",
        "RICE",
        "Legal / compliance (060)",
    ],
    [
        "1",
        "Duplicate automation + source",
        "Entry policy; first-source; cooling-off; UDMF",
        "10",
        "3.0",
        "70%",
        "9 pm",
        "2.3",
        "High; profiling; retention",
    ],
    [
        "2",
        "ID / offer UX alignment",
        "UI-BP alignment; progressive capture; lawful keys",
        "10",
        "3.0",
        "70%",
        "6 pm",
        "3.5",
        "Critical; Aadhaar; DPDP",
    ],
    [
        "3",
        "Offer revise + batch dates",
        "Comp change; batch start-date; fewer letters",
        "10",
        "2.5",
        "75%",
        "7 pm",
        "2.7",
        "Medium; retention",
    ],
    [
        "4",
        "India Fraud KYC architecture",
        "PS enablement; UDMF+BGV; honest Aadhaar",
        "10",
        "2.5",
        "75%",
        "2 pm",
        "9.4",
        "Medium; partner DPAs",
    ],
    [
        "5",
        "HiredScore India anchors",
        "Beta playbook; funnel KPIs",
        "10",
        "2.75",
        "65%",
        "4 pm",
        "4.5",
        "High; EU AI Act; oversight",
    ],
    [
        "6",
        "CPaaS + Broadbean runbooks",
        "+91 SMS; boards; WhatsApp partner paths",
        "10",
        "2.25",
        "70%",
        "3 pm",
        "5.3",
        "Medium; consent",
    ],
    [
        "7",
        "Mass offers + bulk BGC",
        "Bulk offers; BGC reinit; lawful purge",
        "10",
        "2.75",
        "70%",
        "10 pm",
        "1.9",
        "High; BGV minimisation",
    ],
    [
        "8",
        "Approvals + dashboards",
        "JR/offer BPs; SLA dashboards",
        "10",
        "2.25",
        "65%",
        "8 pm",
        "1.8",
        "Low-medium; DPDP audit",
    ],
    [
        "9",
        "Regional campaign consent",
        "Opt-out where lawful; unblock reach",
        "8",
        "2.25",
        "50%",
        "5 pm",
        "1.8",
        "Critical; DPDP marketing",
    ],
    [
        "10",
        "Pre-hire no-show status",
        "Avoid attrition KPI distortion",
        "7",
        "1.75",
        "60%",
        "4 pm",
        "1.6",
        "Low",
    ],
]

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [
            {
                "rows": handoff_rows,
                "left_inches": 0.2,
                "top_inches": 1.0,
                "width_inches": 9.6,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Table supports portfolio review and sequencing.\n"
            "• Rows one to two (duplicate or source; ID and offer UX): 060 flags CRITICAL RISK; legal counsel before customer commitment.\n"
            "• Row five (HiredScore): CRITICAL RISK on automated screening trajectories; EU AI Act high-risk duties.\n"
            "• Row nine (regional campaign consent): CRITICAL RISK on marketing opt-out design under DPDP.\n\n"
            "References:\n"
            "• research/India/legal-compliance-review-2026-03-30-IN-PMF-001.md\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    }
)

slides.append(section(14, "Closing"))
slides.append({"master_index": MI, "layout_name": "Bumper Slide"})


def _pestel_anchor_hits(text: str) -> int:
    """Rough anchor count: URLs, named sources, DA-*, file paths, years, metrics."""
    n = len(re.findall(r"https?://\S+", text))
    n += len(re.findall(r"\bDA-[A-Z0-9-]+\b", text))
    n += len(re.findall(r"research/[\w/.-]+\.md", text))
    n += len(re.findall(r"\b20\d{2}\b", text))
    n += len(
        re.findall(
            r"\d+\.\d+\s*percent|\d+%|USD\s*[\d.]+|INR|CAGR|BPO|GCC|DPDP|UPI|SEBI|BRSR|ESG|LODR",
            text,
            re.I,
        )
    )
    return n


def _pestel_bullet_units(bullet: str) -> int:
    """Sentence-like units: split on period, semicolon, or em-dash clause boundaries."""
    parts = re.split(r"(?<=[.;])\s+|\s+;\s+|,\s+(?=and |or )", bullet)
    return len([p for p in parts if len(p.strip()) > 25])


def run_content_density_validation() -> list:
    """Pre-generation validation (130 protocol). Returns list of error strings."""
    errs = []
    n_slides = len(slides)
    if not (50 <= n_slides <= 60):
        errs.append(f"Slide count {n_slides} outside 50-60")

    for i, s in enumerate(slides):
        ph = s.get("placeholders") or {}
        t0 = (ph.get("0") or {}).get("text") or ""
        if t0 and len(t0) > 45:
            errs.append(f"Slide {i + 1} title {len(t0)} chars (>45): {t0!r}")

    for title, bullets, impl, _refs in PESTEL:
        env = title == "Environmental"
        exp_b = 4 if env else 5
        if len(bullets) != exp_b:
            errs.append(f"PESTEL {title}: expected {exp_b} bullets, got {len(bullets)}")
        if len(impl.split()) < 50:
            errs.append(f"PESTEL {title}: product implication <50 words ({len(impl.split())})")
        slide_text = " ".join(bullets) + " " + impl
        if _pestel_anchor_hits(slide_text) < 5:
            errs.append(
                f"PESTEL {title}: slide anchor count <5 (heuristic across bullets + implication)"
            )
        for bi, b in enumerate(bullets):
            units = _pestel_bullet_units(b)
            if not (2 <= units <= 6):
                errs.append(
                    f"PESTEL {title} bullet {bi + 1}: expected 2-3 sentence-like units (allow to 6), got {units}"
                )

    for s in slides:
        ph = (s.get("placeholders") or {}).get("0") or {}
        title = ph.get("text") or ""
        m = re.match(r"^(P[1-4]) - ", title)
        if not m:
            continue
        pid = m.group(1)
        tbs = s.get("text_boxes") or []
        if not tbs:
            continue
        paras = tbs[0].get("paragraphs") or []
        themes = quotes = jtbds = 0
        for p in paras:
            lvl = p.get("level")
            txt = p.get("text")
            if isinstance(txt, list):
                bold = any(
                    isinstance(r, dict) and r.get("bold") for r in txt if isinstance(r, dict)
                )
                if lvl == 0 and bold:
                    themes += 1
                elif lvl == 1:
                    st = "".join(
                        r.get("text", "") if isinstance(r, dict) else str(r) for r in txt
                    )
                    if st.strip().startswith("When "):
                        jtbds += 1
                    elif '"' in st:
                        quotes += 1
                    else:
                        errs.append(f"{pid}: level-1 line neither quote nor JTBD: {st[:50]!r}")
            elif isinstance(txt, str):
                if lvl == 0:
                    themes += 1
                elif lvl == 1:
                    if txt.strip().startswith("When "):
                        jtbds += 1
                    elif '"' in txt:
                        quotes += 1
        n_lines = themes + quotes + jtbds
        if not (2 <= themes <= 3):
            errs.append(f"Customer {pid}: theme subheaders {themes} (want 2-3)")
        if not (3 <= quotes <= 4):
            errs.append(f"Customer {pid}: quotes {quotes} (want 3-4)")
        if not (2 <= jtbds <= 3):
            errs.append(f"Customer {pid}: JTBD lines {jtbds} (want 2-3)")
        if not (7 <= n_lines <= 8):
            errs.append(f"Customer {pid}: total lines {n_lines} (want 7-8)")

    rec_slides = [
        s
        for s in slides
        if ((s.get("placeholders") or {}).get("0") or {}).get("text", "").startswith(
            "Recommendation "
        )
    ]
    if len(rec_slides) != 5:
        errs.append(f"Expected 5 recommendation slides, got {len(rec_slides)}")
    need_headers = {"Problem", "Evidence", "Recommendation", "Why now", "Success metrics"}
    for rs in rec_slides:
        paras = (rs.get("text_boxes") or [{}])[0].get("paragraphs") or []
        heads = set()
        for p in paras:
            txt = p.get("text")
            if not isinstance(txt, list):
                continue
            for r in txt:
                if isinstance(r, dict) and r.get("bold") and isinstance(r.get("text"), str):
                    t = r["text"].strip()
                    if t in need_headers:
                        heads.add(t)
        missing = need_headers - heads
        if missing:
            errs.append(f"Recommendation slide missing sections: {missing}")

    return errs


validation_errors = run_content_density_validation()
print("--- Content Density Validation Report ---")
if validation_errors:
    for e in validation_errors:
        print(f"FAIL: {e}")
    print(f"\nBLOCKED: {len(validation_errors)} validation error(s).")
    sys.exit(1)
print("PASS: PESTEL bullets, implication word count, anchor heuristic, titles <=45 chars,")
print("      customer P1-P4 density, five recommendation structures, slide count 50-60.")
print("--- End report ---\n")

OUT.write_text(json.dumps(slides, indent=2), encoding="utf-8")
print(f"Wrote {OUT} with {len(slides)} slides")
