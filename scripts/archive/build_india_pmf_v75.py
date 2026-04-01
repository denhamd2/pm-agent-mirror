#!/usr/bin/env python3
"""Generate slides_spec_v75.json for India PMF roadmap (INDIA-E2E-004)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "slides_spec_v75.json"

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
        "Suite hire-to-retire coherence; unified security; onboarding handoffs suit November 2025 labour-code documentation.",
        "DPDP-aligned configurable consent, retention, purge; credible versus marketing-only compliance claims.",
        "Hindi and bulk grid actions; mobile recruiter supports high-volume India operating models.",
        "HiredScore and Paradox offset semantic and scheduling gaps when licensed with governance.",
        "EU AI Act and GDPR documentation supports GCCs hiring into EMEA on same tenant.",
    ]
    W = [
        "Native Workday SMS to +91 is a true gap; CPaaS workaround needs PS validation.",
        "Native WhatsApp in core Recruiting UI is a true gap versus regional suite narratives.",
        "Semantic AI without HiredScore or Workday AI SKU is a perceived gap in AI-heavy RFPs.",
        "India board multipost is Broadbean-class workaround; gaps when partner coverage misses a board.",
        "Paradox-grade conversational scheduling is workaround unless Paradox is active.",
    ]
    O = [
        "Q2 India row: eight wins with DPDP and boards elevates trust and sourcing proof.",
        "Deloitte India 2026: compliance is top AI barrier; governed HiredScore can win versus opaque demos.",
        "Broadbean escalation playbook closes multipost stories without native board build.",
        "Four labour codes increase need for employment metadata from offer to HCM.",
        "Fraud and Aadhaar misuse press raises demand for authenticated, minimised PII journeys.",
    ]
    T = [
        "Darwinbox, Keka, Zoho bundle omnichannel and TCO; pressure mid-market and subsidiaries.",
        "SAP SmartRecruiters and Oracle Recruiting Booster sharpen enterprise AI and integration bars.",
        "Phased DPDP and EU AI Act diligence slows AI rollouts; simple AI vendors win short cycles.",
        "GCC as company Priority 1 versus India Medium risks perception of deprioritisation.",
        "Premium SaaS faces procurement pressure despite strong GDP; many ATS options confuse shortlists.",
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
            "• Source: swot-analysis-India-2026-03-30-INDIA-E2E-004.md\n\n"
            "References:\n"
            "• research/India/swot-analysis-India-2026-03-30-INDIA-E2E-004.md\n"
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
            "• research/competitive/in/in-competitive-scan-2026-03-30-INDIA-E2E-004.md"
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
        "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
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
                "text": "India PMF is defined by extreme scale, trust and identity risk, and brittle offer paths; five internal experts and five customer voices (P1 to P5) triangulate on duplicates, agency source rules, India IDs and OTP friction, and channel versus audit tension.",
            },
            {
                "level": 1,
                "text": "Q2 strategy names India as medium scale with eight wins, DPDP readiness, and local boards via certified partner distribution; AI matching and core ATS parity are levers, while another region remains the top corporate priority, creating airtime tension.",
            },
            {
                "level": 1,
                "text": "Competitive intelligence flags true gaps on native +91 SMS, native WhatsApp in core UI, native direct Naukri-class multipost, and full semantic AI without AI SKUs; native Hindi, DPDP-style controls, and bulk actions defend enterprise deals.",
            },
            {
                "level": 1,
                "text": "Presales win-loss exports held no India rows this cycle; gap themes lean on interviews, competitive matrices, and regulatory research until CRM exports improve.",
            },
            {
                "level": 1,
                "text": "Roadmap emphasis: board coverage proof, partner messaging architecture, duplicate and source depth with counsel on identifiers, consent model optionality, and offer lifecycle hardening with audit evidence.",
            },
        ],
        alt=True,
        speaker=(
            "• Open with scale and fraud before features.\n"
            "• Name DPDP and May 2027-oriented buyer expectations.\n"
            "• Acknowledge win-loss data gap transparently.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
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
                "text": "Triangulate internal SME patterns with customer evidence to score business and customer impact using a consistent RICE-style model.",
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
            "• research/India/strategy-context-2026-03-30-INDIA-E2E-004.md"
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
            "• research/India/strategy-context-2026-03-30-INDIA-E2E-004.md"
        ),
    )
)
slides.append(
    title_only(
        "India Market Momentum - Key Indicators",
        [
            {
                "level": 1,
                "text": "India HR technology market commonly cited around USD 1,120 million in 2024 with forecasts toward roughly USD 2,300 million by 2033 near eight percent CAGR; definitions vary by segment.",
            },
            {
                "level": 1,
                "text": "IMF FY26 GDP growth forecast near 7.3 percent supports continued enterprise software investment despite global headwinds.",
            },
            {
                "level": 1,
                "text": "Nasscom via Business Today February 2026 points to on the order of 135,000 industry net adds in FY26 with GCC demand; reinforces high-volume recruiting product needs.",
            },
            {
                "level": 1,
                "text": "IDC-style public cloud projections toward USD 25.5 billion by 2028 at roughly 24 percent CAGR reinforce API-first integrations and SaaS procurement norms.",
            },
            {
                "level": 1,
                "text": "DataReportal January 2025 basis shows 806 million internet users and 1.12 billion mobile connections; mobile-first apply and messaging norms shape candidate expectations.",
            },
        ],
        alt=False,
        speaker=(
            "• Use ranges not false precision on market size.\n"
            "• Link cloud growth to integration expectations.\n\n"
            "References:\n"
            "• research/India/pestel-analysis-India-2026-03-30-INDIA-E2E-004.md\n"
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
            "• research/India/strategy-context-2026-03-30-INDIA-E2E-004.md"
        ),
    )
)
slides.append(
    title_only(
        "Regional Expansion Strategy",
        [
            {
                "level": 1,
                "text": "India: medium scale priority; eight wins; DPDP; local boards via partner.",
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
            "• research/India/strategy-context-2026-03-30-INDIA-E2E-004.md"
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
            "• research/India/strategy-context-2026-03-30-INDIA-E2E-004.md"
        ),
    )
)

# PESTEL
PESTEL = [
    (
        "Political",
        [
            "On 21 November 2025 India implemented four consolidated labour codes covering wages, industrial relations, social security, and occupational safety, replacing twenty-nine legacy statutes per Reuters; thresholds for prior approval on layoffs shifted from one hundred toward three hundred workers in reporting.",
            "Reforms explicitly define gig and platform work, extend minimum wages and social security narratives toward platform workers, and allow night-shift permissions for women subject to safety safeguards; unions cite concerns on worker rights erosion.",
            "MeitY leads DPDP rulemaking and AI advisories while CERT-In 2022 directions still shape logging and rapid incident reporting expectations for cloud buyers evaluating recruiting stacks.",
            "State-level rules and enforcement vary after central codes set floors; staffing, contract labour registration, and statutory forms still need jurisdiction-specific validation in implementations.",
            "Digital-policy momentum increases expectations for accountable processing, labelled AI on significant platforms, and demonstrable maps between product controls and advisory language in enterprise RFPs.",
        ],
        "Workday should treat India as a dual-track compliance market: surface labour-code-aligned hiring documentation patterns including appointment letters, fixed-term employment, and gig-related benefit tracking where customers model platform work, and maintain clear maps between product controls and DPDP and AI advisory expectations because political signalling and enforcement capacity are rising together.",
        "• Reuters labour codes: https://www.reuters.com/business/world-at-work/india-announces-implementation-new-codes-reform-labour-laws-2025-11-21/\n• Mondaq DPDP rules: https://www.mondaq.com/india/privacy-protection/1715184/meity-notifies-dpdp-rules-enforcement-timelines-and-formation-of-the-board",
    ),
    (
        "Economic",
        [
            "India HR technology market commonly estimated near USD 1,120 million in 2024 with forecasts such as USD 2,300 million by 2033 near eight percent CAGR in trade summaries; segment definitions differ between payroll, HCM, and recruiting point tools.",
            "IMF FY26 GDP growth forecast near 7.3 percent in February 2026 press relay supports continued enterprise software appetite despite global uncertainty.",
            "Nasscom via Business Today 24 February 2026 cites on the order of 135,000 net industry adds in FY26 versus roughly 133,000 prior year with GCC hiring as a driver; AI-related revenue estimates appear in the USD 10 to 12 billion range in the same reporting.",
            "IDC press summaries project Indian public cloud services toward USD 25.5 billion by 2028 at roughly 24.3 percent CAGR 2023 to 2028 with SaaS as the largest deployment category.",
            "Directional growth on cloud migration, employee experience, and automation elevates ROI expectations for time-to-fill and coordinator efficiency in recruiting purchases.",
        ],
        "The economic stack of growing HR tech spend, cloud-first procurement, and GCC-led hiring volume supports Workday enterprise positioning and AI automation ROI narratives when implementations measurably shorten time-to-fill and reduce coordinator load; TCO stories should acknowledge competitive ATS and HRMS alternatives common in India mid-market and enterprise accounts.",
        "• OpenPR HR tech sizing: https://www.openpr.com/news/3948664/india-human-resource-hr-technology-market-size-worth-usd-2-300\n• Business Today Nasscom: https://www.businesstoday.in/latest/corporate/story/it-industry-likely-to-hire-135000-employees-in-fy26-projects-nasscom-517760-2026-02-24\n• IDC cloud PR: https://www.idc.com/getdoc.jsp?containerId=prAP52965924",
    ),
    (
        "Social",
        [
            "DataReportal Digital 2025 India reports 1.12 billion cellular mobile connections representing 76.6 percent of population, 806 million internet users at 55.3 percent penetration, and population near 1.46 billion with median age near 28.8 years.",
            "LinkedIn India ad reach near 150 million early 2025 on DataReportal basis is one comparable signal; Moneycontrol 2026 cites higher member headlines requiring methodology reconciliation before hard claims.",
            "WhatsApp is widely described as India’s largest national market for Meta; short-message channels are socially normative for scheduling, reminders, and status even when employers prefer email for audit.",
            "Press summaries of PLFS-style releases in early 2026 discuss female labour force participation near 35 percent with urban rural splits; inclusive sourcing remains politically salient.",
            "2025 law-enforcement busts of fake job rackets reported in Indian press show systematic misuse of resumes, Aadhaar copies, and forged offer letters; employers expect branded, minimised, and authentic communications.",
        ],
        "Workday Recruiting should prioritise mobile-first candidate journeys, credible branded communications to combat fraud perception, and messaging-channel options that match India norms while localising languages beyond English for high-volume roles; align with Q2 strategy on multi-channel engagement without assuming a single default channel.",
        "• DataReportal India: https://www.datareportal.com/reports/digital-2025-india\n• Economic Times job fraud sample: https://hr.economictimes.indiatimes.com/news/industry/delhi-cyber-police-bust-fake-job-recruitment-racket-hundreds-affected/122066095",
    ),
    (
        "Technological",
        [
            "Deloitte India 24 March 2026 enterprise AI study reports 40 percent of Indian respondents citing significant or full AI usage versus roughly 28 percent global, with at-scale deployment strong in product development, strategy and operations, marketing and sales, and supply chain.",
            "Ninety-four percent expect AI spend to increase; 68 percent prioritise security and compliance controls; 39 percent cite regulatory or compliance requirements as the top AI integration challenge in the same study.",
            "BCG-relayed trade press claims high GenAI penetration in HR cohorts with uneven realised impact, signalling governance and measurement gaps typical of early scale adoption.",
            "Nasscom-linked commentary emphasises hybrid domain and technology skills and reduced campus hiring peaks versus history, shifting ATS value toward skills inference, internal mobility, and pipeline analytics.",
            "MeitY 2024 advisories on labelling under-tested AI, bias and electoral integrity, and metadata for synthetic content add non-DPDP transparency expectations for platform deployers summarised in CyberPeace and Mondaq analyses.",
        ],
        "Workday should activate HiredScore and Paradox with India-relevant governance including role-based access, human-in-the-loop shortlisting, logging for audit, and disclosures that satisfy DPDP notices and security reviews; use Deloitte’s compliance-barrier finding to pre-empt procurement objections with reference architectures and assessment artefacts where customers mirror EU AI Act practice.",
        "• Deloitte India AI press: https://www.deloitte.com/in/en/about/press-room/indian-enterprises-lead-global-peers-in-at-scale-ai-adoption-across-most-functions.html\n• Mondaq MeitY AI advisory: https://www.mondaq.com/india/new-technology/1500884/revised-meity-advisory-on-deployment-of-ai-models",
    ),
    (
        "Environmental",
        [
            "SEBI Business Responsibility and Sustainability Reporting drives mandatory workforce-related disclosures for listed entities including gender split and disability counts in many filings; recruiting is an upstream lever for externally assured demographics.",
            "Large FY2024-25 BRSR PDFs from major banks and industrials show granular employee demographics, reinforcing that diversity metrics are board- and investor-visible for many customers.",
            "Reuters November 2024 and pv magazine India late 2025 highlight skills shortages in renewable energy despite rapid capacity growth; Rediff March 2026 cites sharp recruitment growth in clean energy with compensation pressure.",
            "DATA GAP: India does not impose recruiting-specific environmental reporting like EU CSRD; environmental factors are indirect via sector hiring and ESG narratives rather than ATS compliance mandates.",
            "Green skills demand still warrants vertical sourcing packs and skills ontology hooks for customers hiring into infrastructure and energy transition roles.",
        ],
        "Prioritise diversity and workforce analytics handoffs to HCM that align with BRSR-relevant metrics, and offer vertical skills content for renewable energy and infrastructure customers; no standalone environmental compliance module is required for recruiting beyond interfaces customers already expect from the suite.",
        "• ICICI BRSR example PDF: https://www.icicibank.com/content/dam/icicibank/managed-assets/docs/investor/annual-reports/2025/icici-bank-brsr-2025.pdf\n• Reuters green skills: https://www.reuters.com/business/energy/skills-shortage-hobbles-indias-clean-energy-aspirations-2024-11-20/",
    ),
    (
        "Legal",
        [
            "Digital Personal Data Protection Act 2023 with DPDP Rules notified 14 November 2025 establishes Data Fiduciaries and Data Principals; Mondaq summaries describe phased commencement including core processing duties around 14 May 2027 for many fiduciary obligations.",
            "Notice and consent must be clear, plain, itemised, with withdrawal and complaint pathways; security safeguards, processor contracts, retention schedules, and logging are expected programme elements.",
            "Breach reporting summaries point to Board and data principal notification with roughly 72-hour summary to the Board once aware in common legal commentary; exact enforcement posture will clarify as the Board operates.",
            "GDPR remains authoritative for EU and EEA candidates and remote hiring into Europe; Articles 5 through 9, 13 through 14, 17, 20, 22, 35, and 44 through 50 remain the diligence spine for multinational templates.",
            "EU AI Act Annex III treats relevant employment and recruitment AI as high-risk; Articles 9 through 15 impose risk management, data governance, documentation, logging, transparency, human oversight, and accuracy duties with database registration timelines per official EU materials.",
        ],
        "Workday Recruiting must implement India-first privacy UX and backend controls mapping to DPDP including granular notices for application, talent community, and screening flows, fast auditable responses for access correction and erasure, breach playbooks aligned to 72-hour Board reporting summaries, and significant data fiduciary workflows for large customers; preserve GDPR and EU AI Act parity for global templates because India-based GCCs routinely hire into EMEA and contract for EU-grade assurances.",
        "• Mondaq DPDP rules: https://www.mondaq.com/india/privacy-protection/1715184/meity-notifies-dpdp-rules-enforcement-timelines-and-formation-of-the-board\n• GDPR: https://gdpr-info.eu/\n• EU AI Act explorer: https://artificialintelligenceact.eu/ai-act-explorer/",
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
                "text": "Gap themes rely on customer interviews, competitive intelligence, internal expert interviews, and macro-regulatory research until presales exports add India-scoped rows.",
            },
            {
                "level": 1,
                "text": "Next step: enrich Tableau or CRM exports with region tags and severity to unlock theme charts in future readouts.",
            },
        ],
        alt=True,
        speaker=(
            "• Be transparent about evidence limits.\n"
            "• Commit to data hygiene for the next deck refresh.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
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
                "text": "No internal brainstorm or ideation CSV was ingested for this mission; Step five did not run.",
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
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
        ),
    )
)

slides.append(section(9, "SME interviews"))
slides.append(
    title_only(
        "Internal SME Interviews - Experts",
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
                "text": "Limitation: selection bias toward large accounts and delivery-heavy themes; triangulate with P1 to P5 evidence in later sections.",
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
                    "Customer P2 and P5 offer volume and statutory ID pain echo configuration and throughput tension.",
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
                    "Customer P5 email-first audit preference contrasts with WhatsApp norm; policy-controlled optionality required.",
                ],
            ),
        ],
    )
)
slides.append(
    sme_slide(
        "SME4",
        "David Lodola",
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
        "David Phillips",
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
                "text": "Five senior recruiting leaders from one high-volume India enterprise programme captured across two onsite group sessions in December 2025.",
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
            "• Anonymise as P1 to P5 with company name retained per policy.\n\n"
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
                        "Recruiting lead, agent hiring India site",
                        "TP",
                    ],
                    [
                        "P2",
                        "Frontline hiring lead, North and East India",
                        "TP",
                    ],
                    ["P3", "Recruitment Manager, specialised team", "TP"],
                    [
                        "P4",
                        "Recruitment Manager, reqs and onboarding",
                        "TP",
                    ],
                    [
                        "P5",
                        "Recruitment Manager, leadership confidential",
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
        "Recruiting lead, TP",
        [
            {
                "theme": "Volume and org metadata",
                "quotes": [
                    '"In a week… normally the numbers would be somewhere around 100… in a month, we hire around 800… to 1,000." - insight on seasonal spikes (P1, TP).',
                    '"There is a supervisory org which you need to attach… we are randomly picking up right now." - governance risk at req creation (P1, TP).',
                    '"It\'s a manual activity… duplicate check option." - duplicate handling cost (P1, TP).',
                ],
                "jtbd": [
                    "When we run high-volume agent hiring in India, I want demand and candidate records to stay clean without per-profile manual checks, so we avoid wrong org tagging and duplicate submissions.",
                    "When referrals and vendors flood the funnel, I want automated duplicate rules beyond name and phone, so agency disputes shrink.",
                ],
            }
        ],
    )
)
slides.append(
    p_slide(
        "P2",
        "Frontline hiring lead, TP",
        [
            {
                "theme": "Peak risk and duplicates",
                "quotes": [
                    '"When there was a peak… we got really hit bad… delays in joining." - go-live timing pain (P2, TP).',
                    '"Duplication needs to get automated… validation… Aadhar… if that duplication check is done on their ADHAR number." - identifier ask (P2, TP).',
                    '"For a recruiter\'s life cycle… most of the time they spend on Workday." - workflow centrality (P2, TP).',
                ],
                "jtbd": [
                    "When we run national frontline ramps, I want hiring and day-one readiness on the critical path, so client SLAs hold.",
                    "When agencies upload at scale, I want first-in-window source credit, so finance exposure from last-touch rules drops.",
                    "When offers change daily, I want regenerate and rescind inside the system, so legal teams stop manual letters at hundreds per day.",
                ],
            }
        ],
    )
)
slides.append(
    p_slide(
        "P3",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Manager bandwidth",
                "quotes": [
                    '"Their performance… setting their goals… how they working… set the agenda for day-to-day basis." (P3, TP).',
                    '"Manager overhead split between recruiting delivery and HR systems that are slow or error-prone." - Step 8 synthesis (P3, TP).',
                    '"We need people and hiring workflows in one reliable system." - desired end state (P3, TP).',
                ],
                "jtbd": [
                    "When I lead a recruiting pod, I want people and hiring workflows in one reliable system, so admin does not crowd out sourcing.",
                    "When HR processes break, I want fast fixes, so recruiters return to candidate-facing work.",
                ],
            }
        ],
    )
)
slides.append(
    p_slide(
        "P4",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Approvals and onboarding",
                "quotes": [
                    '"On email we have approvals… once I have all of these approvals… is when I raise a job requisition." (P4, TP).',
                    '"Once a person joins… you have to go back and complete the onboarding steps… if you don\'t do that then you\'re not a part of the payroll." (P4, TP).',
                    '"Approvals and financial metadata often unclear… multi-day back-and-forth and missed offer SLAs." - Step 8 synthesis (P4, TP).',
                ],
                "jtbd": [
                    "When I open reqs and onboard joiners, I want correct org data up front, so payroll and no-show handling stay clean.",
                    "When approvals sit in email, I want in-product threads, so twenty-four to forty-eight hour SLAs become real.",
                ],
            }
        ],
    )
)
slides.append(
    p_slide(
        "P5",
        "Recruitment Manager, TP",
        [
            {
                "theme": "Reporting and approvals",
                "quotes": [
                    '"Workday is just a tool… we are not able to pull any reports." - analytics gap (P5, TP).',
                    '"Approvals through Workday… we are taking it offline." - audit desire (P5, TP).',
                    '"Government identifiers… once the candidate accept all the policies suddenly it vanishes." - India ID task UX (P5, TP).',
                    '"We\'re losing about 16, 17% people… in the time… to release the offer." - leakage estimate (P5, TP).',
                ],
                "jtbd": [
                    "When I run confidential leadership searches, I want approvals and evidence in one auditable flow, so executives trust the process.",
                    "When India statutory IDs and OTP stall, I want reliable tasks, so specialised hiring stops leaking before join.",
                    "When channels are chosen, I want email-first traceability options, so compliance teams accept outreach design.",
                ],
            }
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
            "Fabiola universal offer compensation complexity aligns with P2 hundreds of offers per day and P5 ID and OTP leakage.",
            "Joiner conversion and recruiter hours; competitor speed stories bite if auditability lags.",
            "Harden offer lifecycle, statutory task semantics, OTP reliability, and audit exports.",
        )
        + theme_block(
            "Documents and background checks",
            "SME attachment hub and reinitiate BGC themes overlap P5 disappearing identifier fields after policy acceptance.",
            "Email workarounds increase breach and minimisation risk; services cost rises.",
            "Stage-flexible candidate document capture with retention hooks.",
        ),
        alt=False,
        speaker=(
            "• Three themes per slide keeps pacing.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
        ),
        font_pt=12,
    )
)
slides.append(
    title_only(
        "Validated Themes 4-5 (Operations and Channels)",
        theme_block(
            "Industrial mass operations",
            "Phillips five clusters and Lodola cohort starts align with P2 national scale context.",
            "Wins in SI and BPO segments need purge, merge, and list disposition depth.",
            "Bulk safe processes with security and audit for DPDP.",
        )
        + theme_block(
            "Channels and consent",
            "Santosh WhatsApp and opt-in starvation contrast P5 email-first compliance preference.",
            "Omnichannel demos in RFPs clash with tenant policy reality.",
            "Configurable consent models and partner messaging with logged threads.",
        ),
        alt=True,
        speaker=(
            "• Call out WhatsApp versus email tension explicitly.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
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
                        "SME view",
                        "Customer",
                        "PMF impact",
                    ],
                    [
                        "Trust and fraud",
                        "KYC, impersonation, interview ID",
                        "Manual dup; Aadhaar ask; agency exposure",
                        "High",
                    ],
                    [
                        "Offer and hire",
                        "Two docs; calc heavy offers",
                        "Regenerate; rescind; ID OTP leakage",
                        "High",
                    ],
                    [
                        "Documents and BGC",
                        "Attachment hub; reinitiate BGC",
                        "ID field behaviour",
                        "Medium high",
                    ],
                    [
                        "Mass operations",
                        "DNH purge merge",
                        "National scale context",
                        "High BPO",
                    ],
                    [
                        "Channels",
                        "WhatsApp; opt-in pain",
                        "Email audit preference",
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
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
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
                        "P5 sourcing narrative",
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
                        "Duplicate and agency source rules; Aadhaar matching desire",
                        "🔴 HIGH",
                        "Manual duplicate check; counsel on identifiers",
                        "P1 P2 quotes",
                        "Automate safe parameters; legal review for IDs",
                    ],
                    [
                        "Schedule",
                        "Paradox-grade scheduling gap; WhatsApp norm",
                        "🟡 MEDIUM",
                        "Paradox when licensed; CPaaS paths",
                        "CI true gap; P5 email preference",
                        "Reference architecture with audit logging",
                    ],
                    [
                        "Offer",
                        "Regenerate rescind limits; acknowledgement-only offers; India ID tasks",
                        "🔴 HIGH",
                        "Manual legal letters; field workarounds",
                        "P2 P5",
                        "Offer lifecycle hardening and statutory UX",
                    ],
                    [
                        "Comply",
                        "Offline approvals; weak audit on identifiers",
                        "🟡 MEDIUM",
                        "Email evidence; screenshots",
                        "P4 P5",
                        "In-product approvals and retention-aware tasks",
                    ],
                    [
                        "Measure",
                        "Reporting and task noise; no pipeline dashboards",
                        "🟡 MEDIUM",
                        "Excel exports; delete-all-email behaviour",
                        "P5",
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
            "• Gap severities synthesised from research March 2026.\n"
            "• Validate workarounds with Deployment Agent thread dac6739f-1c6e-49cf-a587-a06d6a8ababc for parity rows.\n"
            "• Adjust severities after tenant-specific functional review.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }
)

slides.append(section(13, "Roadmap"))
slides.append(
    recommendation_slide(
        1,
        "Broadbean India Board Proof",
        "India deals fail when must-have boards are missing or unclear in multipost architecture; marketing claims from competitors stress one-click breadth.",
        "P5 cites sourcing friction; strategy row names local boards; matrix lists native direct multipost as true gap with partner workaround.",
        "Institutionalise per-deal Broadbean coverage checks for Naukri-class boards; escalate partner gaps; do not fund native board engineering.",
        "Q2 India win target and competitive RFP season require proof not anecdotes.",
        "Board coverage checklist completion: 0% to 100% on top ten India accounts in model; partner tickets opened within five days on misses.",
        "",
    )
)
slides.append(
    recommendation_slide(
        2,
        "India Messaging Reference Architecture",
        "Native +91 SMS and native WhatsApp in core UI are true gaps; buyers still need audited comms designs immediately.",
        "P5 wants email traceability; CI confirms channel gaps; strategy stresses multi-channel engagement.",
        "Publish presales-validated diagrams for CPaaS SMS, WhatsApp partner paths, Paradox scheduling, and logging expectations; run sales engineering workshop.",
        "Channel objections surface in every omnichannel-scored RFP now.",
        "Percentage of India qualified deals with signed-off messaging diagram: 0% to 80% in two quarters.",
        "",
    )
)
slides.append(
    recommendation_slide(
        3,
        "Duplicate, Source, and ID Depth",
        "Manual duplicate review and last-touch agency credit create finance and throughput risk at thousands of profiles per day.",
        "P1 and P2 central pain; P2 names Aadhaar as desired match key.",
        "Automate duplicate detection beyond name phone email where legally permissible; improve agency source windows; package counsel-approved guidance on national identifiers.",
        "Scale breaks appear at current volumes; fraud press elevates scrutiny.",
        "Manual duplicate touches per thousand hires: baseline high to fifty percent reduction in pilot tenant.",
        "\n• Legal (review): national ID matching is high sensitivity under DPDP minimisation; requires explicit lawful basis and likely DPIA-style assessment; EU AI Act and GDPR Article 22 analogues if scoring affects EU-hired candidates.",
    )
)
slides.append(
    recommendation_slide(
        4,
        "Marketing Consent Model Optionality",
        "Strict opt-in starves reach when thousands of candidates never actively opt in; campaigns stall at India volume.",
        "Santosh magic wand on opt-in; aligns to DPDP-era sophistication if counsel approves region policy.",
        "Configurable opt-out with unsubscribe for India marketing where approved; retain strict opt-in where EU requires; instrument reach metrics.",
        "Without change, sourcing cost rises versus competitors with simpler consents.",
        "Reachable candidate rate for India campaigns: plus fifteen to twenty five points where legally viable.",
        "",
    )
)
slides.append(
    recommendation_slide(
        5,
        "Candidate Document Attachment Hub",
        "Review document misuse and email channels leak PII and break BGC handoffs.",
        "SME attachment hub overlaps P5 ID journey pain.",
        "Profile-linked document requests across stages; reduce review document pattern; align retention to DPDP purpose limitation.",
        "Services spend and audit risk compound each quarter at scale.",
        "Email-document exceptions per thousand hires: down thirty percent in pilot.",
        "",
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
        "Legal note",
    ],
    [
        "1",
        "Broadbean proof",
        "Validate boards; escalate partner",
        "2,000",
        "2.5",
        "90%",
        "1 pm",
        "4,500",
        "DPDP vendor DPA",
    ],
    [
        "2",
        "Messaging architecture",
        "CPaaS WhatsApp Paradox diagrams",
        "4,000",
        "2.25",
        "90%",
        "2 pm",
        "4,050",
        "Consent AI disclosure",
    ],
    [
        "3",
        "ID matching programme",
        "Automate dup; counsel on IDs",
        "4,000",
        "2.75",
        "85%",
        "8 pm",
        "1,169",
        "DPDP sensitive ID",
    ],
    [
        "4",
        "Consent opt-out India",
        "Region policy",
        "3,000",
        "3.0",
        "75%",
        "6 pm",
        "1,125",
        "Marketing law",
    ],
    [
        "5",
        "Attachment hub",
        "Stage-flexible docs",
        "2,500",
        "2.25",
        "75%",
        "5 pm",
        "844",
        "Retention erasure",
    ],
    [
        "6",
        "Offer lifecycle",
        "Rescind regenerate OTP",
        "3,500",
        "2.5",
        "80%",
        "10 pm",
        "700",
        "DPDP transparency",
    ],
    [
        "7",
        "Mobile parity",
        "Close mobile gaps",
        "3,500",
        "2.0",
        "70%",
        "8 pm",
        "613",
        "Device security",
    ],
    [
        "8",
        "HiredScore governance",
        "Beta with logs oversight",
        "1,500",
        "2.75",
        "65%",
        "6 pm",
        "447",
        "EU AI Act high risk",
    ],
    [
        "9",
        "Req approvals",
        "In-product metadata",
        "3,000",
        "2.25",
        "75%",
        "12 pm",
        "422",
        "Audit segregation",
    ],
    [
        "10",
        "Notifications reporting",
        "SLA dashboards",
        "2,500",
        "1.75",
        "70%",
        "8 pm",
        "383",
        "PII minimisation",
    ],
    [
        "11",
        "DNH purge merge",
        "Bulk disposition",
        "2,000",
        "2.0",
        "70%",
        "9 pm",
        "311",
        "Fairness review",
    ],
    [
        "12",
        "Interview identity",
        "KYC analytics partners",
        "2,500",
        "2.5",
        "55%",
        "12 pm",
        "286",
        "Biometric ID sensitivity",
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
            "• Legal column highlights items three, eight, and twelve for counsel and privacy review.\n"
            "• Recommendation three: national ID matching needs DPDP minimisation and likely assessment.\n"
            "• Recommendation eight: HiredScore activation requires EU AI Act high-risk measures including human oversight and logging.\n"
            "• Recommendation twelve: interview-stage biometrics or strong ID flows need DPDP and cross-border transfer review.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-INDIA-E2E-004.md"
        ),
    }
)

slides.append(section(14, "Closing"))
slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2), encoding="utf-8")
print(f"Wrote {OUT} with {len(slides)} slides")
