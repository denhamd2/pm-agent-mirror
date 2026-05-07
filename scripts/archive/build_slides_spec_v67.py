#!/usr/bin/env python3
"""Build slides_spec_v67.json for GCC PMF v65-parity deck from 120 report content."""
import json
from pathlib import Path

def tb_body(paragraphs, font=14, height=2.8):
    return {
        "left_inches": 0.7,
        "top_inches": 1.2,
        "width_inches": 8.6,
        "height_inches": height,
        "font_name": "Archivo",
        "font_size_pt": font,
        "color": "ink",
        "paragraphs": paragraphs,
    }

def pi_runs(text_after_prefix):
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": text_after_prefix, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }

def alt(i):
    return "Title Only_Alt" if i % 2 else "Title Only"

def section(nn, name):
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
            "text": f"S E C T I O N  {nn}\n{name}",
        }],
    }

slides = []

slides.append({
    "master_index": 1,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "GCC Recruiting Product-Market Fit Research"},
        "1": {"text": "Thematic analysis and roadmap - March 2026"},
    },
})

slides.append(section("0 1", "Introduction"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Executive Summary"}},
    "text_boxes": [tb_body([
        {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "Enterprise recruiters describe friction across the hire funnel: assignee overhead on moves, notes before formal screen, weak historic funnel visibility, and dashboards that push work to exports and business intelligence."},
        {"level": 1, "text": "Search clusters around Boolean limits, database-wide matching at very high candidate scale, and prioritisation across extreme apply volume."},
        {"level": 1, "text": "Scheduling often feels easier in Outlook than in Workday for some; others want end-to-end orchestration with KSA interview notice, consent, and panel metadata."},
        {"level": 1, "text": "Offers and documents combine configuration rigidity with Arabic rendering issues; nationalisation is often tracked via custom constructs with appetite for audit-ready reporting."},
        {"level": 1, "text": "WhatsApp is operationally essential for speed for some enterprises; others restrict official WhatsApp for fraud and brand integrity, favouring email, SMS, and Teams."},
    ], 14)],
    "speaker_notes": "• Lead with funnel friction and compliance.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md\n• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-027.md",
})

slides.append(section("0 2", "Research challenge"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Research Question and Objectives"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Assess product-market fit for Workday Recruiting in GCC-facing enterprise programmes using qualitative interviews, structured internal ideation, buyer extracts, and competitive baseline research."},
        {"level": 1, "text": "Identify validated themes across funnel ergonomics, discovery and matching, scheduling, documents, nationalisation, and omnichannel communications."},
        {"level": 1, "text": "Triangulate customer evidence with internal capability hotspots, buyer data hygiene, and regional competitive positioning for roadmap prioritisation."},
        {"level": 1, "text": "Produce executive-ready recommendations with honest Native, workaround, and true gap language validated with professional services and tenant testing where classifications vary."},
    ], 14)],
    "speaker_notes": "• Explain scope: six GCC markets with enterprise recruiter evidence.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append(section("0 3", "Context review"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Strategic Context - Why GCC Now"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Nationalisation programmes and enforcement narratives in Saudi Arabia and UAE increase audit-ready workforce reporting expectations for private-sector employers."},
        {"level": 1, "text": "Enterprise buyers compare bundled regional human capital and payroll stories with global suite depth; bake-offs mix statutory adjacency, communications channels, and AI narratives."},
        {"level": 1, "text": "Mobile and messaging norms are very high; omnichannel candidate engagement is a competitive battleground versus regional specialists and global suites."},
        {"level": 1, "text": "Data protection regimes in KSA and UAE raise consent, retention, and cross-border considerations for candidate personal data and sensitive attributes."},
    ], 14)],
    "speaker_notes": "• Connect political and buyer dynamics to roadmap urgency.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "GCC Market Momentum - Key Indicators"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Industry syntheses cite strong growth in GCC human capital management software through 2030; use definitions carefully when comparing sources (Mordor Intelligence, Astute Analytica narratives)."},
        {"level": 1, "text": "Smartphone penetration across MENA is very high in forecast series (~91% by 2025 in one MENA forecast); UAE often cited above 97% in vendor summaries."},
        {"level": 1, "text": "Digital transformation and AI adoption narratives are prominent in regional business press; responsible framing keeps human-in-the-loop for hiring decisions."},
        {"level": 1, "text": "Total cost of ownership and time-to-value matter against regional bundles that combine payroll, compliance, and hiring workflows."},
    ], 12)],
    "speaker_notes": "• Cite Statista and industry reports in spoken layer.\n\nReferences:\n• https://www.statista.com/statistics/1190185/mena-smartphone-penetration-rate-forecast-by-region/\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append(section("0 4", "PESTEL"))

