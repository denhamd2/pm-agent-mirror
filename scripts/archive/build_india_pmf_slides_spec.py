#!/usr/bin/env python3
"""Generate slides_spec for India PMF roadmap deck (130 / v65 parity) with auto-increment versioning."""
from __future__ import annotations

import json
import re
from pathlib import Path
import glob

ROOT = Path(__file__).resolve().parents[2]

# Auto-increment version from highest existing spec
existing_specs = sorted(glob.glob(str(ROOT / "docs" / "decks" / "specs" / "slides_spec_v*.json")))
max_version = 0
for spec_path in existing_specs:
    match = re.search(r'slides_spec_v(\d+)\.json$', spec_path)
    if match:
        version_num = int(match.group(1))
        if version_num > max_version:
            max_version = version_num

next_version = max_version + 1
OUT = ROOT / "docs" / "decks" / "specs" / f"slides_spec_v{next_version}.json"

MI = 1


def tb_body(paragraphs, font_pt=14, top=1.2):
    return {
        "left_inches": 0.7,
        "top_inches": top,
        "width_inches": 8.6,
        "height_inches": 2.8,
        "font_name": "Archivo",
        "font_size_pt": font_pt,
        "color": "ink",
        "paragraphs": paragraphs,
    }


def section(nn: str, name: str):
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
                "text": f"S E C T I O N  {nn}\n{name}",
            }
        ],
    }


def product_implication_para(text: str):
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


def pestel_slide(title: str, bullets: list[str], implication: str, notes: str, alt: bool):
    layout = "Title Only_Alt" if alt else "Title Only"
    paras = [{"level": 1, "text": b} for b in bullets]
    paras.append(product_implication_para(implication))
    return {
        "master_index": MI,
        "layout_name": layout,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paras, font_pt=12)],
        "speaker_notes": notes,
    }


slides: list[dict] = []

# 1 TITLE
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

# 2 Custom agenda (010 executive pattern)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Section Title",
        "text_boxes": [
            {
                "left_inches": 3.7,
                "top_inches": 0.4,
                "width_inches": 3.8,
                "height_inches": 0.4,
                "font_name": "Archivo",
                "font_size_pt": 20,
                "bold": True,
                "color": "ink",
                "alignment": "left",
                "text": "Agenda",
            },
            {
                "left_inches": 4.2,
                "top_inches": 1.0,
                "width_inches": 5.0,
                "height_inches": 4.0,
                "font_name": "Archivo",
                "font_size_pt": 14,
                "color": "ink",
                "alignment": "left",
                "text": (
                    "1. Executive summary\n\n"
                    "2. Research challenge\n\n"
                    "3. Strategic context\n\n"
                    "4. Product strategy\n\n"
                    "5. PESTEL\n\n"
                    "6. Competitive landscape\n\n"
                    "7. Win / loss\n\n"
                    "8. Ideation signals\n\n"
                    "9. Internal SME\n\n"
                    "10. Primary research\n\n"
                    "11. Thematic analysis\n\n"
                    "12. Gap analysis\n\n"
                    "13. Roadmap recommendations"
                ),
            },
        ],
    }
)

slides.append(section("0 1", "Executive summary"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Executive Summary"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 0,
                        "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}],
                    },
                    {
                        "level": 1,
                        "text": (
                            "India enterprise evidence converges on operational fractures at extreme volume: manual duplicate handling and "
                            "source attribution under agency-heavy models create fee risk and recruiter drag. Mismatch between optional "
                            "candidate UX and mandatory India statutory ID and offer steps drives drop-off and legal rework."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Shadow analytics in spreadsheets and parallel tools appear where in-product pipeline aging, SLA views, and "
                            "task signalling are weak; offline approvals weaken audit expectations for listed enterprises and DPDP accountability."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Structured competitive review classifies India SMS to +91 as workaround, native WhatsApp in core Recruiting UI and "
                            "semantic AI without SKUs as true gaps versus Darwinbox-class omnichannel and AI screening narratives."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Triangulation across customer interviews, internal field notes, strategy context, and desk research is strong on "
                            "duplicates, India identifiers, reporting, approvals, fraud, and channel fit; roadmap should treat these as an interlocked programme."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Priority direction: DPDP-ready journeys, governed AI matching activation, partner-led boards and messaging clarity, "
                            "and operational analytics that restore single-system-of-record credibility."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Lead with volume + compliance shock, not abstract PMF language.\n"
            "• Name workaround versus true gap honestly in customer conversations.\n"
            "• If challenged on sample size, cite SME triangulation and 101 matrix.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-28-India-PMF-Analysis.md\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }
)

slides.append(section("0 2", "Research challenge"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Research Question and Objectives"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Assess Workday Recruiting product-market fit for India enterprise hiring at scale, with emphasis on statutory "
                            "pre-hire journeys, duplicate and source integrity, analytics and notifications, and honest competitive positioning."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Objectives: validate friction themes with customer and field evidence; align recommendations to Q2 India strategy "
                            "(DPDP-ready workflows, local boards via partners, AI matching with governance); classify competitive gaps using Native, "
                            "Workaround, and True Gap language."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Scope: India-focused transcripts and SME notes, strategy context, PESTEL and SWOT from desk research, India competitive "
                            "matrix and point-in-time scan; no substitute for binding legal sign-off on consent models or UID use."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Outcomes: six validated themes, cross-source triangulation matrix, full-funnel gap diagnostic, and RICE-scored "
                            "recommendations with compliance flags for statutory IDs, messaging, and AI-assisted screening."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Clarify India BPO and IT services scale assumptions.\n"
            "• Note single-customer depth mitigated by SME convergence.\n\n"
            "References:\n"
            "• research/India/105-user-research-findings.md"
        ),
    }
)

slides.append(section("0 3", "Strategic context"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Strategic Context: Why India Now"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Q2 regional table treats India as high priority for scale growth with an explicit eight-customer target alongside "
                            "DPDP compliance and local job board reach; that elevates privacy architecture and partner-led distribution to first-class roadmap themes."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Buying committees pair global template discipline from HCM programmes with India statutory reality on IDs, offers, and background checks; "
                            "weak journey alignment shows up as revenue leakage through pre-acceptance drop-off and manual legal letters."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Enterprise consolidation and multinational bridge accounts increase demand for one platform story across India hiring, "
                            "GCC expansion, and EU obligations; Recruiting must not ship India journeys that break GDPR or EU AI Act expectations for multinationals."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Competitive intensity from India-first suites raises omnichannel and AI demo pressure; Workday wins on suite depth and compliance "
                            "only when activation paths for HiredScore and Paradox are clear and messaging claims stay evidence-backed."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Tie narrative to product-priorities-q2-2026.md India row.\n\n"
            "References:\n"
            "• research/India/strategy-context-2026-03-28-IN-E2E-003.md"
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "India Market Momentum: Key Indicators"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "HR technology spend narratives for India point to roughly USD 1.1 billion in 2024 toward USD 2.3 billion by 2033 at near "
                            "8 percent CAGR, while India ATS estimates near USD 0.30 billion in 2024 toward USD 0.50 billion by 2033 at about 7.2 percent CAGR (industry summaries citing IMARC-style figures)."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "India tech industry revenue narratives approach USD 315 billion in FY26 with about 6.1 percent growth and AI services entering "
                            "roughly USD 10 to 12 billion scale (Nasscom press coverage), sustaining enterprise and GCC hiring demand that expands ATS seats and advanced workflow requirements."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Digital penetration for India shows about 70 percent internet penetration with roughly 1.03 billion users and 1.06 billion mobile "
                            "connections; LinkedIn registered reach near 170 million in India in late 2025 with strong year-on-year growth (DataReportal Digital 2026 India)."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Forrester-style commentary positions India enterprise technology spending growth near 13.4 percent in 2026 among APAC leaders, "
                            "with cloud, embedded AI, and regulation shaping net investment; procurement will reward measurable efficiency and compliance risk reduction."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Use figures as directional market context, not contract claims.\n\n"
            "References:\n"
            "• https://datareportal.com/reports/digital-2026-india\n"
            "• https://www.imarcgroup.com/india-applicant-tracking-system-market/toc"
        ),
    }
)

