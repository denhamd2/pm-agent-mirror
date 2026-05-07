#!/usr/bin/env python3
"""One-off generator for slides_spec_v59.json (GCC PMF v59). Run from repo root."""
import json

from slide_specs_dir import SLIDE_SPECS_DIR

OUT = SLIDE_SPECS_DIR / "slides_spec_v59.json"

MI = 1
BODY = dict(
    left_inches=0.7,
    top_inches=1.2,
    width_inches=8.6,
    height_inches=2.8,
    font_name="Archivo",
    font_size_pt=11,
    color="ink",
)


def sec(subtitle: str):
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
                "font_size_pt": 11,
                "color": "ink",
                "paragraphs": [
                    {"level": 0, "text": "Workday Confidential"},
                    {"level": 0, "text": subtitle},
                ],
            }
        ],
    }


def imply(text: str):
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 11, "highlight": "FFFF00"},
            {"text": text, "bold": True, "font_size_pt": 11, "highlight": "FFFF00"},
        ],
    }


def title_only(title: str, paragraphs: list, speaker_notes: str, alt: bool):
    return {
        "master_index": MI,
        "layout_name": "Title Only_Alt" if alt else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [{**BODY, "paragraphs": paragraphs}],
        "speaker_notes": speaker_notes,
    }


def p1(t):
    return {"level": 1, "text": t}


def p2(t):
    return {"level": 2, "text": t}


def sub12(t):
    return {"level": 0, "text": [{"text": t, "bold": True, "font_size_pt": 12}]}


slides = []

# 1 TITLE
slides.append(
    {
        "master_index": MI,
        "layout_name": "TITLE",
        "placeholders": {
            "0": {"text": "GCC Recruiting Product-Market Fit Research"},
            "1": {"text": "Thematic analysis and roadmap implications — March 2026 (v59)"},
        },
    }
)

# 2 Section
slides.append(sec("Introduction"))

# 3 Research Author
slides.append(
    title_only(
        "Research Author",
        [
            sub12("Ownership and scope"),
            p1("Analyst: 120-pmf-thematic-analysis (Braun & Clarke, 2006); deck: 130-pmf-slide-generator."),
            p1("Mission: GCC-E2E-019; report date 25 March 2026."),
            p1("Primary qualitative: P1–P3 enterprise GCC-facing transcripts (re-read in Phase 1; 105 linked for attestation only)."),
            p1("Triangulation: 106 P&T ideation export (N ≈ 9,922 TA-filtered); 107 Opportunity Detail.xlsx (598 rows, low GCC keyword count)."),
            p1("Competitive: 101 Step 1 — gcc-competitive-matrix.md v1.9; gcc-competitive-scan-2026-03-25-GCC-E2E-019.md."),
            p1("Deployment Agent thread 5087cfa2-4dec-4834-b052-54cfe75d66de for Native / Workaround / True Gap reconciliation."),
        ],
        "• Credit 120 report path and mission for audit.\n• Call out 101 + DA as authoritative for product claims.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-25-GCC-PMF-Analysis-v59.md\n• https://gdpr-info.eu/",
        False,
    )
)

# 4 Executive Summary
slides.append(
    title_only(
        "Executive Summary",
        [
            sub12("Headline outcomes"),
            p1("Friction spans the hire funnel: dense candidate review, search discovery, scheduling outside Workday, offer or document rigidity, Arabic / RTL defects in generated output."),
            p1("Nationalisation (Saudization, Emiratisation, Kuwaitization) tracked via custom fields; appetite for first-class regional reporting and honest Qiwa / Mudad recruiting exchange stance (True Gap per 101)."),
            p1("WhatsApp essential for speed (P1, P2); global tenant may restrict official WhatsApp (P3) — multi-channel design required."),
            p1("106 surfaces massive Communications and Notifications volume; 107 reinforces apply or advert friction, screening UX, integration narratives (NA-heavy extract)."),
            p1("Six Priority 1 roadmap slides follow triangulation; E2E handoff table lists all 10 recommendations for HITL."),
        ],
        "• Keep to funnel + compliance + channels narrative.\n• Do not over-weight 107 for GCC geo.\n\nReferences:\n• 120 report Executive Summary\n• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know",
        True,
    )
)

# 5 Section
slides.append(sec("Research challenge"))

# 6 Research Question
slides.append(
    title_only(
        "Research Question and Objectives",
        [
            sub12("Research challenge"),
            p1("Assess GCC Recruiting PMF using customer ground truth, internal ideation volume, win-loss buyer narrative, and 101 competitive parity."),
            p1("Objectives: map validated themes; triangulate Customer + Internal Team (106) + Win-Loss (107); align recommendations with 060 legal validation in 120."),
            p1("Scope: GCC labour markets (KSA, UAE, Qatar, Kuwait, Bahrain, Oman) with enterprise recruiter evidence; no raw GCC CSV in research/GCC/raw-data for this run."),
            p1("Out of scope: replacing binding legal advice; inferring GCC deal truth solely from global 107 rows."),
        ],
        "• Tie objectives to E2E handoff use.\n\nReferences:\n• Braun & Clarke (2006)\n• research/GCC/thematic-analysis/2026-03-25-GCC-PMF-Analysis-v59.md#Methodology",
        False,
    )
)