pestel = [
    ("Political", [
        {"level": 1, "text": "Saudi Arabia: Nitaqat and Saudization remain structural under Vision 2030; MHRSD and Qiwa-adjacent compliance shape employer obligations (Mondaq summaries cite programme phases 2026–2028)."},
        {"level": 1, "text": "UAE: Emiratization targets and penalties for private sector evolve; MoHRE urged employers on 2025 targets (validate figures at deal time; practitioner guides cite AED 108,000-class fines in 2025 narratives)."},
        {"level": 1, "text": "Third-party legal summaries track programme changes; sales and services must avoid over-claiming a single out-of-the-box product where matrix classifies workaround-style reporting."},
        {"level": 1, "text": "Workforce localisation is a board-level topic in enterprise RFPs; recruiters need defensible audit trails, not only policy text."},
        pi_runs("Workday must support defensible, auditable tracking of nationalisation-relevant attributes and manager-ready views, while sales and professional services use triangulated matrix language to avoid over-claiming a single out-of-the-box dashboard where the latest baseline classifies workaround-style nationalisation and MOHRE reporting."),
    ]),
    ("Economic", [
        {"level": 1, "text": "GCC HCM software market growth narratives through 2030 appear across industry syntheses; Astute Analytica cites HR tech valuation toward USD 5,483.5 million by 2032 (definitions vary)."},
        {"level": 1, "text": "Buyers weigh suite bundles that combine payroll, workforce compliance, and hiring against best-of-breed depth and enterprise security."},
        {"level": 1, "text": "Regional specialists market statutory adjacency and lower integration tax versus global suite implementations."},
        {"level": 1, "text": "Deal cycles mix capital discipline, renewal timing, and expansion revenue from existing HCM footprints."},
        pi_runs("Position total cost of ownership, statutory adjacency, and time-to-value credibly against bundled regional suites and mid-market velocity competitors, because economic buyers compare payroll-plus-hiring bundles with global platform depth in GCC bake-offs."),
    ]),
    ("Social", [
        {"level": 1, "text": "MENA smartphone penetration forecasts are high (~91% by 2025 in one forecast series; Statista topic pages document mobile-first norms)."},
        {"level": 1, "text": "English is common for professional roles; Arabic matters more for operational and blue-collar segments (customer evidence)."},
        {"level": 1, "text": "WhatsApp is speed-critical for some enterprises; others restrict official WhatsApp for scam and brand-integrity reasons, favouring email, SMS, and Teams."},
        {"level": 1, "text": "Candidate expectations on responsiveness and mobile apply exceed many legacy ATS workflows."},
        pi_runs("Mobile-first apply and multi-channel communications must coexist with optional messaging paths where Paradox is licensed and transparent SMS positioning for UAE and Saudi Arabia markets, because buyers compare omnichannel stories in competitive evaluations."),
    ]),
    ("Technological", [
        {"level": 1, "text": "Regional press and consultancies describe high AI adoption interest in HR; BCG and Gulf Business frame pilots with human-in-the-loop responsibility."},
        {"level": 1, "text": "Government digitalisation: Qiwa, Mudad, and MOHRE appear in compliance and competitive true gap and workaround discussion for recruiting versus payroll-only scope."},
        {"level": 1, "text": "Enterprise buyers expect explainable matching and clear entitlement stories for AI-assisted features versus competitor demos."},
        {"level": 1, "text": "Integration tax matters when exchanges sit outside core recruiting workflows."},
        pi_runs("Ship explainable ranking, clear disclosure, and documented integration patterns for government exchanges where true gaps persist, and maintain governance for AI features so global enterprises can meet PDPL-class expectations."),
    ]),
    ("Environmental", [
        {"level": 1, "text": "Few direct ATS requirements from climate policy; narrow recruiting-specific environmental signal."},
        {"level": 1, "text": "UAE majors publish net zero commitments (e.g. ADNOC sustainability narrative) relevant to enterprise ESG reporting exports, not core req-to-hire."},
        {"level": 1, "text": "Customers may still ask for workforce sustainability hooks in global reporting packs."},
        {"level": 1, "text": "Treat as secondary to nationalisation and privacy for core recruiting investment decisions."},
        pi_runs("Treat environmental reporting hooks as optional for global customers with sustainability disclosure needs, because recruiting product decisions remain driven by compliance, localisation, and funnel performance in GCC."),
    ]),
    ("Legal", [
        {"level": 1, "text": "KSA PDPL: Royal Decree M/19, amended M/148 (2023); in force September 2023 with practitioner grace narratives into 2024 (DLA Piper, Regulations.ai summaries)."},
        {"level": 1, "text": "UAE PDPA: Federal Decree-Law No. 45 of 2021 (UAE legislation portal overview)."},
        {"level": 1, "text": "Interview process design inputs include KSA three-day notice, consent if shorter, and panel nationality tracking; confirm with customer legal teams."},
        {"level": 1, "text": "AI-assisted screening and profiling require impact assessment discipline and human oversight in recruitment contexts."},
        pi_runs("Apply consent, minimisation, retention, and cross-border transfer discipline for candidate PII and sensitive attributes; surface compliance hints in scheduling UX without pretending to be legal advice, and plan DPIA-style reviews for AI screening."),
    ]),
]