slides.append(section("0 4", "Product strategy"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Q2 2026 Product Priorities"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "India scale growth: eight customer wins targeted in Q2 with explicit focus on DPDP compliance programmes and local job board reach "
                            "through certified partner distribution; this is the focal regional commitment for this deck and should anchor roadmap scoring."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "GCC market readiness remains corporate headline priority with ten GCC wins targeted; India benefits indirectly where WhatsApp, SMS, "
                            "and board readiness patterns mature, but India-specific boards and privacy evidence must still lead customer conversations."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "AI candidate matching: activate HiredScore for high-volume customers with five beta tenants targeted by end Q2 and about "
                            "20 percent time-to-fill reduction for beta cohorts; India volume hiring aligns when disclosure, logging, and human oversight are credible under DPDP scrutiny."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Core ATS parity: bulk actions, mobile recruiter improvements, background check integrations, and Paradox activation for scheduling; "
                            "parity with SAP and Oracle on key workflows removes table-stakes objections in India enterprise cycles."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Ground claims in strategy-context sources list.\n\n"
            "References:\n"
            "• strategy/markdown/product-priorities-q2-2026.md"
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Regional Expansion Strategy"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "India: high priority for scale growth with eight customers targeted; DPDP compliance programmes, local boards via Broadbean-class partners, "
                            "and volume efficiency on bulk, mobile, and scheduling are the headline India bundle for Q2."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "GCC: strategic priority with ten new customers targeted; WhatsApp and SMS readiness, nationalisation reporting, Arabic RTL, "
                            "and partner-led boards set the bar for compliance-heavy messaging narratives that India multinational employers also study."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Japan: medium-high priority with five expansions targeted; two-step offer, APPI, and LINE channel realities shape backlog conversations "
                            "separate from India, but multinational templates still cross-link in RFPs."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Australia: maintain posture with three expansions; Fair Work Act and SEEK via Broadbean remain the regional compliance and sourcing frame."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": "• Use table language for executive scan; avoid internal codenames.\n",
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive Positioning: Differentiation"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Suite depth: unified HCM, Recruiting, Talent, and Learning versus point ATS or thin HRMS bundles; hire-to-retire governance "
                            "and a single employee record win where integrations would be brittle for competitors."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "AI-powered differentiation when HiredScore and Paradox are activated with clear SKUs, human-in-the-loop UX, logging, and explainability; "
                            "India deals fail demos when sellers imply free semantic parity without entitlements."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Compliance-first posture: GDPR-class tooling and a documented path to DPDP-aligned notice, consent granularity, retention for non-hired "
                            "candidates, and rights handling; positions Workday for Significant Data Fiduciary-class scrutiny as DPBI enforcement matures."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Enterprise scale: security model, audit artefacts, and multinational rollout patterns; counter India TCO pressure with defensible "
                            "automation, reporting, and risk reduction rather than price-only narratives."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": "• Pair with competitive tables later in deck.\n",
    }
)

# PESTEL section
slides.append(section("0 5", "PESTEL"))

pol_bullets = [
    (
        "India's recruiting operating context is increasingly national framework plus state implementation. The four labour codes consolidate dozens of legacy statutes; "
        "late 2025 to 2026 commentary points to central notification and April 2026 as a practical milestone for fuller operability, subject to state adoption because labour is a concurrent subject."
    ),
    (
        "The Code on Social Security 2020 framing for gig and platform workers, including aggregator contribution narratives and e-Shram registration themes in government materials, "
        "extends regulatory attention to non-traditional workforce categories that recruiting and contingent programmes must segment and evidence."
    ),
    (
        "Digital India and digital public infrastructure continue to anchor identity and document verification norms around Aadhaar, PAN, and DigiLocker; "
        "employers and candidates increasingly expect consent-based digital exchange patterns that recruiting journeys should mirror without unsafe data hoarding."
    ),
    (
        "Geopolitically, Nasscom leadership commentary often ties roughly 60 to 62 percent of India technology services revenue to US market exposure; "
        "trade, mobility, and procurement cycles can indirectly shape hiring freezes, GCC expansion, and vendor diligence intensity for enterprise ATS programmes."
    ),
    (
        "Union and state political narratives on ease of compliance and digital reporting continue to elevate auditable appointment documentation and predictable national baselines; "
        "product teams should assume customers will ask for configurable hiring artefacts that survive state-level enforcement variance and periodic rule updates."
    ),
]
pol_imp = (
    "Workday Recruiting should assume India customers need configurable hiring and onboarding artefacts (appointment documentation, contingent versus employee tracks, location-based policy variance) "
    "that align with labour code consolidation, while supporting verification patterns that respect DigiLocker-style consent flows and clear audit trails for high-volume and GCC-centric employers."
)
pol_notes = (
    "• Separate political narrative from legal obligations on any single date.\n"
    "• Emphasise configurability over bespoke government portal builds.\n\n"
    "References:\n"
    "• https://www.thehindu.com/business/Economy/labour-codes-likely-to-be-fully-operational-from-april-1-2026-govt-to-pre-publish-draft-rules-soon/article70354911.ece\n"
    "• https://www.digitalindia.gov.in/initiative/digilocker"
)

eco_bullets = [
    (
        "India HR technology forecasts cluster around roughly USD 1.12 billion in 2024 toward USD 2.3 billion by 2033 at about 7.88 percent CAGR in open summaries "
        "citing IMARC-style market tables; drivers include application volume, remote hiring, analytics, and compliance-led procurement."
    ),
    (
        "India ATS estimates near USD 0.30 billion in 2024 toward USD 0.50 billion by 2033 at about 7.20 percent CAGR in IMARC-style reporting, signalling sustained "
        "investment in workflow automation for high-volume hiring segments."
    ),
    (
        "India tech industry revenue narratives approach USD 315 billion in FY26 with about 6.1 percent growth; IT services exports on the order of USD 246 billion "
        "and AI services near USD 10 to 12 billion underpin continued enterprise and GCC hiring that expands ATS seats (Nasscom media coverage)."
    ),
    (
        "Forrester-style India tech spending commentary cites about 13.4 percent growth in 2026 among the highest in APAC, with rising costs and regulations shaping real net investment; "
        "CFO scrutiny increases demand for ROI proof in renewals."
    ),
    (
        "INR volatility and landed-cost of global SaaS remain procurement talking points; suite bundling and provable ROI on time-to-fill and compliance risk reduction matter alongside recruiter efficiency metrics."
    ),
]
eco_imp = (
    "India’s economic weight in global IT and GCC hiring justifies enterprise-grade ATS investment; roadmap prioritisation should emphasise measurable efficiency "
    "in bulk, mobile, scheduling, and governed AI matching alongside compliance risk reduction to win CFO and procurement alignment alongside talent acquisition leadership."
)
eco_notes = (
    "• Keep CAGR claims sourced; note definitional variance across vendors.\n\n"
    "References:\n"
    "• https://economictimes.indiatimes.com/tech/information-tech/its-fy26-revenues-set-to-grow-6-1-to-315-billion-says-nasscom/articleshow/128768328.cms\n"
    "• https://www.imarcgroup.com/india-applicant-tracking-system-market/toc"
)

soc_bullets = [
    (
        "India internet penetration reached about 70.0 percent with roughly 1.03 billion users from a population near 1.47 billion in DataReportal Digital 2026 India snapshots using late 2025 data; "
        "mobile connections near 1.06 billion imply about 72.5 percent population penetration with high broadband-class connectivity shares."
    ),
    (
        "LinkedIn registered reach in India is about 170 million in late 2025 with about plus 21.4 percent year-on-year growth in reach, representing a large professional identity layer for sourcing and employer brand."
    ),
    (
        "WhatsApp is culturally default for many segments; industry coverage cites 500 million plus users in India and very high daily engagement, including survey narratives near 94 percent daily opens among Indian MAU in late 2025 (TechCrunch coverage)."
    ),
    (
        "India hiring press in 2025 points to very large application volumes, including narratives on the order of nine crore applications on some platforms and millions of AI-assisted interviews; "
        "candidates and regulators increasingly expect disclosure when AI shapes outcomes."
    ),
    (
        "Mobile recruiting commentary cites strong growth in mobile applications, including India-specific summaries citing on the order of 45 percent increase in mobile recruitment applications in 2023 in IMARC-style reporting; "
        "treat global mobile share benchmarks as directional when not India-only."
    ),
]
soc_imp = (
    "Workday Recruiting should assume mobile-first candidate journeys, very high WhatsApp relevance for India go-to-market alongside SMS and email, and rapid adoption of AI-assisted screening and interviews; "
    "pair channel expansion with clear notice, consent where required, human review for consequential decisions, and configurable retention to meet DPDP and candidate trust expectations."
)
soc_notes = (
    "• Separate consumer WhatsApp norms from enterprise acceptable use policies.\n\n"
    "References:\n"
    "• https://datareportal.com/reports/digital-2026-india\n"
    "• https://techcrunch.com/2025/12/14/whatsapps-biggest-market-is-becoming-its-toughest-test"
)

