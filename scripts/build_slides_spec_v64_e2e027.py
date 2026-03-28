#!/usr/bin/env python3
"""Emit slides_spec_v64.json for GCC PMF roadmap from 2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md"""
import json

OUT = "/Users/david.denham/product-manager-agent/slides_spec_v64.json"

TB = lambda top=1.2: {
    "left_inches": 0.7,
    "top_inches": top,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_name": "Archivo",
    "font_size_pt": 11,
    "color": "ink",
}

def pi_line(text_after_prefix: str):
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": text_after_prefix, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }

def sec(num: str, name: str):
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
                "font_size_pt": 12,
                "color": "ink",
                "text": f"S E C T I O N  {num}\n{name}",
            }
        ],
    }

slides = []

# 1 TITLE
slides.append({
    "master_index": 1,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "GCC Recruiting Product-Market Fit Research"},
        "1": {"text": "Thematic analysis and roadmap — March 2026"},
    },
})

# 2 Introduction divider
slides.append(sec("0 1", "Introduction"))

# 3 Executive Summary
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Executive Summary"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Enterprise recruiters describe friction across the hire funnel: assignee overhead on moves, notes before formal screen, weak historic funnel visibility, and dashboards that push work to exports and business intelligence."},
            {"level": 1, "text": "Search and discovery cluster around Boolean limits, database-wide matching at very high candidate scale, and prioritisation across extreme apply volume."},
            {"level": 1, "text": "Interview scheduling often feels easier in Outlook than in Workday for some; others want end-to-end orchestration with Saudi Arabia interview notice, consent, and panel metadata."},
            {"level": 1, "text": "Offers and documents combine configuration rigidity with Arabic rendering issues in generated documents; nationalisation is often tracked via custom constructs with appetite for audit-ready reporting."},
            {"level": 1, "text": "WhatsApp is operationally essential for speed for some enterprises; others restrict official WhatsApp for fraud and brand integrity, favouring email, SMS, and Teams."},
        ],
    }],
    "speaker_notes": "• Lead with funnel friction and compliance.\n• Anchor competitive claims in March 2026 matrix and scan.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md\n• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-027.md",
})

# 4 Research challenge
slides.append(sec("0 2", "Research challenge"))

# 5 Research Question & Objectives
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Research Question and Objectives"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Assess product-market fit for Workday Recruiting in GCC-facing enterprise programmes using qualitative interviews, structured internal ideation, buyer extracts, and competitive baseline research."},
            {"level": 1, "text": "Identify validated themes across funnel ergonomics, discovery and matching, scheduling, documents, nationalisation, and omnichannel communications."},
            {"level": 1, "text": "Triangulate customer evidence with internal capability hotspots, win-loss data hygiene, and regional competitive positioning for roadmap prioritisation."},
            {"level": 1, "text": "Produce executive-ready recommendations with honest Native, workaround, and true gap language validated with professional services and tenant testing where classifications vary."},
        ],
    }],
    "speaker_notes": "• Explain scope: six GCC markets with enterprise recruiter evidence.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 6 Five-phase framework
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Research Approach — Five-Phase Framework"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Phase 1 — Familiarisation: full re-read of primary customer transcripts; structured findings file used for traceability only."},
            {"level": 1, "text": "Phase 2 — Initial coding: forty plus semantic codes tagged by participant plus internal and buyer sources where applicable."},
            {"level": 1, "text": "Phase 3 — Theme generation: cluster into six robust themes with cross-source review."},
            {"level": 1, "text": "Phase 4 — Theme review: triangulation matrix across customer, internal ideation, win-loss extract, and competitive scan."},
            {"level": 1, "text": "Phase 5 — Reporting: PESTEL desk pass, competitive narrative from baseline scan only, roadmap recommendations with legal checkpoint on sensitive uses."},
        ],
    }],
    "speaker_notes": "• Braun and Clarke thematic analysis framing.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 7 Context section
slides.append(sec("0 3", "Context review"))