for idx, (title, paras) in enumerate(pestel):
    slides.append({
        "master_index": 1,
        "layout_name": alt(idx),
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paras, 12)],
        "speaker_notes": "• Desk research citations in report appendix.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
    })

slides.append(section("0 5", "Competitive landscape"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Regional Specialists  -  GCC"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key strengths", "Key weaknesses", "GCC fit", "Notes"],
            [
                "Bayzat",
                "• GCC-first HRMS, payroll, hiring\n• Mudad payroll and WPS narrative\n• Mobile apply and scheduling marketing\n• Bundle TCO story vs global suite",
                "• Mid-market scope vs enterprise security depth\n• Narrower global footprint\n• Integration depth varies by module",
                "Strong statutory adjacency",
                "101 scan: macro bake-off vs Workday platform depth",
            ],
            [
                "HiBob",
                "• Bob Hiring integrated ATS (2024 PR)\n• Mid-market velocity\n• Regional office presence headlines",
                "• Enterprise RFP depth vs SAP/Oracle\n• GCC office refresh cadence",
                "Mid-market and growth accounts",
                "GlobeNewswire Mar 2026 Australia recognition per scan",
            ],
            [
                "Zoho Recruit",
                "• Frequent What's New cadence (Feb 2026)\n• Screening bot triggers, telephony\n• Add-on messaging ecosystem",
                "• Enterprise security and suite adjacency\n• Depth vs Oracle first-party channels",
                "Value ATS and velocity demos",
                "101: no March block on English What's New at scan",
            ],
            [
                "Regional bundles (general)",
                "• Payroll plus hiring narrative\n• Local compliance marketing",
                "• Global process standardisation\n• Multi-country tenant complexity",
                "GCC statutory comparisons",
                "Compare TCO honestly vs Workday footprint",
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
    }],
    "speaker_notes": "• Content sourced from March 2026 competitive scan only.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Global Platforms  -  Enterprise"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key strengths", "Key weaknesses", "GCC fit", "Notes"],
            [
                "SAP + SmartRecruiters",
                "• Mar 2026 connected HCM and Winston hiring narrative\n• Keeps SR+SF in MENA comparisons\n• Enterprise install base",
                "• Integration tax across phased rollouts\n• Demo velocity vs Zoho",
                "Large enterprise RFPs",
                "101 scan narrative",
            ],
            [
                "Oracle",
                "• 25D WhatsApp channel; Meta templates\n• 26A recruiting index per readiness docs\n• Global recruiting footprint",
                "• Suite complexity\n• Buyer fatigue on upgrades",
                "Enterprise bake-offs",
                "Messaging breadth in competitive stories",
            ],
            [
                "Workday",
                "• Platform depth and security model\n• Paradox conversational journeys when licensed\n• Skills Cloud pages for honest AI match story\n• Configurable grid Native per DA28",
                "• True gaps: first-party WhatsApp, Qiwa/Mudad recruiting, semantic match without add-ons, SMS to UAE/Saudi via standard messaging per latest thread",
                "Enterprise GCC programmes",
                "Triangulate DA20–DA28 before absolute claims",
            ],
            [
                "Microsoft ecosystem",
                "• Outlook and Teams ubiquity\n• Calendar habits for scheduling",
                "• Not a full ATS; adjacency only",
                "User habit comparator",
                "Customers cite Outlook easier than Workday for some trials",
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
    }],
    "speaker_notes": "• Align talk tracks to matrix rows and professional services validation.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Competitive SWOT  -  Workday GCC"}},
    "tables": [
        {
            "rows": [
                ["Strengths", "Weaknesses"],
                [
                    "• Enterprise candidate grid (Native, latest baseline)\n• Interview self-scheduling with live calendars when Scheduling SKU is licensed\n• Paradox path for conversational journeys where licensed\n• Skills Cloud and HiredScore depth when activated",
                    "• True gap: first-party WhatsApp in core UI; Qiwa and Mudad recruiting exchanges; semantic match without add-ons; SMS to UAE and Saudi via standard Workday Messaging per latest thread\n• Workaround: nationalisation and MOHRE dashboards; multipost without Broadbean via custom integrations; RTL for complex Workday Docs per latest thread\n• Reconcile deployment guidance across threads with PS and tenant UAT",
                ],
            ],
            "left_inches": 0.5,
            "top_inches": 1.0,
            "width_inches": 9.0,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
        {
            "rows": [
                ["Opportunities", "Threats"],
                [
                    "• Enforcement increases audit-ready reporting demand\n• Mobile apply and bilingual journeys\n• Governed AI interest with enterprise controls",
                    "• Buyers compare first-party WhatsApp to competitors\n• Statutory adjacency from regional bundles\n• Inconsistent enablement erodes trust if not reconciled in go-to-market",
                ],
            ],
            "left_inches": 0.5,
            "top_inches": 3.15,
            "width_inches": 9.0,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
    ],
    "speaker_notes": "• SWOT synthesised from March 2026 matrix and scan.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-027.md",
})