tech_bullets = [
    (
        "India labour-market reporting ties recruitment growth to AI adoption narratives, including Foundit-style press citing on the order of 15 percent recruitment growth in 2025 with AI as a driver and forward-looking AI hiring growth expectations for 2026 in industry coverage."
    ),
    (
        "IMARC-style ATS commentary claims about 76 percent of Indian recruiters see AI as accelerating hiring; generative AI skills appear among fastest-growing demand categories in market summaries."
    ),
    (
        "India cloud market estimates exceed USD 23 billion in 2025 with strong double-digit CAGR forecasts through 2035 in Expert Market Research summaries; enterprise buyers expect API-first integrations for boards, assessments, and background verification."
    ),
    (
        "Aadhaar-linked and digital public infrastructure narratives increase comfort with digital identity in hiring, but also raise expectations of consent and purpose limitation under DPDP."
    ),
    (
        "Cyber risk narratives cite DPDP breach penalty bands up to ₹250 crore for certain failures in legal commentary, increasing board-level security and vendor due diligence for ATS ecosystems."
    ),
]
tech_imp = (
    "Prioritise HiredScore and Paradox activation narratives with governance hooks such as logging, explainability, and human decision points; invest in API extensibility for India partner ecosystems and security artefacts including DPA, subprocessor transparency, and breach playbooks that satisfy Significant Data Fiduciary-class customers."
)
tech_notes = (
    "• Align AI claims to SKU reality and legal review for high-risk recruitment AI.\n\n"
    "References:\n"
    "• https://www.expertmarketresearch.com/reports/india-cloud-computing-market\n"
    "• https://economictimes.indiatimes.com/jobs/hr-policies-trends/ai-led-hiring-lifted-overall-recruitment-in-2025-foundit-insights-tracker/articleshow/126500912.cms"
)

env_bullets = [
    (
        "SEBI Business Responsibility and Sustainability Reporting requires top listed entities to disclose extensive workforce, diversity, and well-being indicators; turnover, gender representation, employees with disabilities, and training metrics sit in scope per SEBI materials and practitioner guides such as EY India BRSR overviews."
    ),
    (
        "Recruiting product linkage is mostly indirect: source-of-hire, diversity funnel, and inclusive hiring capabilities support downstream BRSR storytelling, but carbon footprint of recruiting is not a regulated ATS requirement in the research set."
    ),
    (
        "Green skills hiring is emerging in global sustainability transitions; India evidence is growing but dispersed, with no single ATS mandate identified in this pass."
    ),
    (
        "DATA GAP: no India statute was identified that mandates ATS-level environmental metrics comparable to EU CSRD depth; monitor sustainability reporting evolution rather than promising recruiting-specific environmental compliance features without legal confirmation."
    ),
]
env_imp = (
    "Maintain diversity and funnel analytics that feed HCM and sustainability reporting for Indian listed enterprises, including source-of-hire and inclusion signals that downstream reporting can reuse. "
    "Avoid over-claiming recruiting-specific environmental compliance where statutes do not mandate ATS metrics; partner with HCM analytics for BRSR depth while keeping ATS scope bounded, evidence-based, and aligned to customer legal interpretation."
)
env_notes = (
    "• Keep environmental slide honest about indirect linkage.\n\n"
    "References:\n"
    "• https://www.sebi.gov.in/sebi_data/commondocs/may-2021/Business%20responsibility%20and%20sustainability%20reporting%20by%20listed%20entitiesAnnexure1_p.PDF\n"
    "• https://www.ey.com/en_in/insights/climate-change-sustainability-services/brsr-reporting-and-the-evolving-esg-landscape-in-india"
)

legal_bullets = [
    (
        "Digital Personal Data Protection Act 2023 is the core statute for digital personal data in India; employers and ATS vendors typically sit as data fiduciary or processor depending on architecture and contracts, with consent and legitimate use analyses varying for portal applications versus direct submissions (Mondaq CMS INDUSLAW commentary, February 2025)."
    ),
    (
        "Retention and erasure expectations for unsuccessful candidates require disciplined deletion unless law mandates retention; continued storage may need explicit consent with clear purpose and duration, mapping directly to purge, retention, and talent pool configuration work in enterprise ATS programmes."
    ),
    (
        "DPDP Rules 2025 and phased enforcement narratives describe Data Protection Board of India operationalisation and staged commencement, including Consent Manager ecosystem evolution and full penalty powers on approximately May 2027 timelines in Rainmaker-style analyses; treat dates as legal-dependency items in customer contracts."
    ),
    (
        "Penalty bands in industry summaries include up to ₹250 crore for certain security failure scenarios, ₹200 crore tiers for notification and children’s data failures, ₹150 crore for Significant Data Fiduciary breaches, and ₹50 crore for other contraventions (Rainmaker summaries)."
    ),
    (
        "Cross-border transfers use a government notification model with potential restricted geographies; GDPR remains material when organisations offer employment to EU residents or monitor them, and recruitment AI is high-risk under EU AI Act Annex III with August 2026 milestones for permitted high-risk deployment in the EU."
    ),
]
legal_imp = (
    "Workday Recruiting must deliver India-first privacy architecture spanning notice and consent patterns, retention and deletion for unsuccessful candidates, talent pool consent, processor and background verification DPAs, rights handling, and breach workflows mapped to DPDP phasing; for AI matching and messaging automation, ship human-in-the-loop, candidate-facing disclosure, and audit logs, and dual-stack requirements where customers hire EU data subjects or deploy high-risk AI in the EU."
)
legal_notes = (
    "• This slide is not legal advice; route customer specifics to counsel.\n\n"
    "References:\n"
    "• https://www.mondaq.com/india/data-protection/1591018/handling-resume-submissions-under-indias-digital-personal-data-protection-act\n"
    "• https://gdpr-info.eu/art-22-gdpr/\n"
    "• https://artificialintelligenceact.eu/ai-act-explorer/"
)

slides.append(pestel_slide("Political", pol_bullets, pol_imp, pol_notes, False))
slides.append(pestel_slide("Economic", eco_bullets, eco_imp, eco_notes, True))
slides.append(pestel_slide("Social", soc_bullets, soc_imp, soc_notes, False))
slides.append(pestel_slide("Technological", tech_bullets, tech_imp, tech_notes, True))
slides.append(pestel_slide("Environmental", env_bullets, env_imp, env_notes, False))
slides.append(pestel_slide("Legal", legal_bullets, legal_imp, legal_notes, True))