# 7 5-Phase
slides.append(
    title_only(
        "Research Approach - 5-Phase Framework",
        [
            sub12("Braun & Clarke thematic analysis"),
            p1("Phase 1: Familiarisation — re-read all P1–P3 transcripts listed in 120; 105 markdown not a substitute."),
            p1("Phase 2: Initial coding — abbreviated code book in report (e.g. Req-Move-Assignee-Friction, Boolean-Search-Weak)."),
            p1("Phase 3: Theme generation — eight validated themes with PMF impact."),
            p1("Phase 4: Theme review — triangulation matrix vs 106 and 107; 101 for competitive claims."),
            p1("Phase 5: Definition and reporting — roadmap Priority 1 / 2; E2E handoff table."),
        ],
        "• Emphasise re-read of raw transcripts.\n\nReferences:\n• https://doi.org/10.1191/1478088706qp063oa",
        True,
    )
)

# 8 Section
slides.append(sec("Strategic context"))

# 9 Strategic Context
slides.append(
    title_only(
        "Strategic Context - Why GCC Now",
        [
            sub12("Market and buyer dynamics"),
            p1("Nationalisation programmes intensify audit and penalty exposure; recruiters need auditable fields and manager-ready reporting, not only offline spreadsheets."),
            p1("Bake-offs pit bundled regional HR + payroll + ATS narratives against global stacks with AI and messaging stories; honest SKU boundaries reduce surprise in evals."),
            p1("Enterprise consolidation favours suite standardisation yet regional statutory adjacency (Mudad, WPS, Qiwa narratives) remains a decision factor."),
            p1("Buying committees compare candidate experience parity, high-volume screening, native vs paid add-on (e-sign, scheduling depth), and integrations (LinkedIn, calendars)."),
        ],
        "• Connect to Vision 2030 and Emiratisation press narratives cautiously.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-25-GCC-E2E-019.md\n• https://www.gulfnews.com/uae/dh108000-fine-per-unfilled-job-uae-moves-to-penalise-companies-missing-emiratisation-targets-1.500396465",
        False,
    )
)

# 10 Market Momentum
slides.append(
    title_only(
        "GCC Market Momentum - Key Indicators",
        [
            sub12("Quantitative anchors (industry syntheses)"),
            p1("GCC HCM software market growth narratives through 2030 (definitions vary by analyst) — Mordor Intelligence GCC HCM Software; Astute Analytica GCC HR tech headline to 2032."),
            p1("High smartphone and WhatsApp-oriented usage patterns in KSA; UAE strong mobile and social penetration (Statista territory pages)."),
            p1("AI adoption ranked highly in regional narratives; talent use cases emphasise screening and engagement with human judgment (Gulf Business 2025; BCG AI at work GCC)."),
            p1("Government digitalisation: Qiwa, Mudad anchor Saudi workforce compliance; 101 classifies recruiting data exchange as True Gap until productised."),
        ],
        "• Flag magnitude variance across analysts.\n\nReferences:\n• https://www.mordorintelligence.com/industry-reports/gcc-human-capital-management-software-market\n• https://www.statista.com/topics/9947/social-media-usage-in-saudi-arabia/",
        True,
    )
)

# 11 Section PESTEL
slides.append(sec("PESTEL"))

# 12 Political
slides.append(
    title_only(
        "Political",
        [
            p1("Saudi Arabia: Nitaqat / Saudization phases aligned with Vision 2030; MHRSD drives localization expectations."),
            p2("Qiwa-linked contract and compliance narratives in third-party legal commentary (Mondaq 2026–2028 Nitaqat phase)."),
            p2("Zawya coverage of Nitaqat calculation updates through Qiwa contracts."),
            p1("UAE: Emiratisation targets and penalty narratives in press and compliance guides — validate figures at deal time with legal."),
            p2("Gulf News example: fines framing for missing Emiratisation targets."),
            p1("Kuwaitization referenced in customer nationalisation theme (report Theme 5); policy detail customer-specific."),
            p1("Qatar, Bahrain, and Oman appear in GCC scope; use customer-specific policy packs when deals localise beyond KSA and UAE."),
            p1("Policy calendars shift with royal decrees and ministry updates; partner with regional legal for slide-deck numbers."),
            p1("Workday posture: nationalisation workaround today (fields + reports); elevate toward reference models per Priority 1."),
            imply(
                "When political programmes tie licences, visas, and fines to hiring mix, Recruiting must surface auditable nationality or quota dimensions, manager-ready dashboards, and configurable reporting packs so TA leaders defend decisions without shadow spreadsheets."
            ),
        ],
        "• Separate press from customer legal confirmation.\n• Cite Mondaq and Zawya for KSA.\n\nReferences:\n• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know\n• https://www.zawya.com/en/economy/gcc/saudi-arabia-updates-nitaqat-saudization-calculation-through-qiwa-contracts-ghwi8n8q",
        False,
    )
)