# 8 Strategic Context - Why GCC Now
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Strategic Context — Why GCC Now"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Nationalisation programmes and enforcement narratives in Saudi Arabia and UAE increase audit-ready workforce reporting expectations for private-sector employers."},
            {"level": 1, "text": "Enterprise buyers compare bundled regional human capital and payroll stories with global suite depth; bake-offs mix statutory adjacency, communications channels, and AI narratives."},
            {"level": 1, "text": "Mobile and messaging norms are very high; omnichannel candidate engagement is a competitive battleground versus regional specialists and global suites."},
            {"level": 1, "text": "Data protection regimes in KSA and UAE raise consent, retention, and cross-border considerations for candidate personal data and sensitive attributes."},
        ],
    }],
    "speaker_notes": "• Connect political and buyer dynamics to roadmap urgency.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 9 GCC Market Momentum
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "GCC Market Momentum — Key Indicators"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Industry syntheses cite strong growth in GCC human capital management software through 2030; use definitions carefully when comparing sources."},
            {"level": 1, "text": "Smartphone penetration across MENA is very high in forecast series; UAE often cited above ninety-seven percent in vendor summaries."},
            {"level": 1, "text": "Digital transformation and AI adoption narratives are prominent in regional business press; responsible framing keeps human-in-the-loop for hiring decisions."},
            {"level": 1, "text": "Total cost of ownership and time-to-value matter against regional bundles that combine payroll, compliance, and hiring workflows."},
        ],
    }],
    "speaker_notes": "• Cite Statista and industry reports in spoken layer; numbers vary by definition.\n\nReferences:\n• https://www.statista.com/statistics/1190185/mena-smartphone-penetration-rate-forecast-by-region/\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 10 PESTEL section
slides.append(sec("0 4", "PESTEL"))

# 11-16 PESTEL factors
pestel_bodies = [
    ("Political", [
        {"level": 1, "text": "Saudi Arabia: Nitaqat and Saudization remain structural; Qiwa-adjacent compliance narratives shape employer obligations."},
        {"level": 1, "text": "UAE: Emiratization targets and penalties for private sector evolve; validate figures at deal time using official sources."},
        pi_line("Deliver auditable nationalisation tracking and manager-ready views; align sales claims with matrix Native, workaround, and true gap classifications and tenant validation."),
    ]),
    ("Economic", [
        {"level": 1, "text": "GCC HCM software market growth narratives through 2030 appear across industry syntheses; magnitudes vary by market definition."},
        {"level": 1, "text": "Buyers weigh suite bundles that combine payroll, workforce compliance, and hiring against best-of-breed depth."},
        pi_line("Position total cost of ownership, statutory adjacency, and time-to-value credibly against regional bundles and mid-market velocity competitors."),
    ]),
    ("Social", [
        {"level": 1, "text": "Very high smartphone penetration supports mobile-first apply and responsive journeys."},
        {"level": 1, "text": "English is common for professional roles; Arabic matters more for operational segments. WhatsApp is speed-critical for some enterprises; others restrict official use."},
        pi_line("Design multi-channel journeys with optional messaging paths where licensed and transparent SMS positioning for UAE and Saudi Arabia markets."),
    ]),
    ("Technological", [
        {"level": 1, "text": "Regional press describes high interest in AI for HR; governance and explainability remain essential."},
        {"level": 1, "text": "Government digitalisation programmes appear in compliance discussions for exchanges beyond core recruiting workflows."},
        pi_line("Ship explainable ranking, clear disclosure, and documented integration patterns for government exchanges where true gaps persist."),
    ]),
    ("Environmental", [
        {"level": 1, "text": "Few direct ATS requirements from climate policy; major employers publish net zero commitments relevant to enterprise sustainability reporting."},
        {"level": 1, "text": "Signal is secondary to nationalisation and privacy for core recruiting product decisions."},
        pi_line("Treat environmental reporting hooks as optional for global customers with sustainability disclosure needs."),
    ]),
    ("Legal", [
        {"level": 1, "text": "KSA PDPL and UAE PDPA raise consent, minimisation, retention, and transfer considerations for candidate data."},
        {"level": 1, "text": "Interview process design inputs include notice periods and panel metadata; confirm with customer legal teams."},
        pi_line("Apply consent and transparency discipline; plan impact assessments for AI-assisted screening and sensitive attributes across jurisdictions."),
    ]),
]

for i, (title, paras) in enumerate(pestel_bodies):
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt" if i % 2 else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [{**TB(), "paragraphs": paras}],
        "speaker_notes": "• Desk research citations in report appendix.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
    })

# 17 Competitive landscape
slides.append(sec("0 5", "Competitive landscape"))