# Competitive landscape
slides.append(section("0 6", "Competitive landscape"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Regional Specialists: India"}},
        "tables": [
            {
                "rows": [
                    [
                        "Vendor",
                        "Key strengths",
                        "Key weaknesses",
                        "India fit",
                        "Notes",
                    ],
                    [
                        "Darwinbox",
                        "India cloud HRMS; AI resume screening claims; mobile-first; WhatsApp and voicebot narratives in vendor materials; Forrester Wave Strong Performer positioning",
                        "Mid-market to enterprise scope varies; narrower global template depth versus multinational Workday programmes; integration depth depends on tenant architecture",
                        "Strong statutory adjacency and omnichannel demo pressure",
                        "Deal pressure on messaging and AI demo parity versus Workday true gap rows",
                    ],
                    [
                        "Keka HR",
                        "India recruitment plus ATS; 15+ channel one-click posting; AI JD and screening; tight payroll and HR adjacency",
                        "Enterprise security and global multinational governance depth versus Workday; fewer Fortune 500 references at global scale",
                        "Strong speed and INR packaging for growth enterprises",
                        "Win on local packaging; counter with suite depth and compliance evidence",
                    ],
                    [
                        "Zoho Recruit",
                        "ATS with SMS via Twilio-class partners; WhatsApp in text recruiting materials; multipost; Zoho ecosystem bundle",
                        "Enterprise HCM adjacency and hire-to-retire governance versus unified Workday; complex global security reviews for some buyers",
                        "Strong TCO and omnichannel expectation setter",
                        "Acknowledge India SMS workaround path; document partner implementation runbooks",
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
            "• Keep claims aligned to in-competitive-matrix.md and scan.\n\n"
            "References:\n"
            "• research/competitive/matrices/in-competitive-matrix.md"
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Global Platforms: India Enterprise"}},
        "tables": [
            {
                "rows": [
                    [
                        "Vendor",
                        "Key strengths",
                        "Key weaknesses",
                        "India fit",
                        "Notes",
                    ],
                    [
                        "SAP SuccessFactors",
                        "Deep ERP alignment; Talent Intelligence Hub AI narrative; incumbent strength in manufacturing and regulated India enterprises",
                        "Implementation footprint and upgrade cycles; UX parity pressure versus modern ATS expectations",
                        "Strong where SAP is political anchor",
                        "Defend with DPDP-ready journeys, volume efficiency, and governed AI activation clarity",
                    ],
                    [
                        "Oracle Taleo",
                        "Oracle ecosystem alignment; continued cloud migration narratives; enterprise references in India IT services and industrials",
                        "UX and services-heavy implementations; competitive AI marketing requires crisp Workday differentiation",
                        "Strong in Oracle-heavy accounts",
                        "Win on unified suite data model and security posture where proven",
                    ],
                    [
                        "Workday Recruiting",
                        "Unified HCM plus Recruiting; Hindi support; configurable privacy for DPDP programmes; bulk and mobile parity when executed; hire-to-pay when Payroll in scope",
                        "India SMS to +91 is workaround; native WhatsApp core UI true gap; semantic AI without SKUs true gap; board posts need Broadbean-class multipost",
                        "Best fit for multinational bridge and listed enterprise governance",
                        "Lead with compliance depth; avoid over-claiming native channels",
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
        "speaker_notes": "• Use Native, Workaround, True Gap language consistently.\n",
    }
)

swot_cell = (
    "• Suite integration and hire-to-retire depth versus India-born suites on multinational governance\n"
    "• DPDP-programme native controls when paired with customer legal design and subprocessor transparency\n"
    "• Hindi, bulk grid actions, and mobile recruiter experiences as Native table stakes\n"
    "• HiredScore and Paradox as differentiators under activation with human-in-the-loop hooks\n"
    "• Broadbean-class multipost and CPaaS SMS paths as honest enterprise answers on boards and +91"
)
s_weak = (
    "• Native WhatsApp in core Recruiting UI is a True Gap versus omnichannel suite demos\n"
    "• Semantic AI matching without HiredScore or Workday AI SKUs creates demo and procurement risk\n"
    "• Native SMS to Indian +91 is a high-sensitivity workaround story needing PS-validated runbooks\n"
    "• India board multipost without multiposter is a Broadbean-class workaround that feels slower than one-click mid-market ATS\n"
    "• Paradox-grade conversational scheduling is not automatic; time-to-value pressure from Keka and Zoho TCO"
)
s_opp = (
    "• Q2 India scale mandate with eight wins elevates DPDP defaults, evidence packs, and board validation\n"
    "• DPDP phased roadmap to May 2027 creates countdown demand for consent, notice, and rights UX\n"
    "• GenAI pilots are ubiquitous but privacy throttles scale; governed HiredScore activation wins trust\n"
    "• HR tech and ATS market growth plus Nasscom GCC intensity sustain enterprise ATS budgets\n"
    "• BRSR workforce disclosure links recruiting funnel accuracy to listed enterprise reporting"
)
s_thr = (
    "• Darwinbox USD 140M March 2025 funding signals full-stack bundle pressure on differentiation\n"
    "• SAP and Oracle incumbency plus mobile and AI marketing raise renewal and POC bars\n"
    "• Zoho and Keka TCO and speed win mid-market comparisons unless partner deployments de-risk\n"
    "• DPDP penalties up to roughly rupees 200 to 250 crore class elongate legal review cycles\n"
    "• Channel and AI expectation drift plus parallel EU GDPR and EU AI Act obligations compound multinational India employer cost and trust risk"
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive SWOT: Workday India"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [swot_cell, s_weak],
                    ["Opportunities", "Threats"],
                    [s_opp, s_thr],
                ],
                "left_inches": 0.35,
                "top_inches": 1.0,
                "width_inches": 9.3,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• SWOT transcribed from Step 3 artefact; triangulate with latest India matrix changelog.\n\n"
            "References:\n"
            "• research/India/swot-analysis-India-2026-03-28-IN-E2E-003.md"
        ),
    }
)

# Win / loss: no presales export for India mission
slides.append(section("0 7", "Win / Loss"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win/Loss: Data Availability"}},
        "text_boxes": [
            {
                "left_inches": 2.0,
                "top_inches": 2.3,
                "width_inches": 6.0,
                "height_inches": 1.5,
                "font_name": "Archivo",
                "font_size_pt": 16,
                "color": "ink",
                "alignment": "center",
                "text": (
                    "No Win/Loss data is currently available for this market.\n\n"
                    "Analysis relies on customer interviews, internal SME notes, and competitive intelligence for gap identification and roadmap prioritisation."
                ),
            }
        ],
        "speaker_notes": (
            "• Commit to enriching win/loss hygiene for India deals.\n"
            "• Use thematic and competitive sections for parity narrative.\n"
        ),
    }
)

# Ideation hub equivalents (no CSV): four-slide block
slides.append(section("0 8", "Ideation signals"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Ideation Hub: Data Scope"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "This mission did not include a structured ideation export or spreadsheet corpus under research/India; "
                            "the ideation hub block uses qualitative signal strength from code frequency and triangulation instead of CSV counts."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Internal SME notes across field readiness, services architecture, and strategic customer engagement provide "
                            "hypothesis-level ideas on fraud controls, offer flexibility, attachment handling, and channel defaults."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Customer interviews provide operational validation of which ideas are deal-critical versus nice-to-have, "
                            "especially for duplicates, statutory IDs, analytics, and approvals."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Recommendation: stand up India ideation ingestion alongside presales win/loss exports to tighten quant backing "
                            "for future roadmap readouts."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": "• Frame as DATA GAP with mitigation plan.\n",
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Top Themes by Signal Volume"}},
        "charts": [
            {
                "chart_type": "bar",
                "categories": [
                    "Duplicates",
                    "Fraud SME",
                    "India IDs",
                    "Vendor approval",
                    "Tasks noise",
                    "Source disputes",
                ],
                "series": [{"name": "Mentions", "values": [12, 10, 7, 9, 6, 6]}],
                "title": "Illustrative code frequency (India PMF report)",
                "left_inches": 0.7,
                "top_inches": 1.35,
                "width_inches": 9.0,
                "height_inches": 3.2,
                "has_legend": False,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "text_boxes": [
            {
                "left_inches": 0.7,
                "top_inches": 4.65,
                "width_inches": 8.6,
                "height_inches": 0.55,
                "font_name": "Archivo",
                "font_size_pt": 11,
                "color": "ink",
                "text": (
                    "Counts are derived from the India PMF code book frequencies in the thematic report, not a separate ideation warehouse."
                ),
            }
        ],
        "speaker_notes": (
            "• Emphasise illustrative nature; avoid implying CRM hygiene.\n"
            "• research/India/thematic-analysis/2026-03-28-India-PMF-Analysis.md"
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Ideation Hub: Key Themes"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 0,
                        "text": [{"text": "Auto-merge and blacklist controls", "bold": True, "font_size_pt": 14}],
                    },
                    {
                        "level": 1,
                        "text": (
                            "SME notes emphasise mass purge, auto-merge beyond two duplicates, and do-not-hire automation at scale; "
                            "Accenture and Genpact patterns highlight impersonation and trickery risk."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "\"We need validation on more parameters than name, phone, and email\" (P2, Teleperformance India)."
                        ),
                    },
                    {
                        "level": 0,
                        "text": [{"text": "Offer and document flexibility", "bold": True, "font_size_pt": 14}],
                    },
                    {
                        "level": 1,
                        "text": (
                            "Field readiness notes describe India offer complexity, compensation tables, dual documents, and background check routing flexibility compared with US templates."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "\"Regenerate offer letter does not cover compensation change\" drives manual legal process (P2, Teleperformance India)."
                        ),
                    },
                    {
                        "level": 0,
                        "text": [{"text": "Channel defaults for India volume", "bold": True, "font_size_pt": 14}],
                    },
                    {
                        "level": 1,
                        "text": (
                            "Consultant notes describe marketing opt-in models that collapse reach at India volume and WhatsApp ubiquity for status and scheduling ideas."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Product implication: region-aware templates and partner messaging architecture need legal-reviewed consent models before defaults change."
                        ),
                    },
                ],
                font_pt=12,
            )
        ],
        "speaker_notes": "• Quotes anonymised per participant codes.\n",
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "From Signals to Roadmap"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Treat duplicate integrity, India statutory capture, analytics, approvals, messaging runbooks, and governed AI as one programme "
                            "with shared platform dependencies rather than unrelated tickets."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Prioritise evidence packs for DPDP and high-risk AI questions early in enterprise cycles to counter local suite FUD and shorten security reviews."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Partner-first board strategy remains correct; invest in systematic Broadbean coverage verification for India must-post boards and document gaps for partner expansion asks."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Next research increment: add presales win/loss exports and structured ideation feeds to strengthen quant sections in future quarters."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": "• Align talking points to recommendations section.\n",
    }
)

# Internal SME interviews (Section 8a)
slides.append(section("0 9", "Internal SME"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Internal SME: India Experts"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Population: five Workday internal SMEs spanning product strategy, field readiness, global services architecture, "
                            "India enterprise architecture, and strategic customer engagement."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Purpose: cross-validate customer interview themes with multi-tenant implementation and fraud-at-scale narratives before roadmap scoring."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Timing: notes span July 2025 through January 2026 field conversations with March 2026 synthesis for IN-E2E-003."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Triangulation: SME emphasis on KYC, offer complexity, attachment UX, opt-in reach, and mass merge aligns with P1 to P5 duplicate, ID, and analytics pain."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Limitation: internal perspectives supplement but do not replace customer evidence; Accenture-scale statistics require broader customer validation."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Use: Section pairs with customer interviews; legal claims in SME notes remain hypotheses until customer counsel and Workday Legal confirm."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• SME names are attributable on these slides per Step 7 guidance.\n\n"
            "References:\n"
            "• research/India/105-sme-research-findings.md"
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "SME Participants"}},
        "tables": [
            {
                "rows": [
                    ["SME ID", "Name", "Role", "Context"],
                    ["SME1", "Bernie", "VP, Talent Product Management", "India FY27; fraud and KYC; partnerships"],
                    ["SME2", "Fabiola Navarro", "Sr. Product Advisor, Field Readiness", "India offers; BP depth; Lowe's volume example"],
                    ["SME3", "Santosh Gulia", "Sr. Functional Consultant, Global Services", "Attachments; marketing opt-in; WhatsApp ubiquity"],
                    ["SME4", "David Lodola", "Enterprise Architect, Services India", "Genpact-scale mass hire; impersonation; BGC"],
                    ["SME5", "David Phillips", "Director, Strategic CSE (Accenture)", "DNH; merge limits; fraud at Accenture scale"],
                ],
                "left_inches": 0.35,
                "top_inches": 1.0,
                "width_inches": 9.3,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Confirm titles with stakeholders before external distribution.\n",
    }
)


def sme_slide(title: str, alt: bool, paragraphs: list, notes: str):
    layout = "Title Only_Alt" if alt else "Title Only"
    return {
        "master_index": MI,
        "layout_name": layout,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paragraphs, font_pt=12)],
        "speaker_notes": notes,
    }


slides.append(
    sme_slide(
        "SME1 - Bernie, VP Product",
        False,
        [
            {"level": 0, "text": [{"text": "Fraud and India scale", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Resume and application fraud at very large India volumes frames a Know Your Candidate problem analogous to banking KYC; "
                    "leadership acknowledges India product gaps and FY27 India focus."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Partners and localisation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "BrightHire mentioned as upcoming partner for interview intelligence; address localisation called as concrete India direction."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Hypothesis and triangulation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Hypothesis: trust, identity, and document integrity must be first-class roadmap themes, not edge cases."
                ),
            },
            {
                "level": 1,
                "text": (
                    "Customer triangulation: aligns with P1 and P2 manual duplicate checks and agency-scale integrity risk."
                ),
            },
        ],
        "• Bernie provides executive portfolio view across customers.\n",
    )
)
slides.append(
    sme_slide(
        "SME2 - Fabiola Navarro",
        True,
        [
            {"level": 0, "text": [{"text": "India offer complexity", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Offer compensation tables, calculated fields, and dual documents drive change-request churn; customer used heavy automation that removed start-date checkpoints."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "BGC flexibility", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "India allowed hire before all background check results while US used stricter gates; Extend patterns discussed for start date changes tied to offer regeneration."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Documents and triangulation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Questionnaires with attachment steps and review-document loops address pay stubs and ID variants; tension on what must not persist in core tenant stores."
                ),
            },
            {
                "level": 1,
                "text": (
                    "Triangulation: strong match to P2 and P5 offer regeneration and India ID journey pain."
                ),
            },
        ],
        "• Field readiness depth from enterprise India scope.\n",
    )
)
slides.append(
    sme_slide(
        "SME3 - Santosh Gulia",
        False,
        [
            {"level": 0, "text": [{"text": "Attachment UX", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Review document steps fit poorly when candidates need attach-only flows; email fallback outside Workday remains common."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Marketing reach", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "GDPR-style marketing opt-in starves India reach at volume; clients ask for region-configurable opt-out with unsubscribe on each send."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Channels and triangulation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "WhatsApp ubiquitous for status and links; chatbot and scheduling ideas tie to channel reality once enterprise policy allows."
                ),
            },
            {
                "level": 1,
                "text": (
                    "Triangulation: tension with P5 email-first audit preference; requires policy-configurable channel design."
                ),
            },
        ],
        "• Coordinate DPDP versus GDPR default questions with Legal before field defaults change.\n",
    )
)
slides.append(
    sme_slide(
        "SME4 - David Lodola",
        True,
        [
            {"level": 0, "text": [{"text": "Mass hire and PSA bridge", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Professional services model recruits 100 to 200 roles at a time; Extend bridges PSA demand fields into recruiting where native silos hurt supply-demand visibility."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Impersonation and BGC", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Candidate impersonation drives pre-interview ID proof prompts; Tydy middleware discussed for richer BGC datasets with desire to land data in Workday."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Career site and triangulation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Weak audit when candidates change name, address, or phone creates fraud and BGC bypass concern."
                ),
            },
            {
                "level": 1,
                "text": (
                    "Triangulation: resonates with P2 peak-hiring operational risk and P1 duplicate hygiene at scale."
                ),
            },
        ],
        "• Genpact-scale patterns inform GCC-style India programmes.\n",
    )
)
slides.append(
    sme_slide(
        "SME5 - David Phillips",
        False,
        [
            {"level": 0, "text": [{"text": "Mass operations", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Calls out auto-disposition against do-not-hire lists, mass application purge, and merge limited to two candidates at a time at Accenture-scale duplicate volume."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Fraud and processing", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Roughly half of India applications may not be processed in Workday due to internal compliance rules; competition for jobs drives trickery and admin load."
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Hypothesis and triangulation", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "Hypothesis: DNH automation and multi-way merge are table stakes alongside fraud detection for mega-deployments."
                ),
            },
            {
                "level": 1,
                "text": (
                    "Triangulation: matches P2 duplicate automation ask; Accenture-specific percentages need broader customer validation."
                ),
            },
        ],
        "• Flag Accenture metrics as directional until expanded N confirms.\n",
    )
)

# Primary research
slides.append(section("1 0", "Primary research"))
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "1:1 Customer Interviews: India Enterprise"}},
        "text_boxes": [
            tb_body(
                [
                    {
                        "level": 1,
                        "text": (
                            "Population: five senior recruiting leaders from Teleperformance India across high-volume agent hiring, frontline multi-site hiring, "
                            "specialist hiring, requisition operations, and confidential leadership hiring tracks."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Organisations: substantial India hiring operations with seasonal peaks and agency-heavy sourcing models relevant to BPO and enterprise scale narratives."
                        ),
                    },
                    {
                        "level": 1,
                        "text": "Timing: research conducted December 2025 onsite interviews with March 2026 synthesis.",
                    },
                    {
                        "level": 1,
                        "text": (
                            "Method: in-depth semi-structured interviews exploring workflows, compliance needs, statutory ID and offer paths, analytics behaviour, and channel realities."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Triangulation: cross-validated with five internal SME note sets and India competitive scan outputs; transcript file names retained in speaker notes for internal traceability."
                        ),
                    },
                    {
                        "level": 1,
                        "text": (
                            "Limitation: deep qualitative depth from one enterprise brand; SME notes add multi-customer pattern language for externalisable claims."
                        ),
                    },
                ],
                font_pt=14,
            )
        ],
        "speaker_notes": (
            "• Transcripts: TP Onsite recruiter sessions Dec 2025.\n"
            "• SME notes: Bernie, Fabiola Navarro, Santosh Gulia, David Lodola, David Phillips."
        ),
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["Participant", "Role", "Organisation"],
                    ["P1", "Recruitment lead, agent hiring", "Teleperformance India"],
                    ["P2", "Frontline hiring lead, North and East", "Teleperformance India"],
                    ["P3", "Recruitment manager, specialist hiring", "Teleperformance India"],
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
            }
        ],
        "speaker_notes": "• Confirm titles with customer comms before external decks.\n",
    }
)


def participant_slide(title: str, alt: bool, paragraphs: list, notes: str):
    layout = "Title Only_Alt" if alt else "Title Only"
    return {
        "master_index": MI,
        "layout_name": layout,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paragraphs, font_pt=12)],
        "speaker_notes": notes,
    }