# 13 Economic
slides.append(
    title_only(
        "Economic",
        [
            p1("GCC HCM / HR software forecasts cite growth through 2030; magnitudes differ by market definition (services vs software)."),
            p2("Mordor Intelligence GCC HCM Software market report."),
            p2("GlobeNewswire / Astute Analytica GCC HR tech valuation narrative to 2032."),
            p1("Enterprise bake-offs weigh platform TCO against bundled regional suites that package payroll, WPS adjacency, and ATS."),
            p1("Investment in digital HR and compliance tooling continues alongside oil-sector diversification narratives."),
            p1("Time-to-value and implementation capacity influence wins even when Workday wins on suite depth."),
            p1("Competitive scan (GCC-E2E-019) notes Series C-era regional ATS funding echoes — verify before commercial claims."),
            imply(
                "Economic pressure and TCO comparisons mean Recruiting must articulate honest entitlements (Skills Cloud, HiredScore, Paradox), implementation paths, and statutory adjacency so GCC buyers see predictable cost and value versus bundled regional suites."
            ),
        ],
        "• Avoid single vendor CAGR as sole truth.\n\nReferences:\n• https://www.globenewswire.com/news-release/2024/06/18/2900516/0/en/GCC-HR-Tech-Market-Valuation-Set-to-Skyrocket-to-Reach-USD-5-483-5-Million-By-2032-Astute-Analytica.html",
        True,
    )
)

# 14 Social
slides.append(
    title_only(
        "Social",
        [
            p1("WhatsApp and mobile messaging norms are very high in KSA; UAE shows high social and mobile penetration (Statista)."),
            p2("Statista social media usage Saudi Arabia topic page."),
            p2("Statista WhatsApp usage by country statistics."),
            p1("Professional hiring often English-first; Arabic more critical for operational or blue-collar cohorts (P2 transcript signal)."),
            p1("Candidate responsiveness expectations favour fast channels; enterprise policy may forbid specific apps (P3)."),
            p1("Career site multi-hop journeys and ~40%+ mobile apply signal (P2) increase conversion risk."),
            p1("Social proof and brand risk influence channel policy alongside speed."),
            p1("Multi-lingual hiring teams mix Arabic and English workflows; avoid one-size channel mandates in enterprise tenants."),
            imply(
                "Social norms push mobile-first apply and messaging channels, yet enterprise policy may block WhatsApp, so Recruiting needs configurable omnichannel engagement, documented Studio plus CPaaS paths, and in-app alternatives such as email, SMS where supported, and Teams."
            ),
        ],
        "• Stress multi-channel, not WhatsApp-only.\n\nReferences:\n• https://www.statista.com/statistics/291540/mobile-internet-user-whatsapp/",
        False,
    )
)

# 15 Technological
slides.append(
    title_only(
        "Technological",
        [
            p1("GCC ranks highly in AI adoption narratives; recruiting use cases emphasise screening and engagement with human judgment."),
            p2("Gulf Business AI in GCC recruitment (2025)."),
            p2("BCG AI at work in the GCC (2025)."),
            p1("Government digitalisation: Qiwa and Mudad anchor Saudi workforce compliance; 101 classifies recruiting data exchange as True Gap."),
            p1("Deployment Agent: predefined slot self-scheduling vs live interviewer-calendar self-serve — bake-off workaround when bar is full sync."),
            p1("Paradox through Workday (January 2026 newsroom) positions conversational scheduling including WhatsApp in vendor narrative."),
            p1("Skills Cloud dependency for Candidate Skills Match must be explicit in demos versus core SKU expectations."),
            p1("Integration roadmaps must name HiredScore depth separately from base search to reduce bake-off expectation drift."),
            imply(
                "Technological narratives and portal adjacency require explainable, human-in-the-loop AI positioning for multinational tenants, plus honest calendar and messaging depth claims aligned to EU AI Act and GDPR-class expectations even when selling into GCC."
            ),
        ],
        "• Pair AI story with 060 high-risk framing.\n\nReferences:\n• https://gulfbusiness.com/en/2025/jobs/ai-hiring-what-recruiters-would-want-you-to-know/\n• https://www.bcg.com/publications/2025/ai-at-work-gcc-pilots-to-progress",
        True,
    )
)

# 16 Environmental
slides.append(
    title_only(
        "Environmental",
        [
            p1("DATA GAP (narrow): few signals tie environmental regulation directly to core ATS capabilities in this dataset."),
            p1("Major GCC employers publish net zero and sustainability commitments; example ADNOC net zero operations narrative."),
            p2("ADNOC sustainability portal — workforce and operations framing."),
            p1("ESG and workforce disclosure exports may matter for enterprise customers but remain secondary to hiring compliance in PMF evidence."),
            p1("Green job tagging or carbon reporting for reqs not evidenced in P1–P3 transcripts for this run."),
            p1("Monitor CSR hiring and sustainability reporting asks in future GCC win-loss rows."),
            p1("Product watch: optional reporting exports if customer RFPs cluster (hypothesis only)."),
            imply(
                "Environmental and ESG workforce disclosures are secondary in current GCC recruiting PMF evidence, yet enterprise customers may request exportable reporting hooks later, so monitor RFP language without over-building ahead of validated demand."
            ),
        ],
        "• State DATA GAP clearly to avoid greenwashing slides.\n\nReferences:\n• https://adnoc.ae/en/sustainability-net-zero",
        False,
    )
)