# 18 Regional specialists
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Regional Specialists — GCC and Value"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Bayzat: GCC-first HRMS, payroll, and hiring; Mudad payroll and workforce compliance narrative; mobile apply and scheduling marketing."},
            {"level": 1, "text": "HiBob: Bob Hiring integrated ATS; mid-market velocity and regional office headlines vary by refresh cycle."},
            {"level": 1, "text": "Zoho Recruit: frequent What's New cadence; add-on messaging ecosystem contrasts with first-party channel stories elsewhere."},
            {"level": 1, "text": "Comparison axis: bundle total cost of ownership and statutory adjacency versus global platform depth and enterprise security model."},
        ],
    }],
    "speaker_notes": "• Content sourced from March 2026 competitive scan only.\n\nReferences:\n• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-027.md",
})

# 19 Global platforms
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Global Platforms — Enterprise Comparators"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "SAP and SmartRecruiters: connected HCM and hiring narrative keeps enterprise comparisons active in MENA evaluations."},
            {"level": 1, "text": "Oracle: channel breadth including messaging integrations; recruiting index availability per readiness materials."},
            {"level": 1, "text": "Workday: platform depth, Paradox for conversational journeys where licensed, Skills Cloud public pages for honest AI match entitlement story."},
            {"level": 1, "text": "Enablement must triangulate deployment guidance on SMS, scheduling SKU, RTL documents, multipost, and nationalisation dashboards before absolute customer commitments."},
        ],
    }],
    "speaker_notes": "• Align talk tracks to matrix rows and professional services validation.\n\nReferences:\n• research/competitive/matrices/gcc-competitive-matrix.md",
})

# 20 SWOT — two tables per 010
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Competitive SWOT — Workday in GCC"}},
    "tables": [
        {
            "rows": [
                ["Strengths", "Weaknesses"],
                [
                    "• Enterprise candidate grid classified Native in latest baseline\n• Interview self-scheduling with live calendars when Scheduling SKU is licensed\n• Paradox path for conversational journeys where licensed\n• Skills Cloud and HiredScore depth when activated",
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

# 21 Win / Loss section
slides.append(sec("0 6", "Win / Loss"))

# 22-25 Win/Loss quartet
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss — Dataset Scope"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Buyer opportunity extract contains five hundred ninety-eight rows; after Gulf keyword filtering, zero rows remain for Gulf Cooperation Council recruiting dynamics."},
            {"level": 1, "text": "One row referencing Microsoft GCC High was excluded because it refers to a cloud segment, not Gulf states."},
            {"level": 1, "text": "Implication: Gulf-specific win-loss themes are not extractable from this tabular extract; avoid inferring regional outcomes from unrelated rows."},
            {"level": 1, "text": "Remediation: improve country and gap taxonomy hygiene; pair future Gulf-labelled extracts with competitive matrix for bake-offs."},
        ],
    }],
    "speaker_notes": "• Be transparent about data gap; avoid false precision.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-27-win-loss-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss — Product Gap Themes (Proxy)"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 0, "text": [{"text": "Proxy source: internal P&T ideation volume", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Nine thousand nine hundred twenty-two ideas in Talent Acquisition filter; not GCC-labelled in cells — use as hypothesis volume only."},
            {"level": 1, "text": "Hotspots: Communications and Notifications; Job Requisitions; Candidate Job Application Flow; Candidates and Prospects; Offers; Compliance and Data Privacy; Career Sites; Interviews."},
            {"level": 1, "text": "Cross-check with customer interviews before treating as regional prevalence."},
        ],
    }],
    "speaker_notes": "• Position internal ideation as hypothesis, not GCC prevalence proof.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss — Capability Hotspots Chart"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms", "Reqs", "Apply flow", "Candidates", "Offers", "Privacy", "Career", "Interviews"],
        "series": [{"name": "Idea count (proxy)", "values": [1452, 1397, 1393, 1212, 922, 839, 658, 476]}],
        "title": "Top capability rows by idea volume (TA filter)",
        "left_inches": 0.5,
        "top_inches": 1.35,
        "width_inches": 9.0,
        "height_inches": 3.4,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "speaker_notes": "• Chart illustrates internal volume only; caveat in talk track.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss — Gulf Analytics Remediation"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Populate country-specific gap detail fields on opportunities to unlock future Gulf-filtered analytics."},
            {"level": 1, "text": "Train customer-facing teams to disambiguate Gulf Cooperation Council from similarly named cloud segments."},
            {"level": 1, "text": "Pair qualitative customer evidence and March 2026 competitive baseline when Gulf tabular data is thin."},
            {"level": 1, "text": "Next step: ingest Gulf-labelled customer relationship management exports when available."},
        ],
    }],
    "speaker_notes": "• Practical remediation from win-loss file analysis.\n\nReferences:\n• research/GCC/win-loss-analysis/2026-03-27-win-loss-analysis-GCC-E2E-027.md",
})

