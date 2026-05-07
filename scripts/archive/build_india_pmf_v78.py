#!/usr/bin/env python3
"""Emit slides_spec_v78.json for India PMF roadmap IN-PMF-001 (user-specified section set)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v78.json"
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
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
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
        "• Use anchored facts in live Q&A.\n"
        "• Connect factor narrative to India roadmap themes.\n"
        "• If challenged on dates, cite Mondaq and official circulars.\n"
        "• Emphasise May 2027 core DPDP conduct window where relevant.\n"
        "• Keep Product implication as the bridge to product actions.\n\n"
        f"References:\n{refs}"
    )
    return title_only(title, paras, alt=False, speaker=sn, font_pt=12)


def swot_cell_bullets(lines: list):
    return {"paragraphs": [{"level": 1, "text": t} for t in lines]}


def swot_slide():
    S = [
        "Enterprise suite and security posture: Recruiting inside HCM, Talent, and Learning supports hire-to-retire coherence valued by GCC, BFSI, and IT services parents in India.",
        "Compliance-first configuration: DPDP-style consent, retention, and purge patterns are configurable; Hindi language pack and bulk grid actions support India demos.",
        "UDMF duplicate detection and merge is native per India matrix triangulation; differentiator versus mid-market suites with uneven dedupe depth.",
        "Background verification orchestration via Job Application business process, Core Connector, and Studio gives a native framework for BGV initiation and tracking.",
        "HiredScore and Workday AI narratives align with Q2 AI candidate matching when licensed; credible for high-volume shortlisting with human oversight.",
    ]
    W = [
        "Native +91 SMS and native WhatsApp in core Recruiting UI are true gaps; competitors market SMS and WhatsApp aggressively for high-volume response.",
        "Native direct multipost to Naukri-class boards is a true gap; Broadbean-class multipost is a workaround to validate per deal.",
        "Government Aadhaar verification is not natively delivered; expect custom integration or BGV partner paths while competitors showcase document automation.",
        "Mobile recruiter offers partial parity versus desktop; high-volume coordinators feel friction versus mobile-first regional ATS narratives.",
        "Suite depth can present longer time-to-value versus INR-priced India suites (Keka, Zoho, Darwinbox) where about 41% of HR tech spend concentrates in mid-market segments.",
    ]
    O = [
        "Phased DPDP implementation through May 2027 for core notice, consent, rights, breach, and penalties gives a programmatic selling window for privacy-by-design recruiting.",
        "Fraud and credential discrepancy narratives plus scam press coverage increase BGV and audit trail budgets; framework plus partners story fits risk-aware CHROs.",
        "About 25% of India HR technology spend sits in recruitment applications (IMARC, 2025), supporting ATS replacement and AI upgrades in IT-heavy hiring.",
        "Significant Data Fiduciary DPIA discipline and algorithmic review hooks favour vendors who ship logging, contracts, and human review for automated ranking.",
        "Q2 India scale target of eight customer wins with explicit DPDP and local job boards focus creates a sharp internal mandate for sales, partners, and collateral.",
    ]
    T = [
        "Bundled India HR suites (Darwinbox, Keka, Zoho Recruit) combine ATS, payroll, strong local channels, and partner BGV at lower perceived TCO.",
        "SAP (SmartRecruiters embedding) and Oracle (Fusion agentic narratives) reinforce enterprise competition where Workday is not the sole AI story.",
        "Regulatory enforcement scale includes up to INR 250 crore penalties for security safeguard failures; board-level stakes for any high-volume candidate database.",
        "Price sensitivity and ROI proof in mid-market can commoditise screening features unless Workday proves time-to-fill, quality, and compliance ROI.",
        "Channel and board gaps in RFPs may disqualify on native Naukri or +91 SMS requirements; workarounds need professionally documented architecture.",
    ]
    return {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "SWOT - Workday Recruiting India"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [swot_cell_bullets(S), swot_cell_bullets(W)],
                    ["Opportunities", "Threats"],
                    [swot_cell_bullets(O), swot_cell_bullets(T)],
                ],
                "top_inches": 1.0,
                "left_inches": 0.35,
                "width_inches": 9.3,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• SWOT sourced from India SWOT artefact March 2026, not thematic report body.\n"
            "• Pair strengths with honest channel and board gaps.\n"
            "• Opportunities tie to DPDP runway and eight-win India row.\n"
            "• Threats include suite bundles and penalty scale.\n"
            "• Validate matrix classifications before customer commitments.\n\n"
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
            "• Use native versus workaround versus true gap language in discussion.\n"
            "• Validate SMS architecture with professional services before promises.\n"
            "• Reference India competitive matrix v1.6.\n\n"
            "References:\n"
            "• research/competitive/matrices/in-competitive-matrix.md\n"
            "• research/competitive/in/in-competitive-report-2026-03-30-IN-PMF-001.md"
        ),
    }


def recommendation_slide(n: int, short_title: str, problem: str, evidence: str, rec: str, why_now: str, metrics: str, speaker_extra: str = ""):
    title = f"Recommendation {n}: {short_title}"
    if len(title) > 45:
        title = f"Rec {n}: {short_title}"
    if len(title) > 45:
        title = title[:45]
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
        "• Tie evidence to anonymised customer codes in talk track.\n"
        "• Use metrics for quarterly review.\n"
        f"{speaker_extra}\n\n"
        "References:\n"
        "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md\n"
        "• research/India/legal-compliance-review-2026-03-30-IN-PMF-001.md"
    )
    return title_only(title, paras, alt=(n % 2 == 0), speaker=sn, font_pt=14)


# PESTEL bullets: sourced from research/India/pestel-analysis-India-2026-03-30-IN-PMF-001.md (March 2026)
PESTEL = [
    (
        "Political",
        [
            "Four consolidated labour codes (Wages; Industrial Relations; Social Security; OSH and Working Conditions) moved through 2025 to 2026 rules cycles; EY India reports nationwide implementation effective 21 November 2025, shifting how fixed-term and contract workforce models are administered for volume employers.",
            "Moneycontrol and similar summaries highlight fixed-term employment formalisation, adjusted retrenchment thresholds for smaller establishments, and gig or platform registration themes that change how hiring managers document cohort starts and separations.",
            "High-profile fake recruitment cases (for example CBI probes into impersonation rings targeting DRDO-style roles reported in The Hindu, 2025 to 2026) keep hiring integrity in national press and elevate background verification and identity discipline as reputational risk for enterprise TA.",
            "Public-sector integrity scandals reinforce buyer appetite for auditable source attribution, interview identity checks, and vendor-managed verification rather than informal trust in high-volume funnels.",
            "Principal versus contractor visibility expectations rise where blended workforces serve government-adjacent or regulated clients; enterprise India programmes must show consistent approval evidence across agencies and direct hires.",
        ],
        (
            "Workday should configure requisition and offer workflows for fixed-term and contract patterns with principal versus contractor visibility where customers track blended workforces, and align approval and audit evidence with labour-code-driven documentation expectations. "
            "Position verification capabilities as risk reduction for fraud-sensitive employers in BFSI, IT services, and GCC-led hiring without over-claiming native government identity APIs."
        ),
        "• EY India labour codes PDF: https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/alerts-hub/2025/11/new-labour-codes-implemented-across-the-country-effective-21-november-2025.pdf\n"
        "• Moneycontrol labour codes piece: https://www.moneycontrol.com/news/business/economy/india-s-new-labour-codes-reset-flexible-hiring-what-changes-for-fixed-term-and-contract-workers-13691270.html\n"
        "• The Hindu DRDO impersonation coverage: https://www.thehindu.com/news/national/cbi-registers-case-to-probe-fake-recruitment-racket-offering-jobs-in-drdo/article69262465.ece",
    ),
    (
        "Economic",
        [
            "IMARC sizes the India human resource technology market at approximately USD 1,208.26 million in 2025, projecting USD 2,329.11 million by 2034 at about 7.56% CAGR from 2026 to 2034; recruitment is the leading application segment at 25% share in 2025.",
            "IT end-use represents the largest vertical share at 32% in 2025 per the same IMARC taxonomy, consistent with high-volume hiring in IT, ITES, and GCC-led delivery centres that benchmark ATS throughput and AI screening ROI.",
            "Organisations with fewer than 1,000 employees represent 41% of the market (IMARC), signalling mid-market price pressure alongside enterprise deals where suite depth and global templates still win committee votes.",
            "Naukri remains the dominant online recruitment brand with very large resume inventory; Live Mint and trade reporting on Info Edge point to sustained recruitment revenue growth and continued product investment in AI shortlisting outside core ATS shells.",
            "Enterprise India buyers still run total cost of ownership math against INR-packaged suites; credible ROI stories require time-to-fill, recruiter capacity, and quality-of-hire metrics tied to verification and dedupe hygiene, not feature lists alone.",
        ],
        (
            "Workday should prioritise ROI narratives for time-to-fill, recruiter capacity, and quality of hire in high-volume segments, and pair them with a validated India board strategy through certified partner multipost coverage checked per deal. "
            "Realistic total cost of ownership framing versus INR suites should include partner SMS, verification, and integration load so finance sees the full picture behind licence lines."
        ),
        "• IMARC India HR technology: https://www.imarcgroup.com/india-human-resource-technology-market\n"
        "• Live Mint Info Edge / Naukri context: https://www.livemint.com/market/stock-market-news/info-edge-india-s-job-giant-naukri-99acres-jeevansathi-shiksha-financials-guidance-outlook-stock-performance-analysis-11747288141816.html",
    ),
    (
        "Social",
        [
            "India internet users crossed about 958 million in 2025 with roughly 8% year-on-year growth; Economic Times Brand Equity cites IAMAI-linked reporting showing rural users as a majority share and rapid uptake of short video and AI-assisted features.",
            "IDC notes about 152 million smartphone units shipped in India in 2025, flat year-on-year, with 2026 volumes expected to soften; mobile-first apply and messaging expectations remain structurally high even when device refresh slows.",
            "Vendor and industry commentary on workforce fraud remains directional; AuthBridge Workforce Fraud Files 2025 press summaries (via PSU Connect, 2025) cite single-digit discrepancy rates with spikes in employment and education checks, elevating verification budgets.",
            "Overseas job scams and impersonation coverage (for example Moneycontrol on embassy warnings, 2025 to 2026) reinforce candidate scepticism and employer spend on structured verification states inside ATS journeys.",
            "Trust signals in the candidate journey (who sees data, why, and retention) matter as much as recruiter throughput; high-throughput review without structured verification states repeats collection and erodes confidence.",
        ],
        (
            "Candidate journeys should surface clear trust signals about who sees personal data, why it is processed, and how long it is retained, while recruiter tools support high-throughput review with structured verification states and dedupe to limit repeated collection. "
            "This pairing reduces friction for mobile-heavy applicants and aligns with DPDP expectations on transparency and minimisation without turning the ATS into a covert profiling engine."
        ),
        "• ET Brand Equity / IAMAI user base: https://brandequity.economictimes.indiatimes.com/news/marketing/indias-internet-user-base-crosses-950-million-in-2025-iamai-report/127794708\n"
        "• IDC India smartphone 2025 to 2026: https://www.idc.com/resource-center/press-releases/india-smartphone-market-2025-2026/\n"
        "• PSU Connect AuthBridge summary: https://www.psuconnect.in/corporate-news/-workforce-fraud-files-2025-authbridge-exposes-india-hiring-red-flags\n"
        "• Moneycontrol overseas scam trend: https://www.moneycontrol.com/news/trends/russian-embassy-warns-indians-amid-fake-overseas-job-offers-report-fraudsters-to-law-enforcement-13870340.html",
    ),
    (
        "Technological",
        [
            "IMARC trend commentary positions AI-powered ATS, screening, and analytics as mainstream buyer expectations in India HR tech forecasts, raising the bar for credible human-in-the-loop demos versus unchecked automation claims.",
            "India AI governance is evolving via MeitY guidance and legislative proposals; Mondaq’s March 2026 DPDP and Rules analysis treats horizontal data protection as the first-line governance layer for AI that processes personal data in hiring.",
            "UIDAI maintains Aadhaar Authentication and Offline Verification Regulations, 2021 as the core instrument for regulated authentication; recruiting products typically integrate through regulated channels and BGV partners rather than ad hoc collection.",
            "High-volume India tenants expect performance, bulk actions, mobile recruiter flows, and integration clarity across processors, BGV vendors, and AI suppliers; weak orchestration narratives lose to suite bundles that pretend omnichannel is native everywhere.",
            "Workday baseline skills matching is native while advanced semantic tiers depend on Workday AI or HiredScore SKUs; honest SKU boundaries reduce bake-off surprises when committees compare against Zia-class demos.",
        ],
        (
            "For high volume, invest in performance, bulk actions, mobile recruiter flows, and integration clarity spanning processors, BGV vendors, and AI vendors with logged, purpose-limited processing aligned to notices. "
            "For AI-assisted hiring, ship human-in-the-loop defaults, explainability, and contract-ready documentation so India and EU-parent governance teams see one coherent story."
        ),
        "• IMARC India HR technology trends: https://www.imarcgroup.com/india-human-resource-technology-market\n"
        "• Mondaq DPDP and Rules 2025: https://www.mondaq.com/india/privacy-protection/1759134/indias-digital-personal-data-protection-act-and-the-dpdp-rules-2025-phased-commencement-core-obligations-and-a-board-ready-compliance-strategy\n"
        "• UIDAI regulations 2021: https://www.uidai.gov.in/en/about-uidai/legal-framework/updated-regulation/16312-aadhaar-authentication-and-offline-verification-regulations-2021.html",
    ),
    (
        "Environmental",
        [
            "SEBI mandates Business Responsibility and Sustainability Reporting for top listed entities; BRSR Core introduces phased assurance ladders for top 150, 250, 500, and 1,000 entities from FY 2023-24 through FY 2026-27 and expands value-chain disclosure expectations per SEBI circular July 2023.",
            "Principle 3 on employee well-being and value-chain reporting indirectly elevates responsible workforce metrics for large employers and their suppliers, influencing HR reporting packs that recruiting data must eventually feed.",
            "DATA GAP: limited authoritative public statistics tie BRSR directly to recruiting software purchasing in 2026; treat sustainability reporting as enterprise governance context rather than a standalone ATS buying trigger in most deals.",
            "Large employers may still export diversity and training metrics from HCM into sustainability disclosures; recruiting analytics should avoid scope creep into non-essential environmental personal data while supporting clean workforce handoffs.",
        ],
        (
            "Support reporting on diversity and workforce metrics where customers export to sustainability reports, and avoid overstating carbon or green hiring features unless tied to validated customer programmes. "
            "Environmental pressure for recruiting software is moderate; product marketing should stay grounded in export and taxonomy support rather than claiming net-new green hiring platforms."
        ),
        "• SEBI BRSR Core circular: https://www.sebi.gov.in/legal/circulars/jul-2023/brsr-core-framework-for-assurance-and-esg-disclosures-for-value-chain_73854.html",
    ),
    (
        "Legal",
        [
            "The Digital Personal Data Protection Act, 2023 applies to digital personal data processed in India and extraterritorially where processing relates to offering goods or services to individuals in India; Mondaq’s March 2026 analysis summarises phased commencement including 13 November 2025 institutional provisions, 13 November 2026 consent manager registration layer, and 13 May 2027 core conduct obligations.",
            "Sections 5 to 6 require notice to accompany or precede consent and consent to be free, specific, informed, unconditional, and unambiguous via clear affirmative action, with withdrawal as easy as giving consent; fiduciaries must prove notice and consent if disputed.",
            "Section 7(i) covers processing for employment purposes and to safeguard the employer from loss or liability, including corporate espionage and trade secrets framing, but proportionality analysis still applies in implementation rather than offering a blank cheque.",
            "Processor rules in Section 8 and Rule 6 elevate encryption, access control, logging, and retention expectations for vendors handling candidate data; breach Rule 7 expects concise notices to data principals and the Board with tiered penalties up to INR 250 crore for security safeguard failures in the Schedule.",
            "Mondaq argues DPDP is India’s first-line control for AI systems processing personal data; Significant Data Fiduciary rules require periodic data protection impact assessment and audit reporting, including review of algorithmic systems that could affect rights in hiring.",
        ],
        (
            "Workday Recruiting implementations for India must treat candidate data as digital personal data subject to notice and lawful basis design, with granular consent where relied upon, withdrawal paths, processor contracts for BGV and messaging vendors, and audit evidence for consent and rights handling. "
            "High-volume hiring increases retention, erasure, and log tension, so specified purposes must align with requisition and talent pool lifecycles, and automated ranking should include human review and explainability commensurate to customer risk; this is not legal advice."
        ),
        "• Mondaq DPDP Act and Rules 2025: https://www.mondaq.com/india/privacy-protection/1759134/indias-digital-personal-data-protection-act-and-the-dpdp-rules-2025-phased-commencement-core-obligations-and-a-board-ready-compliance-strategy\n"
        "• UIDAI Aadhaar regulations 2021: https://www.uidai.gov.in/en/about-uidai/legal-framework/updated-regulation/16312-aadhaar-authentication-and-offline-verification-regulations-2021.html",
    ),
]


def sme_slide(sme_id: str, full_name: str, role_short: str, paras: list, alt: bool):
    title = f"{sme_id} - {full_name}, {role_short}"
    if len(title) > 45:
        title = f"{sme_id} - {full_name.split()[0]}, {role_short}"[:45]
    return title_only(
        title,
        paras,
        alt=alt,
        speaker=(
            f"• Anchor {full_name.split()[0]}'s patterns to India scale accounts.\n"
            "• Contrast with anonymised customer quotes in Primary research.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
        font_pt=14,
    )


slides: list = []

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
            {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "India PMF pairs industrial hiring scale with trust risk: Teleperformance research and five internal experts converge on duplicate integrity, agency source economics, government identifier capture, offer-path rigidity, and honest channel positioning versus omnichannel suites.",
            },
            {
                "level": 1,
                "text": "Quantified customer pain includes about one full-time equivalent per site on manual duplicate checks at two to three thousand vendor uploads daily, four hundred to five hundred candidates blocked on corrected offers after acceptance, and fifteen to seventeen percent offer-to-join attrition partly tied to identifier friction.",
            },
            {
                "level": 1,
                "text": "Q2 strategy names India scale growth with eight wins, DPDP programmes, and local boards via certified partner distribution; AI matching and core ATS parity matter when disclosures and human oversight are credible for India committees.",
            },
            {
                "level": 1,
                "text": "Competitive intelligence shows true gaps on native +91 SMS, native WhatsApp in core UI, native direct Naukri-class multipost, and full semantic AI without AI SKUs; native Hindi, configurable privacy levers, bulk grid, UDMF, and BGV framework defend enterprise deals when claims stay precise.",
            },
            {
                "level": 1,
                "text": "Priority direction: India enterprise integrity programme on source and dedupe, offer rescind and regenerate with cohort updates, regional marketing communication model with legal gating, mass hiring operations with audit-grade controls, and Know Your Candidate flows using partner-mediated verification.",
            },
        ],
        alt=True,
        speaker=(
            "• Lead with scale and financial exposure before feature detail.\n"
            "• Name May 2027-oriented DPDP buyer expectations.\n"
            "• Cite thematic analysis path for deep dives.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
        font_pt=14,
    )
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "1/2 Headline_Alt",
        "placeholders": {"0": {"text": "India PMF - Scale Meets Trust"}},
        "text_boxes": [
            {
                "left_inches": 0.7,
                "top_inches": 1.5,
                "width_inches": 8.6,
                "height_inches": 2.5,
                "font_name": "Archivo",
                "font_size_pt": 16,
                "color": "ink",
                "text": (
                    "Industrial hiring volumes amplify every friction in duplicates, source economics, "
                    "identifiers, and offer flexibility; India wins in Q2 need audit-grade records plus "
                    "partner-honest channel and board stories."
                ),
            }
        ],
        "speaker_notes": (
            "• Use as bridge from executive summary to research challenge.\n"
            "• Reinforce eight-win India row and DPDP runway verbally.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    }
)

slides.append(section(2, "Research challenge"))
slides.append(
    title_only(
        "Research Question and Objectives",
        [
            {
                "level": 1,
                "text": "Assess Workday Recruiting product-market fit in India for enterprise, GCC-led, and high-volume programmes using strategy inputs, macro analysis, competitive intelligence, internal experts, and customer interviews.",
            },
            {
                "level": 1,
                "text": "Prioritise roadmap-ready actions aligned to Q2 Talent Acquisition priorities, India scale row targets, AI matching with governance, and core ATS parity narratives.",
            },
            {
                "level": 1,
                "text": "Triangulate internal expert patterns with customer evidence and market scans to score business and customer impact using reach, composite impact, confidence, and effort.",
            },
            {
                "level": 1,
                "text": "Surface legal and compliance hooks for identifiers, marketing consent, screening automation, and background checks without substituting counsel.",
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

slides.append(section(3, "Strategic context"))
slides.append(
    title_only(
        "Strategic Context - Why India Now",
        [
            {
                "level": 1,
                "text": "India is named for scale growth in Q2 with eight customer wins, DPDP readiness work, and local job board reach through partner distribution; buyers expect proof in configuration, audit logs, and partner maps.",
            },
            {
                "level": 1,
                "text": "GCC-led technology hiring and multinational captives keep India volumes high; cohort starts, agency-heavy sourcing, and statutory compensation complexity amplify any ATS friction.",
            },
            {
                "level": 1,
                "text": "Enterprise committees pair suite depth with AI and omnichannel demos; phased DPDP enforcement through 2027 raises notice, consent, rights, and breach discipline as table stakes.",
            },
            {
                "level": 1,
                "text": "Fraud, forged documents, and impersonation stories in national press elevate Know Your Candidate programmes from nice-to-have to deal credibility for risk-aware CHROs.",
            },
        ],
        alt=True,
        speaker=(
            "• Contrast corporate priority labels with customer severity on the ground.\n\n"
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
                "text": "IMARC cites India HR technology at about USD 1,208.26 million in 2025 toward USD 2,329.11 million by 2034 at roughly 7.56% CAGR 2026 to 2034, with recruitment at 25% application share and IT at 32% vertical share in 2025.",
            },
            {
                "level": 1,
                "text": "IAMAI-linked press via Brand Equity places India internet users above 950 million in 2025 with rural-majority growth, reinforcing mobile apply and messaging buyer expectations.",
            },
            {
                "level": 1,
                "text": "IDC smartphone shipment commentary for India (2025 flat, 2026 softening) still sits atop a massive installed base where WhatsApp and SMS norms dominate candidate comms narratives.",
            },
            {
                "level": 1,
                "text": "Darwinbox roughly USD 140 million funding (March 2025 trade press) signals continued investment in regional suite and AI stories that shape RFP scoring.",
            },
            {
                "level": 1,
                "text": "DPDP Act 2023 plus Rules 2025 commentary (Mondaq, March 2026) frames a phased compliance runway through May 2027 core conduct obligations alongside competitive pressure on channels and verification partners.",
            },
        ],
        alt=False,
        speaker=(
            "• Use ranges when syndicated definitions differ.\n\n"
            "References:\n"
            "• research/India/pestel-analysis-India-2026-03-30-IN-PMF-001.md\n"
            "• https://www.imarcgroup.com/india-human-resource-technology-market"
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
                "text": "India scale growth leads: eight wins targeted in Q2 with DPDP compliance programmes and local job boards validated through certified partner distribution; this is the focal regional mandate before other corporate themes.",
            },
            {
                "level": 1,
                "text": "GCC market readiness remains the top corporate priority (ten wins, zero product-related deal blockers); India benefits indirectly when omnichannel and compliance investments set a credible global bar buyers compare in Mumbai and Bengaluru committees.",
            },
            {
                "level": 1,
                "text": "AI candidate matching: five beta tenants and about twenty percent time-to-fill improvement target; India volume hiring fits when human review, logging, and DPDP-aligned notices are demonstrable.",
            },
            {
                "level": 1,
                "text": "Core ATS parity: bulk grid actions, mobile recruiter improvements, background check integrations, and Paradox activation reduce coordinator load and scheduling objections at India scale.",
            },
        ],
        alt=True,
        speaker=(
            "• India-first bullet order is mandatory for this regional deck.\n"
            "• OKR anchors: ten GCC wins, five AI betas, Recruiting NPS 60.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md\n"
            "• strategy/markdown/product-priorities-q2-2026.md"
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
                "text": "GCC: highest corporate priority; ten wins; WhatsApp and SMS patterns; nationalisation reporting; Arabic localisation; boards via Broadbean-class paths.",
            },
            {
                "level": 1,
                "text": "Japan: medium deepen; five expansions; country-specific offer and compliance patterns that echo in multinational templates cited in India RFPs.",
            },
            {
                "level": 1,
                "text": "Australia: maintain; three expansions; mature market contrast on pricing and board coverage expectations.",
            },
        ],
        alt=False,
        speaker=(
            "• India appears first by design.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-30-IN-PMF-001.md"
        ),
    )
)
slides.append(
    title_only(
        "Competitive Positioning - India Lens",
        [
            {
                "level": 1,
                "text": "Suite depth across HCM, Recruiting, Talent, and Learning versus point ATS and INR bundles remains the enterprise answer when integrity and security operating model are funded.",
            },
            {
                "level": 1,
                "text": "AI-powered matching and conversational engagement when HiredScore and Paradox are activated must show governance, not unchecked automation, to satisfy India and EU-parent risk officers.",
            },
            {
                "level": 1,
                "text": "Compliance-first posture extends GDPR and EU AI Act discipline into India DPDP programmes covering notices, retention, rights, and processor transparency.",
            },
            {
                "level": 1,
                "text": "Vulnerabilities intensify where buyers expect +91 SMS, WhatsApp, and in-product Naukri-class posting; Know Your Candidate programmes should lead with UDMF, BGV framework, and partner-mediated Aadhaar-class checks after legal review.",
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

slides.append(section(5, "PESTEL"))
for title, bullets, impl, refs in PESTEL:
    slides.append(pestel_slide(title, bullets, impl, refs))

slides.append(section(6, "Competitive landscape"))
slides.append(
    comp_table_slide(
        "Regional Specialists - India",
        [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            [
                "Darwinbox",
                "India cloud HRMS; Gartner MQ Challenger narrative; AI and agent story; Microsoft fabric partnerships; SpringVerify-style BGV marketing; DPDP landing pages",
                "Mid-market to enterprise scope varies; security diligence items in trade press; narrower global template depth versus Workday",
                "Strong single-vendor HRMS and omnichannel story",
                "Pressure on native channel gaps until partner runbooks are crisp",
            ],
            [
                "Keka HR",
                "Fifteen-plus channel one-click posting; AI JD, parsing, matching; DPDP claims; INR pricing; payroll adjacency",
                "Dedupe depth unproven versus UDMF; global template story thinner",
                "Speed and local packaging for mid-market",
                "Board-count stories need Broadbean proof responses",
            ],
            [
                "Zoho Recruit",
                "Twilio SMS; marketplace WhatsApp; Zia AI on mobile; multipost; ecosystem TCO; SpringVerify document automation narratives",
                "Enterprise security and global HCM coherence versus full suite",
                "TCO and omnichannel defaults",
                "Battle card: suite depth, DPDP programme fit, honest native rows",
            ],
            [
                "greytHR Recruit",
                "Naukri, Hirist, IIM Jobs multipost via Zwayam Amplify; AI screening; SpringVerify via Unite; INR add-on pricing",
                "Mid-market scope; integration depth varies by tenant",
                "Statutory adjacency and board-led demos",
                "Use as board-coverage benchmark, not as build mandate",
            ],
        ],
        alt=False,
    )
)
slides.append(
    comp_table_slide(
        "Global Platforms - India",
        [
            ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
            [
                "SAP",
                "SuccessFactors coherence; SmartRecruiters embedded narrative March 2026; enterprise incumbency; Integration Center BGV patterns",
                "Implementation and licensing complexity; agility varies by account",
                "High in ERP-aligned India shortlists",
                "Benchmark connected HCM and AI roadmaps",
            ],
            [
                "Oracle",
                "Fusion HCM; Recruiting Booster; March 2026 agentic India press; partner BGV packages",
                "Implementation friction; claims need entitlement checks",
                "High where Oracle footprint is deep",
                "Omnichannel demos intensify true-gap pressure",
            ],
            [
                "iCIMS",
                "Global ATS depth; Prime Connector BGV; Spring 2026 frontline AI release; useful in MNC RFPs",
                "Best-of-breed integration tax versus suite buyers",
                "Deal-dependent India enterprise",
                "Contrast suite coherence and security model",
            ],
            [
                "Workday",
                "Hindi; DPDP-style consent, retention, purge; bulk grid; baseline skills matching; UDMF native; BGV BP plus connectors native framework",
                "True gaps: +91 SMS; WhatsApp core UI; native direct Naukri multipost; advanced semantic AI without SKUs",
                "Strong for enterprise India and GCCs",
                "Lead with suite, privacy programme, partner map; reconcile SMS guidance before claims change",
            ],
        ],
        alt=True,
    )
)
slides.append(swot_slide())

slides.append(section(7, "SME interviews"))
slides.append(
    title_only(
        "Internal SME Interviews - Experts",
        [
            {
                "level": 1,
                "text": "Five Workday experts across product leadership, field readiness, global services, India enterprise architecture on a Genpact programme, and strategic customer engagement on Accenture.",
            },
            {
                "level": 1,
                "text": "Coverage includes fraud and Know Your Candidate, India offers and compensation tables, background checks and documents, marketing consent reach, WhatsApp norms, and mass operations including merge limits.",
            },
            {
                "level": 1,
                "text": "Timing: interview notes from 2025 India research programme; synthesised March 2026 for this readout.",
            },
            {
                "level": 1,
                "text": "Purpose: implementation and product lens to cross-check customer interviews; internal views supplement but do not replace customer voice.",
            },
            {
                "level": 1,
                "text": "Limitation: bias toward large accounts and delivery-heavy themes; triangulate with P1 to P4 customer evidence in Primary research.",
            },
        ],
        alt=True,
        speaker=(
            "• Introduce SMEs by relevance to India scale accounts.\n\n"
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
                    ["SME1", "Bernie", "VP, Talent Product Management", "Product leadership; India FY27 focus; fraud at scale"],
                    ["SME2", "Fabiola Navarro", "Sr. Product Advisor, Field Readiness", "Lowe's India; offers; BGC flexibility"],
                    ["SME3", "Santosh Gulia", "Sr. Functional Consultant, Global Services", "India deployments; documents; consent reach"],
                    ["SME4", "David Lodola", "Enterprise Architect, Services (India)", "Genpact; mass hiring; BGC middleware"],
                    ["SME5", "David Phillips", "Director, Strategic Customer Engagement", "Accenture; volume; duplicates"],
                ],
                "left_inches": 0.35,
                "top_inches": 1.15,
                "width_inches": 9.3,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Table uses eight-point font for density.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
    }
)

# SME individual slides: 7-8 lines each (level 0 subheaders + level 1 bullets)
slides.append(
    sme_slide(
        "SME1",
        "Bernie",
        "VP Talent Product",
        [
            {"level": 0, "text": [{"text": "Fraud and KYC at India scale", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Know Your Candidate framed like banking KYC; roughly 100,000 resumes per month discussed with Accenture-scale pain on resume fraud."},
            {"level": 1, "text": "Hypothesis: fraud surface grows with volume; AI may help flag suspicious application behaviour if governed."},
            {"level": 0, "text": [{"text": "India roadmap anchor", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "FY27 India target opportunity noted as strategic focus; localisations and explicit India gap acknowledgement belong in planning conversations."},
            {"level": 0, "text": [{"text": "Triangulation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customer P1 and P2 agency and duplicate mechanics align with fraud and identity risk; reinforces integrity-first roadmap sequencing."},
        ],
        alt=False,
    )
)
slides.append(
    sme_slide(
        "SME2",
        "Fabiola Navarro",
        "Sr. Advisor, Field",
        [
            {"level": 0, "text": [{"text": "India offer and compensation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Lowe's India collected four to five documents (pay stubs, IDs, photos); review-documents pattern was stretched to store non-standard artefacts."},
            {"level": 1, "text": "Start date changes frequent; tension between auto-complete hire and correcting dates; India cohorts sometimes hire before all BGC results return."},
            {"level": 0, "text": [{"text": "BGC flexibility", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customers want an easy re-initiate control; parallel drug and BGC stages appeared in India configurations."},
            {"level": 0, "text": [{"text": "Triangulation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customer P1 and P2 offer rigidity and statutory letter errors echo configuration and throughput pressure at volume."},
        ],
        alt=True,
    )
)
slides.append(
    sme_slide(
        "SME3",
        "Santosh Gulia",
        "Sr. Consultant, GS",
        [
            {"level": 0, "text": [{"text": "Document capture gaps", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Proposes candidate-home attachment box for ad hoc documents; review-documents step awkward when recruiter sends nothing first."},
            {"level": 1, "text": "India clients vary on which proofs are required pre-interview; rigid business process steps force email workarounds."},
            {"level": 0, "text": [{"text": "Marketing reach and channels", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Marketing communication opt-in collapses reach: about one hundred of two thousand recipients opt in; recommends region-configurable opt-out with unsubscribe."},
            {"level": 1, "text": "WhatsApp described as default messaging channel for many India candidates; SMS relatively rare."},
            {"level": 0, "text": [{"text": "Triangulation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customer interviews did not emphasise opt-in yet; watch for adoption-stage gaps as marketing features roll out."},
        ],
        alt=False,
    )
)
slides.append(
    sme_slide(
        "SME4",
        "David Lodola",
        "Ent. Architect, India",
        [
            {"level": 0, "text": [{"text": "Mass hiring and PSA bridge", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Genpact recruits en masse for roughly one hundred to two hundred openings; needs mass processing for offers, agreements, approvals, and cohort start dates."},
            {"level": 1, "text": "Magic-wand ask: proactive candidate management at scale with demand and supply visibility across PSA and recruiting."},
            {"level": 0, "text": [{"text": "Trust and BGC data", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Impersonation risk; career-site changes to name or phone lack strong audit trail; BGC dataset should be collected upfront to avoid duplicate entry in middleware."},
            {"level": 0, "text": [{"text": "Triangulation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customer P2 cites two to three thousand vendor uploads daily; both signal industrial-scale integrity and throughput needs."},
        ],
        alt=True,
    )
)
slides.append(
    sme_slide(
        "SME5",
        "David Phillips",
        "Strategic Cust. Eng.",
        [
            {"level": 0, "text": [{"text": "Accenture volume reality", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Roughly 200,000 duplicate candidate records cited; auto-merge limited to two at a time creates hygiene bottlenecks at India application scale."},
            {"level": 1, "text": "Trickery and resume games increase administrative burden; AI could help prioritise review queues if human oversight stays mandatory."},
            {"level": 0, "text": [{"text": "Do Not Hire pattern", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Accenture-style programmes want automated disposition against deny lists spanning former employees and flagged individuals; needs legal design."},
            {"level": 0, "text": [{"text": "Triangulation", "bold": True, "font_size_pt": 14}]},
            {"level": 1, "text": "Customer P1 and P2 financial exposure on source attribution complements duplicate-scale narrative from the field."},
        ],
        alt=False,
    )
)

slides.append(section(8, "Primary research"))
slides.append(
    title_only(
        "1:1 Customer Interviews - India Enterprise",
        [
            {
                "level": 1,
                "text": "Four senior recruiting leaders from Teleperformance India operations covering agent hiring, frontline hiring, leadership hiring, and specialist recruiting; about ninety thousand India headcount context.",
            },
            {
                "level": 1,
                "text": "Organisations running industrial weekly hiring with seasonal peaks up to twelve thousand hires in eight to ten weeks; Workday Recruiting live July 2025 during peak volume.",
            },
            {
                "level": 1,
                "text": "Research conducted December 2025; in-depth semi-structured interviews on workflows, compliance, and technology gaps.",
            },
            {
                "level": 1,
                "text": "Triangulated with internal expert interviews, competitive matrices, and macro legal research; anonymised as P1 to P4 with company retained.",
            },
            {
                "level": 1,
                "text": "Limitation: single enterprise voice in customer set; validate patterns with additional India prospective customers before generalising beyond BPO-scale operations.",
            },
        ],
        alt=True,
        speaker=(
            "• Never use legal names on slides; P codes only.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    )
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Customer Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["Participant", "Role", "Company"],
                    ["P1", "Recruitment Manager, Agent Hiring", "Teleperformance India"],
                    ["P2", "Sr. Recruitment Manager, Frontline", "Teleperformance India"],
                    ["P3", "Recruitment Manager, Leadership", "Teleperformance India"],
                    ["P4", "Specialist Recruiter", "Teleperformance India"],
                ],
                "left_inches": 0.35,
                "top_inches": 1.15,
                "width_inches": 9.3,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Eight-point table font per deck standard.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    }
)

# P1+P2 combined: 3 themes, 4 quotes, 3 JTBD, 8 lines minimum
slides.append(
    title_only(
        "P1 and P2 - Frontline and Agent",
        [
            {"level": 0, "text": [{"text": "Duplicate and source crisis", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": '"If you do a bulk upload, and you don\'t check that box to check for the duplicates, it\'s too late." - insight on manual duplicate risk (P2, Teleperformance).',
            },
            {
                "level": 1,
                "text": '"Workday is not going to capture the first source which was there... it will capture the second source." - agency payment exposure (P2, Teleperformance).',
            },
            {
                "level": 1,
                "text": '"I have one resource at every site who\'s only doing this." - one FTE per site on vendor upload checks at two to three thousand profiles daily (P2, Teleperformance).',
            },
            {"level": 0, "text": [{"text": "Cooling period and referrals", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": '"Ideally, my source should be 3rd December, the referral which was uploaded." - first-source expectation inside cooling rules (P1, Teleperformance).',
            },
            {"level": 0, "text": [{"text": "Jobs to be done", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "When three hundred to four hundred agencies upload daily, I want automatic duplicate evaluation at upload, so I can redeploy site FTEs off checkbox work.",
            },
            {
                "level": 1,
                "text": "When cooling periods apply, I want first-in-window source visible on approval screens, so finance pays the correct agency without case backlogs.",
            },
            {
                "level": 1,
                "text": "When vendor approval blocks rehires, I want compliant decoupling options, so security rules do not force destructive data workarounds.",
            },
        ],
        alt=False,
        speaker=(
            "• Stress financial liability thread in live readout.\n"
            "• Keep quotes short; expand in appendix if needed.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    )
)

slides.append(
    title_only(
        "P3 and P4 - Leadership and Specialist",
        [
            {"level": 0, "text": [{"text": "Government IDs and offer friction", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": '"It\'s choking my bandwidth to guide them... three days" - sequential government ID capture and vanishing fields (P3, Teleperformance).',
            },
            {
                "level": 1,
                "text": '"We are losing about sixteen-seventeen percent people... between offer and join" - quantified drop-off window (P3, Teleperformance).',
            },
            {
                "level": 1,
                "text": '"We are not even receiving the OTP [for Aadhaar validation]" - reliability and ticket load (P3, Teleperformance).',
            },
            {"level": 0, "text": [{"text": "Requisitions and tooling depth", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": '"Having the hiring manager working the requisitions will solve a lot for us." - cost centre and LOB accuracy (P3, Teleperformance).',
            },
            {"level": 0, "text": [{"text": "Jobs to be done", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "When leadership candidates move fast, I want parallel mandatory ID capture with reliable OTP fallbacks, so offers release without SVP-level embarrassment loops.",
            },
            {
                "level": 1,
                "text": "When hiring managers hold cost centre truth, I want them to open requisitions in-product, so recruiters stop twenty-four to forty-eight hour billing rework.",
            },
            {
                "level": 1,
                "text": "When specialists source from boards, I want parsing and guardrails, so external pre-screening does not become an ungoverned shadow funnel (P4 context with P3 on tooling).",
            },
        ],
        alt=True,
        speaker=(
            "• Pair fifteen to seventeen percent metric with multi-causal caution.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    )
)

slides.append(section(9, "Thematic analysis"))
slides.append(
    title_only(
        "Validated Themes 1-3 - Integrity and Velocity",
        [
            {"level": 0, "text": [{"text": "Trust, identity, and record integrity", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: India hiring combines impersonation risk with financially material source attribution; P2 describes wrong agency payment piles while SMEs cite Accenture-scale fraud surface.",
            },
            {
                "level": 1,
                "text": "Business impact: contract-grade duplicate and source logic becomes a deal breaker for agency-heavy employers; auditability replaces trust-based manual checks.",
            },
            {
                "level": 1,
                "text": "Product implication: ship first-source-within-cooling visibility, upload-time duplicate evaluation, and merge scale paths with logged overrides for India tenants.",
            },
            {"level": 0, "text": [{"text": "Industrial-scale hiring and offers", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: cohort hiring of hundreds of roles clashes with one-by-one offer patterns; P1 cites four hundred to five hundred wrong compensation letters stuck post-acceptance.",
            },
            {
                "level": 1,
                "text": "Business impact: manual PDF offers outside the system create legal review bottlenecks and break system-of-record promises for BPO clients.",
            },
            {
                "level": 1,
                "text": "Product implication: rescind and reissue, regenerate after acceptance with version history, batch cohort date changes, and role fixes blocking rescind at high-volume tenants.",
            },
            {"level": 0, "text": [{"text": "Government IDs and BGV readiness", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: Aadhaar, PAN, and UAN are required before offer but skippable in flow; OTP failures and vanishing fields extend release timelines.",
            },
            {
                "level": 1,
                "text": "Business impact: multi-day chasing reduces join probability in competitive labour markets; aligns with fifteen to seventeen percent window risk called out by P3.",
            },
            {
                "level": 1,
                "text": "Product implication: parallel mandatory capture, OTP reliability programmes, candidate document hub, and partner-mediated verification without native UIDAI over-claims.",
            },
        ],
        alt=False,
        speaker=(
            "• Three themes per slide keeps VP scan-ability.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    )
)
slides.append(
    title_only(
        "Validated Themes 4-6 - Reach and Fidelity",
        [
            {"level": 0, "text": [{"text": "Channels and regional comms policy", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: SME evidence shows opt-in marketing configuration can collapse candidate reach; customers did not emphasise the same pain yet, signalling adoption-stage variance.",
            },
            {
                "level": 1,
                "text": "Business impact: reach gaps hurt conversion in high-volume funnels and weaken responses versus Darwinbox-class omnichannel demos.",
            },
            {
                "level": 1,
                "text": "Product implication: region-configurable marketing comms defaults with unsubscribe, plus channel roadmap for WhatsApp and SMS with legal review and partner contracts.",
            },
            {"level": 0, "text": [{"text": "Requisition fidelity and approvals", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: P3 shows recruiters guessing cost centres and LOB while hiring managers hold truth; offline email approvals lack in-product audit trails.",
            },
            {
                "level": 1,
                "text": "Business impact: twenty-four to forty-eight hour delays and wrong client billing disputes in BPO models where accuracy is contractual.",
            },
            {
                "level": 1,
                "text": "Product implication: hiring-manager-led requisition paths, in-product approval chains, validation rules, and dashboards that expose LOB and cost centre mismatches early.",
            },
            {"level": 0, "text": [{"text": "Background check flexibility", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": "Key insight: SMEs describe post-hire BGC, parallel drug and BGC stages, and middleware depth beyond basic connectors; customers emphasise ID gates more than BGC UX for now.",
            },
            {
                "level": 1,
                "text": "Business impact: professional services clients need orchestration and audit without forcing duplicate data entry across vendor portals.",
            },
            {
                "level": 1,
                "text": "Product implication: richer vendor payloads, one-click re-initiation, post-hire continuation patterns, and partner ecosystem clarity shared with SpringVerify-class vendors.",
            },
        ],
        alt=True,
        speaker=(
            "• Call out SME-customer divergence on comms explicitly.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md"
        ),
    )
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Triangulation - Key Themes"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "SME signal", "Customer signal", "Market scan", "PMF impact"],
                    [
                        "Trust and record integrity",
                        "Fraud, impersonation, two hundred thousand-scale dupes, merge limits",
                        "Last-source wins; agency piles; one FTE per site",
                        "UDMF native; Aadhaar gov not native",
                        "Critical financial and legal exposure",
                    ],
                    [
                        "Mass hiring and offers",
                        "Hundred to two hundred role batches; automation maxed yet friction",
                        "Twelve thousand hires in weeks; four hundred to five hundred stuck letters",
                        "Bulk grid native; AI volume demos from suites",
                        "Critical system-of-record risk",
                    ],
                    [
                        "Government IDs and documents",
                        "Document box ask; pre-interview ID proofs",
                        "OTP failures; IDs not mandatory; fifteen to seventeen percent window",
                        "Zoho SpringVerify doc automation; partner paths",
                        "High operational and CX risk",
                    ],
                    [
                        "Channels and comms",
                        "Opt-in reach collapse; WhatsApp norm",
                        "Not raised in TP set",
                        "True gap SMS and WhatsApp in core UI",
                        "High reach and RFP risk",
                    ],
                    [
                        "JR data and approvals",
                        "Low SME emphasis",
                        "Offline approvals; cost centre drift",
                        "Enterprise workflow expectations",
                        "High for BPO billing models",
                    ],
                    [
                        "BGC flexibility",
                        "Post-hire, re-initiate, Tydy middleware",
                        "IDs gate BGC",
                        "Shared BGV partners across vendors",
                        "Medium-high orchestration play",
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
            "• Matrix synthesises SME, customer, and competitive intel proxy.\n"
            "• Use PMF impact column to justify sequencing conversations.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }
)

slides.append(section(10, "Roadmap recommendations"))
slides.append(
    title_only(
        "Compliance Snapshot - Five Themes",
        [
            {
                "level": 1,
                "text": "Roadmap items touching personal data and automated support need impact assessments where processing is high risk; duplicate automation and identity programmes sit in that bucket alongside any fraud-detection AI.",
            },
            {
                "level": 1,
                "text": "Regional marketing communication changes require jurisdiction-specific legal review across India, GCC, and EU models before defaulting opt-in versus opt-out; telecom marketing rules add registry considerations for SMS.",
            },
            {
                "level": 1,
                "text": "Offer rescind and regenerate must respect India state employment nuances, e-signature validity, and fresh acceptance for material compensation or role changes.",
            },
            {
                "level": 1,
                "text": "Aadhaar-class flows must stay partner-mediated under UIDAI rules with masking, explicit consent, and fallbacks when one-time passwords fail; mandatory-field posture needs employment counsel sign-off.",
            },
        ],
        alt=False,
        speaker=(
            "• Advisory summary March 2026; not a substitute for counsel.\n"
            "• Use to explain why sequencing may differ from headline RICE rank.\n\n"
            "References:\n"
            "• research/India/legal-compliance-review-2026-03-30-IN-PMF-001.md"
        ),
    )
)
slides.append(
    recommendation_slide(
        1,
        "UDMF India Integrity",
        "Agency-heavy India employers face manual duplicate checks at thousands of uploads per day while last-approved source wins conflicts with first-source contracts, creating payment disputes and compliance risk on candidate records.",
        "P2 (Teleperformance) cites a pile of wrong-source cases; P1 ties referral-versus-vendor dates to cooling-period fairness. India matrix reinforces UDMF native lead versus suites with uneven dedupe depth.",
        "Implement first-touch or first-approved-source-within-cooling rules, automatic duplicate evaluation on agency upload, higher batch merge limits, cooling visibility on approvals, and explore decoupling vendor upload approval from rehire blocks where law allows.",
        "Q2 India scale target plus DPDP accuracy duties elevate audit-grade candidate records; competitive demos on volume AI increase pressure to prove integrity without silent automation.",
        "Manual duplicate FTEs per site: baseline today versus target near zero for checkbox-only work; agency dispute cases: downward trend quarter on quarter with logged source decisions.",
        "• Legal review notes DPIA and human oversight for automated disposition paths.\n",
    )
)
slides.append(
    recommendation_slide(
        2,
        "Regional Comms Model",
        "Marketing communication defaults designed for strict opt-in regimes can collapse reachable candidates in India high-volume funnels, while competitors market WhatsApp and SMS aggressively.",
        "SME quantified two thousand-email sends where roughly one hundred opt in; competitive matrix lists native +91 SMS and core WhatsApp as true gaps until partner paths are validated.",
        "Deliver region-configurable marketing comms models with unsubscribe and logging; pair with channel roadmap for WhatsApp and SMS using CPaaS interim playbooks; obtain legal sign-off before changing claims.",
        "DPDP and telecom marketing rules create a gated window; May 2027 core conduct timeline increases board focus on consent evidence and processor contracts.",
        "Reachable candidates per campaign: baseline low opt-in versus materially higher delivered audience where law permits; unsubscribe complaints: monitored monthly with legal thresholds.",
        "• Legal review flags high risk; requires jurisdiction-specific opinions and TRAI DND considerations for SMS.\n",
    )
)
slides.append(
    recommendation_slide(
        3,
        "Offer Flexibility",
        "Candidates who accepted offers cannot receive corrected compensation or date letters inside the product; rescind may be blocked by roles, forcing manual legal-reviewed PDFs outside the system.",
        "P1 (Teleperformance) cites four hundred to five hundred post-July cohort cases; P2 cannot batch-change start dates for twenty-plus joiners; P3 lacks rescind access.",
        "Ship rescind and reissue, regenerate after acceptance for material fields with version history, batch cohort updates, and security patterns that restore rescind to recruiter roles where policy allows.",
        "Post-go-live crisis at a flagship India volume customer creates executive escalation risk; manual letters undermine DPDP accountability and employment-law documentation expectations.",
        "Offers corrected inside product: percent of amendment cases; legal approval cycle time for exceptions: baseline weeks to target days; candidate NPS on offer experience: trend upward.",
        "• Legal review emphasises India state employment law variance and e-signature validity on superseded offers.\n",
    )
)
slides.append(
    recommendation_slide(
        4,
        "Mass Hiring Suite",
        "Cohort employers still send one hundred to one hundred fifty offers per day individually; bulk approvals and mass dispositions lag suite competitors' volume demos.",
        "SMEs describe hundred-plus role batches; P3 confirms no mass offers today; matrix shows bulk grid native but UX gaps remain at extreme scale.",
        "Build batch offers, bulk approvals with human confirmation patterns, and mass disposition or purge playbooks that preserve per-candidate audit logs for SOX-minded BPO clients.",
        "Q2 core ATS parity theme and India eight-win push reward throughput stories that stay enterprise-safe under DPDP minimisation rules.",
        "Time per cohort offer event: hours to minutes; approval cycle SLA hit rate: baseline versus target; purge errors: near-zero with retention guardrails.",
        "• Legal review stresses individual consent within batches and granular audit logs.\n",
    )
)
slides.append(
    recommendation_slide(
        5,
        "India Know Your Candidate",
        "Government identifiers are mandatory in policy but optional in UX, producing multi-day chase loops, OTP failures, and BGV delays that correlate with fifteen to seventeen percent offer-to-join leakage.",
        "P3 details vanishing ID fields and OTP tickets; P2 asks for Aadhaar as a dedupe key; SMEs want document hubs and pre-interview proofs.",
        "Deliver parallel mandatory capture for Aadhaar, PAN, and UAN where legal review approves; improve OTP reliability and fallbacks; add candidate attachment hub and interviewer prompts; route Aadhaar authentication through UIDAI-authorised partners only.",
        "DPDP minimisation and Aadhaar law constraints require partner-mediated verification; fraud press and BGV contracts increase CFO scrutiny on identity programmes in 2026 bids.",
        "Median days from offer readiness to ID-complete: three plus to under one; OTP failure ticket rate: downward trend; offer-to-join conversion: baseline fifteen to seventeen percent window toward improved band with multi-factor programmes.",
        "• Legal review marks highest complexity: Aadhaar Act, biometric DPIA if applicable, mandatory-field opinions.\n",
    )
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [
            {
                "rows": [
                    [
                        "#",
                        "Title",
                        "Action",
                        "Reach",
                        "Impact",
                        "Confidence",
                        "Effort",
                        "RICE",
                        "Legal / compliance",
                    ],
                    [
                        "1",
                        "UDMF India integrity",
                        "First-source-within-cooling; auto dedupe on upload; bulk merge; approval UX",
                        "20,000",
                        "3.0",
                        "90%",
                        "10 pm",
                        "5,400",
                        "DPDP accuracy; audit logs; human review if auto-reject",
                    ],
                    [
                        "2",
                        "Regional comms opt-out plus roadmap",
                        "Region-configurable marketing default; unsubscribe; WhatsApp/SMS roadmap; CPaaS interim",
                        "20,000",
                        "2.25",
                        "75%",
                        "4 pm",
                        "8,437",
                        "DPDP consent; TCCPR; processor DPAs",
                    ],
                    [
                        "3",
                        "Offer rescind and cohort updates",
                        "Rescind/reissue; regenerate after acceptance; versions; batch dates; roles",
                        "8,000",
                        "3.0",
                        "90%",
                        "6 pm",
                        "3,600",
                        "Employment law; e-sign; material change consent",
                    ],
                    [
                        "4",
                        "Mass hiring operations suite",
                        "Batch offers; bulk approvals; mass disposition patterns",
                        "8,000",
                        "2.75",
                        "85%",
                        "10 pm",
                        "1,870",
                        "DPDP minimisation on purge; SOX-style audit for BPO",
                    ],
                    [
                        "5",
                        "India KYC IDs and document hub",
                        "Mandatory parallel IDs; OTP reliability; attachment hub; prompts",
                        "8,000",
                        "2.75",
                        "85%",
                        "12 pm",
                        "1,558",
                        "DPDP; Aadhaar Act; EU AI Act if AI fraud",
                    ],
                ],
                "left_inches": 0.25,
                "top_inches": 1.05,
                "width_inches": 9.5,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Table mirrors prioritised research recommendations with RICE components.\n"
            "• Use for leadership selection conversations; sequencing may differ from RICE rank.\n"
            "• Legal column summarises advisory review March 2026.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-30-India-PMF-Analysis-IN-PMF-001.md\n"
            "• research/India/legal-compliance-review-2026-03-30-IN-PMF-001.md"
        ),
    }
)

slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {OUT} with {len(slides)} slides")