# 17 Legal
slides.append(
    title_only(
        "Legal",
        [
            p1("Saudi PDPL: enforceability and SDAIA oversight; principles include lawful basis, minimization, retention, rights (Lexology / practitioner summaries)."),
            p2("Clyde & Co Saudi implementing regulations insight (2023 entry point)."),
            p1("UAE PDPA: Federal Decree-Law No. 45 of 2021; GDPR-aligned themes — UAE legislation portal and Lexology summaries."),
            p1("KSA private-sector job advertising and interviews: MHRSD rules — Mondaq entry on new regulations."),
            p1("P1 described three-day notice, documented consent if sooner, and panel nationality tracking — customer-described design input pending legal confirmation."),
            p1("060 validation in 120: EU AI Act high-risk for AI-assisted screening; GDPR Arts 6, 9, 17, 22 implications for multinational hiring."),
            p1("Cross-border transfers for multinational candidates remain governed by customer DPAs; surface data residency questions early in GCC deals."),
            imply(
                "Legal regimes require configurable warnings and panel metadata for KSA-style interview rules after legal sign-off, plus bilingual notices, retention discipline, and DPIA-style thinking for high-volume AI to align PDPL, PDPA, and EU expectations."
            ),
        ],
        "• Never present product warnings as final legal position.\n\nReferences:\n• https://uaelegislation.gov.ae/en/legislations/1972\n• https://www.mondaq.com/saudiarabia/employee-rights-labour-relations/1683580/new-regulations-for-private-sector-job-advertising-and-interviews\n• https://artificialintelligenceact.eu/ai-act-explorer/",
        True,
    )
)

# 18 Section Competitive
slides.append(sec("Competitive landscape"))

# 19 Regional
slides.append(
    title_only(
        "Competitive Landscape - Regional Specialists",
        [
            p1("Bayzat-class: HR + payroll + ATS with Mudad / WPS public narrative; strong statutory adjacency story in GCC evaluations."),
            p1("Zoho Recruit: Arabic in language set; semantic / Zia matching narrative; WhatsApp blog plus Twilio marketplace; 2026 hiring-metrics content."),
            p1("HiBob: Bob Hiring integrated ATS (April 2024 milestone); quote-based pricing; limited new Dubai office finding on this pass."),
            p1("Positioning: regional suites win on bundled compliance optics; value ATS wins on price plus messaging extensions."),
        ],
        "• Verify funding echoes before citing rounds.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-25-GCC-E2E-019.md",
        False,
    )
)

# 20 Global
slides.append(
    title_only(
        "Competitive Landscape - Global Platforms",
        [
            p1("SAP + SmartRecruiters: March 2026 SAP News on unified experience, Winston, fraud detection, consent, data transferability."),
            p1("Oracle: 25D WhatsApp under Redwood + Recruiting Booster; 26A gen-AI recruiting docs for diligence."),
            p1("Workday: Paradox Conversational ATS through Workday (January 2026 newsroom); Skills Cloud pages tie recruiting skills matching to entitlements."),
            p1("GCC-E2E-019 DA reconciliation: WhatsApp True Gap in core UI; GCC SMS not on standard Workday Messaging supported-country list (Studio + Twilio or Telesign workaround)."),
        ],
        "• Keep Oracle and SAP claims tied to 101 scan dates.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
        True,
    )
)

# 21 SWOT
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive SWOT Analysis - Workday Recruiting in GCC"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [
                        "Suite depth, security model, global HCM adjacency; Paradox narrative for conversational engagement.",
                        "WhatsApp True Gap in core UI; predefined slot scheduling vs live calendar bar; Qiwa or Mudad recruiting exchange True Gap; complex Arabic PDF or Docs caveats.",
                    ],
                ],
                "left_inches": 0.5,
                "top_inches": 1.0,
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
                        "Activate Paradox; document Studio + CPaaS; elevate nationalisation reporting; Skills Cloud plus HiredScore packaging clarity.",
                        "Bundled regional suites on statutory optics; SAP or Oracle AI and messaging roadmaps; buyer TCO comparisons on native e-sign and scheduling.",
                    ],
                ],
                "left_inches": 0.5,
                "top_inches": 3.15,
                "width_inches": 9.0,
                "height_inches": 2.1,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            },
        ],
        "speaker_notes": "• SWOT is strategic summary of 101 + DA.\n• Do not claim full RTL PDF parity without PS and UAT.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
    }
)

# 22 Section Win Loss
slides.append(sec("Win / Loss"))

# 23 W/L overview
slides.append(
    title_only(
        "Win / Loss Analysis - Dataset Overview",
        [
            p1("Source: Opportunity Detail.xlsx — 598 gap rows (107 analysis, 25 March 2026)."),
            p1("Segment skew: North America 532 rows; EMEA 29; APAC 25 — not a GCC-only win-loss set."),
            p1("Stages: Won 179; Open 136; Do Nothing 107; Lost 96; Closed 39; other 41."),
            p1("GCC keyword hits: 2 rows — include Outlook or Teams or HiredScore scheduling constraint for GCC populations (single open-row data point)."),
            p1("Use 107 as buyer narrative colour; validate True Gap claims via 101 and Deployment Agent."),
        ],
        "• Warn against GCC inference from NA-heavy extract.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-25-win-loss-analysis.md",
        False,
    )
)