# 26 Primary research section
slides.append(sec("0 7", "Primary research"))

# 27 Intro
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "GCC Customer Research Programme"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Three enterprise interviews with GCC-facing recruiters re-read in full for this analysis."},
            {"level": 1, "text": "Semi-structured protocol covering funnel ergonomics, scheduling, documents, nationalisation, discovery, and communications channels."},
            {"level": 1, "text": "Participants anonymised as P1, P2, and P3 with role and organisation retained for traceability."},
            {"level": 1, "text": "Findings triangulated with internal ideation hotspots and March 2026 competitive baseline."},
        ],
    }],
    "speaker_notes": "• Set expectations on sample size and depth versus breadth.\n\nReferences:\n• research/GCC/105-user-research-findings.md",
})

# 28 Participants table
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
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

# 29-31 Per-customer
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "P1 — Recruiter Lead, Accenture"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 0, "text": [{"text": "Role context", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Cyber security and campus hiring; high-touch coordination across compliance-heavy workflows."},
            {"level": 0, "text": [{"text": "Key evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Assignee overhead when moving candidates between requisitions; notes capture before formal screen stage."},
            {"level": 1, "text": "Dashboard readability limits; historic funnel visibility per requisition is weak."},
            {"level": 1, "text": "WhatsApp described as necessary for speed; nationalisation quotas tracked with gender and disability dimensions."},
        ],
    }],
    "speaker_notes": "• Quote sparingly in live readout; full quotes in report.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P1_Ammad_Alsairafi_Accenture.txt",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "P2 — Performance Manager, Baker Hughes"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 0, "text": [{"text": "Role context", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Global talent acquisition innovation; high-volume candidate operations."},
            {"level": 0, "text": [{"text": "Key evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Boolean search feels weak; wants database-wide matching including people who have not applied at two-million-candidate scale."},
            {"level": 1, "text": "Outlook scheduling trial felt easier than Workday for interview scheduling."},
            {"level": 1, "text": "WhatsApp campaigns via partner; email-only campaigns in Workday; mobile apply exceeds forty percent in described segments."},
        ],
    }],
    "speaker_notes": "• Emphasise discovery and scheduling friction.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P2_Mahboob_Khan_Baker_Hughes.mp4.txt",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "P3 — Product Owner, Shell"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 0, "text": [{"text": "Role context", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Talent and resourcing product ownership; enterprise policy constraints on channels."},
            {"level": 0, "text": [{"text": "Key evidence", "bold": True, "font_size_pt": 12}]},
            {"level": 1, "text": "Prioritisation across very high curriculum vitae volume; exploring HiredScore-style capabilities."},
            {"level": 1, "text": "Arabic character rendering failures in Workday Docs described as square glyphs."},
            {"level": 1, "text": "Official WhatsApp restricted for fraud and brand risk; prefers email, SMS, and Teams."},
        ],
    }],
    "speaker_notes": "• Capture policy divergence on messaging channels.\n\nReferences:\n• research/GCC/customer-transcripts/Interview_P3_Arika_Yamahata_Shell.txt",
})

# 32 Ideation section
slides.append(sec("0 8", "Ideation hub"))

