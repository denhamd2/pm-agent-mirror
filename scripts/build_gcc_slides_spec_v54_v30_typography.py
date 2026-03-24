#!/usr/bin/env python3
"""Build slides_spec_v54.json from 2026-03-22-GCC-PMF-Analysis-v54.md (v30 inventory + typography)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "slides_spec_v54.json"

BODY = {"left_inches": 0.7, "top_inches": 1.2, "width_inches": 8.6, "height_inches": 2.8}
REPORT = "research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v54.md"


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
            {"text": "Product implication: ", "bold": True, "font_size_pt": 11, "highlight": "FFFF00"},
            {"text": body, "bold": True, "font_size_pt": 11, "highlight": "FFFF00"},
        ],
    }


def sec(primary: str, secondary: str) -> dict:
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
                    {"level": 0, "text": [{"text": primary, "bold": True, "font_size_pt": 12}]},
                    {"level": 0, "text": secondary},
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


def pestel_slide_levels(name: str, alt: bool, items: list[tuple[int, str]], implication: str, notes: str):
    paras = [{"level": lv, "text": _strip_bullet(tx)} for lv, tx in items if tx.strip()]
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
            "1": {"text": "Workday Recruiting | Gulf Cooperation Council | v54 4-way triangulation | 22 March 2026"},
        },
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "GCC Recruiting PMF roadmap | Authorship, 101/105/106/107 sources, executive summary, and how to read this deck",
    )
)

slides.append(
    title_only(
        "Research Author",
        [
            {"level": 1, "text": "Analysis: 120-pmf-thematic-analysis (GCC-E2E-014 Step 2b) + 130 slide generator"},
            {"level": 1, "text": f"Report: {REPORT}"},
            {"level": 1, "text": "Triangulation: 105 customer transcripts, 101 CI scan + matrix, 106 P&T ideas dashboard, 107 win-loss extract"},
            {"level": 1, "text": "Primary qual: 3 enterprise interviews (P1–P3) with GCC hiring context"},
            {"level": 1, "text": "Legal: 060 review advised on PESTEL Legal and governed AI roadmap bullets before production commitments"},
            {"level": 1, "text": "Spec: v30 slide inventory + typography (2.8in body, paragraphs bullets, PESTEL yellow highlight)"},
        ],
        alt=True,
        notes=f"• Traceability for exec readers.\n\nReferences:\n• {REPORT}",
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
                    {"level": 0, "text": [{"text": "Headline findings", "bold": True, "font_size_pt": 12}]},
                    {
                        "level": 1,
                        "text": "Nationalisation and local compliance are deal-critical; 101 shows workaround-led coverage; 106 sustains compliance volume; 107 flags regulatory loss links where sparse.",
                    },
                    {
                        "level": 1,
                        "text": "Omnichannel (WhatsApp, SMS, campaigns) expected for GCC speed; Zoho paths sharp in 101; Shell (P3) shows enterprise no-WhatsApp policy — need governed choice.",
                    },
                    {
                        "level": 1,
                        "text": "Candidate review density, mobile apply, and career journey friction: P1–P3 + 106 candidate-record effort + 107 career/scheduling themes converge.",
                    },
                    {
                        "level": 0, "text": [{"text": "Roadmap headline", "bold": True, "font_size_pt": 12}]},
                    {
                        "level": 1,
                        "text": "Ten E2E handoff recommendations span compliance suite, omnichannel, grid/mobile, governed AI, scheduling, RTL, career path, permissions, offer docs, and sales enablement.",
                    },
                    {
                        "level": 0, "text": [{"text": "Market signal", "bold": True, "font_size_pt": 12}]},
                    {
                        "level": 1,
                        "text": "PESTEL: Nitaqat 2026–2028, Emiratisation enforcement, GCC HR tech ~9–10% CAGR band, PDPL-class laws in KSA and UAE.",
                    },
                ],
                height=3.2,
            )
        ],
        "speaker_notes": "• v54 executive bullets.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Research challenge | Research questions, objectives, and Braun & Clarke methodology with 4-way triangulation for GCC Recruiting PMF",
    )
)

slides.append(
    title_only(
        "Research Question & Objectives",
        [
            {"level": 1, "text": "How can Workday Recruiting strengthen PMF in GCC enterprise hiring?"},
            {"level": 1, "text": "Map customer jobs, compliance risk, and omnichannel norms vs product reality (Native / Workaround / Gap per 101)"},
            {"level": 1, "text": "Triangulate 105 interviews with 106 internal ideation volume, 107 global win-loss buying criteria, and 101 competitive scan"},
            {"level": 1, "text": "Produce prioritised roadmap actions with E2E handoff for PM selection"},
        ],
        notes="• Method: Braun & Clarke (2006) six reporting phases in v54 report.\n\nReferences:\n• Braun & Clarke (2006)",
    )
)

slides.append(
    title_only(
        "Research Approach - 5-Phase Framework",
        [
            {"level": 1, "text": "Phase 0: Corpus scoping (GCC; 101/105/106/107 artefacts for GCC-E2E-014)"},
            {"level": 1, "text": "Phase 1: Familiarisation (re-read customer transcripts per 105 attestation)"},
            {"level": 1, "text": "Phase 2: Initial coding (48 semantic codes, source-tagged)"},
            {"level": 1, "text": "Phase 3: Candidate themes (7 clusters refined to 5 robust themes; 6 rows in matrix incl. scheduling)"},
            {"level": 1, "text": "Phase 4: Triangulation (4-column matrix; convergence 2/4–4/4)"},
            {"level": 1, "text": "Phase 5–6: Theme definition, PESTEL, competitive (101-sourced), report + this deck"},
        ],
        alt=True,
        notes="• Aligns to v54 methodology table.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Strategic context | GCC market size, HR tech growth, nationalisation enforcement, and why recruiting depth matters for Workday now",
    )
)

slides.append(
    title_only(
        "Strategic Context - Why GCC Now",
        [
            {"level": 1, "text": "Nationalisation quotas and penalties tie ATS evidence to licence-to-operate (Emiratisation, Saudization, Kuwaitisation)"},
            {"level": 1, "text": "Regional bundles (e.g. Bayzat) and value ATS (Zoho) narrate compliance and omnichannel aggressively"},
            {"level": 1, "text": "Enterprise buyers still value Workday depth, security, and global template — parity gaps must be explained with 101 facts, not slides alone"},
            {"level": 1, "text": "107 shows large do-nothing loss cohort — ROI and adoption narratives matter alongside feature parity"},
        ],
        notes="• Strategic frame from v54.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    )
)

slides.append(
    title_only(
        "GCC Market Momentum - Key Indicators",
        [
            {
                "level": 1,
                "text": "Astute Analytica (press summary): GCC HR tech ~9.05% CAGR 2024–2032; USD multi-billion by early 2030s (validate methodology in primary report)",
            },
            {"level": 1, "text": "Enforcement narratives: UAE Emiratisation fines in press; KSA Nitaqat 2026–2028 phase in legal summaries"},
            {"level": 1, "text": "Social: very high messaging adoption; WhatsApp #1 in UAE Statista-style rankings (use for channel strategy, not as legal advice)"},
        ]
        + [
            _product_impl_para(
                "Budget competition inside HR stacks favours platform consolidation and provable ROI; 107 do-nothing cohort reinforces adoption and value narratives alongside parity."
            )
        ],
        alt=True,
        notes="• Astute Analytica; GlobeNewswire summary.\n\nReferences:\n• https://www.astuteanalytica.com/industry-report/gcc-hr-tech-market",
        body_height=3.05,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "PESTEL | Political, economic, social, technological, environmental, and legal factors with yellow-highlight product implications",
    )
)

PESTEL = [
    (
        "Political",
        False,
        [
            (1, "Saudi Arabia: new Nitaqat phase 2026–2028 described in advisory summaries as intensifying Saudization monitoring (Qiwa banding, visa and services linkage)"),
            (2, "Mondaq and Fragomen programme commentary — verify Arabic primary MHRSD notices for deals"),
            (1, "UAE: MoHRE Emiratisation targets and enforcement; press cites AED 108,000 fine per missing Emirati from 1 January 2026 for 2025 shortfalls"),
            (2, "Gulf News, Khaleej Times summaries — validate against official MoHRE guidance before customer commitments"),
            (1, "Customer evidence: P1 cites binding quota bands (20%, 60%, 50%) and in-system tracking liability for nationalisation metrics"),
            (1, "KSA interview panel and Kuwait interview notice constraints referenced in transcripts (scheduling guardrail hypotheses)"),
            (1, "Kuwait / Oman: Kuwaitisation and Omanisation remain structural themes on government-linked contracts"),
            (1, "101 classifies much nationalisation reporting as workaround-led today — political risk if customers cannot prove compliance in-product"),
        ],
        "Nationalisation is a political risk surface for customers; recruiting products must support auditable tracking, role-based visibility, and reporting that states Native versus workaround paths aligned with the 101 matrix.",
        "• Mondaq; Fragomen; Gulf News.\n\nReferences:\n• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know",
    ),
    (
        "Economic",
        True,
        [
            (1, "GCC HR tech forecasts cluster multi-billion USD by early 2030s with high single-digit CAGR"),
            (1, "Astute Analytica press summary cites ~9.05% CAGR 2024–2032 for GCC HR tech market sizing"),
            (2, "Treat headline valuation as directional until primary vendor methodology is reviewed"),
            (1, "Enterprise ATS purchases sit inside broader HCM consolidation and compliance-led renewals"),
            (1, "Regional competitors bundle payroll, WPS adjacency, and local portals — TCO stories pressure point solutions"),
            (1, "107 loss-to-do-nothing cohort (~107 rows) signals budget and ROI stalls, not only competitive defeat"),
            (1, "Consolidation favours vendors who prove ROI on recruiter speed and compliance analytics, not feature lists alone"),
            (1, "v54 executive summary: budget competition raises bar for trustworthy reporting and workflow guardrails"),
        ],
        "Budget competition inside HR stacks favours platform consolidation and provable ROI; win-loss do-nothing patterns mean adoption and value proof must accompany roadmap parity work.",
        "• Astute Analytica; GlobeNewswire.\n\nReferences:\n• https://www.globenewswire.com/news-release/2024/06/18/2900516/0/en/GCC-HR-Tech-Market-Valuation-Set-to-Skyrocket-to-Reach-USD-5-483-5-Million-By-2032-Astute-Analytica.html",
    ),
    (
        "Social",
        False,
        [
            (1, "GCC states show very high social and messaging adoption; WhatsApp repeatedly #1 in UAE platform rankings (Statista-style hubs)"),
            (2, "Use penetration stats for GTM and UX priority, not as substitute for tenant policy review"),
            (1, "P2 cites 40%+ mobile apply share in Middle East context; mobile drop-off is a recruiter efficiency risk"),
            (1, "Arabic important for operational and blue-collar hiring; professional roles often English-first but offer and document Arabic remains sensitive"),
            (1, "P3: Workday Docs character rendering issues for Arabic offers — social expectation of credible local language artefacts"),
            (1, "P1 and P2: WhatsApp essential for speed; P3: official business policy may block WhatsApp — enterprise governance split"),
            (1, "Campaign and notification norms in GCC reward fast response; email-only journeys feel dated to many recruiters (P2)"),
        ],
        "Mobile-first apply and credible Arabic and RTL in generated artefacts are social expectations in GCC hiring, so channel breadth must pair with tenant controls and audit-friendly logging.",
        "• Statista hubs; customer transcripts.\n\nReferences:\n• https://www.statista.com/statistics/1391532/uae-most-used-social-media-platforms/",
    ),
    (
        "Technological",
        True,
        [
            (1, "101 records Qiwa and Mudad as custom or gap class versus competitor marketing — validate per bid with Deployment Agent"),
            (1, "AI in TA shows high intent and uneven maturity in industry commentary and 101 scan"),
            (2, "106: Gen AI on Job Requisitions low volume (n=24) but relatively less negative sentiment — cautious internal optimism"),
            (1, "Competitor velocity on AI-assisted hiring (Zoho, Bayzat, HiBob narratives) raises table-stakes pressure"),
            (1, "Integrations: Broadbean job board model per workspace rule — do not promise native board builds where partnership covers demand"),
            (1, "Paradox and HiredScore assumed integrated — package scheduling and matching narratives with disclosure and human oversight"),
            (1, "Government portal and insurance integrations remain fast-moving — product marketing must track Deployment Agent deltas quarterly"),
            (1, "Mobile and API expectations rise with regional ATS velocity; enterprise buyers still demand auditability over flash features"),
        ],
        "AI and portal integrations require enterprise governance, audit trails, human review for high-risk recruitment uses, and honest Native versus partner versus gap classification from 101.",
        "• gcc-competitive-scan-2026-03-22-GCC-E2E-014.md; 106 brainstorm analysis.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-014.md",
    ),
    (
        "Environmental",
        False,
        [
            (1, "DATA GAP: no direct environmental driver for ATS PMF surfaced in this pass"),
            (1, "Optional watch: UAE Net Zero 2050 and KSA climate commitments may increase ESG reporting on employer branding over time"),
            (2, "Link to recruiting is indirect — monitor customer RFP language rather than inventing green ATS mandates"),
            (1, "Supplier due diligence questions may grow for global employers — low near-term impact on core ATS workflows"),
            (1, "Environmental bullet retained for PESTEL completeness per v30 inventory"),
            (1, "Defer feature investment unless customer-backed ESG hiring fields emerge in pipeline"),
        ],
        "No near-term ATS feature mandate from the environmental factor in this analysis; monitor ESG and employer branding fields as a long-tail signal only.",
        "• v54 PESTEL Environmental.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    ),
    (
        "Legal",
        True,
        [
            (1, "Saudi PDPL in force 14 September 2023 (commonly cited): registration, DPO triggers, breach notification, cross-border transfers"),
            (2, "DLA Piper and Lexology summaries — engage legal for customer-specific processing bases"),
            (1, "UAE Federal Decree-Law 45 of 2021 effective 2 January 2022: consent, automated decision-making rights, DPO, UAE Data Office"),
            (2, "Mondaq UAE employee privacy summaries for employment-related processing patterns"),
            (1, "EU AI Act: recruitment and selection AI typically high-risk (Annex III); GDPR Article 22 limits solely automated decisions with legal or significant effect"),
            (1, "Product boundary: nationality and diversity tracking need lawful basis clarity; WhatsApp logging must support retention, access, and audit under PDPL-class laws"),
            (1, "Candidate-facing disclosure and recruiter audit trails for assisted ranking are preconditions for governed AI matching (v54 Theme 4)"),
            (1, "060 validation recommended before any automated rejection or scoring UX ships in global employer tenants"),
        ],
        "Nationality and diversity tracking must be lawful-basis clear per market; channel logging for WhatsApp should support retention, access, and audit expectations under PDPL-class laws, with 060 review before automated rejection or scoring UX.",
        "• DLA Piper; Lexology; EU AI Act explorer.\n\nReferences:\n• https://gdpr-info.eu/; https://artificialintelligenceact.eu/",
    ),
]
for name, alt, items, impl, sn in PESTEL:
    slides.append(pestel_slide_levels(name, alt, items, impl, sn))

slides.append(
    sec(
        "Workday Confidential",
        "Competitive landscape | Regional specialists, global platforms, and SWOT grounded in 101 Step 1 scan and gcc-competitive-matrix.md",
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Regional Specialists",
        [
            {"level": 1, "text": "Bayzat: bundled HR, payroll, WPS, government portal claims, Arabic, AI-positioned ATS — validate portal claims in RFP"},
            {"level": 1, "text": "Zoho Recruit: Arabic, WhatsApp integration paths, Twilio SMS, fast cadence, transparent pricing — sharp omnichannel comparator"},
            {"level": 1, "text": "HiBob: modern UX, Bob Hiring, large job board reach claim; Mosaic / Pento M&A — confirm Arabic and GCC payroll per deal"},
            {"level": 1, "text": "Implication: win on global enterprise depth and auditability; respect local bundle TCO stories"},
        ]
        + [
            _product_impl_para(
                "Workday wins on enterprise record and security when bid teams map 101 Native, Workaround, and True Gap honestly against regional suite narratives."
            )
        ],
        notes="• 101 scan + matrix GCC-E2E-014.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-014.md",
        body_height=3.05,
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Global Platforms",
        [
            {"level": 1, "text": "Global suites: Workday, SAP SuccessFactors, Oracle — enterprise ATS as part of HCM footprint"},
            {"level": 1, "text": "101 feature comparison (condensed): Arabic UI native; RTL generated documents = gap; WhatsApp/SMS partner-led with geography caveats"},
            {"level": 1, "text": "Qiwa / Mudad: gap (custom) vs competitor marketing; nationalisation: workaround (fields + reporting) vs native dashboard claims"},
            {"level": 1, "text": "Job boards: Broadbean partnership model — expand via partner, not native board builds"},
        ]
        + [
            _product_impl_para(
                "Close perception gaps with Deployment Agent-backed bid sheets and 101 classification, not undifferentiated suite messaging."
            )
        ],
        alt=True,
        notes="• gcc-competitive-matrix.md changelog GCC-E2E-014.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
        body_height=3.05,
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
                        "Enterprise depth, security, auditability, global template; HiredScore and Paradox narratives when activated",
                        "RTL generated documents gap; SMS geography caveats for CE; WhatsApp partner-led vs Zoho-style paths",
                    ],
                    [
                        "101-classified workarounds for nationalisation reporting — implementable but enablement-heavy",
                        "Qiwa / Mudad custom integration burden vs competitor marketing claims",
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
                        "Board-level nationalisation enforcement; governed AI and omnichannel if packaged with compliance",
                        "Regional bundles win on TCO and local portal story when Workday evidence is unclear",
                    ],
                    [
                        "Sales and CS enablement with Broadbean and Deployment Agent facts reduces spreadsheet sidecar risk",
                        "AI and career-site benchmarks (Phenom, Eightfold) from 107 comparisons raise parity bar",
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
        "speaker_notes": "• SWOT transcribed from v54 competitive section + 101.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Win / Loss | 107 opportunity extract, pipeline outcomes, gap themes, and proxy severity — global signal with sparse GCC rows",
    )
)

slides.append(
    title_only(
        "Win / Loss Analysis - Dataset Overview",
        [
            {"level": 1, "text": "Source: research/GCC/win-loss-interviews/Opportunity Detail.xlsx (Sheet 1) — 598 gap-level rows, 432–433 opportunities"},
            {"level": 1, "text": "Outcomes: 179 Closed/Won; 96 Closed/Lost to Competition; 107 Closed/Lost to Do Nothing (plus smaller open and historical buckets)"},
            {"level": 1, "text": "Geography: 532 rows North America; 29 EMEA; 25 APAC; GCC keyword matches sparse — use as global buying-criteria lens"},
            {"level": 1, "text": "Dominant gap type: Feature across won, lost, and do-nothing; Integration in all outcomes; Regulatory/Compliance rare but loss-linked"},
        ]
        + [
            _product_impl_para(
                "Treat 107 as global Workday Recruiting pattern data; triangulate GCC specifics with 105 transcripts and 101 validated gaps."
            )
        ],
        alt=True,
        notes="• 2026-03-22-win-loss-analysis.md.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-22-win-loss-analysis.md",
        body_height=3.05,
    )
)

slides.append(
    title_only(
        "Win / Loss - Top Gap Themes (Buying Criteria)",
        [
            {
                "level": 1,
                "text": "Must-have signals: feature parity versus incumbent ATS; integrations (Indeed, LinkedIn) framed as blocking when buyer believes another vendor closes the workflow",
            },
            {
                "level": 1,
                "text": "Important: AI and talent marketing benchmarks (Phenom, Eightfold); career site and interview scheduling comparisons",
            },
            {
                "level": 1,
                "text": "Loss themes: incumbent already does X; channel and integration attribution risk; offer and e-sign experience vs Greenhouse-style flows",
            },
            {
                "level": 1,
                "text": "Do nothing: large cohort — budget, timing, ROI, paralysis — roadmap needs value narrative not only parity lists",
            },
        ]
        + [
            _product_impl_para(
                "Separate parity losses from no-decision in GTM; validate claims with 101 Native versus Workaround before roadmap commits."
            )
        ],
        notes="• 107 buying criteria hierarchy.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-22-win-loss-analysis.md",
        body_height=3.05,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win / Loss - Pipeline Outcomes: Charts"}},
        "charts": [
            {
                "chart_type": "column",
                "categories": ["Closed/Won", "Lost vs\ncompetition", "Lost do\nnothing"],
                "series": [{"name": "Gap-level rows", "values": [179, 96, 107]}],
                "left_inches": 1.0,
                "top_inches": 1.65,
                "width_inches": 8.0,
                "height_inches": 3.2,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "speaker_notes": "• Row counts from 107 executive summary.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-22-win-loss-analysis.md",
    }
)

slides.append(
    title_only(
        "Win / Loss - Competitive Factor Matrix (Summary)",
        [
            {"level": 1, "text": "Feature depth: wins despite gaps; losses when incumbent matches specific workflow; do-nothing still feature-typed"},
            {"level": 1, "text": "Career site / candidate UX: competitor strength noted even in some wins; losses reference better career site or chatbot elsewhere"},
            {"level": 1, "text": "Interview scheduling: perceived delivered in competitor versus third-party framing in notes"},
            {"level": 1, "text": "All claims remain buyer or CI perception until 101 and Deployment Agent classify facts"},
        ]
        + [
            _product_impl_para(
                "Use this matrix to brief sales and PM on honest gap registration alongside suite wins — align post-sale CSM narratives to listed gaps."
            )
        ],
        notes="• Factor matrix cells from 107.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-22-win-loss-analysis.md",
        body_height=3.05,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Primary research | 105 synthesis, transcript roster, per-customer quotes and themes, plus 106 ideation quant from P&T dashboard export",
    )
)

slides.append(
    title_only(
        "Customer Interviews | 3 GCC-market enterprise participants (anonymised P1–P3)",
        [
            {"level": 1, "text": "Population: n=3 enterprise programmes with GCC hiring exposure; semi-structured interviews; Braun & Clarke coding"},
            {"level": 1, "text": "Transcripts: Interview_P1_Accenture.txt; Interview_P2_Baker_Hughes.mp4.txt; Interview_P3_Shell.txt (paths under research/GCC/customer-transcripts/)"},
            {"level": 1, "text": "105 findings regenerated in GCC-E2E-014 Step 2a; 120 re-read transcripts in Phase 1 with Fresh pass attestation"},
            {"level": 1, "text": "Triangulation: customer column anchors themes; 106 adds internal volume; 107 adds global loss patterns; 101 grounds competitive claims"},
            {"level": 1, "text": "SME transcripts: none — no internal SME column in matrix"},
            {"level": 1, "text": "Limitation: qual depth high, statistical prevalence low — complement with 106/107/101 for scale signals"},
        ],
        alt=True,
        notes="• v54 105 inputs section.\n\nReferences:\n• research/GCC/105-user-research-findings.md",
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
                    ["Participant", "Role (label)", "Organisation"],
                    ["P1", "Cybersecurity and campus hiring lead", "Accenture"],
                    ["P2", "Performance and innovation manager (global TA systems)", "Baker Hughes"],
                    ["P3", "Product owner, talent and resourcing", "Shell"],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "height_inches": 2.5,
                "font_size_pt": 9,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Anonymisation P1–P3 per 010-style-guide.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    }
)

slides.append(
    title_only(
        "Customer Interview - Accenture (P1)",
        [
            {
                "level": 1,
                "text": "\"I'm liable to hit … 20% … 60% … 50% … on my hiring\" — nationalisation quota tracking on Workday is board-level (P1, Accenture); Theme T1 4/4",
            },
            {
                "level": 1,
                "text": "\"You're not able to organise an interview … in less than three day notice\" — Kuwait scheduling and consent friction; JTBD: when panels must comply, I want guardrails in-product so I avoid regulatory mis-steps",
            },
            {"level": 2, "text": "KSA panel composition themes and interview rules cited in transcript"},
            {"level": 1, "text": "WhatsApp: absolute necessary for immediate responses in market (P1) — aligns T2 omnichannel"},
            {"level": 1, "text": "Dashboards: native views unusable; rebuild externally — feeds T6 reporting (3/4 convergence)"},
            {"level": 1, "text": "Req-level permissions: assignee-tag friction when moving candidates — E2E rec 8 hook"},
            {"level": 1, "text": "Scepticism on government portal ease versus competitor claims — aligns 101 Qiwa/Mudad gap narrative"},
        ],
        alt=True,
        notes="• Quote-led bullets from v54 Theme 1 and interview synthesis.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Baker Hughes (P2)",
        [
            {
                "level": 1,
                "text": "\"Navigate through different tabs … 100 candidates or 200 candidates … time consuming\" — grid friction; Theme T3 4/4",
            },
            {
                "level": 1,
                "text": "\"Two million candidates … can the system match\" — database match beyond applicants; Theme T4 AI 4/4",
            },
            {"level": 1, "text": "Boolean search weak; wants semantic or AI-assisted discovery at scale"},
            {"level": 1, "text": "Scheduling: felt more complicated than Outlook; Paradox integration interest — Theme T5"},
            {"level": 1, "text": "Nationalisation: Nitaqat; nationality fields; penalties — reinforces T1"},
            {"level": 1, "text": "WhatsApp helpful in GCC and Saudi; email-only campaigns feel limiting — T2"},
            {"level": 1, "text": "40%+ mobile apply in Middle East context; Arabic critical for operational hiring — PESTEL Social bridge"},
        ],
        notes="• P2 synthesis v54.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Shell (P3)",
        [
            {
                "level": 1,
                "text": "\"Hundreds of CV … knowing immediately who we should be paying attention to\" — prioritisation at volume; Theme T3",
            },
            {
                "level": 1,
                "text": "\"Not … supposed to use WhatsApp … official business\" — enterprise policy divergence; T2 convergence 3/4 not 4/4",
            },
            {"level": 1, "text": "Hiring score / HiredScore evaluation for high volume, low openings — T4 governed AI"},
            {"level": 1, "text": "Arabic / RTL: Docs shows squares for Arabic offers — E2E rec 6 RTL artefacts"},
            {"level": 1, "text": "PowerBI for leadership; franchise markets use Excel-level reporting — T6 reporting 3/4"},
            {"level": 1, "text": "Comms: email, SMS, Teams official channels — product must support governed channel choice"},
            {"level": 1, "text": "In-system document collection versus email attachments — E2E rec 9 compliance angle"},
        ],
        alt=True,
        notes="• P3 synthesis v54.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub | P&T Idea Results Dashboard (106)",
        [
            {"level": 1, "text": "Source: Qualtrics Copper / P&T Idea Results export; Talent Acquisition slice N ≈ 9,922 idea records (March 2026 analysis)"},
            {"level": 1, "text": "Not verbatim customer quotes — volume, modelled sentiment, and modelled effort signals for internal prioritisation cross-check"},
            {"level": 1, "text": "Highest volume capabilities: Communications and Notifications (1,452); Job Requisitions (1,397); Candidate Job Application Flow (1,393); Candidates and Prospects (1,212)"},
            {"level": 1, "text": "Strongest negative effort: Candidates and Prospects, Offers, Browse Jobs, Career Sites, Interviews, Communications — aligns customer pain"},
        ]
        + [
            _product_impl_para(
                "Use 106 to prioritise roadmap themes already validated by 105 — never replace customer ground truth with internal counts alone."
            )
        ],
        notes="• 2026-03-22-brainstorm-analysis.md.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-22-brainstorm-analysis.md",
        body_height=3.05,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Customer Ideation Hub - Top Capability Areas by Idea Volume"}},
        "charts": [
            {
                "chart_type": "column",
                "categories": [
                    "Comms /\nNotifications",
                    "Job\nRequisitions",
                    "Cand. Job\nApplication",
                    "Candidates /\nProspects",
                    "Offers /\nAgreements",
                    "Compliance /\nPrivacy",
                ],
                "series": [{"name": "Idea count (106)", "values": [1452, 1397, 1393, 1212, 922, 839]}],
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
                "text": "Counts from 106 dashboard export — methodology owned by analytics owner; validate before external quoting.",
                "left_inches": 0.7,
                "top_inches": 4.95,
                "width_inches": 8.6,
                "height_inches": 0.55,
                "font_name": "Archivo",
                "font_size_pt": 9,
                "color": "laptop",
            }
        ],
        "speaker_notes": "• Volumes from brainstorm analysis executive summary.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-22-brainstorm-analysis.md",
    }
)

slides.append(
    title_only(
        "Customer Ideation Hub - Key Themes from Internal Signals",
        [
            {"level": 1, "text": "H1 Comms volume leader — maps to omnichannel and notification backlog pressure"},
            {"level": 1, "text": "H2 Req + application core loop — maps to apply funnel and requisition friction"},
            {"level": 1, "text": "H3 Candidate record effort hotspot — maps to grid, profile, search (T3)"},
            {"level": 1, "text": "H4 Offer, career, interview triangle — maps to scheduling and candidate experience (T5)"},
            {"level": 1, "text": "H5 Compliance and privacy load — maps to nationalisation and PDPL-class work (T1)"},
            {"level": 1, "text": "H6 Gen AI on reqs — low n, milder negativity; cautious optimism versus legal guardrails (T4)"},
        ],
        notes="• Hypothesis IDs from 106 report.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-22-brainstorm-analysis.md",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - AI Ideas Spotlight",
        [
            {"level": 1, "text": "106: Gen AI on Job Requisitions — volume 24; sentiment -0.128; effort index +0.67 (polarised low-n signal)"},
            {"level": 1, "text": "Customer: P2 database match ask; P3 hiring score interest — buyer pull matches internal AI curiosity"},
            {"level": 1, "text": "107: Phenom / Eightfold style benchmarks appear in comparison notes — competitive table stakes"},
            {"level": 1, "text": "Legal: EU AI Act high-risk recruitment; GDPR Article 22; human-in-the-loop non-negotiable for ranking affecting candidates"},
        ]
        + [
            _product_impl_para(
                "Activate HiredScore and roadmap AI only with recruiter-in-the-loop UX, transparency, DPIA discipline, and 060-reviewed copy on automated assistance."
            )
        ],
        alt=True,
        notes="• Cross-walk 106 H6 to v54 Theme 4.\n\nReferences:\n• 060-legal-advisor.mdc; 2026-03-22-GCC-PMF-Analysis-v54.md",
        body_height=3.05,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Thematic validation | Six triangulated themes, convergence scores, and 4-way cross-source validation matrix (105, 106, 107, 101)",
    )
)

slides.append(
    title_only(
        "Validated Themes 1-3 - Nationalisation, omnichannel, candidate review",
        [
            {"level": 1, "text": "T1 Nationalisation and GCC compliance — 4/4 convergence; critical PMF; spreadsheet sidecar risk if reporting weak"},
            {"level": 1, "text": "T2 Omnichannel communications — 3/4 (Shell policy split); need channel breadth plus enterprise controls"},
            {"level": 1, "text": "T3 Candidate review and mobile experience — 4/4; grid redesign and mobile apply globally scalable"},
        ],
        notes="• v54 theme write-ups.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    )
)

slides.append(
    title_only(
        "Validated Themes 4-6 - AI, scheduling, reporting",
        [
            {"level": 1, "text": "T4 AI matching and pre-screening — 4/4 with legal overlay; HiredScore on-strategy if governed"},
            {"level": 1, "text": "T5 Scheduling and interview logistics — 4/4; Paradox-first and GCC rule pack after 060"},
            {"level": 1, "text": "T6 Reporting and dashboards — 3/4; PowerBI exits; honest gap pattern in 107 wins too"},
        ]
        + [
            _product_impl_para(
                "Themes 4–6 connect recruiter speed, compliance guardrails, and leadership reporting — sequence roadmap with legal review on scheduling and AI surfaces."
            )
        ],
        alt=True,
        notes="• Themes 4–6 v54.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
        body_height=3.0,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix (4-way)"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "Cust", "106", "107", "101", "Conv.", "PMF"],
                    ["T1 Compliance", "✓", "✓", "Rare", "Wrk", "4/4", "Critical"],
                    ["T2 Omnichannel", "✓", "✓", "Indir.", "Part.", "3/4", "High"],
                    ["T3 Grid/mobile", "✓", "✓", "✓", "✓", "4/4", "High"],
                    ["T4 AI match", "✓", "Low n", "Bench.", "Vel.", "4/4", "High"],
                    ["T5 Scheduling", "✓", "✓", "✓", "Par.", "4/4", "High"],
                    ["T6 Reporting", "✓", "Vol.", "Sparse", "Ent.", "3/4", "Med–Hi"],
                ],
                "left_inches": 0.45,
                "top_inches": 1.15,
                "width_inches": 9.1,
                "height_inches": 3.35,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Abbreviated headers for fit: Cust=Customer; Conv=Convergence; Part=Partner paths; Par=Paradox; Vel=AI velocity; Wrk=Workaround.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Diagnostic | Full-funnel gaps from v54 cross-theme insights — suite wins, parity honesty, franchise reporting",
    )
)

slides.append(
    title_only(
        "GCC Recruiting Gap Analysis - Full Funnel",
        [
            {"level": 1, "text": "Attract and apply: career site multi-hop (P2); mobile share high — consolidate front door with Paradox or native branding where appropriate"},
            {"level": 1, "text": "Screen and review: tab sprawl and weak boolean; AI match demand — unified review surface and governed matching"},
            {"level": 1, "text": "Interview and schedule: Outlook leakage; Kuwait notice and KSA panel rules — configurable guardrails after legal review"},
            {"level": 1, "text": "Offer and documents: RTL defects; email attachment risk — in-system collection and artefact fidelity"},
            {"level": 1, "text": "Compliance and report: nationalisation tracking; PowerBI exits — trustworthy in-product exports and role-based dashboards"},
        ]
        + [
            _product_impl_para(
                "Platform ROI wins in 107 when suite lands; losses when incumbent matches a specific workflow — pair parity roadmaps with honest gap registration and CSM follow-through."
            )
        ],
        alt=True,
        notes="• Cross-theme insights v54.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md",
        body_height=3.25,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Roadmap recommendations | Ten Priority 1–2 actions from v54, five-part slides, then E2E handoff table for PM selection",
    )
)

REC = [
    (
        "Recommendation 1: Nationalisation and GCC compliance suite (P1)",
        False,
        "Problem: Customers experience quotas and penalties as financial risk; 101 classifies much nationalisation as workaround-led today.\n"
        "Evidence: P1 quota tracking quotes; P2 fields and reporting; 106 compliance load; 4/4 triangulation on T1.\n"
        "Recommendation: First-class tracking, role-based reporting, auditable exports; enablement clarifies Native vs workaround for Qiwa, Mudad, MOHRE-style reporting.\n"
        "Why now: Nitaqat 2026–2028 and Emiratisation enforcement narratives in desk research — verify per deal.\n"
        "Success metrics: adoption of standard packs; audit findings down; win rate vs regional bundles when evidence is crisp.",
    ),
    (
        "Recommendation 2: Omnichannel candidate communications (P1)",
        True,
        "Problem: GCC expects WhatsApp and SMS speed; email-only campaigns feel limiting; tenant policies may block consumer messaging.\n"
        "Evidence: P1 and P2 WhatsApp essential/helpful; P3 official-channel-only; 101 partner and geography caveats; 106 comms volume leader.\n"
        "Recommendation: Package Paradox and approved partners with tenant governance, templates, consent logging; parity on SMS geography.\n"
        "Why now: Statista-style messaging penetration; competitor Zoho paths visible in 101.\n"
        "Success metrics: opt-in rates; time-to-reply; reduction of shadow channels where policy allows.",
    ),
    (
        "Recommendation 3: Candidate review experience (P1)",
        False,
        "Problem: High-density review across tabs costs time at 100–200 candidate scale; prioritisation unclear at hundreds of CVs.\n"
        "Evidence: P2 tab navigation; P3 who to focus on; 106 candidate-record effort hotspot; T3 at 4/4.\n"
        "Recommendation: Unified grid and profile, stronger boolean and semantic search, mobile-optimised apply.\n"
        "Why now: Middle East mobile apply share cited by P2; global scalability of grid wins.\n"
        "Success metrics: clicks-to-shortlist; recruiter satisfaction; mobile completion rate.",
    ),
    (
        "Recommendation 4: Governed AI matching and pre-screening (P1)",
        True,
        "Problem: Buyers want database match beyond applicants; competitors market AI velocity.\n"
        "Evidence: P2 two-million-candidate ask; P3 hiring score; 107 Phenom/Eightfold benchmarks; T4 at 4/4 with legal overlay.\n"
        "Recommendation: HiredScore activation with recruiter-in-the-loop UX, explainability, candidate transparency, DPIA and bias review.\n"
        "Why now: EU AI Act high-risk recruitment; GDPR Article 22 expectations for global employers.\n"
        "Success metrics: match acceptance; legal sign-off on flows; incident and escalation rates.",
    ),
    (
        "Recommendation 5: Interview scheduling (P2)",
        False,
        "Problem: Native scheduling feels heavier than Outlook; regulatory hints needed for Kuwait and KSA.\n"
        "Evidence: P2 Outlook comparison; P1 red notification for regulatory requirements; T5 at 4/4; 107 scheduling comparisons.\n"
        "Recommendation: Simplify core flow; integrate Paradox value; configurable GCC guardrails after 060 review.\n"
        "Why now: Scheduling cited across customer and win-loss narratives.\n"
        "Success metrics: in-product scheduled events; support tickets down; legal-approved warning copy.",
    ),
    (
        "Recommendation 6: RTL and Arabic document generation (P2)",
        True,
        "Problem: Arabic characters render as squares in generated offer artefacts — deal blocker for Arabic markets.\n"
        "Evidence: P3 Workday Docs experience; 101 RTL generated documents as gap.\n"
        "Recommendation: Address RTL and Arabic fidelity in generated offers and contracts; align with document platform owners.\n"
        "Why now: Social and legal expectations for Arabic artefacts in GCC hiring.\n"
        "Success metrics: defect reports down; customer acceptance tests on sample templates.",
    ),
    (
        "Recommendation 7: Career site and apply path (P2)",
        False,
        "Problem: Multi-hop journeys from job board to external career front door to Workday reduce conversion.\n"
        "Evidence: P2 branding and clunky apply themes; 107 career site comparisons.\n"
        "Recommendation: Reduce hops via branding and integration strategy including Paradox where appropriate.\n"
        "Why now: Mobile share and competitor front-door benchmarks.\n"
        "Success metrics: apply completion rate; time-to-apply; career site bounce.",
    ),
    (
        "Recommendation 8: Req-level permissions for candidate moves (P2)",
        True,
        "Problem: Assignee-tag friction when moving candidates across requisitions slows leads.\n"
        "Evidence: P1 explicit friction; codebook Move-Candidate-Assignee-Friction.\n"
        "Recommendation: Redesign permissions so recruitment leads can move candidates without workaround overhead.\n"
        "Why now: High-volume enterprise programmes hit this weekly.\n"
        "Success metrics: admin time per move; recruiter complaints; permission support tickets.",
    ),
    (
        "Recommendation 9: In-system document collection for offers (P2)",
        False,
        "Problem: Email attachments for candidate documents weaken audit trails and consent evidence.\n"
        "Evidence: P1 and P3 compliance angles on offline documentation.\n"
        "Recommendation: Structured candidate upload workflows for offer-related documents with retention and access controls.\n"
        "Why now: PDPL-class expectations for evidence and minimisation.\n"
        "Success metrics: % documents in-system; audit pass rate; fewer email escalations.",
    ),
    (
        "Recommendation 10: Sales and CS enablement (P2)",
        True,
        "Problem: Buyers hear competitor portal and omnichannel claims that outpace current messaging clarity.\n"
        "Evidence: 101 scan; P1 scepticism on portals; 107 perception versus fact gaps.\n"
        "Recommendation: Broadbean board coverage playbook; Deployment Agent-backed bid guidance on SMS, WhatsApp, portals, nationalisation workarounds.\n"
        "Why now: Large do-nothing cohort needs ROI story alongside parity proof.\n"
        "Success metrics: win rate in contested GCC deals; shorter clarification cycles in RFPs.",
    ),
]
for i, (title, alt, body) in enumerate(REC):
    slides.append(
        recommendation_slide(
            title,
            alt,
            body,
            f"• E2E handoff row {i + 1} from v54.\n\nReferences:\n• {REPORT}",
        )
    )

e2e_rows = [
    ["#", "Title", "Action (short)"],
    ["1", "Nationalisation suite", "Tracking, reporting, exports; 101-aligned enablement for Qiwa, Mudad, MOHRE"],
    ["2", "Omnichannel comms", "Partner packaging, governance, consent; non-WhatsApp enterprise paths"],
    ["3", "Candidate review", "Unified grid/profile, search, mobile apply"],
    ["4", "Governed AI", "HiredScore, human-in-the-loop, transparency, DPIA"],
    ["5", "Interview scheduling", "Simplify, Paradox, GCC guardrails post-060"],
    ["6", "RTL / Arabic docs", "Fidelity in generated offers and contracts"],
    ["7", "Career site / apply", "Reduce multi-hop; branding and integrations"],
    ["8", "Req permissions", "Move candidates without assignee-tag friction"],
    ["9", "Offer document collection", "Structured uploads vs email"],
    ["10", "Sales / CS enablement", "Broadbean playbook; bid guidance from 101 + DA"],
]

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "E2E Handoff: Research Recommendations (PM Selection)"}},
        "tables": [
            {
                "rows": e2e_rows,
                "left_inches": 0.45,
                "top_inches": 1.15,
                "width_inches": 9.1,
                "height_inches": 3.5,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.28,
            }
        ],
        "speaker_notes": "• HITL: PM selects one row for PRD → 315 → 320 → 330 → 400 pipeline.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v54.md § E2E Handoff",
    }
)

slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