# 24 Top gaps table
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win / Loss - Top Product Gap Themes (Severity-Weighted)"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "Lost / in-flight signal", "Example buyer criteria code"],
                    [
                        "Candidate apply length / CX",
                        "Long advert or JD, apply friction in losses",
                        "WinLoss-BX-01",
                    ],
                    ["Screening / high volume", "Resume disposition, too many clicks", "WinLoss-HV-02"],
                    ["Native vs add-on cost", "E-sign TCO vs native claims", "WinLoss-COST-03"],
                    ["Integrations", "LinkedIn Quick Apply, calendar stacks", "WinLoss-INT-04"],
                    ["Interview orchestration", "Outlook / Teams / HiredScore (GCC row)", "WinLoss-INTV-05"],
                ],
                "left_inches": 0.45,
                "top_inches": 1.15,
                "width_inches": 9.1,
                "height_inches": 2.85,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Codes are internal tags from 107 report.\n• Pair with loss quotes in notes, not on slide.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-25-win-loss-analysis.md",
    }
)

# 25 Charts
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Win / Loss - Gap Analysis: Charts"}},
        "charts": [
            {
                "chart_type": "bar",
                "categories": ["Won", "Lost", "Open", "Do Nothing", "Closed"],
                "series": [{"name": "Rows", "values": [179, 96, 136, 107, 39]}],
                "title": "Opportunity gap rows by stage bucket",
                "left_inches": 0.55,
                "top_inches": 1.25,
                "width_inches": 9.0,
                "height_inches": 3.2,
                "has_legend": False,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "speaker_notes": "• Explain row-level counts are not ACV-weighted.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-25-win-loss-analysis.md",
    }
)

# 26 GCC proxy
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Win / Loss - GCC-Relevant and EMEA Proxy Gaps"}},
        "tables": [
            {
                "rows": [
                    ["Signal", "Detail", "How to use in PMF"],
                    [
                        "GCC keyword row",
                        "GCC populations cannot use WD Outlook integrations for scheduling or MS Teams HiredScore experience (Open)",
                        "Functional validation with calendar and HiredScore scope; do not generalise from n=1",
                    ],
                    [
                        "EMEA subset",
                        "29 rows — regional supplement only",
                        "Colour for EU multinational hiring; not GCC substitute",
                    ],
                    [
                        "Loss-heavy JD",
                        "Legal JD from advert vs competitor download story",
                        "Pairs with mobile apply and career site themes",
                    ],
                ],
                "left_inches": 0.45,
                "top_inches": 1.15,
                "width_inches": 9.1,
                "height_inches": 2.85,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Stress low GCC row weight.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-25-win-loss-analysis.md",
    }
)

# 27 Section Primary
slides.append(sec("Primary research"))

# 28 Interview strip
slides.append(
    title_only(
        "Customer Interviews | 3 GCC-market enterprise participants (semi-structured)",
        [
            p1("Population: n = 3 anonymised customer interviews (P1–P3) with GCC-facing recruiting remits."),
            p1("GCC relevance: KSA, UAE, and regional hiring discussed across Accenture, Baker Hughes, and Shell contexts."),
            p1("Timing: transcripts ingested for GCC-E2E-019; 120 Phase 1 full re-read March 2026."),
            p1("Method: semi-structured interviews aligned to Braun & Clarke familiarisation; codes and themes in 120 report."),
            p1("Sources: Interview_P1_Ammad_Alsairafi_Accenture.txt; Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt; Interview_P3_Arika_Yamahata_Shell.txt."),
            p1("Triangulation: cross-checked with 106 volume hotspots on comms, application UX, offers; 107 on apply and screening loss themes; PESTEL on legal and social norms."),
            p2("Limitation: no internal SME transcripts in internal-sme-transcripts for this run."),
        ],
        "• Set expectations on n=3 depth vs breadth.\n\nReferences:\n• research/GCC/customer-transcripts/",
        False,
    )
)

# 29 Participants table
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Customer Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["Participant", "Role", "Organisation"],
                    [
                        "P1",
                        "Recruiter Lead (Cyber Security & Campus Hiring)",
                        "Accenture",
                    ],
                    ["P2", "Performance & Innovation Manager (Global TA)", "Baker Hughes"],
                    ["P3", "Product Owner (Talent & Resourcing)", "Shell"],
                ],
                "left_inches": 0.5,
                "top_inches": 1.2,
                "width_inches": 9.0,
                "height_inches": 1.85,
                "font_size_pt": 10,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Anonymisation preserves org and role per workspace standard.\n• Add hiring volume detail only from transcripts if asked.\n\nReferences:\n• research/GCC/105-user-research-findings.md",
    }
)

# 30 P1
slides.append(
    title_only(
        "P1 - Recruiter Lead, Accenture",
        [
            p1('"We cannot keep context when every move copies security boundaries" — navigation tax across reqs and notes slows shortlisting (P1, Accenture).'),
            p1("Theme 1 (Candidate review density): tabs, notes before screen, assignee tagging overhead on high-volume campus and cyber hiring."),
            p1("When requisitions churn weekly, I want fewer clicks to disposition, so I can protect time-to-fill for burst hiring."),
            p1("KSA interview compliance: described three-day notice, documented consent if sooner, panel nationality tracking — feed configurable warnings after legal sign-off."),
            p1("Nationalisation: penalties drive custom fields; appetite for out-of-the-box regional reporting."),
            p2("Workaround today: heavy Excel or PowerBI rebuild for executive views."),
            p1("Scheduling still often easier in Outlook than in-product flows (Theme 3)."),
        ],
        "• Lead with high-volume campus pain.\n• Quote paraphrased to fit slide; full text in transcript.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt",
        False,
    )
)