# 33-36 Ideation quartet
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub — Overview"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Nine thousand nine hundred twenty-two ideas analysed under Talent Acquisition filter from internal P&T ideation export."},
            {"level": 1, "text": "Regional caveat: cells are not GCC-labelled; themes indicate global Talent Acquisition pressure."},
            {"level": 1, "text": "Use alongside customer interviews for prioritisation, not as GCC prevalence proof."},
            {"level": 1, "text": "Highest negative sentiment and effort indices align to communications, requisitions, application flow, and candidates and prospects."},
        ],
    }],
    "speaker_notes": "• Volume and sentiment are directional internal signals.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub — Top Capability Areas"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Communications and Notifications: one thousand four hundred fifty-two ideas."},
            {"level": 1, "text": "Job Requisitions: one thousand three hundred ninety-seven ideas."},
            {"level": 1, "text": "Candidate Job Application Flow: one thousand three hundred ninety-three ideas."},
            {"level": 1, "text": "Candidates and Prospects: one thousand two hundred twelve ideas."},
            {"level": 1, "text": "Offers, Compliance and Data Privacy, Career Sites, and Interviews follow in descending volume."},
        ],
    }],
    "speaker_notes": "• Pair with roadmap backlog themes for internal alignment.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation Hub — Key Themes"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Questionnaire granularity on requisitions; delete candidate pools; application progress accuracy."},
            {"level": 1, "text": "DocuSign pause on requisition approval; grid group column label overrides; dynamic offer filenames."},
            {"level": 1, "text": "These hypotheses require GCC validation probes rather than automatic roadmap commitment."},
            {"level": 1, "text": "Cross-reference with Themes one through six in thematic analysis for convergence."},
        ],
    }],
    "speaker_notes": "• Themes derived from verbatim and capability coding in ideation export.\n\nReferences:\n• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub — AI and Throughput"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Internal ideation includes Gen AI on Job Requisitions and recruiter throughput themes in high-volume rows."},
            {"level": 1, "text": "Customer interviews emphasise explainable matching, entitlements for Skills Cloud and HiredScore, and human review for AI-assisted ranking."},
            {"level": 1, "text": "Legal checkpoint applies to profiling and sensitive attributes; plan disclosures and assessments before commercial commitments."},
            {"level": 1, "text": "Position honestly against competitors that market broad AI hiring narratives."},
        ],
    }],
    "speaker_notes": "• Align AI story to licensed capabilities and governance.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 37 Thematic section
slides.append(sec("0 9", "Thematic analysis"))

# 38-39 Theme splits
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Validated Themes — Set One"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "T1 Funnel density and recruiter ergonomics: navigation tax, notes timing, funnel visibility, dashboards exporting to business intelligence."},
            {"level": 1, "text": "T2 Discovery, search, and AI-assisted matching: Boolean limits, database-wide match, prioritisation at scale, entitlements clarity."},
            {"level": 1, "text": "T3 Scheduling and compliance-aware orchestration: Outlook versus Workday scheduling trials; Saudi Arabia notice, consent, and panel metadata."},
            {"level": 1, "text": "T4 Offers, documents, and configuration agility: offer band rigidity, Arabic document rendering, structured uploads."},
        ],
    }],
    "speaker_notes": "• Themes grounded in customer quotes and codes.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Validated Themes — Set Two"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "T5 Nationalisation and local compliance reporting: quotas, penalties, custom fields, franchise spreadsheet workarounds."},
            {"level": 1, "text": "T6 Omnichannel communications and candidate journey: WhatsApp essential versus policy bans; partner campaigns; SMS positioning."},
            {"level": 1, "text": "Cross-theme insight: fewer tools, less export, clearer entitlements resonates across interviews."},
            {"level": 1, "text": "Divergence on messaging implies multi-tenant channel policy and audit trails rather than a single-channel bet."},
        ],
    }],
    "speaker_notes": "• Call out convergence and divergence explicitly.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 40 Triangulation matrix — simplified table (8 cols might be wide; use smaller font)
