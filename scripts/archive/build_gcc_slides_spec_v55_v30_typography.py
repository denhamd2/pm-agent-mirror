#!/usr/bin/env python3
"""Build slides_spec_v55.json from 2026-03-22-GCC-PMF-Analysis-v55.md (v30 inventory + typography)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "slides_spec_v55.json"

BODY = {"left_inches": 0.7, "top_inches": 1.2, "width_inches": 8.6, "height_inches": 2.8}
REPORT = "research/GCC/thematic-analysis/2026-03-22-GCC-PMF-Analysis-v55.md"


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
            "0": {"text": "GCC Recruiting Product-Market Fit Analysis"},
            "1": {"text": "Insights & Roadmap - March 2026"},
        },
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "GCC Recruiting PMF roadmap | Authorship, 101/105 sources, executive summary, and how to read this deck",
    )
)

slides.append(
    title_only(
        "Research Author",
        [
            {"level": 1, "text": "Analysis: 120-pmf-thematic-analysis (GCC-E2E-015 Step 2b) + 130 slide generator"},
            {"level": 1, "text": f"Report: {REPORT}"},
            {"level": 1, "text": "Triangulation: customer-only — 105 findings v55 + three enterprise transcripts; 101 Step 1 CI scan + gcc-competitive-matrix.md v1.5"},
            {"level": 1, "text": "106 brainstorm and 107 win-loss: not executed this mission — ideation and formal win-loss blocks show DATA GAP with proxies"},
            {"level": 1, "text": "Legal: 060 lens on PESTEL Legal and Priority 1–9 recommendations before production commitments"},
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
                        "text": "End-to-end friction: req permission churn, stage-gated notes, offer latency, scheduling vs Outlook — P1–P3 converged",
                    },
                    {
                        "level": 1,
                        "text": "Recruiter efficiency: multi-tab review, boolean limits, database-wide match — aligns 101 True Gap on core semantic / AI match without optional SKUs",
                    },
                    {
                        "level": 1,
                        "text": "Compliance: nationalisation quotas, custom nationality fields, franchise Excel reporting — 101 True Gaps on Qiwa, Mudad, MOHRE native connectors",
                    },
                    {
                        "level": 0, "text": [{"text": "Channel divergence", "bold": True, "font_size_pt": 12}]},
                    {
                        "level": 1,
                        "text": "P1/P2: WhatsApp essential; P3: corporate restriction — tenant policy model required; Oracle packaged WhatsApp vs Workday workaround per 101",
                    },
                    {
                        "level": 0, "text": [{"text": "Roadmap headline", "bold": True, "font_size_pt": 12}]},
                    {
                        "level": 1,
                        "text": "Nine E2E recommendations: scheduling, nationalisation packs, unified review + AI stance, omnichannel policy, RTL docs, structured uploads, dashboards, mobile apply, phased portals",
                    },
                ],
                height=3.2,
            )
        ],
        "speaker_notes": "• v55 executive bullets from 120 report.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Research challenge | Research questions, objectives, and Braun & Clarke methodology for GCC Recruiting PMF (customer + 101 triangulation)",
    )
)

slides.append(
    title_only(
        "Research Question & Objectives",
        [
            {"level": 1, "text": "How can Workday Recruiting strengthen PMF in GCC enterprise hiring given nationalisation, omnichannel, and AI parity pressure?"},
            {"level": 1, "text": "Map customer jobs and compliance risk versus product reality (Native / Workaround / True Gap per 101 matrix)"},
            {"level": 1, "text": "Triangulate 105-regenerated findings with fresh 120 transcript re-read and 101 competitive scan (no 106/107 this run)"},
            {"level": 1, "text": "Produce prioritised roadmap actions with RICE illustrations and E2E handoff for PM selection"},
        ],
        notes="• Method: Braun & Clarke (2006) six phases in v55 report.\n\nReferences:\n• https://www.tandfonline.com/doi/abs/10.1191/1478088706qp063oa",
    )
)

slides.append(
    title_only(
        "Research Approach - 5-Phase Framework",
        [
            {"level": 1, "text": "Phase 0: Corpus already GCC-centric (Phase 0 not required per report)"},
            {"level": 1, "text": "Phase 1: Familiarisation — re-read all customer .txt transcripts listed in 105 attestation (not 105 markdown alone)"},
            {"level": 1, "text": "Phase 2: Coding — semantic codes tagged [Customer]; frequency from three interviews"},
            {"level": 1, "text": "Phase 3–5: Theme clustering, review, definition — customer-only evidence"},
            {"level": 1, "text": "Phase 6: Integrated PESTEL (web-sourced) and Competitive Landscape strictly from 101 Step 1 artefacts"},
            {"level": 1, "text": "060 validation on Legal PESTEL and roadmap recommendations before final report"},
        ],
        alt=True,
        notes="• Aligns to v55 methodology section.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
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
            {"level": 1, "text": "Nationalisation quotas and penalties tie ATS evidence to licence-to-operate (Nitaqat, Emiratisation, Kuwaitisation, Omanisation narratives)"},
            {"level": 1, "text": "Regional bundles (Bayzat, Zoho) and global suites (SAP, Oracle) stress statutory adjacency and AI-led hiring stories"},
            {"level": 1, "text": "Enterprise buyers value Workday depth and global template — parity gaps on RTL docs, core AI match, and portals must be honest in bid"},
            {"level": 1, "text": "Customer set (n=3) is qual-rich; scale claims require 101 desk research and future quant"},
        ],
        notes="• Strategic frame from v55 executive summary.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    )
)

slides.append(
    title_only(
        "GCC Market Momentum - Key Indicators",
        [
            {
                "level": 1,
                "text": "Astute Analytica (press wire): GCC HR tech base ~USD 2.5B+ toward ~USD 5.5B by 2032 at ~9% CAGR — validate methodology for finance use",
            },
            {"level": 1, "text": "OpenPR-style wires cite ~10% CAGR variants — treat as directional band"},
            {"level": 1, "text": "Enforcement: UAE press on Emiratisation fines; KSA Qiwa-linked contract counting from April 2026 in trade press (verify before commitments)"},
        ]
        + [
            _product_impl_para(
                "Economic growth in HR tech spend rewards platform consolidation; customers scrutinise TCO of add-ons versus native workflow, matching P2 desire to reduce tool sprawl."
            )
        ],
        alt=True,
        notes="• Astute Analytica; OpenPR summaries.\n\nReferences:\n• https://www.einpresswire.com/article/766700155/the-gcc-hr-tech-market-to-reach-usd-5-483-5-million-by-2032-growing-at-a-cagr-of-9-05-astute-analytica",
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
        "PESTEL - Political",
        False,
        [
            (1, "Saudization (Nitaqat) remains structural; 2026–2028 phase commentary in legal / HR press — validate dates in live sources before contract commitments"),
            (2, "Mondaq advisory summaries describe programme mechanics — pair with Arabic primary MHRSD notices for deals"),
            (1, "Qiwa-linked contract counting for Nitaqat reported as tightening from April 2026 (Zawya, Saudi Gazette, legal summaries)"),
            (1, "UAE Emiratisation: MOHRE urges private sector to meet 2025 targets; Gulf News cites AED 108,000 fine per unfilled job narrative"),
            (1, "P1 cites binding quota bands (20%, 60%, 50%) across nationalisation programmes — board-level liability"),
            (2, "Kuwait and KSA interview notice and panel rules in transcripts — scheduling product boundary"),
            (1, "101 classifies native Qiwa / Mudad / MOHRE as True Gaps — political risk if audit trails live in spreadsheets"),
        ],
        "Political pressure increases audit-grade workforce and hiring data in Qiwa- and MOHRE-aligned formats; recruiting must support evidence trails and configurable compliance nudges without pretending native portal sync exists where 101 marks True Gap.",
        "• Mondaq; Zawya; Gulf News; MOHRE.\n\nReferences:\n• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know\n• https://www.zawya.com/en/economy/gcc/saudi-arabia-updates-nitaqat-saudization-calculation-through-qiwa-contracts-ghwi8n8q",
    ),
    (
        "PESTEL - Economic",
        True,
        [
            (1, "GCC HR tech market forecasts cite USD 2.5B+ base toward ~USD 5.5B by 2032 at ~9.05% CAGR (Astute Analytica via EIN Presswire)"),
            (2, "Treat headline valuation as directional until primary vendor methodology is reviewed for finance-grade use"),
            (1, "OpenPR and similar wires cite ~10% CAGR variants — use as sensitivity band not single truth"),
            (1, "Enterprise ATS purchases sit inside HCM consolidation; compliance-led renewals favour platforms that prove ROI"),
            (1, "Regional competitors bundle payroll and portal adjacency — TCO stories pressure point ATS narratives"),
            (1, "P2 mobile-heavy apply and tool-sprawl themes — economic pressure to consolidate vendor surface area"),
            (1, "101 True Gaps on optional SKUs (AI match) raise buyer scrutiny of licence boundaries"),
        ],
        "Economic growth in HR tech spend rewards platform consolidation; customers will scrutinise TCO of add-ons versus native workflow, matching P2 desire to reduce tool sprawl and clarify HiredScore packaging.",
        "• Astute Analytica; OpenPR.\n\nReferences:\n• https://www.einpresswire.com/article/766700155/the-gcc-hr-tech-market-to-reach-usd-5-483-5-million-by-2032-growing-at-a-cagr-of-9-05-astute-analytica",
    ),
    (
        "PESTEL - Social",
        False,
        [
            (1, "Smartphone penetration very high; industry summaries cite UAE above 97% (2024) and GCC ~91% smartphone share of connections (Statista topic pages)"),
            (2, "Use penetration for GTM priority, not as substitute for tenant security policy"),
            (1, "WhatsApp culturally dominant for fast candidate response — P1 and P2 explicit; P3 enterprise policy may forbid official WhatsApp use"),
            (1, "Bilingual hiring (English + Arabic) matters for operational / blue-collar cohorts per P2"),
            (1, "P2 cites 40%+ handheld traffic for apply in Middle East context — conversion risk if mobile flows weak"),
            (1, "P3 historical Arabic character rendering failures in Workday Docs for offers — social expectation of credible local artefacts"),
            (1, "Campaign norms reward fast response; channel strategy must respect fraud and audit concerns (P3)"),
        ],
        "Mobile-first apply and local language are social expectations; channel strategy must be tenant-governed with policy profiles, audit, and approved templates that respect both speed and enterprise discipline.",
        "• Statista MENA smartphone topics; transcripts.\n\nReferences:\n• https://www.statista.com/topics/5338/smartphone-market-in-mena/",
    ),
    (
        "PESTEL - Technological",
        True,
        [
            (1, "AI in recruitment widely marketed; Gulf Business 2025 and BCG GCC AI-at-work publications cite TA leader interest"),
            (1, "Ceipal / People Matters 2025 release: 58% of GCC firms take more than 45 days to fill critical roles — time-to-fill pressure narrative"),
            (1, "101 notes SAP SmartRecruiters closure Sep 2025 and Mar 2026 Joule / Winston AI narrative — raises RFP expectations"),
            (1, "Oracle Recruiting Cloud: WhatsApp channel 25D and Infobip partnership per 101 scan — omnichannel parity bar"),
            (1, "Government portals Qiwa, Mudad, MOHRE: 101 classifies Workday native as True Gap — integration burden on customers today"),
            (1, "Paradox and HiredScore assumed integrated per workspace style guide — roadmap must disclose licence and human-in-the-loop UX"),
            (2, "Broadbean partnership model for job boards — expand via partner, not undifferentiated native board builds"),
            (1, "P2: scheduling UX felt heavier than Outlook — technology expectations set by calendar clients"),
        ],
        "AI-assisted matching is competitively expected, but 101 classifies core semantic match as True Gap without optional SKUs; roadmap must clarify licence boundaries and human-in-the-loop design per 060 and EU AI Act framing.",
        "• Gulf Business; BCG; PR Newswire; 101 scan.\n\nReferences:\n• https://gulfbusiness.com/en/2025/jobs/ai-hiring-what-recruiters-would-want-you-to-know/\n• https://www.prnewswire.com/news-releases/58-of-gccs-take-more-than-45-days-to-fill-critical-roles-new-ceipal-and-people-matters-report-finds-302711508",
    ),
    (
        "PESTEL - Environmental",
        False,
        [
            (1, "DATA GAP (recruiting-specific): no material environmental driver uniquely shaping ATS PMF in this pass beyond general national ESG reporting"),
            (1, "UAE Net Zero 2050 and KSA 2060 narratives exist at country level — not surfaced in customer transcripts as recruiting constraints"),
            (2, "Monitor green employer branding on career sites as secondary signal only"),
            (1, "Supplier ESG questionnaires may grow for global employers — low near-term impact on core ATS workflows"),
            (1, "Defer feature investment unless customer-backed ESG hiring fields emerge in pipeline"),
            (1, "Environmental bullet retained for PESTEL completeness per v30 inventory"),
        ],
        "No standalone environmental roadmap item for Recruiting from this research; monitor green employer branding on career sites as a secondary signal without inventing green ATS mandates.",
        "• v55 PESTEL Environmental.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    ),
    (
        "PESTEL - Legal",
        True,
        [
            (1, "KSA PDPL and Implementing Regulations (SDAIA): registration, lawful basis, data subject rights, breach notification, cross-border transfers, DPO triggers in scoped cases"),
            (2, "NatLawReview and practitioner summaries — engage legal for tenant-specific processing bases"),
            (1, "UAE Federal Decree-Law 45 of 2021: consent-centric model; sensitive definitions broad; cross-border mechanisms; free-zone carve-outs need per-tenant confirmation"),
            (1, "EU AI Act: recruitment / selection AI is high-risk Annex III — risk management, data governance, human oversight, transparency, record-keeping"),
            (1, "GDPR Article 22 and Article 35 DPIA: automated profiling and high-risk processing for EU touchpoints"),
            (1, "AI-assisted matching: design human review before adverse action; candidate disclosure where AI influences decisions"),
            (1, "WhatsApp / messaging: consent granularity; retention of threads for audit; phishing mitigations align with P3 fraud concerns"),
            (1, "P1 KSA interview rules: product warnings and consent capture must be configurable and legally reviewed — do not hard-code statutory text"),
        ],
        "Compliance-first data model and AI governance are non-negotiable differentiators versus point ATS; Legal must sign off UX copy for consent, AI disclosure, and compliance prompts in the 319 / 060 chain.",
        "• NatLawReview; EU AI Act explorer; GDPR.\n\nReferences:\n• https://artificialintelligenceact.eu/ai-act-explorer/\n• https://gdpr-info.eu/",
    ),
]
for name, alt, items, impl, sn in PESTEL:
    slides.append(pestel_slide_levels(name, alt, items, impl, sn))

slides.append(
    sec(
        "Workday Confidential",
        "Competitive landscape | Regional specialists, global platforms, and SWOT grounded in 101 Step 1 scan and gcc-competitive-matrix.md v1.5",
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Regional Specialists",
        [
            {"level": 1, "text": "Bayzat: bundled HR + payroll; Mudad payroll flow documented in competitor narrative; AI ATS marketing"},
            {"level": 1, "text": "HiBob: Bob Hiring; Mosaic FP&A M&A context; Arabic not evidenced in this 101 pass — validate per deal"},
            {"level": 1, "text": "Zoho Recruit: fast 2026 cadence (telephony, screening bot, job alerts); Zoho Payroll Saudization KB; WhatsApp integration paths in ecosystem"},
            {"level": 1, "text": "Implication: statutory adjacency stories sharpen versus Workday — win on enterprise depth when 101 Native / Gap facts are crisp"},
        ]
        + [
            _product_impl_para(
                "Workday wins contested GCC deals when bid teams map 101 Native, Workaround, and True Gap honestly against regional suite TCO and portal claims."
            )
        ],
        notes="• 101 scan GCC-E2E-015.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-22-GCC-E2E-015.md",
        body_height=3.05,
    )
)

slides.append(
    title_only(
        "Competitive Landscape - Global Platforms",
        [
            {"level": 1, "text": "SAP SuccessFactors: SmartRecruiters closed Sep 2025; Mar 2026 AI + SF narrative (Joule / Winston) per 101"},
            {"level": 1, "text": "Oracle Recruiting Cloud: WhatsApp channel 25D; Infobip partnership; Redwood candidate UX"},
            {"level": 1, "text": "Workday vs deal themes (101): req grid Native; interview scheduling Native with UX friction vs Outlook; WhatsApp Workaround; nationalisation Workaround; Arabic UI Native; RTL generated documents True Gap"},
            {"level": 1, "text": "Five validated True Gaps: RTL-rich generated docs; core semantic / AI match without optional products; native Qiwa; native Mudad; native MOHRE"},
        ]
        + [
            _product_impl_para(
                "Close perception gaps with Deployment Agent-backed bid sheets and 101 classification — not undifferentiated suite messaging."
            )
        ],
        alt=True,
        notes="• gcc-competitive-matrix.md changelog 2026-03-22 GCC-E2E-015.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
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
                        "Enterprise req candidate grid, calendar-sync scheduling, Arabic recruiter UI RTL, mobile-responsive apply, dashboards and reports (101)",
                        "RTL complex generated documents True Gap; core AI / semantic match True Gap without optional SKUs; native Qiwa, Mudad, MOHRE True Gaps",
                    ],
                    [
                        "HiredScore and Paradox assumed integrated when licensed — depth narrative available",
                        "WhatsApp Workaround versus Oracle packaged channel story; nationalisation reporting Workaround versus suite-native claims",
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
                        "Productised GCC compliance packs; policy-governed omnichannel; scheduling excellence with KSA guardrails — map to nine recommendations",
                        "Regional bundles win on statutory adjacency TCO when portal and RTL gaps are unexplained",
                    ],
                    [
                        "Honest packaging of HiredScore / Paradox with human-in-the-loop and 060-reviewed copy",
                        "SAP / Oracle AI and omnichannel velocity raise RFP table stakes faster than long-cycle connector delivery",
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
        "speaker_notes": "• SWOT from v55 competitive section + 101.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Win / Loss | Formal 107 extract not run this mission — dataset gap, proxy themes from interviews + 101, illustrative severity chart, GCC proxy table",
    )
)

slides.append(
    title_only(
        "Win / Loss Analysis - Dataset Overview (DATA GAP)",
        [
            {"level": 1, "text": "Formal win-loss analysis (107) was not executed for GCC-E2E-015 — no Opportunity Detail.xlsx ingest this pipeline run"},
            {"level": 1, "text": "Triangulation is customer interviews (n=3) plus 101 competitive scan — do not quote global win rates from this deck"},
            {"level": 1, "text": "Next wave: run 107 when win-loss folder contains .txt / .csv / .xlsx sources per orchestrator Step 2.75"},
            {"level": 1, "text": "Proxy buying criteria inferred: feature parity on AI and omnichannel; integration truthfulness on portals; RTL and offer experience"},
        ]
        + [
            _product_impl_para(
                "Until 107 runs, use interview and 101 evidence for loss-risk themes; refresh this block after win-loss extract with Fresh pass attestation."
            )
        ],
        alt=True,
        notes="• 130 requires four Win/Loss content classes — DATA GAP slide preserves v30 parity.\n\nReferences:\n• .cursor/rules/000-master-orchestrator.mdc",
        body_height=3.05,
    )
)

slides.append(
    title_only(
        "Win / Loss - Proxy Gap Themes (Interviews + 101)",
        [
            {
                "level": 1,
                "text": "Scheduling and calendar parity: P2 felt in-product scheduling more complicated than Outlook — buying risk if competitor positions lighter UX",
            },
            {
                "level": 1,
                "text": "AI matching and database-wide prioritisation: P2/P3 ask versus 101 True Gap on core semantic match without optional products",
            },
            {
                "level": 1,
                "text": "RTL generated offers: P3 Arabic squares in Docs — hard parity gap versus employer brand promise",
            },
            {
                "level": 1,
                "text": "Omnichannel: Oracle packaged WhatsApp vs Workday workaround — RFP scorecard risk when not explained with governance story",
            },
            {
                "level": 1,
                "text": "Nationalisation evidence: spreadsheet and custom-field workarounds — loss risk to regional suites with louder statutory adjacency",
            },
        ]
        + [
            _product_impl_para(
                "Separate interview-validated pain from competitive marketing claims using 101 Native / Workaround / True Gap before roadmap commits."
            )
        ],
        notes="• Proxy themes from v55 executive summary and competitive table.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
        body_height=3.05,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win / Loss - Proxy Severity by Theme (Interview Evidence)"}},
        "charts": [
            {
                "chart_type": "column",
                "categories": [
                    "T1\nWorkflow",
                    "T2\nEfficiency",
                    "T3\nCompliance",
                    "T4\nCand. exp.",
                    "T5\nChannel",
                ],
                "series": [{"name": "Evidence strength (1–3)", "values": [3, 3, 3, 2, 3]}],
                "left_inches": 1.0,
                "top_inches": 1.65,
                "width_inches": 8.0,
                "height_inches": 3.2,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "speaker_notes": "• Illustrative proxy chart from v55 theme evidence strength (High=3, Medium–high=2). Not win-loss population data.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md § Primary Themes",
    }
)

slides.append(
    title_only(
        "Win / Loss - GCC-Relevant Proxy Factors (101 + Qual)",
        [
            {"level": 1, "text": "Portal truthfulness: Qiwa, Mudad, MOHRE native class — severity high where customers must prove compliance digitally"},
            {"level": 1, "text": "AI narrative: SAP / Oracle copilot stories — severity high for RFP technical scoring"},
            {"level": 1, "text": "Omnichannel packaging: WhatsApp native vs partner — severity medium–high depending on buyer channel policy"},
            {"level": 1, "text": "RTL documents: offer and contract fidelity — severity high for Arabic-heavy employers"},
        ]
        + [
            _product_impl_para(
                "Use this proxy table to brief sales and PM until 107 refresh; replace rows with quantitative severity when win-loss extract is available."
            )
        ],
        notes="• Qualitative proxy — not 107 severity index.\n\nReferences:\n• gcc-competitive-scan-2026-03-22-GCC-E2E-015.md",
        body_height=3.05,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Primary research | 105 synthesis, transcript roster, per-customer quotes and themes — no 106 ideation CSV this mission",
    )
)

slides.append(
    title_only(
        "Customer Interviews | 3 GCC-market enterprise participants (anonymised P1–P3)",
        [
            {"level": 1, "text": "Population: n=3 enterprise TA leaders with GCC hiring context; semi-structured interviews; Braun & Clarke thematic analysis"},
            {"level": 1, "text": "Transcripts: Interview_P1_Ammad_Alsairafi_Accenture.txt; Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt; Interview_P3_Arika_Yamahata_Shell.txt"},
            {"level": 1, "text": "105 findings regenerated GCC-E2E-015 Step 2a (v55 attestation); 120 Phase 1 re-read all listed transcripts"},
            {"level": 1, "text": "Triangulation: customer-only — no SME .txt; 106 / 107 columns not applicable per v55 matrix note"},
            {"level": 1, "text": "101 grounds competitive claims; interviews ground jobs-to-be-done and workaround behaviour"},
            {"level": 1, "text": "Limitation: high qual depth, low n — do not infer statistical prevalence without further research"},
        ],
        alt=True,
        notes="• v55 105 inputs and methodology.\n\nReferences:\n• research/GCC/105-user-research-findings.md",
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
                    ["P1", "Recruitment Lead (Cyber Security and Campus Hiring)", "Accenture"],
                    ["P2", "Performance and Innovation Manager, Talent Acquisition", "Baker Hughes"],
                    ["P3", "Product Owner, Talent and Resourcing", "Shell"],
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
        "speaker_notes": "• Anonymisation P1–P3 per 010-style-guide.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md Appendix",
    }
)

slides.append(
    title_only(
        "Customer Interview - Accenture (P1)",
        [
            {
                "level": 1,
                "text": "\"Why doesn't the system allow me that capability … assign the roles and then move the candidates\" — req permission churn; Theme 1 workflow rigidity (P1, Accenture)",
            },
            {
                "level": 1,
                "text": "\"WhatsApp is an absolute necessary … immediate responses\" — regional channel expectation; Theme 5 divergence vs P3 (P1, Accenture)",
            },
            {"level": 2, "text": "KSA interview rules: minimum notice, documented consent if shortened, panel nationality mix — scheduling guardrail hypothesis"},
            {"level": 1, "text": "Nationalisation quotas cited as personal liability bands — Theme 3 compliance and evidence reporting"},
            {"level": 1, "text": "JTBD: when I must prove Nitaqat-style hiring mix, I want auditable in-product evidence so I avoid board-level penalty exposure"},
            {"level": 1, "text": "Structured document upload categories for offers — hooks Recommendation 6 intake narrative"},
            {"level": 1, "text": "Native scheduling desire with notifications to candidate and hiring manager — Recommendation 1 evidence"},
        ],
        alt=True,
        notes="• Quote-led bullets from v55 Theme 1 and 5.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Baker Hughes (P2)",
        [
            {
                "level": 1,
                "text": "\"Integrated … into a single tab … 100 candidates or 200 candidates\" — multi-tab review pain; Theme 2 efficiency (P2, Baker Hughes)",
            },
            {
                "level": 1,
                "text": "\"It felt more complicated than scheduling a meeting via Outlook\" — scheduling UX gap; Theme 1 (P2, Baker Hughes)",
            },
            {"level": 1, "text": "40%+ mobile or handheld apply share cited — Theme 4 candidate experience"},
            {"level": 1, "text": "Arabic important for operational / blue-collar roles — bilingual hiring social factor"},
            {"level": 1, "text": "Nationality custom fields in UAE and Saudi — Theme 3 workaround versus productised pack"},
            {"level": 1, "text": "JTBD: when I scan high-volume pipelines, I want dense single-surface review and stronger boolean so I can shortlist faster"},
            {"level": 1, "text": "Multi-hop apply via external career front door — mobile conversion and hop reduction hooks Recommendation 8"},
        ],
        notes="• P2 synthesis v55.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
    )
)

slides.append(
    title_only(
        "Customer Interview - Shell (P3)",
        [
            {
                "level": 1,
                "text": "\"The struggle … across all of the hundreds of CV … who we should be paying attention to\" — database prioritisation; Theme 2 (P3, Shell)",
            },
            {
                "level": 1,
                "text": "\"We just avoid … WhatsApp … can't use for official business\" — enterprise policy restriction; Theme 5 (P3, Shell)",
            },
            {"level": 1, "text": "Arabic letters in offers rendered as squares in Workday Docs — Theme 4 RTL document gap"},
            {"level": 1, "text": "Franchise / low-volume GCC entities: manual or Excel-based local legal reporting — Theme 3 franchise lens"},
            {"level": 1, "text": "HiredScore interest with human oversight expectations — aligns Recommendation 3 AI stance"},
            {"level": 1, "text": "JTBD: when I govern a global template, I want tenant channel policy and auditability so I meet fraud and compliance discipline"},
            {"level": 1, "text": "PowerBI workaround for leadership dashboards — Recommendation 7 hook"},
        ],
        alt=True,
        notes="• P3 synthesis v55.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub | DATA GAP - No P&T dashboard export (106) this mission",
        [
            {"level": 1, "text": "GCC-E2E-015 did not run 106 — no brainstorm-sessions .txt / .xlsx ingest for ideation quant block"},
            {"level": 1, "text": "v30 inventory still requires four ideation content-class slides — populated as explicit DATA GAP and hypotheses from interviews"},
            {"level": 1, "text": "Highest-signal internal volumes unknown — proxy: comms, reqs, candidate record, offers rank high from P1–P3 qual"},
            {"level": 1, "text": "Next wave: drop Qualtrics / P&T export into research/GCC/brainstorm-sessions/ and re-run 106 before next deck refresh"},
        ]
        + [
            _product_impl_para(
                "Do not substitute invented ideation counts for missing 106 — rerun 106 when source files exist to validate internal volume signals."
            )
        ],
        notes="• 130 ideation block with DATA GAP per baseline spec when no CSV.\n\nReferences:\n• docs/decks/gcc-pmf-roadmap-baseline-slides-spec.md",
        body_height=3.05,
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - Proxy Capability Heatmap (Qual-Only)",
        [
            {"level": 1, "text": "Communications and notifications: HIGH proxy heat — WhatsApp vs policy split across P1–P3"},
            {"level": 1, "text": "Job requisitions and permissions: HIGH — move-candidate and assignee friction (P1)"},
            {"level": 1, "text": "Candidate review and search: HIGH — tabs, boolean, database match (P2, P3)"},
            {"level": 1, "text": "Offers and documents: HIGH — RTL defects; structured intake opportunity (P1, P3)"},
            {"level": 1, "text": "Interview scheduling: MEDIUM–HIGH — Outlook comparison and KSA rules (P1, P2)"},
            {"level": 1, "text": "Compliance reporting: HIGH — nationalisation and franchise Excel exits (P1–P3)"},
        ],
        notes="• Qualitative proxy only — not 106 counts.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - Key Themes from Interview Verbatims (Proxy)",
        [
            {"level": 1, "text": "H1 End-to-end workflow rigidity — permissions, notes, offers, scheduling offline or multi-tool"},
            {"level": 1, "text": "H2 Recruiter efficiency at scale — grid density, boolean, AI / HiredScore stance"},
            {"level": 1, "text": "H3 Compliance and nationalisation — quotas, custom fields, franchise reporting"},
            {"level": 1, "text": "H4 Candidate experience — mobile, Arabic, RTL documents, apply hops"},
            {"level": 1, "text": "H5 Channel strategy tension — WhatsApp essential vs banned for official use"},
            {"level": 1, "text": "Replace this slide with 106 verbatim theme counts after dashboard export is available"},
        ],
        alt=True,
        notes="• Maps to five validated themes in v55.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md § Primary Themes",
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - AI Ideas Spotlight (Interview + 101 Proxy)",
        [
            {"level": 1, "text": "P2/P3: database-wide match and HiredScore interest — buyer pull matches global AI RFP pressure in 101"},
            {"level": 1, "text": "101: SAP Joule / Winston and Oracle AI narratives — competitive velocity on copilot stories"},
            {"level": 1, "text": "Legal: EU AI Act high-risk recruitment; GDPR Article 22; human-in-the-loop non-negotiable for ranking"},
            {"level": 1, "text": "106 Gen-AI-on-req sentiment unavailable this mission — flag as refresh item"},
        ]
        + [
            _product_impl_para(
                "Activate HiredScore and roadmap AI only with recruiter-in-the-loop UX, transparency, DPIA discipline, and 060-reviewed copy on automated assistance."
            )
        ],
        notes="• Proxy spotlight — no 106 n=.\n\nReferences:\n• 060-legal-advisor.mdc; 2026-03-22-GCC-PMF-Analysis-v55.md",
        body_height=3.05,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Thematic validation | Five validated themes, customer-only triangulation matrix, and PMF impact from v55 report",
    )
)

slides.append(
    title_only(
        "Validated Themes 1-3 - Workflow, efficiency, compliance",
        [
            {"level": 1, "text": "Theme 1: End-to-end workflow rigidity — permissions, stage-gated notes, offer latency, scheduling fragmentation — evidence High (P1–P3 subsets)"},
            {"level": 1, "text": "Theme 2: Recruiter efficiency at scale — multi-tab review, boolean limits, database-wide match — evidence High; 101 True Gap on core AI match"},
            {"level": 1, "text": "Theme 3: Compliance, nationalisation, evidence reporting — quotas, penalties, custom fields, franchise Excel — evidence High"},
        ],
        notes="• v55 Primary Themes 1–3.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
    )
)

slides.append(
    title_only(
        "Validated Themes 4-5 - Candidate experience and channel tension",
        [
            {"level": 1, "text": "Theme 4: Candidate experience, mobile, language, documents — multi-hop apply, ~40%+ mobile (P2), Arabic operational roles, RTL offer failures (P3) — Medium–high"},
            {"level": 1, "text": "Theme 5: Channel strategy tension — WhatsApp essential (P1, P2) versus corporate restriction (P3) — High divergence"},
        ]
        + [
            _product_impl_para(
                "Themes 4–5 require tenant-configurable channel policies and RTL document investment — sequence with Legal on consent and artefact accuracy."
            )
        ],
        alt=True,
        notes="• v55 Primary Themes 4–5.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md",
        body_height=2.9,
    )
)

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix (Customer + 101)"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "P1", "P2", "P3", "101", "PMF impact"],
                    ["1 Workflow", "Strong", "Sched", "Franchise", "UX", "Critical speed"],
                    ["2 Efficiency", "Dash", "Strong", "Strong", "AI gap", "Critical parity"],
                    ["3 Compliance", "Strong", "Strong", "Manual", "Portals", "High"],
                    ["4 Cand. exp.", "Docs", "Strong", "RTL", "RTL gap", "High"],
                    ["5 Channel", "WA+", "WA+", "WA ban", "Ora pack", "Med–high"],
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
        "speaker_notes": "• Abbreviated cells for fit — full matrix in v55 report.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md § Triangulation Matrix",
    }
)

slides.append(
    sec(
        "Workday Confidential",
        "Diagnostic | Full-funnel gaps from v55 cross-theme insights — scheduling, search, RTL, omnichannel, compliance reporting",
    )
)

slides.append(
    title_only(
        "GCC Recruiting Gap Analysis - Full Funnel",
        [
            {"level": 1, "text": "Attract and apply: multi-hop career front door (P2); high mobile share — reduce hops and sharpen mobile conversion"},
            {"level": 1, "text": "Screen and review: tab sprawl, weak boolean, database match ask — unified review surface and clear AI licence path"},
            {"level": 1, "text": "Interview and schedule: Outlook leakage; KSA and Kuwait rules — configurable guardrails after 060"},
            {"level": 1, "text": "Offer and documents: RTL defects; email attachments — structured intake and document fidelity"},
            {"level": 1, "text": "Compliance and report: nationalisation tracking; franchise Excel exits — productised packs and role-tailored dashboards"},
        ]
        + [
            _product_impl_para(
                "101 True Gaps align with customer asks on AI, RTL, and portals — pair roadmap sequencing with honest gap registration and tenant policy models."
            )
        ],
        alt=True,
        notes="• Cross-theme insights v55.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md § Cross-theme insights",
        body_height=3.25,
    )
)

slides.append(
    sec(
        "Workday Confidential",
        "Roadmap recommendations | Nine Priority 1–2 actions from v55, five-part slides, E2E handoff table, then next steps",
    )
)

REC = [
    (
        "Recommendation 1: Interview scheduling excellence + GCC compliance guardrails",
        False,
        "Problem: In-product scheduling feels heavy versus calendar clients; KSA-style notice, consent, and panel hints need product support.\n"
        "Evidence: P1 rules and notifications; P2 Outlook comparison; Theme 1; Legal notes on consent and audit.\n"
        "Recommendation: Improve scheduling UX; configurable minimum notice, documented exception consent, panel composition hints; notifications to candidate and hiring manager.\n"
        "Why now: Competitive scheduling narratives plus customer urgency on GCC compliance guardrails.\n"
        "Success metrics: in-product scheduled events; support tickets down; legal-approved warning copy adoption.",
    ),
    (
        "Recommendation 2: Nationalisation and diversity data model (productised GCC packs)",
        True,
        "Problem: Custom nationality fields and spreadsheet sidecars increase error risk versus quota penalties.\n"
        "Evidence: P1 liability framing; P2 custom fields; Theme 3; 101 workaround classification on nationalisation reporting.\n"
        "Recommendation: Pre-modelled fields, validations, reporting templates for Saudization / Emiratization / Kuwaitisation / Omanisation-style tracking with RBAC on sensitive attributes.\n"
        "Why now: Political enforcement narratives in desk research and customer board exposure.\n"
        "Success metrics: adoption of standard packs; audit findings down; fewer bespoke field projects.",
    ),
    (
        "Recommendation 3: Unified candidate review + search roadmap (incl. AI match stance)",
        False,
        "Problem: Multi-tab review and weak boolean slow high-volume shortlisting; buyers want database-wide match.\n"
        "Evidence: P2 tab quote; P3 hundreds of CVs quote; Theme 2; 101 True Gap on core semantic match without optional SKUs.\n"
        "Recommendation: Reduce tab load; strengthen boolean and field combinations; publish clear HiredScore / enterprise search licensing path with human-in-the-loop UX.\n"
        "Why now: SAP / Oracle AI stories raise RFP bar; customer pull is explicit.\n"
        "Success metrics: time-to-shortlist; match feature adoption with disclosure; legal sign-off on flows.",
    ),
    (
        "Recommendation 4: Policy-governed omnichannel candidate engagement",
        True,
        "Problem: Regional speed favours WhatsApp; global enterprises may ban it for official comms — one-size channel fails.\n"
        "Evidence: P1/P2 pro-WhatsApp; P3 restriction; Theme 5; Oracle packaged WhatsApp vs Workday workaround in 101.\n"
        "Recommendation: Tenant policies for approved channels; template governance; opt-in; audited threads; honest sales narrative versus Oracle packaging.\n"
        "Why now: Divergent customer evidence within single enterprise archetypes will recur in GCC deals.\n"
        "Success metrics: policy coverage; reduction of shadow channels where allowed; compliant opt-in rates.",
    ),
    (
        "Recommendation 5: RTL-rich generated documents for offers (Arabic)",
        False,
        "Problem: Arabic offer text renders incorrectly in generated documents — employer brand and legal accuracy risk.\n"
        "Evidence: P3 squares quote; Theme 4; 101 RTL complex generated documents True Gap.\n"
        "Recommendation: Close True Gap on complex RTL in generated documents (Workday Docs / BIRT path per platform reality).\n"
        "Why now: Arabic operational hiring demand from P2 and document failures from P3.\n"
        "Success metrics: defect reports down; customer acceptance tests on sample templates.",
    ),
    (
        "Recommendation 6: Structured offer / visa document intake (categories)",
        True,
        "Problem: Email attachments for offer-related documents weaken audit trails.\n"
        "Evidence: P1 structured upload theme; P3 risk angles; Theme 1 orchestration.\n"
        "Recommendation: Candidate upload by category with DLP-friendly routing; reduce email sprawl.\n"
        "Why now: PDPL-class integrity expectations and franchise governance.\n"
        "Success metrics: percentage of documents in-system; fewer email escalations.",
    ),
    (
        "Recommendation 7: Role-tailored dashboards and franchise-friendly reporting",
        False,
        "Problem: In-app dashboards weak; franchise entities exit to Excel — leadership blind spots.\n"
        "Evidence: P1/P3 dashboard quotes; Theme 3 franchise manual reporting; PowerBI workaround (P3).\n"
        "Recommendation: Recruiter versus leadership lenses in-product; lightweight patterns for low-volume entities.\n"
        "Why now: Compliance and speed narratives require trustworthy roll-ups without BI exits.\n"
        "Success metrics: in-product report adoption; Excel exit rate down.",
    ),
    (
        "Recommendation 8: Mobile-first apply and fewer external hops",
        True,
        "Problem: High mobile share and multi-hop apply paths hurt conversion.\n"
        "Evidence: P2 40%+ mobile; career site redirect theme; Theme 4.\n"
        "Recommendation: Sharpen mobile conversion; reduce double career site hops where customer owns front door.\n"
        "Why now: Social expectations and competitive candidate UX benchmarks.\n"
        "Success metrics: mobile completion rate; time-to-apply; bounce reduction.",
    ),
    (
        "Recommendation 9: Native government portal integrations (Qiwa, Mudad, MOHRE)",
        False,
        "Problem: 101 validates native portal class as True Gap — customers carry integration burden today.\n"
        "Evidence: Competitive table; Theme 3 evidence reporting; long-cycle delivery risk in RICE.\n"
        "Recommendation: Phased connector roadmap with honest gap language until native delivery; processor versus controller analysis with Legal.\n"
        "Why now: Political audit pressure increasing even when connectors lag AI and UX work.\n"
        "Success metrics: pilot tenants; reduced custom integration projects; win-rate impact in portal-sensitive bids.",
    ),
]
for i, (title, alt, body) in enumerate(REC):
    slides.append(
        recommendation_slide(
            title,
            alt,
            body,
            f"• E2E handoff row {i + 1} from v55.\n\nReferences:\n• {REPORT}",
        )
    )

e2e_rows = [
    ["#", "Title", "Action (short)"],
    ["1", "Interview scheduling + GCC guardrails", "In-product UX; KSA notice, consent, panel hints; notifications"],
    ["2", "Nationalisation / diversity packs", "Pre-modelled fields, validations, reports; RBAC"],
    ["3", "Unified review + search + AI stance", "Tabs, boolean, HiredScore path; human-in-the-loop"],
    ["4", "Policy-governed omnichannel", "Tenant channel policy; templates; audit; Oracle parity story"],
    ["5", "RTL-rich generated documents", "Arabic offer fidelity in generated docs"],
    ["6", "Structured document intake", "Category uploads; less email"],
    ["7", "Dashboards + franchise reporting", "Role lenses; lightweight low-volume patterns"],
    ["8", "Mobile-first apply", "Conversion; fewer external hops"],
    ["9", "Native portal integrations", "Phased Qiwa, Mudad, MOHRE; honest gaps"],
]

slides.append(
    {
        "master_index": 1,
        "layout_name": "Title Only_Alt",
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
        "speaker_notes": "• HITL: PM selects one row for PRD → 315 → 320 → 330 → 400 pipeline.\n\nReferences:\n• 2026-03-22-GCC-PMF-Analysis-v55.md § E2E Handoff",
    }
)

slides.append(
    title_only(
        "Next Steps",
        [
            {"level": 1, "text": "HITL 1: PM selects one recommendation from E2E handoff table — orchestrator logs choice in MISSION_LOG.md"},
            {"level": 1, "text": "Pipeline: 200 PRD (markdown) → 080 Red Team → 315 discovery → 319 copy → 320 prototype → 319 spot-check → 330 Figma → 400 backlog"},
            {"level": 1, "text": "Refresh quant blocks: add brainstorm-sessions sources and rerun 106; add win-loss sources and rerun 107 for next deck version"},
            {"level": 1, "text": "Keep 101 matrix and scan dated per mission — quarterly CI refresh for sales enablement"},
        ],
        notes="• GCC E2E-015 orchestrator Step 4 onward.\n\nReferences:\n• .cursor/rules/000-master-orchestrator.mdc",
    )
)

slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