# 31 P2
slides.append(
    title_only(
        "P2 - Performance & Innovation Manager, Baker Hughes",
        [
            p1('"Boolean feels weaker than our database size deserves" — asks for database-wide match including non-applicants (P2, Baker Hughes).'),
            p1("Theme 2 (Search and matching): improved Boolean, proactive matching across ~2M candidates, AI interest with honest Skills Cloud boundary."),
            p1("When sourcing at scale, I want one search model across pools, so I can surface passive talent without exporting to spreadsheets."),
            p1("Mobile apply ~40%+ handheld traffic; career site redirect friction (Phenom to Workday hops) hurts conversion (Theme 7)."),
            p1("WhatsApp described as operationally essential for immediate responses in GCC hiring (Theme 6)."),
            p2("Arabic more critical for blue-collar operational hiring than some corporate roles."),
            p1("Nationalisation tracking still matters for operational hiring cohorts even when corporate reqs are English-led."),
        ],
        "• Bridge to Zoho semantic narrative cautiously.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
        True,
    )
)

# 32 P3
slides.append(
    title_only(
        "P3 - Product Owner, Shell",
        [
            p1('"Official WhatsApp is blocked here — we still need trustworthy threads in Workday" — policy divergence on messaging (P3, Shell).'),
            p1("Theme 6 (WhatsApp vs policy): channel desirability vs fraud or brand risk requires multi-channel design."),
            p1("When governance forbids consumer WhatsApp, I want verifiable email and Teams-centric workflows, so I can audit recruiter outreach."),
            p1("Theme 4 (Offers, documents, RTL): Arabic squares or glyph issues in Workday Docs for generated offers; upload versus email sprawl."),
            p1("Franchise model lowers GCC volume versus peers; still sees dashboard export to Excel."),
            p2("Align with Priority 2 on two-way email and Teams depth for restricted tenants."),
            p1("Theme 8 reporting spill-over: exports rebuilt in PowerBI when in-app operational views miss the brief."),
        ],
        "• Nuance franchise vs integrated opco hiring.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt",
        False,
    )
)

# 33-36 Ideation Hub
slides.append(
    title_only(
        "Customer Ideation Hub | 9,922 TA-filtered P&T ideas (internal signal)",
        [
            p1("Source: P&T Qualtrics export filtered Talent Management to Talent Acquisition — N ≈ 9,922 idea documents (106, 25 March 2026)."),
            p1("Not GCC-labelled: treat as internal friction radar; validate each hotspot with 105 and 101 before roadmap commitment."),
            p1("Top capability volumes: Communications and Notifications 1,452; Job Requisitions 1,397; Candidate Job Application Flow 1,393."),
            p1("Also heavy: Candidates and Prospects 1,212; Offers and Employment Agreements 922."),
        ],
        "• Explicitly label global P&T bias.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-25-brainstorm-analysis.md",
        True,
    )
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Customer Ideation Hub - Top Capability Areas by Idea Volume"}},
        "charts": [
            {
                "chart_type": "bar",
                "categories": [
                    "Comms & Notifications",
                    "Job Requisitions",
                    "Candidate Apply Flow",
                    "Candidates & Prospects",
                    "Offers & Agreements",
                ],
                "series": [{"name": "Ideas", "values": [1452, 1397, 1393, 1212, 922]}],
                "title": "Top five TA capabilities by idea volume (106 export)",
                "left_inches": 0.55,
                "top_inches": 1.25,
                "width_inches": 9.0,
                "height_inches": 3.2,
                "has_legend": False,
                "category_axis_font_size_pt": 9,
                "value_axis_font_size_pt": 9,
                "title_font_size_pt": 10,
            }
        ],
        "speaker_notes": "• Numbers from 106 executive summary.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-25-brainstorm-analysis.md",
    }
)

slides.append(
    title_only(
        "Customer Ideation Hub - Key Themes from Verbatim Analysis",
        [
            p1("Req-Questionnaire-Granularity: pick individual questions per req versus entire questionnaire packs."),
            p1("Application-UX-Trust: accurate multi-step progress; help text for jurisdictions without legal surnames."),
            p1("Req-Approval-Integration: inline e-sign in approval versus DocuSign round-trip (8–24h cited in verbatims)."),
            p1("Comms-Volume-Pain: notification fatigue; hardest-effort cluster in model tables."),
            p1("Offer-Docs-Operational: dynamic offer PDF naming with candidate and date tokens."),
            p1("Recruiter-Grid-Config-Scale: group-column label overrides; questionnaire density limits."),
        ],
        "• Map each theme to 120 triangulation row.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-25-brainstorm-analysis.md",
        True,
    )
)