tri_rows = [
    ["Theme", "Customer", "Internal ideation", "Win-loss extract", "Convergence note"],
    ["Funnel ergonomics", "Strong", "High volume on candidates and apply flow", "No Gulf rows", "Customer plus internal"],
    ["Discovery and AI", "Strong", "Gen AI on reqs", "No Gulf rows", "Customer plus internal"],
    ["Scheduling", "Strong", "Interviews row volume", "No Gulf rows", "Customer plus competitive baseline"],
    ["Documents and offers", "Strong", "Offers and e-sign friction", "No Gulf rows", "Customer plus internal"],
    ["Nationalisation", "Strong", "Not GCC-specific in cells", "No Gulf rows", "Customer plus PESTEL"],
    ["Omnichannel comms", "Strong", "Comms notifications volume", "No Gulf rows", "Policy divergence across customers"],
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": tri_rows,
        "left_inches": 0.35,
        "top_inches": 1.15,
        "width_inches": 9.3,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Strongest confidence combines customer interviews with competitive baseline and PESTEL; Gulf win-loss extract is thin.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 41 Section before funnel
slides.append(sec("1 0", "Full funnel"))

# 42 Full funnel
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "GCC Recruiting Gap Analysis — Full Funnel"}},
    "text_boxes": [{
        **TB(),
        "paragraphs": [
            {"level": 1, "text": "Attract: career site branding and multi-hop apply — medium severity; partner redirects today."},
            {"level": 1, "text": "Convert: mobile and bilingual apply — medium severity; partner-hosted experiences."},
            {"level": 1, "text": "Screen: grid tabs and notes timing — high severity; process and security configuration plus user experience guidance."},
            {"level": 1, "text": "Schedule: Outlook friction and Saudi Arabia rules — high severity; Scheduling SKU positioning and compliance hints."},
            {"level": 1, "text": "Offer: rigidity and Arabic documents — high severity; offline contracts today."},
            {"level": 1, "text": "Comply: nationalisation reporting — high severity; custom fields and spreadsheets."},
            {"level": 1, "text": "Measure: dashboards and business intelligence spill-over — high severity; operational analytics gap."},
        ],
    }],
    "speaker_notes": "• Map severity to roadmap sequencing conversations.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
})

# 43 Roadmap section
slides.append(sec("1 1", "Roadmap"))

recs = [
    ("Nationalisation and workforce reporting", [
        "Elevate audit-ready nationalisation and workforce reporting with dimensions and report packs.",
        "Use honest Native, workaround, and true gap positioning from baseline threads; reduce custom-field and spreadsheet spill-over.",
        "Align presales claims with professional services patterns and tenant user acceptance testing.",
    ]),
    ("Candidate review and talent discovery", [
        "Reduce navigation tax on the candidate grid; strengthen Boolean and semantic discovery.",
        "Surface database-wide matches with explicit Skills Cloud and HiredScore entitlements and human-in-the-loop review.",
        "Address true gap on core semantic match without add-ons per latest competitive classification.",
    ]),
    ("Interview scheduling in Workday", [
        "Close Outlook friction; package Paradox value and Workday Scheduling SKU clearly separate from base Recruiting.",
        "Add configurable Saudi Arabia-style compliance hints for notice, consent, and panel metadata without legal over-claim.",
        "Validate self-scheduling and live calendar read claims with professional services and tenant testing across threads.",
    ]),
    ("Operational reporting in Recruiting", [
        "Improve Recruiting Hub and per-requisition funnel views for recruiters and leaders.",
        "Reduce reliance on exports and external business intelligence rebuilds.",
        "Role-based dashboards that reflect operational not only executive needs.",
    ]),
    ("WhatsApp, SMS, and verified channels", [
        "Address true gap where customer policy allows; maintain verified enterprise channels where restricted.",
        "For UAE and Saudi Arabia SMS, use third-party paths per latest thread; triangulate earlier Twilio narratives.",
        "Activate Paradox where licensed for conversational journeys.",
    ]),
    ("Qiwa and Mudad recruiting exchanges", [
        "Roadmap or package integration patterns for recruiting exchanges beyond payroll-only scope.",
        "Acknowledge regional bundle depth in competitive talk tracks.",
        "Document professional services implementation assumptions for true gap items.",
    ]),
]

short_titles = [
    "P1 — Nationalisation reporting",
    "P2 — Candidate review and discovery",
    "P3 — Interview scheduling",
    "P4 — Operational reporting",
    "P5 — Messaging channels",
    "P6 — Government exchanges",
]

for i, ((title, bullets), slide_title) in enumerate(zip(recs, short_titles)):
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt" if i % 2 else "Title Only",
        "placeholders": {"0": {"text": slide_title}},
        "text_boxes": [{
            **TB(),
            "paragraphs": [{"level": 1, "text": b} for b in bullets],
        }],
        "speaker_notes": "• Tie actions to evidence and risk notes in thematic report.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-027.md",
    })

# 50 Bumper
slides.append({
    "master_index": 1,
    "layout_name": "Bumper Slide",
})

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print(len(slides), "slides written to", OUT)