slides.append(section("0 6", "Win / Loss"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss  -  Top Gap Themes"}},
    "tables": [{
        "rows": [
            ["Gap theme", "Severity proxy", "Evidence mix"],
            ["Communications and notifications", "High (1,452 ideas)", "Internal ideation volume; customer channel divergence"],
            ["Job requisitions", "High (1,397 ideas)", "Internal ideation volume; configuration friction themes"],
            ["Candidate application flow", "High (1,393 ideas)", "Internal ideation volume; funnel ergonomics interviews"],
            ["Interview scheduling", "Medium–high (476 ideas)", "Customer Outlook vs Workday; DA28 Native with Scheduling SKU"],
            ["Nationalisation reporting", "High (customer)", "P1–P3; PESTEL enforcement narratives"],
            ["Messaging / SMS / WhatsApp", "High (competitive)", "101 true gap rows; policy divergence in interviews"],
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
    "speaker_notes": "• Gulf-coded buyer extract rows were zero this mission; themes combine customer interviews, internal ideation proxy counts, and competitive baseline.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-27-win-loss-analysis-GCC-E2E-027.md\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss  -  Gap Theme Chart"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms", "Reqs", "Apply", "Candidates", "Offers", "Privacy", "Career", "Interviews"],
        "series": [{"name": "Idea count (proxy)", "values": [1452, 1397, 1393, 1212, 922, 839, 658, 476]}],
        "title": "Capability rows by idea volume (TA filter)",
        "left_inches": 0.5,
        "top_inches": 1.35,
        "width_inches": 9.0,
        "height_inches": 3.4,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "text_boxes": [{
        "left_inches": 0.7,
        "top_inches": 4.85,
        "width_inches": 8.6,
        "height_inches": 0.65,
        "font_name": "Archivo",
        "font_size_pt": 11,
        "color": "ink",
        "paragraphs": [
            {"level": 1, "text": "Chart shows internal P&T ideation volume (global TA filter), not Gulf prevalence  -  pair with customer interviews."},
        ],
    }],
    "speaker_notes": "• Internal volume only; caveat in talk track.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss  -  GCC & Proxy Gaps"}},
    "tables": [{
        "rows": [
            ["Topic", "RAG", "Remediation"],
            ["Gulf rows in buyer extract", "🔴 HIGH data gap", "Populate country-specific gap fields; future Gulf-labelled exports"],
            ["Microsoft GCC High collision", "🟡 MEDIUM", "Train teams: Gulf states vs similarly named cloud segments"],
            ["Pair qualitative + matrix", "🟢 LOW risk if done", "Use March 2026 baseline when tabular Gulf data is thin"],
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
    "speaker_notes": "• Practical remediation from buyer extract analysis.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-27-win-loss-analysis-GCC-E2E-027.md",
})

slides.append(section("0 7", "Ideation hub"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub  -  Overview"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Nine thousand nine hundred twenty-two ideas analysed under Talent Acquisition filter from internal P&T ideation export (March 2026)."},
        {"level": 1, "text": "Regional caveat: cells are not GCC-labelled; themes indicate global Talent Acquisition pressure."},
        {"level": 1, "text": "Use alongside customer interviews for prioritisation, not as GCC prevalence proof."},
        {"level": 1, "text": "Highest negative sentiment and effort indices align to communications, requisitions, application flow, and candidates and prospects."},
    ], 14)],
    "speaker_notes": "• Volume and sentiment are directional internal signals.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub  -  Top Capabilities"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Communications and Notifications: 1,452 ideas."},
        {"level": 1, "text": "Job Requisitions: 1,397 ideas."},
        {"level": 1, "text": "Candidate Job Application Flow: 1,393 ideas."},
        {"level": 1, "text": "Candidates and Prospects: 1,212 ideas; Offers, Compliance, Career Sites, Interviews follow."},
    ], 14)],
    "speaker_notes": "• Pair with roadmap backlog themes for internal alignment.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub  -  Key Themes"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Questionnaire granularity on requisitions; delete candidate pools; application progress accuracy."},
        {"level": 1, "text": "DocuSign pause on requisition approval; grid group column label overrides; dynamic offer filenames."},
        {"level": 1, "text": "These hypotheses require GCC validation probes rather than automatic roadmap commitment."},
        {"level": 1, "text": "Cross-reference with six validated themes in thematic analysis for convergence."},
    ], 14)],
    "speaker_notes": "• Themes derived from verbatim and capability coding in ideation export.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub  -  AI Throughput"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Internal ideation includes Gen AI on Job Requisitions and recruiter throughput themes in high-volume rows."},
        {"level": 1, "text": "Customer interviews emphasise explainable matching, entitlements for Skills Cloud and HiredScore, and human review for AI-assisted ranking."},
        {"level": 1, "text": "Legal review applies to profiling and sensitive attributes; plan disclosures and assessments before commercial commitments."},
        {"level": 1, "text": "Position honestly against competitors that market broad AI hiring narratives."},
    ], 14)],
    "speaker_notes": "• Align AI story to licensed capabilities and governance.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append(section("0 8", "Primary research"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "GCC Customer Research Programme"}},
    "text_boxes": [tb_body([
        {"level": 1, "text": "Population: three senior recruiting leaders from enterprises with substantial Middle East hiring operations."},
        {"level": 1, "text": "GCC relevance: organisations actively hiring across GCC markets and global programmes with GCC compliance needs."},
        {"level": 1, "text": "Timing: research conducted March 2026."},
        {"level": 1, "text": "Method: in-depth semi-structured interviews on workflows, compliance, and technology gaps."},
        {"level": 1, "text": "Materials: primary interview transcripts analysed for this report (filenames in speaker notes)."},
        {"level": 1, "text": "Triangulation: cross-validated with internal ideation hotspots, buyer extract hygiene findings, and March 2026 competitive baseline."},
    ], 12)],
    "speaker_notes": "• Transcripts: Interview_P1_Ammad_Alsairafi_Accenture.txt; Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt; Interview_P3_Arika_Yamahata_Shell.txt\n\nReferences:\n• research/GCC/105-user-research-findings.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Customer Interview Participants"}},
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Recruiter Lead (Cyber Security and Campus Hiring)", "Accenture"],
            ["P2", "Performance and Innovation Manager (Global TA)", "Baker Hughes"],
            ["P3", "Product Owner (Talent and Resourcing)", "Shell"],
        ],
        "left_inches": 0.7,
        "top_inches": 1.2,
        "width_inches": 8.6,
        "font_size_pt": 10,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Three enterprise perspectives across services and energy sectors.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