slides.append(
    title_only(
        "Customer Ideation Hub - AI Ideas Spotlight",
        [
            p1("AI-related language clusters with screening, matching, and engagement expectations in TA export (associated words: experience, candidate, profile)."),
            p1("106 hypotheses H4 ties accurate application progress to perceived broken flows — pairs with AI self-service narratives."),
            p1("120 Theme 2 stresses honest Skills Cloud and HiredScore depth versus bake-off AI claims."),
            p1("060: EU AI Act high-risk framing for recruitment AI — human oversight mandatory in messaging."),
            p1("Spotlight actions: demo transparency cards; separate Skills Cloud match from HiredScore scoring in talk tracks."),
            p1("Next: quantify AI-labelled rows in Qualtrics re-pull if PM needs hard percentages."),
        ],
        "• Avoid inventing AI feature demand percentages.\n\nReferences:\n• https://artificialintelligenceact.eu/ai-act-explorer/",
        False,
    )
)

# 37 Section Thematic
slides.append(sec("Thematic analysis"))

# 38 Themes 1-4
slides.append(
    title_only(
        "Validated Themes 1-4 - Customer and cross-source convergence",
        [
            p1("Theme 1 Candidate review density: 3/3 customers; 106 grid or questionnaire pain; 107 click and disposition friction — High PMF impact."),
            p1("Theme 2 Search and AI discovery: 3/3 customers; 107 screening must-haves; 101 Skills Cloud SKU boundary — High PMF impact."),
            p1("Theme 3 Interview scheduling: 2/3 strong; one GCC 107 row on Outlook or Teams; predefined slots vs live calendar bar — High PMF impact."),
            p1("Theme 4 Offers, documents, RTL: 2/3 customers; 107 e-sign TCO; 106 offer naming — High PMF impact."),
        ],
        "• Use matrix slide next for detail.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md#Theme-definitions-and-PMF-impact",
        True,
    )
)

# 39 Themes 5-8
slides.append(
    title_only(
        "Validated Themes 5-8 - Nationalisation, channels, mobile, reporting",
        [
            p1("Theme 5 Nationalisation reporting: 2/3 strong; P3 franchise lower GCC volume; 101 workaround today — High in KSA and UAE."),
            p1("Theme 6 WhatsApp vs policy: 3/3 discuss channels; 106 comms volume leader; omnichannel buying criteria — High PMF impact."),
            p1("Theme 7 Mobile apply and career site: P2 quant; 107 apply length; 106 application UX trust — Medium–High PMF impact."),
            p1("Theme 8 Reporting and BI spill-over: 3/3 export to PowerBI or Excel; in-app dashboards weak — High PMF impact."),
        ],
        "• Connect Theme 8 to Priority 2 dashboards recommendation.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md",
        False,
    )
)

# 40 Triangulation matrix (condensed)
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "Customer", "106", "107", "PMF"],
                    [
                        "1 Review density",
                        "High friction",
                        "Grid scale",
                        "Clicks loss",
                        "High",
                    ],
                    ["2 Search / AI", "3/3", "App trust", "HV screen", "High"],
                    ["3 Scheduling", "2/3", "E-sign adj.", "GCC row", "High"],
                    ["4 Offers / RTL", "2/3", "Offer docs", "E-sign TCO", "High"],
                    ["5 Nationalisation", "2/3", "Low direct", "Sparse", "High"],
                    ["6 WhatsApp", "3/3", "Comms vol", "Omnichannel", "High"],
                    ["7 Mobile apply", "P2 + 107", "App UX", "Apply loss", "Med–High"],
                    ["8 Reporting", "3/3", "Mixed rows", "Sparse", "High"],
                ],
                "left_inches": 0.35,
                "top_inches": 1.05,
                "width_inches": 9.3,
                "height_inches": 3.05,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.22,
            }
        ],
        "speaker_notes": "• Full matrix in 120 report with SME column empty.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md#Triangulation-matrix",
    }
)

# 41 Section Full funnel
slides.append(sec("Full funnel"))

# 42 Full funnel
slides.append(
    title_only(
        "GCC Recruiting Gap Analysis - Full Funnel",
        [
            sub12("Diagnostic across attract, convert, screen, schedule, offer, comply, measure"),
            p1("Attract / convert: mobile apply and career site hops (P2); long apply and JD delivery in 107 losses."),
            p1("Screen / review: navigation tax and weak Boolean (P1, P2); high-volume disposition friction (107, Theme 1)."),
            p1("Schedule: Outlook or third-party still easier (P1–P3); GCC 107 row flags calendar integrations for some populations."),
            p1("Offer / docs: rigid configuration, Arabic Docs defects (P1, P3); e-sign TCO in losses."),
            p1("Comply: nationalisation quotas and interview rules (P1, PESTEL Legal); PDPL and PDPA obligations."),
            p1("Measure: PowerBI and Excel spill-over (Theme 8) when in-app operational views insufficient."),
        ],
        "• Use as single-slide funnel narrative; expand in workshop.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md#Cross-theme-insights",
        False,
    )
)

# 43 Section Roadmap
slides.append(sec("Roadmap"))

