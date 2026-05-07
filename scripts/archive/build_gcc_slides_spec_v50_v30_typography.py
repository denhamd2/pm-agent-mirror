#!/usr/bin/env python3
"""Build slides_spec_v50.json: v30 slide inventory + v30 typography (docs/decks/gcc-pmf-roadmap-v30-typography.md)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v50.json"

# v30-measured body box
BODY = {"left_inches": 0.7, "top_inches": 1.2, "width_inches": 8.6, "height_inches": 2.8}


def _strip_bullet(s: str) -> str:
    s = s.strip()
    if s.startswith("• "):
        return s[2:].strip()
    return s


def _product_impl_para(implication_body: str) -> dict:
    body = implication_body.strip()
    low = body.lower()
    if low.startswith("product implication:"):
        body = body.split(":", 1)[1].strip()
    return {
        "level": 0,
        "text": [
            {
                "text": "Product implication: ",
                "bold": True,
                "font_size_pt": 11,
                "highlight": "FFFF00",
            },
            {"text": body, "bold": True, "font_size_pt": 11, "highlight": "FFFF00"},
        ],
    }


def sec(primary: str, secondary: str) -> dict:
    """v30: 12pt bold primary, 11pt laptop secondary, both level 0 (no bullet on subtitle).

    secondary MUST be a plain string: Slide Deck MCP auto-agenda stringifies run-arrays and
    shows Python-like [{'text': ...}] on slide 2. See 130-pmf-slide-generator.mdc.
    """
    return {
        "master_index": 1,
        "layout_name": "Section Title",
        "text_boxes": [
            {
                "left_inches": 3.3,
                "top_inches": 1.5,
                "width_inches": 5.6,
                "height_inches": 2.2,
                "font_name": "Archivo",
                "font_size_pt": 11,
                "color": "ink",
                "paragraphs": [
                    {
                        "level": 0,
                        "text": [{"text": primary, "bold": True, "font_size_pt": 12}],
                    },
                    {
                        "level": 0,
                        "text": secondary,
                    },
                ],
            }
        ],
    }


def body_text_box(paragraphs: list, height: float | None = None) -> dict:
    box = {**BODY, "font_name": "Archivo", "font_size_pt": 11, "color": "ink", "paragraphs": paragraphs}
    if height is not None:
        box["height_inches"] = height
    return box


def title_only(title: str, paragraphs: list, alt: bool = False, notes: str = "", body_height: float | None = None):
    lo = "Title Only_Alt" if alt else "Title Only"
    slide = {
        "master_index": 1,
        "layout_name": lo,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [body_text_box(paragraphs, height=body_height)],
    }
    if notes:
        slide["speaker_notes"] = notes
    return slide


def pestel_slide(name: str, alt: bool, bullet_lines: list[str], implication: str, notes: str):
    paras = [{"level": 1, "text": _strip_bullet(line)} for line in bullet_lines if line.strip()]
    paras.append(_product_impl_para(implication))
    return title_only(name, paras, alt=alt, notes=notes)


def recommendation_slide(title: str, alt: bool, body: str, notes: str):
    lines = [ln.strip() for ln in body.strip().split("\n") if ln.strip()]
    paras = [{"level": 1, "text": _strip_bullet(ln)} for ln in lines]
    return title_only(title, paras, alt=alt, notes=notes, body_height=2.8)


slides: list = []

slides.append(
    {
        "master_index": 1,
        "layout_name": "TITLE",
        "placeholders": {
            "0": {"text": "GCC Product-Market Fit Research"},
            "1": {
                "text": "Workday Recruiting | Gulf Cooperation Council | v50 v30 typography | 22 March 2026"
            },
        },
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "GCC Recruiting PMF roadmap | Authorship, data sources, executive summary, and how to read this deck",
    )
)

slides.append(
    title_only(
        "Research Author",
        [
            {"level": 1, "text": "Analysis: Workday Recruiting PMF agent workflow (120 report + 130 deck)"},
            {"level": 1, "text": "Report: research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v50.md"},
            {"level": 1, "text": "Primary qual: 3 GCC-market enterprise interviews (P1–P3)"},
            {"level": 1, "text": "Structured opportunities: research/raw-data/filtered_gcc_opps.csv (2 GCC rows)"},
            {"level": 1, "text": "Legal checkpoints: 060 on PESTEL Legal and roadmap recommendations"},
            {"level": 1, "text": "Spec: v30 inventory + v30 typography (native bullets, 2.8in body, PESTEL highlight)"},
        ],
        alt=True,
        notes="• Ownership and traceability for exec readers.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v50.md",
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Executive Summary"}},
        "text_boxes": [
            body_text_box(
                [
                    {
                        "level": 0,
                        "text": [{"text": "Headline finding", "bold": True, "font_size_pt": 12}],
                    },
                    {
                        "level": 1,
                        "text": "Strong PMF signals on nationalisation, scheduling, WhatsApp policy split, grid/search, and reporting — triangulated with 2 GCC Win/Loss rows; no SME transcripts in research/GCC/.",
                    },
                    {
                        "level": 0,
                        "text": [{"text": "What to ship first (P1 themes)", "bold": True, "font_size_pt": 12}],
                    },
                    {
                        "level": 1,
                        "text": "Nationalisation and compliance analytics (OOTB vs custom fields)",
                    },
                    {
                        "level": 1,
                        "text": "Interview scheduling, M365 depth, KSA guardrails (legal-reviewed copy)",
                    },
                    {
                        "level": 1,
                        "text": "AI matching / semantic search with human-in-the-loop",
                    },
                    {
                        "level": 1,
                        "text": "WhatsApp and omnichannel with tenant policy controls",
                    },
                    {
                        "level": 1,
                        "text": "Candidate grid / single-pane recruiter UX",
                    },
                    {
                        "level": 0,
                        "text": [{"text": "Market signal", "bold": True, "font_size_pt": 12}],
                    },
                    {
                        "level": 1,
                        "text": "GCC HR tech market growing ~9% CAGR through 2032 (Astute Analytica); compliance enforcement rising",
                    },
                ],
                height=3.15,
            )
        ],
        "speaker_notes": "• v50 synthesis; v30-style exec blocks (12pt subheads + bullets).\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Research challenge | Research questions, objectives, and Braun & Clarke five-phase methodology for GCC Recruiting PMF",
    )
)

slides.append(
    title_only(
        "Research Question & Objectives",
        [
            {"level": 1, "text": "How can Workday Recruiting better support hiring in the GCC region?"},
            {"level": 1, "text": "Understand customer pain points, compliance requirements, and local preferences"},
            {"level": 1, "text": "Identify product gaps and roadmap opportunities"},
            {
                "level": 1,
                "text": "Triangulate interviews with Win/Loss data, PESTEL desk research, and competitive context",
            },
        ],
        notes="• Braun & Clarke six-phase methodology.\n\nReferences:\n• Braun & Clarke (2006)",
    )
)

slides.append(
    title_only(
        "Research Approach - 5-Phase Framework",
        [
            {"level": 1, "text": "Phase 0: Geographic filtering (GCC)"},
            {"level": 1, "text": "Phase 1: Familiarisation with data"},
            {"level": 1, "text": "Phase 2: Generating initial codes"},
            {"level": 1, "text": "Phase 3: Generating themes"},
            {"level": 1, "text": "Phase 4: Reviewing themes (triangulation)"},
            {"level": 1, "text": "Phase 5: Defining and naming themes"},
            {"level": 1, "text": "Phase 6: Report + slide deck (v30 inventory + typography)"},
        ],
        alt=True,
        notes="• Standard Braun & Clarke methodology.\n\nReferences:\n• Braun & Clarke (2006)",
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Strategic context | GCC market size, HR tech growth, digital hiring momentum, and why the region matters for Workday Recruiting now",
    )
)

slides.append(
    title_only(
        "Strategic Context - Why GCC Now",
        [
            {
                "level": 1,
                "text": "Nationalisation programmes tie hiring software to licence-to-operate risk",
            },
            {
                "level": 1,
                "text": "Enterprise ATS cycles favour suites that prove compliance depth and auditability",
            },
            {
                "level": 1,
                "text": "Regional competitors lead on Arabic UX, local boards, and nationalisation reporting",
            },
            {
                "level": 1,
                "text": "Workday wins on global HCM record; must close GCC-specific evidence gaps",
            },
        ],
        notes="• Strategic framing.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    )
)

slides.append(
    title_only(
        "GCC Market Momentum - Key Indicators",
        [
            {
                "level": 1,
                "text": "Astute Analytica: US$2,557.3M (2023) → US$5,483.5M (2032), CAGR 9.05% (GCC HR tech)",
            },
            {"level": 1, "text": "Strong HR tech investment intent across GCC enterprises (analyst summaries)"},
            {
                "level": 1,
                "text": "Nationalisation timelines (e.g. Nitaqat 2026–2028 commentary) increase hiring proof burden",
            },
            {
                "level": 1,
                "text": "High WhatsApp penetration in UAE samples vs tenant messaging policy variance",
            },
        ]
        + [
            _product_impl_para(
                "Market growth plus enforcement make recruiting depth a board-visible purchase criterion."
            )
        ],
        alt=True,
        notes="• Astute Analytica.\n\nReferences:\n• https://www.astuteanalytica.com/industry-report/gcc-hr-tech-market",
        body_height=3.0,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "PESTEL | Political, economic, social, technological, environmental, and legal factors with yellow-highlight product implications",
    )
)

pestel_data = [
    (
        "Political",
        False,
        [
            "Saudi Nitaqat 2026–2028: MHRSD phase (verify Arabic primary notices)",
            "UAE Emiratisation: MOHRE enforcement; press fines context (verify per deal)",
            "Kuwait / Oman: Kuwaitisation and Omanisation on government-linked contracts",
        ],
        "Native nationalisation dimensions, audit-ready reporting, Qiwa/MoHRE-aligned evidence where required.",
        "• Mondaq; Gulf News.\n\nReferences:\n• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know",
    ),
    (
        "Economic",
        True,
        [
            "Astute Analytica: US$2,557.3M (2023) → US$5,483.5M (2032), CAGR 9.05%",
            "ATS remains a priority segment inside HR suites",
            "Saudi / UAE consolidation favours platforms that prove compliance depth",
        ],
        "GCC is a high-growth market; nationalisation-ready recruiting is a differentiator.",
        "• Astute Analytica.\n\nReferences:\n• https://www.astuteanalytica.com/industry-report/gcc-hr-tech-market",
    ),
    (
        "Social",
        False,
        [
            "UAE GMI 2024: ~85.8% WhatsApp penetration (16–64 users) in industry summary",
            "P1–P2: WhatsApp essential; P3: policy may block WhatsApp",
            "P2: 40%+ career traffic handheld; Arabic critical for operational hiring",
        ],
        "WhatsApp + SMS + email with policy controls; mobile apply; Arabic UX.",
        "• GMI; transcripts.\n\nReferences:\n• https://www.globalmediainsight.com/blog/uae-social-media-statistics",
    ),
    (
        "Technological",
        True,
        [
            "Qiwa, GOSI, Mudad: Saudi portals (verify features via Deployment Agent)",
            "AI in TA is baseline in analyst grids (e.g. Fosway)",
            "Microsoft 365 and scheduling integration depth remains a differentiator",
        ],
        "Credible evidence patterns; AI with audit, explainability, and human review.",
        "• Industry summaries.\n\nReferences:\n• learningnews.com/news/fosway/2025/2025-fosway-9-grid-for-cloud-hr/",
    ),
    (
        "Environmental",
        False,
        [
            "DATA GAP: no recruiting-specific environmental signals in this pass",
            "UAE Net Zero 2050, Saudi 2060: macro ESG context",
            "ESG workforce reporting may emerge",
        ],
        "No recruiting feature commitment from this factor in v50; monitor ESG workforce reporting demand.",
        "• N/A.\n\nReferences:\n• N/A",
    ),
    (
        "Legal",
        True,
        [
            "Saudi PDPL: lawful basis, retention, rights, breaches — map recruiting data (Legal)",
            "KSA interviews: ≥3 working days' notice themes in practitioner summaries — verify Arabic law",
            "UAE PDPA (45/2021): lawful processing, transfers, subject rights",
        ],
        "Configurable scheduling guardrails + evidence logs; PDPL/PDPA-ready minimisation; legal-reviewed UX copy.",
        "• Mondaq.\n\nReferences:\n• https://www.mondaq.com/saudiarabia/employee-rights-labour-relations/1683580/new-regulations-for-private-sector-job-advertising-and-interviews",
    ),
]
for name, alt, blines, impl, sn in pestel_data:
    slides.append(pestel_slide(name, alt, blines, impl, sn))

slides.append(
    sec(
        "Workday Confidential",
        "Competitive landscape | Regional specialists, global enterprise platforms, and SWOT for Workday Recruiting in GCC",
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Regional Specialists",
        [
            {"level": 1, "text": "Talentera (Bayt): regional board adjacency; Arabic-first workflows"},
            {"level": 1, "text": "ZenHR / ZenATS: GCC HR stack narratives; mid-market agility"},
            {"level": 1, "text": "Darwinbox: APAC/GCC growth; rapid configuration marketing"},
            {
                "level": 1,
                "text": "Differentiators: Arabic UX, local posting, nationalisation-friendly reporting",
            },
        ]
        + [
            _product_impl_para(
                "RFPs compare Workday to 'good enough' regional ATS unless compliance depth is proven."
            )
        ],
        notes="• Desk scan.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
        body_height=3.0,
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Global Platforms",
        [
            {
                "level": 1,
                "text": "Global suites: Workday, SAP SuccessFactors, Oracle HCM / Taleo",
            },
            {"level": 1, "text": "Phenom (P2): shapes career journey expectations"},
            {"level": 1, "text": "Analyst grids: AI and suite consolidation as baseline"},
        ]
        + [
            _product_impl_para(
                "Win GCC on compliance depth, enterprise trust, and integration reality — not slide-ware alone."
            )
        ],
        alt=True,
        notes="• Fosway summaries.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
        body_height=3.0,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive SWOT Analysis - Workday Recruiting in GCC"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [
                        "Single HCM record; global scale; security and enterprise trust",
                        "GCC OOTB nationalisation vs custom fields; Arabic/RTL doc edge cases",
                    ],
                    [
                        "Partners (HiredScore, Paradox) for AI and scheduling narratives",
                        "M365 scheduling friction for some populations (PG-00009165)",
                    ],
                ],
                "top_inches": 1.0,
                "left_inches": 0.5,
                "width_inches": 9.0,
                "height_inches": 2.1,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            },
            {
                "rows": [
                    ["Opportunities", "Threats"],
                    [
                        "Nationalisation enforcement; board-level compliance buys",
                        "Regional ATS wins on speed and Arabic-first UX",
                    ],
                    [
                        "AI matching demand in interviews",
                        "Competitor posting paths; SKU risk (PG-00005541 pattern)",
                    ],
                ],
                "top_inches": 3.15,
                "left_inches": 0.5,
                "width_inches": 9.0,
                "height_inches": 2.1,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            },
        ],
        "speaker_notes": "• SWOT for sales enablement validation.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Win / Loss | Deal dataset, severity-weighted gap themes, charts, and GCC-relevant or proxy severity gaps from pipeline evidence",
    )
)

slides.append(
    title_only(
        "Win / Loss Analysis - Dataset Overview",
        [
            {"level": 1, "text": "Source: research/raw-data/filtered_gcc_opps.csv"},
            {"level": 1, "text": "Rows ingested: 2 GCC opportunity records (+ header)"},
            {
                "level": 1,
                "text": "Role: echo scheduling integration friction and competitor posting risk",
            },
            {"level": 1, "text": "Limitation: small n — directional with qual, not prevalence rates"},
        ]
        + [
            _product_impl_para(
                "Use Win/Loss as compliance + integration + SKU risk lens in GCC deal reviews."
            )
        ],
        alt=True,
        notes="• CSV.\n\nReferences:\n• research/raw-data/filtered_gcc_opps.csv",
        body_height=3.0,
    )
)

slides.append(
    title_only(
        "Win / Loss - Top Product Gap Themes (Severity-Weighted)",
        [
            {
                "level": 1,
                "text": "Theme A — Scheduling: Outlook/Teams/HiredScore friction (PG-00009165); severity 5",
            },
            {
                "level": 1,
                "text": "Theme B — Posting path: CareerPlug; SKU removal risk (PG-00005541); severity 3",
            },
            {
                "level": 1,
                "text": "Qual: P1–P2 scheduling pain; posting risk aligns with interview competitor pressure",
            },
        ]
        + [
            _product_impl_para(
                "Prioritise integration reliability and scheduling guardrails in GCC bids."
            )
        ],
        notes="• Export labels; verify in source.\n\nReferences:\n• filtered_gcc_opps.csv",
        body_height=3.0,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win / Loss - Gap Analysis: Charts"}},
        "charts": [
            {
                "chart_type": "column",
                "categories": ["PG-00009165\n(scheduling)", "PG-00005541\n(posting)"],
                "series": [{"name": "Severity (export)", "values": [5, 3]}],
                "left_inches": 1.0,
                "top_inches": 1.65,
                "width_inches": 8.0,
                "height_inches": 3.2,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "speaker_notes": "• One series per style guide.\n\nReferences:\n• filtered_gcc_opps.csv",
    }
)

slides.append(
    title_only(
        "Win / Loss - GCC-Relevant Severity-1 Gaps (EMEA Proxy)",
        [
            {
                "level": 1,
                "text": "Proxy: scan EMEA Win/Loss for integration/compliance patterns — not GCC prevalence",
            },
            {"level": 1, "text": "GCC cohort: scheduling stack friction; competitor-assisted posting"},
            {
                "level": 1,
                "text": "Interview bridge: P1 KSA notice/committee; P2 Outlook easier than Workday",
            },
        ]
        + [
            _product_impl_para(
                "Pre-brief CSG and engineering on first questions in GCC escalations."
            )
        ],
        notes="• Transparent proxy.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
        body_height=3.0,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Primary research | Interview programme, participant roster, per-customer findings, and customer ideation quant where CSV data exists",
    )
)

slides.append(
    title_only(
        "Customer Interviews | 3 GCC-market enterprise participants (anonymised)",
        [
            {"level": 1, "text": "Three enterprise programmes with GCC hiring exposure"},
            {"level": 1, "text": "Protocol: P1–P3 anonymised; company and role retained"},
            {
                "level": 1,
                "text": "Coverage: nationalisation, scheduling, messaging, grid, AI, dashboards, Arabic, mobile",
            },
            {"level": 1, "text": "No SME transcripts in research/GCC/ — triangulation Customer vs CSV"},
        ],
        alt=True,
        notes="• Primary research intro.\n\nReferences:\n• research/GCC/customer-transcripts/",
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Customer Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["Participant", "Role", "Organisation", "GCC relevance"],
                    ["P1", "Cyber Security & Campus Hiring Lead", "Accenture", "Egypt, GCC, Africa"],
                    ["P2", "Performance & Innovation Manager (TA)", "Baker Hughes", "Global TA, GCC themes"],
                    ["P3", "Product Owner, Talent & Resourcing", "Shell", "Global; franchise incl. GCC"],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "height_inches": 2.8,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Anonymisation protocol.\n\nReferences:\n• research/GCC/customer-transcripts/",
    }
)

slides.append(
    title_only(
        "Customer Interview - Accenture (P1)",
        [
            {
                "level": 1,
                "text": "Nationalisation: Emiratisation, Saudization, Kuwaitisation; PWD and gender tracking",
            },
            {
                "level": 1,
                "text": "Scheduling: top wish; KSA notice and panel themes; Kuwait notice practice",
            },
            {"level": 1, "text": "Offers: long cycles off-template; workarounds"},
            {"level": 1, "text": "WhatsApp: essential for fast closure"},
            {"level": 1, "text": "Dashboards: hard to read; rebuild externally"},
        ],
        alt=True,
        notes="• P1.\n\nReferences:\n• Interview_P1_Ammad_Alsairafi_Accenture.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Baker Hughes (P2)",
        [
            {"level": 1, "text": "Grid: many tabs at 100–200 candidates; wants seamless view"},
            {"level": 1, "text": "Boolean weak; wants AI-assisted search"},
            {"level": 1, "text": "Scheduling: harder than Outlook; Paradox if integrated"},
            {"level": 1, "text": "Nationalisation: Nitaqat; custom fields; penalties"},
            {"level": 1, "text": "WhatsApp: helpful in GCC/Saudi"},
            {"level": 1, "text": "Career site: branding limits; clunky apply; 40%+ mobile"},
        ],
        notes="• P2.\n\nReferences:\n• Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Shell (P3)",
        [
            {"level": 1, "text": "Reporting: native dashboards insufficient; PowerBI for leadership"},
            {"level": 1, "text": "Arabic/RTL: Docs shows squares for Arabic offers"},
            {"level": 1, "text": "Franchise: fewer openings; manual Excel reporting"},
            {"level": 1, "text": "HiredScore: evaluating for high volume, low openings"},
            {"level": 1, "text": "Comms: WhatsApp restricted; email, SMS, Teams"},
        ],
        alt=True,
        notes="• P3.\n\nReferences:\n• Interview_P3_Arika_Yamahata_Shell.txt",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub | Structured opportunities + qualitative codes (v50)",
        [
            {"level": 1, "text": "DATA GAP: no 9,922-row GCC ideas corpus this pass"},
            {"level": 1, "text": "Proxy: 2 Win/Loss rows + March 2026 codebook (report)"},
            {"level": 1, "text": "Method: semantic codes [Customer], [CSV] then theme clustering"},
        ]
        + [
            _product_impl_para(
                "Reconnect ideas telemetry later; until then label proxies transparently."
            )
        ],
        notes="• Quant honesty.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
        body_height=3.0,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Customer Ideation Hub - Top Capability Areas (Qualitative Weighting)"}},
        "charts": [
            {
                "chart_type": "column",
                "categories": [
                    "Nationalisation",
                    "Scheduling",
                    "Grid/AI",
                    "WhatsApp",
                    "Dashboards",
                    "Offers/RTL",
                ],
                "series": [{"name": "Interview emphasis (relative)", "values": [9, 9, 8, 8, 8, 7]}],
                "left_inches": 0.7,
                "top_inches": 1.55,
                "width_inches": 8.6,
                "height_inches": 3.35,
                "category_axis_font_size_pt": 8,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "text_boxes": [
            {
                "text": "Illustrative weights from coding density — not a statistical model.",
                "left_inches": 0.7,
                "top_inches": 4.95,
                "width_inches": 8.6,
                "height_inches": 0.55,
                "font_name": "Archivo",
                "font_size_pt": 9,
                "color": "laptop",
            }
        ],
        "speaker_notes": "• Replace with real volumes when available.\n\nReferences:\n• Customer transcripts",
    }
)

slides.append(
    title_only(
        "Customer Ideation Hub - 6 Key Themes from Verbatim Analysis",
        [
            {"level": 1, "text": "Nationalisation and workforce compliance analytics"},
            {"level": 1, "text": "Interview scheduling, integrations, statutory guardrails"},
            {"level": 1, "text": "Recruiter efficiency: grid, search, AI matching"},
            {"level": 1, "text": "Omnichannel engagement (WhatsApp, SMS, campaigns)"},
            {"level": 1, "text": "Reporting and dashboard abandonment (PowerBI / Excel)"},
            {"level": 1, "text": "Offers, documents, localisation, mobile candidate experience"},
        ],
        notes="• v50 theme names.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - AI Ideas Spotlight",
        [
            {"level": 1, "text": "P2: large database — match beyond applicants; boolean weak"},
            {"level": 1, "text": "P3: high volume, low openings — HiredScore evaluation"},
            {"level": 1, "text": "P1: AI on roadmap for search and matching"},
            {
                "level": 1,
                "text": "Compliance: EU AI Act high-risk recruitment; GDPR Art. 22 — human-in-the-loop",
            },
        ]
        + [
            _product_impl_para(
                "AI is a buyer expectation; pair with governance and GCC tenant realities."
            )
        ],
        alt=True,
        notes="• Legal-sensitive; verify quotes externally.\n\nReferences:\n• Transcripts; 060-legal-advisor.mdc",
        body_height=3.0,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Thematic validation | Consolidated themes, evidence weighting, and cross-source triangulation across interviews, ideas, and Win/Loss",
    )
)

slides.append(
    title_only(
        "Validated Themes 1-4 - Strong customer signal (GCC)",
        [
            {"level": 1, "text": "Nationalisation & compliance: OOTB gap; penalties (P1, P2)"},
            {
                "level": 1,
                "text": "Scheduling: Outlook/Teams friction; Paradox; KSA themes (P1, P2; PG-00009165)",
            },
            {"level": 1, "text": "Grid & AI: tab fatigue; boolean; database match (P2, P3)"},
            {"level": 1, "text": "WhatsApp: speed in GCC vs policy blocks (P1, P2 vs P3)"},
        ],
        notes="• Batched themes.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    )
)

slides.append(
    title_only(
        "Validated Themes 5-7 - Reporting, offers/docs, competitive pressure",
        [
            {"level": 1, "text": "Reporting: native gaps; PowerBI exits (P1, P3)"},
            {
                "level": 1,
                "text": "Offers, Arabic/RTL, mobile, career site: delays; Phenom redirect (P1–P3)",
            },
            {
                "level": 1,
                "text": "Posting / competitors: PG-00005541 SKU risk; regional ATS comparisons",
            },
        ]
        + [
            _product_impl_para(
                "Themes 5–7 are medium–high PMF; legal review on documents and retention."
            )
        ],
        alt=True,
        notes="• Thematic batch.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
        body_height=3.0,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "P1", "P2", "P3", "CSV", "PMF impact"],
                    ["Nationalisation", "✓", "✓", "-", "Implicit", "Critical"],
                    ["Reporting", "✓", "Partial", "✓", "-", "High"],
                    ["Interview scheduling", "✓", "✓", "-", "✓", "Critical"],
                    ["Offer / docs / RTL", "✓", "-", "✓", "-", "Medium–high"],
                    ["WhatsApp / channels", "✓", "✓", "Policy", "-", "High"],
                    ["Grid / search / AI", "Partial", "✓", "✓", "-", "High"],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "height_inches": 3.25,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Customer + CSV; no SME.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Diagnostic | Full-funnel gap view tying Win/Loss and interview evidence to recruiter workflow pressure points",
    )
)

slides.append(
    title_only(
        "GCC Recruiting Gap Analysis - Full Funnel",
        [
            {
                "level": 1,
                "text": "Attract & apply: mobile/branding gaps; competitor posting SKU risk",
            },
            {
                "level": 1,
                "text": "Screen & interview: grid friction; Outlook leakage; KSA guardrails needed",
            },
            {
                "level": 1,
                "text": "Offer & onboard: offer lead times; Arabic/RTL defects; email document risk",
            },
            {
                "level": 1,
                "text": "Compliance: custom-field nationalisation; PowerBI exits on reporting",
            },
        ]
        + [
            _product_impl_para(
                "Full-funnel fixes blend compliance depth with recruiter speed."
            )
        ],
        alt=True,
        notes="• Funnel synthesis.\n\nReferences:\n• Transcripts; filtered_gcc_opps.csv",
        body_height=3.15,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Roadmap recommendations | Priority 1 and Priority 2 actions, success metrics, and E2E handoff table for PM selection",
    )
)

rec_bodies = [
    (
        "Recommendation 1: Nationalisation and compliance analytics (P1)",
        False,
        "Problem: Custom nationality fields break; audit risk for Nitaqat / Emiratisation / Kuwaitisation.\n"
        "Evidence: P1 targets; P2 penalties; desk research on programme phases.\n"
        "Recommendation: OOTB objects, reports, exceptions; Qiwa/MoHRE-aligned evidence (legal sign-off).\n"
        "Why now: 2026–2028 Nitaqat commentary; UAE enforcement narratives (verify per deal).\n"
        "Success metrics: % on standard packs; audit findings down; GCC win rate vs regional ATS.",
    ),
    (
        "Recommendation 2: Interview scheduling and GCC rule packs (P1)",
        True,
        "Problem: Recruiters leave for Outlook; rules in spreadsheets.\n"
        "Evidence: P1 top wish; P2 harder than Outlook; PG-00009165 friction.\n"
        "Recommendation: M365 depth; Paradox-class flows; KSA notice/panel helpers (legal copy).\n"
        "Why now: MHRSD themes in practitioner articles — verify Arabic primary law.\n"
        "Success metrics: in-product schedules; fewer tickets; legal acceptance of warnings/consent.",
    ),
    (
        "Recommendation 3: AI matching and semantic search (P1)",
        False,
        "Problem: Boolean weak; large databases hide matches.\n"
        "Evidence: P2 scale; P3 HiredScore; P1 AI question.\n"
        "Recommendation: Semantic search; similar candidates; HiredScore alignment; disclosures.\n"
        "Why now: Analyst grids treat AI in TA as baseline.\n"
        "Success metrics: time-to-shortlist; match acceptance; DPIAs for AI surfaces.",
    ),
    (
        "Recommendation 4: WhatsApp and omnichannel campaigns (P1)",
        True,
        "Problem: Email-only misses GCC norms; tenant policy splits.\n"
        "Evidence: P1/P2 essential/helpful; P3 blocks WhatsApp.\n"
        "Recommendation: WhatsApp Business; templates; Arabic; consent logs; tenant toggles.\n"
        "Why now: High UAE messaging penetration (industry summaries).\n"
        "Success metrics: opt-in; delivery; less shadow channel where allowed.",
    ),
    (
        "Recommendation 5: Candidate grid redesign (P1)",
        False,
        "Problem: Tab fatigue at volume.\n"
        "Evidence: P2 100–200 candidate navigation.\n"
        "Recommendation: Single-pane summary, CV, notes, history, actions.\n"
        "Why now: Grid pain global; GCC volume amplifies time-to-fill.\n"
        "Success metrics: clicks-to-CV; time-to-shortlist; recruiter satisfaction.",
    ),
    (
        "Recommendation 6: Recruiter and leader dashboards (P2)",
        True,
        "Problem: Native dashboards shallow; PowerBI exits.\n"
        "Evidence: P1 headache; P3 PowerBI.\n"
        "Recommendation: Role-aware dashboards; time-in-stage; conversion; LOB/location/level.\n"
        "Why now: Leadership wants live compliance and funnel proof.\n"
        "Success metrics: WAU dashboards; fewer external BI extracts.",
    ),
]
for t, alt, b in rec_bodies:
    slides.append(recommendation_slide(t, alt, b, "• Items 7–8 in report E2E table.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v50.md"))

slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