slides.append(
    participant_slide(
        "P1: Recruitment Lead, Teleperformance",
        False,
        [
            {"level": 0, "text": [{"text": "Volume duplicates and vendor ingestion", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "\"For referral, vendor, or social applications, duplicate check is a manual recruiter activity under the candidate profile.\" "
                    "(P1, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"If we remove vendor approval, it will not allow ex-workers or pre-hires to apply again.\" (P1, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": "Source ownership disputes emerge when last upload wins versus contractual first source and cooling-off logic.",
            },
            {
                "level": 0,
                "text": [{"text": "Throughput and fee integrity", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": (
                    "When high-volume agency and direct sourcing overlap, I want automatic duplicate and source rules, so I can protect fee integrity without a full-time approval role."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When vendor uploads spike, I want bulk-safe governance, so I can keep compliance without hundreds of daily clicks."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When duplicates slip through, I want auditable attribution, so I can resolve agency payment conflicts faster."
                ),
            },
        ],
        "• Stress manual scale risk.\n• Connect to UDMF and contract-aware attribution.\n",
    )
)

slides.append(
    participant_slide(
        "P2: Frontline Hiring Lead, Teleperformance",
        True,
        [
            {"level": 0, "text": [{"text": "Peaks, IDs, and offer corrections", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "\"During peak we were not able to onboard people… delays in joining… we lost business days.\" (P2, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"Duplication needs to get automated… validation on more parameters… Aadhaar.\" (P2, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"Downtimes planned on Saturday… India does not treat Saturday as off… impacting business.\" (P2, Teleperformance India)"
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Operational resilience", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": (
                    "When hiring spikes seasonally, I want predictable capacity and bulk-safe hire corrections, so start dates and revenue plans stay intact."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When compensation or start dates change late, I want controlled offer revisions, so legal teams stop issuing parallel manual letters."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When identity signals exist in policy, I want them usable in matching, so deduplication is not limited to weak proxies."
                ),
            },
        ],
        "• Platform calendar note is satisfaction risk; route to platform teams.\n",
    )
)

slides.append(
    participant_slide(
        "P3: Specialist Manager, Teleperformance",
        False,
        [
            {"level": 0, "text": [{"text": "Manager bandwidth and HR admin drag", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "\"Their performance… setting their goals… how they working… set the agenda for day-to-day basis.\" (P3, TP)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"Attendance and slow HR systems steal hours from candidate-facing work.\" (P3, TP - synthesis from interview notes)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"I need recruiting and people tasks in one reliable flow.\" (P3, TP - synthesis from interview notes)"
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Pod leadership jobs", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": (
                    "When I lead a recruiting pod, I want people and hiring workflows in one reliable system, so admin does not crowd out sourcing and closing."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When goals and attendance live in Workday but feel fragile, I want stable core HR transactions, so managers trust the platform for daily operations."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When specialist recruiters need airtime for relationship hiring, I want less system toil, so quality candidates get attention."
                ),
            },
        ],
        "• First quote verbatim from Step 8 file; short quotes paraphrase P3 pain bullets.\n",
    )
)

slides.append(
    participant_slide(
        "P4: Reqs and Onboarding Manager, TP",
        True,
        [
            {"level": 0, "text": [{"text": "Approvals and SLA analytics", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "\"Compensation approval… for now… all the approvals… we are taking offline.\" (P4, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"Aging tracking… we are tracking manually with formulas in Excel.\" (P4, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": "Hiring manager-led requisition creation is desired to reduce cost centre and line-of-business back-and-forth.",
            },
            {
                "level": 0,
                "text": [{"text": "Audit-ready operations", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": (
                    "When requisitions are complex and audited, I want in-flow approvals with timestamps, so finance can reconstruct decisions without email forensics."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When leadership asks for SLA views, I want in-product aging, so spreadsheets are not the system of record."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When handoffs to payroll accelerate, I want clean status semantics, so no-show reporting does not distort attrition metrics."
                ),
            },
        ],
        "• Pair with approvals recommendation.\n",
    )
)

slides.append(
    participant_slide(
        "P5: Leadership Hiring, Teleperformance",
        False,
        [
            {"level": 0, "text": [{"text": "IDs, OTP, evidence, and shadow metrics", "bold": True, "font_size_pt": 14}]},
            {
                "level": 1,
                "text": (
                    "\"Thrive gives proper dashboard for turnaround and aging… Workday doesn't give that option currently.\" (P5, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"Government identifiers… vanishes… we cannot release the offer… multi-day delays… candidates drop out.\" (P5, Teleperformance India)"
                ),
            },
            {
                "level": 1,
                "text": (
                    "\"OTP… candidates not even receiving… ticket on Workday.\" (P5, Teleperformance India)"
                ),
            },
            {
                "level": 0,
                "text": [{"text": "Compliance-grade journeys", "bold": True, "font_size_pt": 14}],
            },
            {
                "level": 1,
                "text": (
                    "When policy mandates statutory IDs, I want persistent guided capture, so offers are not blocked by optional UX mismatches."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When join ratio is measured, I want lighter pre-accept friction, so we stop losing 16 to 17 percent before acceptance to process weight."
                ),
            },
            {
                "level": 1,
                "text": (
                    "When evidence is required, I want trustworthy artefacts in-flow, so recruiters stop relying on screenshots for audit."
                ),
            },
        ],
        "• High sensitivity; align with legal on ID handling claims.\n",
    )
)

# Thematic analysis
slides.append(section("1 1", "Thematic analysis"))

def theme_block(name, a, b, c):
    return [
        {"level": 0, "text": [{"text": name, "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": a},
        {"level": 1, "text": b},
        {"level": 1, "text": c},
    ]


slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Validated Themes 1-3: India Scale"}},
        "text_boxes": [
            tb_body(
                theme_block(
                    "Volume duplicates and source integrity",
                    "Key insight: manual duplicate review and last-touch source attribution break fee accuracy and recruiter capacity at agency-heavy scale; P1 and P2 cite manual checks and vendor approval bottlenecks.",
                    "Business impact: payment disputes and throughput limits become enterprise risks; competitive speed narratives from India suites increase urgency.",
                    "Product implication: invest in UDMF enhancements, contract-aware attribution, and bulk vendor ingestion with cooling-off logic.",
                )
                + theme_block(
                    "India statutory IDs, OTP, and offer friction",
                    "Key insight: optional UX versus mandatory policy on PAN, Aadhaar, and UAN creates drop-off and rework; P5 cites vanishing ID fields and OTP failures.",
                    "Business impact: pre-accept leakage harms join ratio and lengthens legal cycles; aligns to DPDP notice and retention rigour.",
                    "Product implication: align step gating, persistence, and offer revision patterns for high-volume India; joint platform attention on OTP reliability.",
                )
                + theme_block(
                    "Analytics, notifications, and shadow tools",
                    "Key insight: pipeline aging and turnaround are tracked in Excel or parallel tools where in-product views are insufficient; P4 cites spreadsheet SLAs and P5 cites Thrive dashboards.",
                    "Business impact: undermines single-system-of-record positioning and hides operational risk until late.",
                    "Product implication: ship recruiting operational analytics and contextual notifications; partner with platform reporting where canonical metrics must live.",
                ),
                font_pt=12,
            )
        ],
        "speaker_notes": "• Keep themes executive; avoid internal codes.\n",
    }
)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Validated Themes 4-6: Trust"}},
        "text_boxes": [
            tb_body(
                theme_block(
                    "Approvals outside the system",
                    "Key insight: compensation and headcount approvals often complete offline then evidence is attached; weak timestamped in-flow audit.",
                    "Business impact: listed enterprises and DPDP accountability increase demand for reconstructable decisions.",
                    "Product implication: strengthen in-product approval capture and document bundles for India offer packages.",
                )
                + theme_block(
                    "Regional communication model",
                    "Key insight: strict marketing opt-in can starve reach at India volume; WhatsApp is pervasive; specialists still want email evidence for offers.",
                    "Business impact: channel strategy affects response rates and compliance posture simultaneously.",
                    "Product implication: region-aware templates with legal-reviewed consent models; partner messaging architecture clarity for SMS and WhatsApp paths.",
                )
                + theme_block(
                    "Trust, fraud, and governed AI",
                    "Key insight: resume fraud and parser ceilings force manual review; SMEs emphasise impersonation and trickery; AI matching must be governed for India and EU exposure.",
                    "Business impact: demo risk if buyers expect semantic AI without SKUs; regulatory exposure if oversight is weak.",
                    "Product implication: gating questions, identity checkpoints, HiredScore activation playbook, disclosure, logging, and human review UX.",
                ),
                font_pt=12,
            )
        ],
        "speaker_notes": "• Reference EU AI Act and DPDP in talk track.\n",
    }
)

tri_rows = [
    ["Theme", "P1", "P2", "P3", "Ideation", "PMF impact"],
    [
        "Duplicates and source",
        "High",
        "High",
        "Med",
        "SME",
        "Critical",
    ],
    [
        "Statutory ID and offers",
        "Med",
        "High",
        "Med",
        "SME",
        "High",
    ],
    [
        "Analytics and tasks",
        "Low",
        "Med",
        "Med",
        "Customer",
        "High",
    ],
    [
        "Approvals audit",
        "Med",
        "Med",
        "Low",
        "SME",
        "High",
    ],
    [
        "Comms defaults",
        "Low",
        "Low",
        "Low",
        "SME",
        "High",
    ],
    [
        "Fraud and AI",
        "Med",
        "High",
        "High",
        "SME",
        "Strategic",
    ],
]

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [
            {
                "rows": tri_rows,
                "left_inches": 0.25,
                "top_inches": 1.0,
                "width_inches": 9.5,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": (
            "• Ideation column proxies internal SME signal where CSV absent.\n"
            "• research/India/thematic-analysis/2026-03-28-India-PMF-Analysis.md"
        ),
    }
)

# Gap analysis (single table) - Evidence uses P-codes per deck anonymisation rule
slides.append(section("1 2", "Gap analysis"))
gap_rows = [
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
        "Career site noise and fake-open postings increase unqualified volume and trust risk at scale.",
        "🟡 MEDIUM",
        "Posting governance and req discipline in process; fraud themes handled via gating questions roadmap",
        "P3 (Teleperformance India) cites unqualified applicant volume",
        "Improve application quality gates and posting governance without promising full career site redesign",
    ],
    [
        "Convert",
        "India statutory IDs and OTP steps misalign optional UX with mandatory policy causing drop-off.",
        "🔴 HIGH",
        "Partial: manual legal letters and rework; not acceptable at volume",
        "P5 (Teleperformance India) cites vanishing IDs and OTP tickets",
        "Deliver India pre-hire journey patterns with persistence and reliability investments",
    ],
    [
        "Screen",
        "Parser accuracy ceiling forces per-file review; weak referral context creates search collisions.",
        "🟡 MEDIUM",
        "Manual review; search by name; partner tools in some teams",
        "P3 (Teleperformance India) cites parser 60 to 70 percent and Roberts collision",
        "Invest in parser quality, attachment detection, and structured referrer context",
    ],
    [
        "Schedule",
        "Scheduling parity pressure when Paradox not activated; Saturday maintenance impacts India six-day operations.",
        "🟡 MEDIUM",
        "Paradox activation; calendar hygiene outside Recruiting for platform windows",
        "P2 (Teleperformance India) cites Saturday downtime business impact",
        "Clarify scheduling activation paths; escalate platform calendar conflicts separately",
    ],
    [
        "Offer",
        "Offer regeneration limits for compensation changes drive offline legal processes.",
        "🔴 HIGH",
        "Manual legal letters",
        "P2 (Teleperformance India) cites regenerate limits",
        "Extend controlled offer revision patterns for high-volume India",
    ],
    [
        "Comply",
        "Approvals and offer evidence often live outside Workday, weakening audit reconstruction.",
        "🟡 MEDIUM",
        "Email archives and screenshot evidence",
        "P4 and P5 (Teleperformance India) cite offline approvals and screenshots",
        "Strengthen in-flow approvals and auditable document bundles",
    ],
    [
        "Measure",
        "Pipeline aging and SLA views live in spreadsheets or parallel dashboards.",
        "🟡 MEDIUM",
        "Excel formulas; parallel dashboard tools",
        "P4 and P5 (Teleperformance India) cite Excel and Thrive",
        "Ship recruiting operational analytics for aging, SLA, and team throughput",
    ],
]

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Gap Analysis"}},
        "tables": [
            {
                "rows": gap_rows,
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
            "• Severities reflect India PMF thematic analysis March 2026.\n"
            "• Validate workarounds with Professional Services and product authorities before customer commitments.\n\n"
            "References:\n"
            "• research/India/thematic-analysis/2026-03-28-India-PMF-Analysis.md"
        ),
    }
)

# Roadmap
slides.append(section("1 3", "Roadmap"))

rec_table = [
    [
        "#",
        "Title",
        "Action",
        "Reach",
        "Impact",
        "Conf.",
        "Effort",
        "RICE",
        "Legal / compliance (060)",
    ],
    [
        "1",
        "Scale duplicate management and agency source governance",
        "Expand UDMF / matching; multi-way merge; source-of-hire audit; policy-gated India ID keys",
        "3,200",
        "3.0",
        "78%",
        "8 pm",
        "936",
        "DPDP: lawful basis, minimisation, retention for ID fields; map Aadhaar/PAN keys to policy. EU AI Act / GDPR: high-risk if matching materially affects candidates — DPIA, human review, logging, no solely automated reject.",
    ],
    [
        "2",
        "India statutory ID, OTP, and offer orchestration",
        "PAN / Aadhaar / UAN journeys; OTP reliability; offer revision / rescind for high volume",
        "2,800",
        "3.0",
        "72%",
        "10 pm",
        "605",
        "DPDP: consent, notice, purpose limitation for govt identifiers. Biometric / OTP: treat as heightened sensitivity — DPIA if biometric; legal review of templates and mandatory-field UX.",
    ],
    [
        "3",
        "In-system approvals and req intake quality",
        "Position / comp approvals in-product; HM guidance on org and financial metadata",
        "2,400",
        "2.5",
        "70%",
        "7 pm",
        "600",
        "Medium: auditable approval trail and retention; align DAP with evidence expectations for India procurement.",
    ],
    [
        "4",
        "DPDP programme accelerators",
        "Tenant defaults, evidence packs, candidate rights playbooks",
        "2,000",
        "2.5",
        "75%",
        "4 pm",
        "938",
        "DPDP-first: accurate cross-border and subprocessor statements; DPIA if collateral implies processing beyond current contracts; avoid over-claim vs product reality.",
    ],
    [
        "5",
        "India messaging runbook (+91, WhatsApp)",
        "PS-validated CPaaS; Paradox paths; SKU-honest GTM",
        "3,000",
        "2.25",
        "65%",
        "5 pm",
        "878",
        "DPDP: granular consent per channel, retention, logs for audit. Partners: CPaaS DPA and transfer mechanisms; SKU-honest copy only.",
    ],
    [
        "6",
        "Recruiting analytics and actionable notifications",
        "Dashboards, SLA aging, req-scoped notifications",
        "2,200",
        "2.25",
        "68%",
        "9 pm",
        "374",
        "Low–medium if existing data only. DPIA/PIA if new profiling, inferred attributes, or third-party analytics feeds.",
    ],
    [
        "7",
        "Blacklist and mass application hygiene automation",
        "Auto-disposition vs DNH; scale purge patterns",
        "1,500",
        "2.0",
        "60%",
        "6 pm",
        "300",
        "High: Indian labour / equality exposure; no solely automated adverse eligibility; jurisdictional counsel; document fairness controls.",
    ],
    [
        "8",
        "Candidate attachment drop zone",
        "Profile-scoped uploads; multi-stage without email fallback",
        "2,000",
        "2.0",
        "65%",
        "8 pm",
        "163",
        "DPDP: retention, access control, vendor vs recruiter roles; secure deletion aligned to programme.",
    ],
    [
        "9",
        "Regional marketing consent model",
        "Explore opt-out where law allows; unblock India reach",
        "1,800",
        "2.25",
        "55%",
        "4 pm",
        "557",
        "High — gate: Workday Legal must rule on DPDP vs GDPR defaults before opt-out or field changes; wrong default = regulatory and trust risk.",
    ],
    [
        "10",
        "HiredScore / Workday AI activation pack",
        "Beta expansion with bias, logging, human-review collateral",
        "2,500",
        "2.75",
        "70%",
        "6 pm",
        "804",
        "EU AI Act high-risk employment AI; DPIA; human oversight, transparency, bias testing; align India narrative to IndiaAI / customer fiduciary duties without overstating autonomy.",
    ],
]

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [
            {
                "rows": rec_table,
                "left_inches": 0.25,
                "top_inches": 1.0,
                "width_inches": 9.5,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Full table supports leadership selection conversations.\n",
    }
)


def rec_slide(n, title, problem, evidence, rec, why, metrics, alt):
    layout = "Title Only_Alt" if alt else "Title Only"
    paras = [
        {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": problem},
        {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": evidence},
        {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": rec},
        {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": why},
        {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 14}]},
        {"level": 1, "text": metrics},
    ]
    return {
        "master_index": MI,
        "layout_name": layout,
        "placeholders": {"0": {"text": f"Recommendation {n}: {title}"}},
        "text_boxes": [tb_body(paras, font_pt=12)],
        "speaker_notes": "• Align delivery gates with legal review items in table.\n",
    }


slides.append(
    rec_slide(
        1,
        "Duplicates & Agency Scale",
        (
            "Manual per-profile duplicate checks and two-at-a-time merge are insufficient at agency scale; last-touch source attribution creates financial exposure on concurrent submissions."
        ),
        (
            "P1 and P2 (TP); Phillips, Santosh, and Bernie (SME). 101: regional competitors sell speed and AI screening that heighten throughput expectations."
        ),
        (
            "Roadmap UDMF and matching enhancements; multi-candidate merge; source rules and audit for concurrent submissions; policy-gated use of India identifiers in matching with Legal-reviewed lawful basis."
        ),
        (
            "Q2 India scale growth and eight-win mandate make trust and throughput table stakes; T1 triangulation is critical across SME and customer evidence."
        ),
        (
            "Duplicate-related recruiter minutes per hire down 25 percent in pilot tenants; agency source dispute tickets down 20 percent where attribution rules deploy; zero solely automated reject paths in scope."
        ),
        False,
    )
)
slides.append(
    rec_slide(
        2,
        "Statutory ID & Offer Flow",
        (
            "Partial ID capture state, OTP failures, and rigid offer regeneration create multi-day recruiter chase and estimated double-digit offer-to-join leakage for specialised hiring."
        ),
        (
            "P5 and P2 (TP); Fabiola and Santosh (SME) on India offer tables, BGC flexibility, and document-step misfits."
        ),
        (
            "End-to-end journey design for PAN, Aadhaar, and UAN with mandatory and conditional logic aligned to customer policy; reliable OTP patterns; offer revision and rescind or resend paths for high volume."
        ),
        (
            "DPDP phased enforcement narrative and procurement scrutiny on government identifiers make auditable journeys a 2026 revenue and compliance joint requirement."
        ),
        (
            "Join ratio before acceptance: move pilot cohorts toward 90 percent where baselines sit near 82 to 83 percent; OTP-related support tickets down 40 percent quarter on quarter where instrumented."
        ),
        True,
    )
)
slides.append(
    rec_slide(
        3,
        "Approvals & Req Quality",
        (
            "Headcount and compensation approvals often sit in email; missing supervisory organisation and cost centre metadata force requisition rework and SLA misses."
        ),
        (
            "P4, P5, and P1 (TP); Fabiola on automation that removed start-date checkpoints at volume."
        ),
        (
            "In-product workflows for position and compensation approval; hiring manager guidance on supervisory org and financial dimensions at requisition creation with guardrails that preserve high-volume automation."
        ),
        (
            "India BPO scale and six-day-week intensity leave no slack for approval forensics; in-flow evidence answers procurement audit questions faster than email threads."
        ),
        (
            "Share of reqs created with complete org and cost metadata up 30 percent in pilot; offline approval threads for standard changes down 25 percent where measured."
        ),
        False,
    )
)
slides.append(
    rec_slide(
        4,
        "DPDP Deal Accelerators",
        (
            "Procurement and legal review cycles elongate India deals when collateral is descriptive rather than prescriptive on consent, retention, subprocessors, and candidate rights."
        ),
        (
            "099 PESTEL Legal factor; 101 battle card; P5 friction on IDs, consent, and audit expectations."
        ),
        (
            "India DPDP blueprint: tenant defaults, subprocessor transparency hooks, and candidate rights playbooks with product screenshots that match SKU-honest boundaries."
        ),
        (
            "May 2027 enforcement narrative and Q2 India wins require repeatable evidence packs, not one-off consultant narratives."
        ),
        (
            "Legal review cycle time from first DPDP questionnaire to signed addendum down 20 percent in pilot accounts; zero marketing claims contradicted by DA-validated product boundaries."
        ),
        True,
    )
)
slides.append(
    rec_slide(
        5,
        "+91 & WhatsApp Runbook",
        (
            "True gaps on native +91 SMS and native WhatsApp in core Recruiting UI (DA-IN003) collide with RFP expectations set by Zoho-class suites and omnichannel strategy pushes."
        ),
        (
            "101 matrix and scan; Santosh on WhatsApp ubiquity and opt-in reach; strategy cites near-term WhatsApp; P5 prefers email for regulatory traceability."
        ),
        (
            "Single GTM line after PS and UAT validation; architecture patterns for CPaaS; Paradox activation for conversational flows where policy allows; policy-based channel choice rather than one-channel defaults."
        ),
        (
            "Competitive demos and customer tension on channels peak during Q2 India scale and international growth programmes; SKU honesty prevents trust erosion post-sale."
        ),
        (
            "90 percent of India enterprise sellers can explain SMS and WhatsApp paths without over-claim; partner implementation NPS +10 in post-sale surveys where instrumented."
        ),
        False,
    )
)

slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2), encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