recs = [
    (
        "Interview scheduling and compliance-aware UX",
        "Scheduling still painful versus Outlook; KSA notice and panel rules need product affordances.",
        "P1–P3 plus 107 GCC row and 101 predefined slot vs live calendar bar.",
        "Improve in-product scheduling parity; configurable short-notice and panel composition; position Paradox; document calendar depth honestly.",
        "Nationalisation deadlines and SAP or Oracle scheduling narratives intensify bake-offs in 2026.",
        "Reduce scheduling-related cycle time; increase in-product scheduled events; legal-approved KSA warning coverage in pilot tenants.",
    ),
    (
        "Omnichannel candidate engagement (WhatsApp / SMS / alternatives)",
        "WhatsApp essential for some GCC teams; others ban official WhatsApp; SMS not standard on Workday Messaging list.",
        "P1, P2, P3 channel split; 101 True Gap for core UI WhatsApp; 106 comms volume leader.",
        "Activate Paradox; document Studio + CPaaS; strengthen email, SMS where supported, Teams for restricted tenants.",
        "Competitors market WhatsApp and omnichannel; buyers demand parity and policy flexibility.",
        "Higher response rates where allowed; fewer shadow SMS workarounds; clearer RFP answers on channel coverage.",
    ),
    (
        "Nationalisation and local compliance reporting",
        "Customers track quotas via custom fields; want audit-ready OOB reports for UAE, KSA, Kuwait.",
        "P1, P2; 101 workaround today; Qiwa or Mudad recruiting exchange True Gap.",
        "Reference dimensions and manager-ready packs; honest roadmap for government recruiting data exchange.",
        "Fines and licence risk in press narratives increase executive scrutiny.",
        "Faster audit prep; reduced spreadsheet consolidation; clearer statutory story in QBRs.",
    ),
    (
        "RTL and Arabic in generated documents",
        "Arabic glyph or layout defects in Workday Docs undermine offer and contract quality.",
        "P3 transcript; 101 Arabic UI native with complex PDF caveats.",
        "RTL test harness for Docs; PS and tenant UAT before parity claims versus regional ATS.",
        "Zoho Arabic marketing sets perception bar even when features differ.",
        "Fewer manual offer workarounds; higher hiring manager confidence in Arabic packets.",
    ),
    (
        "Candidate review, search, and skills matching clarity",
        "Tab and note friction; Boolean limits; database-wide match expectations versus Skills Cloud SKU.",
        "Theme 1 and 2 across P1–P3; 107 screening; 101 Skills Cloud dependency.",
        "Consolidated review layouts; stronger search; GTM clarity on Skills Cloud vs HiredScore.",
        "AI and semantic matching stories from competitors raise the bar in evals.",
        "Shorter time-to-shortlist; fewer exports; fewer bake-off surprises on entitlements.",
    ),
    (
        "Mobile apply and career site path",
        "Significant mobile traffic; multi-hop apply reduces conversion.",
        "P2 ~40%+ mobile; 107 apply length; 106 application UX trust hypotheses.",
        "Mobile regression tests; reduce partner redirect depth; align with Paradox career site long-term narrative.",
        "Loss themes on LinkedIn and advert delivery reinforce upstream friction.",
        "Higher conversion on handheld; fewer abandoned applies in GCC campaigns.",
    ),
]

alt = False
for i, (title, prob, ev, rec, why, metrics) in enumerate(recs, start=1):
    alt = not alt
    slides.append(
        title_only(
            f"Recommendation {i} - {title}",
            [
                p1(f"Problem: {prob}"),
                p1(f"Evidence: {ev}"),
                p1(f"Recommendation: {rec}"),
                p1(f"Why now: {why}"),
                p1(f"Success metrics: {metrics}"),
            ],
            f"• Map to E2E handoff row {i}.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md#Product-Roadmap-Impact-Summary",
            alt,
        )
    )

# E2E Handoff table
slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "E2E Handoff - Research Recommendations (HITL selection)"}},
        "tables": [
            {
                "rows": [
                    ["#", "Title", "Action (abbrev.)"],
                    [
                        "1",
                        "Interview scheduling and compliance-aware UX",
                        "In-product parity; KSA warnings; Paradox; calendar bar documented",
                    ],
                    [
                        "2",
                        "Omnichannel candidate engagement",
                        "Paradox; Studio + CPaaS; GCC SMS disclosure",
                    ],
                    ["3", "Nationalisation and local compliance reporting", "Reference dims; Qiwa or Mudad honesty"],
                    ["4", "RTL and Arabic in generated documents", "Docs harness; UAT before claims"],
                    [
                        "5",
                        "Candidate review, search, skills matching clarity",
                        "Layouts; search; Skills Cloud GTM",
                    ],
                    ["6", "Mobile apply and career site path", "Mobile tests; fewer redirects"],
                    ["7", "Offer flexibility and implementation velocity", "Faster safe config for exceptions"],
                    ["8", "Structured candidate document upload", "Category-based confidential upload"],
                    ["9", "In-app operational dashboards", "Per-req funnel cockpits"],
                    ["10", "Two-way email and Teams-centric workflows", "Verifiable threads if WhatsApp banned"],
                ],
                "left_inches": 0.35,
                "top_inches": 1.05,
                "width_inches": 9.3,
                "height_inches": 3.05,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.22,
            }
        ],
        "speaker_notes": "• PM selects one row for PRD and design chain.\n\nReferences:\n• 2026-03-25-GCC-PMF-Analysis-v59.md#E2E-Handoff-Research-Recommendations",
    }
)

# Bumper
slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