def customer_slide(layout, title, paragraphs, note_path):
    return {
        "master_index": 1,
        "layout_name": layout,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [tb_body(paragraphs, 11)],
        "speaker_notes": f"• Presenter detail in notes.\n\nReferences:\n• {note_path}",
    }

slides.append(customer_slide(
    "Title Only",
    "P1  -  Recruiter Lead, Accenture",
    [
        {"level": 0, "text": [{"text": "Candidate review and funnel visibility", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"We need historic funnel visibility per requisition\"  -  assignee overhead on moves and weak dashboards push exports (P1, Accenture)."},
        {"level": 1, "text": "When moving candidates between requisitions, I want fewer assignee and security steps, so I can keep pace during campus and cyber hiring peaks."},
        {"level": 0, "text": [{"text": "Compliance and channels", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"WhatsApp is necessary for immediate responses\"  -  speed-critical channel alongside nationalisation quota tracking (P1, Accenture)."},
        {"level": 1, "text": "KSA interview rules: three-day notice with consent if shorter; panel nationality tracking described as design input."},
    ],
    "research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt",
))

slides.append(customer_slide(
    "Title Only_Alt",
    "P2  -  Performance Manager, Baker Hughes",
    [
        {"level": 0, "text": [{"text": "Discovery at scale", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"Match people who have not applied across two million candidates\"  -  Boolean limits and database-wide match demand (P2, Baker Hughes)."},
        {"level": 1, "text": "When screening very high volume, I want semantic and database-wide matching with clear entitlements, so I can find qualified non-applicants faster."},
        {"level": 0, "text": [{"text": "Scheduling and mobile apply", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"Outlook felt easier than Workday\" in scheduling trial  -  friction vs external calendar habits (P2, Baker Hughes)."},
        {"level": 1, "text": "Mobile apply described above forty percent in discussed segments; WhatsApp campaigns via partner versus email-only Workday campaigns."},
    ],
    "research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
))

slides.append(customer_slide(
    "Title Only",
    "P3  -  Product Owner, Shell",
    [
        {"level": 0, "text": [{"text": "Prioritisation and documents", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"Arabic letters show as squares in Workday Docs\"  -  RTL rendering failure in generated documents (P3, Shell)."},
        {"level": 1, "text": "When prioritising hundreds of CVs, I want clearer signals of who matters, so recruiters spend time on highest-impact candidates."},
        {"level": 0, "text": [{"text": "Policy on messaging", "bold": True, "font_size_pt": 12}]},
        {"level": 1, "text": "\"No official WhatsApp\"  -  corporate restriction for fraud and brand integrity; prefers email, SMS, Teams (P3, Shell)."},
        {"level": 1, "text": "Explores HiredScore-style capabilities; dashboards spill to Power BI for operational views."},
    ],
    "research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt",
))

slides.append(section("0 9", "Thematic analysis"))

themes = [
    ("Funnel Density and Ergonomics", [
        {"level": 1, "text": "Key insight and evidence: P1–P3 cite navigation tax across tabs, notes timing before formal screen, and weak per-requisition funnel visibility; internal ideation shows very high volume on candidates and application flow."},
        {"level": 1, "text": "Business impact: daily recruiter throughput falls in GCC and global enterprise segments; export-heavy dashboards increase time-to-fill and churn risk in competitive bakes."},
        {"level": 1, "text": "Product implications: consolidated review surfaces, clearer notes and business process security guidance, Recruiting Hub and per-requisition funnel dashboards, transparent move and copy behaviour."},
    ]),
    ("Discovery, Search, and Matching", [
        {"level": 1, "text": "Key insight and evidence: P2 demands database-wide match including non-applicants at two-million scale; P3 explores HiredScore; competitive baseline classifies semantic match without Skills Cloud or HiredScore as true gap."},
        {"level": 1, "text": "Business impact: discovery friction undermines differentiation versus Zoho Zia and SAP Winston narratives when entitlements are unclear in core deals."},
        {"level": 1, "text": "Product implications: semantic search roadmap with explicit Skills Cloud and HiredScore entitlements, explainability, human review, similar-candidate surfacing on requisitions."},
    ]),
    ("Scheduling and Orchestration", [
        {"level": 1, "text": "Key insight and evidence: P1 wants end-to-end orchestration in one system with KSA notice, consent, and panel metadata; P2 favours Outlook over Workday in trials; baseline states Native self-scheduling when Scheduling SKU is licensed."},
        {"level": 1, "text": "Business impact: scheduling fragmentation delays interviews and weakens Paradox value story where buyers compare calendar friction to Oracle and regional suites."},
        {"level": 1, "text": "Product implications: clear Scheduling SKU positioning separate from base Recruiting, configurable compliance hints (not legal advice), panel metadata capture, professional services and tenant validation before absolute claims."},
    ]),
    ("Offers, Documents, Configuration", [
        {"level": 1, "text": "Key insight and evidence: P1 cites offer configuration rigidity and long change cycles; P3 reports Arabic square glyphs in Workday Docs; baseline flags RTL for complex generated documents as workaround in latest thread."},
        {"level": 1, "text": "Business impact: document failures block GCC and RTL markets and increase offline contract and implementation rework."},
        {"level": 1, "text": "Product implications: faster safe configuration patterns, RTL font and template hardening with customer user acceptance testing, structured in-flow document collection."},
    ]),
    ("Nationalisation and Local Reporting", [
        {"level": 1, "text": "Key insight and evidence: P1–P3 describe quotas, penalties, custom fields, and franchise Excel workarounds; PESTEL cites escalating Emiratization and Nitaqat enforcement narratives."},
        {"level": 1, "text": "Business impact: audit-ready nationalisation reporting is a board-level requirement; workaround positioning erodes trust if competitors claim richer out-of-the-box statutory dashboards."},
        {"level": 1, "text": "Product implications: first-class nationalisation dimensions and report packs where product invests; honest workaround story for MOHRE and out-of-the-box nationalisation dashboards per latest matrix; professional services patterns."},
    ]),
    ("Omnichannel Comms and Journey", [
        {"level": 1, "text": "Key insight and evidence: P1–P2 treat WhatsApp as speed-critical; P3 bans official WhatsApp; internal ideation shows 1,452 communications ideas; baseline lists first-party WhatsApp and UAE/Saudi SMS as true gaps."},
        {"level": 1, "text": "Business impact: channel policy divergence forces multi-tenant configuration and audit trails; buyers compare first-party WhatsApp to Oracle and bundled regional suites."},
        {"level": 1, "text": "Product implications: Paradox activation economics, third-party SMS paths where latest thread applies, verified email and Teams outreach, mobile apply and branding to reduce redirect friction."},
    ]),
]

for i, (tname, paras) in enumerate(themes):
    slides.append({
        "master_index": 1,
        "layout_name": alt(i),
        "placeholders": {"0": {"text": tname[:45]}},
        "text_boxes": [tb_body(paras, 12)],
        "speaker_notes": "• One theme per slide; exactly three bullets.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
    })

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": [
            ["Theme", "Customer", "Internal ideation", "Buyer extract", "Note"],
            ["Funnel ergonomics", "Strong", "High volume on candidates and apply flow", "No Gulf rows", "Customer plus internal"],
            ["Discovery and AI", "Strong", "Gen AI on reqs", "No Gulf rows", "Customer plus internal"],
            ["Scheduling", "Strong", "Interviews row volume", "No Gulf rows", "Customer plus competitive baseline"],
            ["Documents and offers", "Strong", "Offers and e-sign friction", "No Gulf rows", "Customer plus internal"],
            ["Nationalisation", "Strong", "Not GCC-specific in cells", "No Gulf rows", "Customer plus PESTEL"],
            ["Omnichannel comms", "Strong", "Comms notifications volume", "No Gulf rows", "Policy divergence"],
        ],
        "left_inches": 0.35,
        "top_inches": 1.15,
        "width_inches": 9.3,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Strongest confidence combines customer interviews with competitive baseline and PESTEL; Gulf buyer extract is thin this mission.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append(section("1 0", "Full funnel"))

gap_rows = [
    ["Attract", "Career branding and multi-hop apply", "🟡 MEDIUM", "Partner redirects", "P2", "Native career experience / Paradox"],
    ["Convert", "Mobile and bilingual apply", "🟡 MEDIUM", "Partner-hosted", "P2", "Handheld optimisation"],
    ["Screen", "Grid tabs and notes timing", "🔴 HIGH", "Process and security config", "P1, P2", "UX plus admin guidance"],
    ["Schedule", "Outlook friction; KSA rules", "🔴 HIGH", "External tool", "P1, P2", "Scheduling SKU plus hints"],
    ["Offer", "Rigidity; Arabic Docs", "🔴 HIGH", "Offline contracts", "P1, P3", "Agile config plus RTL QA"],
    ["Comply", "Nationalisation reporting", "🔴 HIGH", "Custom fields / Excel", "P1–P3", "Out-of-the-box depth vs honest workaround"],
    ["Measure", "Dashboards and BI spill-over", "🔴 HIGH", "Power BI export", "P1, P3", "Operational Recruiting analytics"],
]

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Gap Analysis"}},
    "tables": [{
        "rows": [["Stage", "Gap", "Severity", "Workaround", "Evidence", "Product implication"]] + [r for r in gap_rows],
        "left_inches": 0.25,
        "top_inches": 1.0,
        "width_inches": 9.5,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Map severity to roadmap sequencing.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append(section("1 1", "Roadmap"))

recs = [
    (
        "Recommendation 1: Nationalisation reporting",
        [
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Mandated employers need audit-ready nationalisation and workforce reporting without spreadsheet spill-over."},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "P1–P3 cite quotas, penalties, and custom constructs; PESTEL enforcement narratives; matrix workaround rows for MOHRE and out-of-the-box nationalisation dashboards."},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Elevate dimensions, report packs, and professional services patterns with honest Native and workaround positioning triangulated across baseline threads."},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Emiratization and Saudization enforcement increases audit scrutiny in enterprise RFPs."},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Reduce custom-field workarounds: baseline versus target tracked with implementation partners; customer time-on-task for compliance reports."},
        ],
    ),
    (
        "Recommendation 2: Candidate review and discovery",
        [
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Navigation tax and weak discovery at scale undermine recruiter throughput and competitive demos."},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "P2 database-wide match demand; P3 HiredScore exploration; matrix true gap on semantic match without add-ons."},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Strengthen Boolean and semantic discovery; surface similar candidates with explicit Skills Cloud and HiredScore entitlements and human-in-the-loop review."},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Competitors market broad AI hiring narratives; entitlements must be crisp in core deals."},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Recruiter time-to-shortlist; discovery feature adoption; win-rate on deals citing discovery gaps."},
        ],
    ),
    (
        "Recommendation 3: Interview scheduling",
        [
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Scheduling splits across tools; KSA customers describe legislated interview constraints."},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "P2 Outlook preference; P1 end-to-end wish; baseline Native for self-scheduling when Scheduling SKU is licensed."},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Close Outlook friction; land Paradox value; separate Scheduling SKU from base Recruiting; configurable KSA-style hints for notice, consent, and panel metadata."},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Calendar habits and compliance expectations are decision criteria in GCC programmes."},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Interview schedule rate inside Workday; recruiter minutes saved per req; reduction in external tool usage."},
        ],
    ),
    (
        "Recommendation 4: Operational reporting",
        [
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Operational and executive views push recruiters and leaders to exports and external BI rebuilds."},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "P1 and P3 describe dashboard readability limits and Power BI spill-over."},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Improve Recruiting Hub and per-requisition funnel views with role-based dashboards for recruiters and leaders."},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Leadership reporting is a recurring theme alongside compliance mandates."},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Export volume down; weekly active use of in-product operational dashboards; leader satisfaction in QBRs."},
        ],
    ),
    (
        "Recommendation 5: WhatsApp and SMS paths",
        [
            {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Buyers expect modern messaging; policy and statutory reality differ by tenant and market."},
            {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "P1–P2 speed-critical WhatsApp; P3 ban; matrix true gap on first-party WhatsApp and UAE/Saudi SMS via standard messaging."},
            {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Address first-party WhatsApp gap where policy allows; third-party SMS for UAE and Saudi per latest thread; strong email and verified channels for restricted enterprises; activate Paradox where licensed."},
            {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Omnichannel comparisons to Oracle and regional bundles are active in bake-offs."},
            {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Candidate response rate by channel; cost per conversation; reduction in manual off-system messaging."},
        ],
    ),
]

for i, (title, paras) in enumerate(recs):
    slides.append({
        "master_index": 1,
        "layout_name": alt(i + 20),
        "placeholders": {"0": {"text": title[:45]}},
        "text_boxes": [tb_body(paras, 11, 3.2)],
        "speaker_notes": "• Five-part structure for leadership readout.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
    })

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Priority Recommendations Summary"}},
    "tables": [{
        "rows": [
            ["#", "Title", "Action"],
            ["1", "Nationalisation and local workforce compliance reporting", "Elevate audit-ready reporting with honest positioning; reduce custom-field spill-over."],
            ["2", "Recruiter candidate review and talent discovery", "Reduce navigation tax; strengthen discovery with explicit entitlements and human review."],
            ["3", "Interview scheduling in-product", "Close Outlook friction; land Paradox and Scheduling SKU story; KSA-style hints."],
            ["4", "Operational and executive reporting in Recruiting", "Improve Hub and per-requisition funnel views; reduce Power BI dependence."],
            ["5", "First-party WhatsApp in core Recruiting UI", "Address true gap where policy allows; third-party SMS paths; verified channels."],
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
    "speaker_notes": "• Summary table for roadmap selection conversations.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append({"master_index": 1, "layout_name": "Bumper Slide"})

out = str(Path(__file__).resolve().parents[2] / "docs" / "decks" / "specs" / "slides_spec_v67.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print("Wrote", out, "slides:", len(slides))
