#!/usr/bin/env python3
"""One-off builder for GCC PMF slides_spec_v32.json (GCC-E2E-032). Run from repo root."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "slides_spec_v32.json")

TB = lambda left, top, w, h, paras, fs=14, notes="": {
    "left_inches": left,
    "top_inches": top,
    "width_inches": w,
    "height_inches": h,
    "font_name": "Archivo",
    "font_size_pt": fs,
    "color": "ink",
    "paragraphs": paras,
}

def sec(nn: str, name: str):
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

def L0_bold(txt, pt=14):
    return {"level": 0, "text": [{"text": txt, "bold": True, "font_size_pt": pt}]}

def L1(s):
    return {"level": 1, "text": s}

def pi_run(text_after_prefix: str):
    """Product implication line: 12pt bold yellow per 010."""
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": text_after_prefix, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }

slides = []

# 1 TITLE
slides.append({
    "master_index": 1,
    "layout_name": "TITLE",
    "placeholders": {
        "0": {"text": "GCC Product-Market Fit Research"},
        "1": {"text": "March 2026"},
    },
})

# 2 Section - Research programme
slides.append(sec("0 1", "Research programme"))

# 3 Executive Summary
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Executive Summary"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L0_bold("Headline outcomes", 14),
        L1("GCC enterprise recruiting teams need governed speed: local channels, auditable nationalisation evidence, and hiring practices that match calendar and messaging habits without breaking global policy. Three customer programmes (Accenture, Baker Hughes, Shell) converge on scheduling friction, nationalisation pressure, discovery UX, and document or RTL risk in offers."),
        L1("Competitive validation (March 2026 scan) flags sales-risk lines on first-party WhatsApp in core UI, SMS without third-party CPaaS, Qiwa or Mudad recruiting out-of-the-box, MOHRE statutory out-of-the-box, and nationalisation executive dashboards out-of-the-box; self-scheduling with live M365 or Google is native when the Scheduling SKU is entitled."),
        L1("Internal ideation shows very high volume and negative sentiment in Communications and Interviews, directionally supporting channel and scheduling themes; presales gap export is sparse (one GCC row) so triangulation leans on interviews plus competitive intelligence."),
        L1("Q2 strategy (GCC readiness, AI matching, core ATS parity) aligns with convergent signals; tension remains where career site depth is deferred to Q3 while customers describe multi-hop apply journeys."),
    ], 14, notes=(
        "• Stress governed omnichannel vs one default channel.\n"
        "• Cite competitive scan date 28 March 2026.\n"
        "• Anchor OKR: 10 GCC wins baseline 3.\n\n"
        "References:\n"
        "• GCC PMF thematic analysis dated 28 March 2026 (internal research folder)\n"
        "• GCC competitive scan dated 28 March 2026 (internal research folder)\n"
        "• strategy/markdown/product-priorities-q2-2026.md"
    ))],
})

# 4 Section Research challenge
slides.append(sec("0 2", "Research challenge"))

# 5 Research Question
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Research Question & Objectives"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Determine where Workday Recruiting achieves product-market fit in GCC enterprise hiring, where statutory and social realities (nationalisation platforms, messaging norms, Arabic documents) strain the experience, and which roadmap bets best match Q2 strategy and winnable bake-offs."),
        L1("Objectives: triangulate customer interviews, internal ideation aggregates, presales gap signals, macro strategy inputs (PESTEL, SWOT), and a fresh competitive baseline scan; produce evidence-backed themes and RICE-scored recommendations with legal compliance notes."),
        L1("Scope: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman, and enterprise footprints that include GCC; exclude consumer ATS or non-Recruiting HCM depth except where adjacency affects hiring outcomes."),
        L1("Outputs for leadership: executive summary, macro factors, competitive landscape with SWOT, win or loss themes, ideation hotspots, per-customer evidence, validated themes, funnel gap table, and priority recommendations."),
    ], 14, notes=(
        "• Method: thematic analysis with multi-source triangulation.\n"
        "• Primary transcripts: three enterprise recruiting leaders.\n\n"
        "References:\n"
        "• Braun & Clarke (2006) thematic analysis methodology"
    ))],
})

# 6 Section Context
slides.append(sec("0 3", "Strategic context"))

# 7 Why GCC now
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Strategic Context - Why GCC Now"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Corporate OKR KR1 targets ten new GCC customer wins from a three-customer baseline; Q2 priorities explicitly anchor market readiness (channels, nationalisation, Arabic, boards) ahead of many nice-to-have marketing features."),
        L1("Nationalisation is operationalised through digital labour infrastructure (Qiwa, Mudad, MOHRE services), so hiring data quality and audit trails are board-visible, not annual spreadsheet exercises."),
        L1("Enterprise bake-offs pair global suites (SAP with SmartRecruiters, Oracle Fusion Recruiting) against bundled regional HR plus payroll narratives; differentiation requires honest statutory scope plus activation stories for Paradox, HiredScore, and Broadbean depth."),
        L1("Buyer committees increasingly ask how AI in hiring is governed; EU AI Act and GCC PDPL-class enforcement raise the bar for documentation, human oversight, and transfer tooling in multinational templates."),
    ], 14)],
})

# 8 Market momentum
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "GCC Market Momentum - Key Indicators"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Industry syntheses cite GCC HR tech markets growing at roughly nine to ten percent CAGR across overlapping definitions, with Astute Analytica pointing to about USD 5,483.5 million by 2032 and IMARC listing USD 760.8M in 2025 toward USD 1.76B by 2034 (segment variance applies)."),
        L1("Social digital penetration is extreme: DataReportal UAE 2025 cites about 99% internet penetration and roughly 195% mobile connection rate versus population; Saudi WhatsApp penetration narratives often quote about 97% of internet users."),
        L1("Cloud shift narratives suggest material enterprise IT spend moving to SaaS (commentary examples cite on the order of 42% UAE enterprise IT on cloud by late 2025 in some governance articles; validate per customer)."),
        L1("Vision 2030 labour statistics in press summaries reference on the order of 2.5M Saudis in the private sector with low single-digit unemployment in 2026 articles, tightening competition for compliant hiring tooling."),
    ], 14, notes=(
        "• Treat market numbers as directional; cite publishers in live readout.\n\n"
        "References:\n"
        "• GCC PESTEL analysis dated 28 March 2026 (internal research folder)\n"
        "• Ein Presswire Astute Analytica GCC HR tech (2026)\n"
        "• IMARC GCC HR Tech Market\n"
        "• DataReportal Digital 2025 UAE"
    ))],
})

# 9 Section Product strategy
slides.append(sec("0 4", "Product strategy"))

# 10 Q2 priorities
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Q2 2026 Product Priorities"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Priority 1 GCC market readiness: close gaps on candidate communication (WhatsApp, SMS), nationalisation compliance (Nitaqat, Emiratisation, Kuwait reporting), Arabic RTL and country-specific hiring steps, and GCC job boards via Broadbean where certified. Target: ten new GCC wins; zero product-related deal blockers in the GCC sales cycle."),
        L1("Priority 2 AI candidate matching: prove HiredScore ROI through activation with explainability for EU AI Act expectations where EU entities deploy. Target: five beta tenants by end Q2; about 20% time-to-fill improvement for beta cohort per strategy doc."),
        L1("Priority 3 Core ATS parity: bulk actions, mobile recruiter experience, background check integrations, and interview scheduling friction reduction via Paradox activation. Target: fewer missing basics objections; grid performance and reliability targets in strategy doc."),
    ], 14, notes=(
        "• Source: GCC strategy context dated March 2026.\n\n"
        "References:\n"
        "• GCC strategy context dated 28 March 2026 (internal research folder)\n"
        "• strategy/markdown/product-priorities-q2-2026.md"
    ))],
})

# 11 Regional expansion
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Regional Expansion Strategy"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("GCC: market entry focus; headline features WhatsApp, nationalisation, Arabic; target ten new wins."),
        L1("Japan: deepen penetration; two-step offer, APPI, LINE; five expansions."),
        L1("India: scale growth; DPDP, local boards; eight wins."),
        L1("Australia: maintain leader position; Fair Work, SEEK; three expansions."),
    ], 14)],
})

# 12 Competitive positioning
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Competitive Positioning - Workday"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Differentiation themes: suite depth (Recruiting plus Core HCM, Talent, Learning on one platform footprint); AI-powered matching and conversational scheduling when HiredScore and Paradox are activated; compliance-first global privacy posture and enterprise security; Fortune 500 scale hiring operations."),
        L1("Vulnerabilities to manage in bake-offs: job board coverage versus local expectations (mitigate via Broadbean depth); mobile recruiter experience versus some SAP scenarios; scheduling requires Paradox activation; GCC first-party WhatsApp and government portal narratives favour competitors unless workaround stories are crisp and PS-validated."),
        L1("Messaging: Enterprise GCC on Workday means one talent record, global governance, regional compliance via configuration, partners, and validated integrations; responsible AI with human-in-the-loop for EU and emerging MENA AI rules."),
    ], 14)],
})

# PESTEL section
slides.append(sec("0 5", "PESTEL"))

# Political (5 bullets + PI)
pol_bullets = [
    "Saudi Nitaqat and Saudization remain the dominant political lever; from 15 April 2026 employer compliance narratives emphasise Qiwa-documented electronic employment contracts as the basis for recognising Saudi headcount, and undocumented contracts risk exclusion from quotas plus visa and iqama friction.",
    "UAE Emiratisation targets escalate in 2026 narratives (for example about 10% skilled Emirati share in larger private employers) with MOHRE monitoring; published guides reference fines on the order of AED 9,000 monthly class per missing Emirati in many summaries, and fake Emiratisation enforcement is a visible theme.",
    "Qatar Law No. 12/2024 on private-sector job localisation introduces vacancy reporting, reserved roles, training obligations, and material fines; it complements the National Workforce Strategy 2024 to 2030 phase plan.",
    "Kuwaitization penalties and proposed higher fines (for example KD 300 framing in press) and sector targets continue to shape hiring plans; Oman Ministerial Resolution 411/2025 requires at least one Omani in foreign-owned establishments within defined windows with Social Protection Fund registration conditions.",
    "Digital government ties recruiting adjacency to Qiwa contract management structurally linked to Nitaqat credit, Mudad and WPS alignment increasing digital trace between payroll and contracts, and MOHRE service digitisation that raises expectations employer HR systems match data quality and timeliness.",
]
pol_paras = [L1(b) for b in pol_bullets] + [pi_run(
    "Workday Recruiting should prioritise auditable nationality, visa, and contract-status fields; executive dashboards and exception handling for Nitaqat, Emiratisation, and Qatarization risk; and integration roadmaps that align headcount, requisition, and offer data with Qiwa, Mudad, and MOHRE-driven timelines, because political enforcement now flows through digital labour infrastructure rather than annual spreadsheet exercises."
)]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Political"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.2, pol_paras, 12, notes=(
        "• Lead with platformisation of nationalisation.\n"
        "• If challenged on fines, cite MOHRE media centre and law firm guides.\n"
        "• Connect to customer quotes on penalties.\n"
        "• Note April 2026 Qiwa contract rule timing.\n"
        "• Emphasise board visibility of workforce evidence.\n\n"
        "References:\n"
        "• Saudi Gazette Nitaqat and Qiwa contracts\n"
        "• Pangea Worldwide Nitaqat update 2026\n"
        "• MOHRE media centre Emiratisation 2025\n"
        "• Mondaq Qatar Law 12/2024; Gulf News Kuwait; Oman Decree.om"
    ))],
})

econ_bullets = [
    "Astute Analytica wire summaries cite the GCC HR tech market reaching roughly USD 5.48 billion by 2032 at about 9.05% CAGR from a 2023 baseline in the USD 2.5B plus range, though publisher definitions vary and should be treated as directional.",
    "IMARC Group lists USD 760.8M in 2025 and about 9.45% CAGR to 2034, with a 2034 value of USD 1.76B; drivers repeatedly cited include cloud HCM, payroll digitisation, AI-assisted talent acquisition, SME adoption, and data-driven workforce planning.",
    "Enterprise spending commentary suggests material GCC IT budget shift to cloud; some SaaS governance articles cite on the order of 42% of UAE enterprise IT spend on cloud by end 2025, which should be validated per customer but signals procurement appetite for governed SaaS.",
    "Bundled TCO from regional HR plus payroll plus insurance vendors competes on price and local packaging, while global suites compete on depth, analytics, and global process standardisation, shaping how recruiting modules are pulled into decisions.",
    "Vision 2030 labour statistics in press summaries reference on the order of 2.5M Saudis in the private sector with unemployment around 2.8% in some 2026 articles, implying tight labour markets that reward faster, compliant hiring cycles.",
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Economic"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.2, [L1(b) for b in econ_bullets] + [pi_run(
        "Workday should frame GCC investment as participation in a structurally growing, cloud-shifted market where recruiting modules are pulled forward by payroll and statutory digitisation and AI narratives; economic buyers still require fast time-to-value proof for messaging, nationalisation, and mobile candidate journeys, or bundled regional suites win on TCO simplicity."
    )], 12, notes=(
        "• Pair CAGR bands with caveat on segment definitions.\n"
        "• Tie to OKR growth story without over-claiming single TAM.\n\n"
        "References:\n"
        "• Ein Presswire Astute Analytica GCC HR tech\n"
        "• IMARC GCC HR Tech Market"
    ))],
})

soc_bullets = [
    "WhatsApp penetration in Saudi Arabia is widely quoted at about 97% of internet users with 33M plus users in some 2026 articles, making messaging-first candidate journeys a social default rather than a niche channel preference.",
    "Recruitment martech blogs claim 90% plus WhatsApp open rates versus 20 to 25% email and materially faster hiring cycles when WhatsApp reminders replace email-only; treat as directional until measured in tenant A/B tests.",
    "DataReportal UAE 2025 cites 99% internet penetration and 195% mobile connection rate versus population; Statista and MENA summaries position GCC among the highest smartphone penetration sub-regions, often citing UAE above 97%.",
    "Operational hiring commonly requires Arabic plus English experiences; enterprise interviews cite Arabic rendering issues in generated documents as offer-blocking, so RTL and mixed-language templates are social expectations.",
    "DEI and non-discrimination themes appear in 2026 GCC labour update summaries alongside ESG harmonisation, increasing social licence pressure for transparent, fair hiring processes even where law is still evolving.",
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Social"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.2, [L1(b) for b in soc_bullets] + [pi_run(
        "Workday Recruiting must deliver mobile-first candidate journeys, WhatsApp-capable hiring steps native or via Paradox and CPaaS with audit, and Arabic plus RTL experiences that survive real offer documents, because social norms and device realities make email-only and English-only flows structurally uncompetitive in core GCC segments."
    )], 12, notes=(
        "• Contrast regional WhatsApp norm with enterprise anti-scam policies.\n\n"
        "References:\n"
        "• DataReportal Digital 2025 UAE\n"
        "• Statista smartphone MENA\n"
        "• Wuseller WhatsApp recruitment guide 2026"
    ))],
})

tech_bullets = [
    "GCC Global Capability Centres and enterprise IT commentary describe cloud-native delivery and AI-first operating patterns as 2026 defaults, raising baseline expectations for conversational and automated hiring features.",
    "Oracle documentation shows WhatsApp as a Recruiting Booster channel with Meta template governance; SAP markets AI across HCM including SmartRecruiters-for-SuccessFactors narratives in March 2026 press, so buyers arrive with checkbox lists.",
    "Workday public September 2025 Middle East expansion articles emphasise Dubai presence and enterprise AI platform narrative; data residency specifics remain customer-specific validation items in RFP legal reviews.",
    "Government platforms Qiwa, Mudad, and MOHRE push API-first compliance expectations; Broadbean remains the approved job-board strategy per product rules, so technological leverage is partner depth rather than bespoke board builds.",
    "Buyers expect AI in screening and scheduling but increasingly ask how AI capabilities are governed; Skills Cloud and HiredScore entitlements must be precise in demos to avoid AI-washing risk versus Zoho Zia-style claims.",
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Technological"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.2, [L1(b) for b in tech_bullets] + [pi_run(
        "Workday should activate HiredScore and Paradox with GCC configuration for language, templates, and holidays; document which AI flows are high-risk under customer jurisdictions; and invest in integration patterns with Studio, CPaaS, and audit logs that match government platform digitisation without promising non-validated native portal connectors."
    )], 12, notes=(
        "• Cite Oracle docs and SAP March 2026 release for competitive pressure.\n\n"
        "References:\n"
        "• Oracle Docs two-way WhatsApp Recruiting Cloud\n"
        "• Workday newsroom Middle East September 2025\n"
        "• Gartner Hype Cycle HR Technology 2024"
    ))],
})

env_bullets = [
    "January 2025 narratives describe a GCC Exchanges Committee initiative on unified ESG metrics for listed issuers, including workforce diversity, turnover, health and safety, and human rights themes in vendor and analyst summaries.",
    "ESRS S1 own-workforce disclosures are referenced globally as a benchmark; EU parents may consolidate GCC hiring metrics into group reporting, indirectly pressuring recruiting analytics completeness.",
    "No recruiting-product-specific GCC mandate comparable to EU green skills surge surfaced in this research cycle; environmental pressure on recruiting is indirect via group ESG reporting and employer brand.",
    "DATA GAP: limited peer-reviewed GCC-only statistics tie recruiting module investment directly to carbon or climate disclosure; treat sustainability linkage as emerging via industrial diversification programmes.",
    "Strongest near-term recruiting implication is ensuring diversity and hiring funnel metrics can feed enterprise ESG and people reporting, often via HCM analytics adjacent to Recruiting.",
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Environmental"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.2, [L1(b) for b in env_bullets] + [pi_run(
        "Workday Recruiting should ensure diversity, requisition, and hiring funnel metrics can feed enterprise ESG and people reporting, often via HCM analytics, whilst acknowledging no standalone recruiting carbon mandate was identified; monitor listed-company GCC disclosure rules for future workforce acquisition metrics."
    )], 12, notes=(
        "• Acknowledge indirect ESG path honestly.\n\n"
        "References:\n"
        "• Ecodrisil GCC unified ESG metrics commentary\n"
        "• EFRAG ESRS S1 knowledge hub"
    ))],
})

legal_bullets = [
    "UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (in force 2 January 2022) establishes lawful basis, purpose limitation, security, breach notification, cross-border transfer rules, and data subject rights in secondary analyses; DIFC and ADGM maintain separate GDPR-style laws with employment-specific consent nuance.",
    "Saudi PDPL under Royal Decree M/19 of 2021 as amended M/148 of 2023 applies broadly and extra-territorially to Saudi residents data; grace period ended September 2024 and SDAIA enforcement narratives reference violation decisions and fines up to SAR 5 million class per Article 36 themes in legal summaries.",
    "GDPR Articles 5, 6, 9, 13 to 14, 17, 20, 22, 35, 44 to 50, and 83 remain in scope for EU parents and EU candidates; recruiting AI use cases map to high-risk themes under EU AI Act Annex III employment narratives with obligations on risk management, logging, transparency, and human oversight.",
    "UAE commentary describes a March 2026 national AI law framework with tiered risk, audits, bias testing, and explainability duties for high-risk hiring algorithms in secondary guides; verify primary legal text before contractual commitments.",
    "Cross-border candidate flows lack EU adequacy for most GCC states in public summaries; expect SCCs plus transfer impact assessment patterns where EU or UK data subjects apply to GCC entities or vice versa, alongside labour-law-sensitive scheduling rules expressed as configurable policy with evidence trails.",
]
legal_pi = (
    "Workday Recruiting must ship granular lawful-basis and consent capture for candidate and sensitive categories, transparent privacy content in Arabic and English, configurable retention and purge aligned to Saudi PDPL and UAE PDPL, and processor disclosure packs for RFPs. "
    "AI-assisted matching via HiredScore requires human review UX, candidate-facing disclosure, audit logs, and DPIA or FRIA collateral for EU customers and high-risk deployments, satisfying GDPR Articles 13 to 14, 17, 20, 22, 35, 44 to 50 and AI Act oversight expectations where applicable. "
    "Cross-border flows need documented transfer tools when EU or UK data subjects apply to GCC entities or vice versa; labour-law-sensitive scheduling rules should be configurable policy with evidence trails."
)
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Legal"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.4, [L1(b) for b in legal_bullets] + [pi_run(legal_pi)], 12, notes=(
        "• Position as enablement, not legal advice.\n"
        "• Flag Annex III recruitment AI for HiredScore narratives.\n\n"
        "References:\n"
        "• UAE Federal Decree-Law 45/2021 portal\n"
        "• IAPP Saudi enforcement; A&O Shearman PDPL enforcement\n"
        "• GDPR Art. 22 gdpr-info.eu\n"
        "• EU AI Act explorer artificialintelligenceact.eu"
    ))],
})

# Competitive landscape
slides.append(sec("0 6", "Competitive landscape"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Regional Specialists - GCC"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "GCC Fit", "Notes"],
            ["Bayzat", "GCC-first HRMS with payroll and hiring; Mudad and WPS narratives on vendor pages; mobile apply and scheduling marketing; bundle TCO story versus global suites", "Mid-market scope versus enterprise security depth; narrower global footprint; integration depth varies by tenant", "Strong statutory adjacency", "Direct platform competitor in KSA and UAE commercial segments"],
            ["HiBob", "Bob Hiring integrated ATS since April 2024; March 2026 Nucleus Research Enterprise HCM Value Matrix Accelerator placement", "Mid-market HCM breadth versus deepest enterprise recruiting configuration; GCC office not headline in this competitive scan", "Growing GCC presence", "Checklist competitor in modern HCM plus hiring deals"],
            ["Zoho Recruit", "Value ATS with Twilio and WhatsApp patterns; Zia semantic match marketing; active What is New cadence in 2026", "Enterprise governance and global hire-to-retire depth versus Workday; services intensity varies", "High smartphone market overlap", "Differentiate on audit, security design, and suite record"],
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
    "speaker_notes": (
        "• Plain semicolon cells per style guide.\n"
        "• Cite competitive scan refresh date 28 March 2026.\n\n"
        "References:\n"
        "• GCC competitive scan dated 28 March 2026 (internal research folder)"
    ),
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Global Platforms - Enterprise ATS"}},
    "tables": [{
        "rows": [
            ["Vendor", "Key Strengths", "Key Weaknesses", "GCC Fit", "Notes"],
            ["SAP SuccessFactors", "March 2026 SmartRecruiters for SuccessFactors single login; Winston and Joule in hiring narratives; deep HCM installed base", "Integration and GCC statutory honesty still require deal-specific validation; AI claims need entitlement clarity", "Strong in enterprise RFPs", "Checkbox AI and suite story versus Workday"],
            ["Oracle Fusion Recruiting", "26A readiness index; WhatsApp via Recruiting Booster plus messaging provider and Meta templates; Redwood UX momentum", "Total cost includes Booster and provider stack; implementation depth varies", "Omnichannel pressure in GCC", "Compare TCO and governance story carefully"],
            ["Workday", "Unified HCM and Recruiting; native grid; self-scheduling with Scheduling SKU when entitled; Paradox and HiredScore when activated", "True gap lines on first-party WhatsApp, several statutory OOTB items, and nationalisation executive dashboards per conservative product capability research (March 2026)", "Enterprise GCC HQ standardisation", "Lead with honest scope plus activation plays"],
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
    "speaker_notes": "• Align claims to March 2026 product capability research and presales validation.\n\nReferences:\n• GCC competitive scan dated 28 March 2026 (internal research folder)",
})

swot_s = (
    "• Suite integration and HCM adjacency for hire-to-retire governance\n"
    "• Enterprise security, audit, and GDPR-class tooling for RFP legal reviews\n"
    "• HiredScore and Paradox when activated for volume and scheduling\n"
    "• Multi-country templates for GCC HQs standardising policy with local fields\n"
    "• Broadbean-certified job-board strategy avoiding native board sprawl"
)
swot_w = (
    "• WhatsApp and omnichannel gap risk until SKU and UAT clarity lands\n"
    "• Government portal and nationalisation executive experience wants native-feeling dashboards\n"
    "• Arabic and RTL document fidelity historically trust-breaking for some tenants\n"
    "• SMS and messaging framework answers drift across internal capability research notes; triangulate before claims\n"
    "• Semantic AI match without add-ons creates demo risk if sellers imply free parity"
)
swot_o = (
    "• Q2 GCC OKR tailwinds tie features to permit and fine avoidance narratives\n"
    "• PDPL plus AI governance differentiation if collateral is credible and fast\n"
    "• Paradox and HiredScore activation programmes convert latent entitlement\n"
    "• Broadbean depth closes integration objections without native board builds\n"
    "• Dubai expansion improves local execution credibility with partners"
)
swot_t = (
    "• Regional bundle competitors win TCO on payroll plus compliance packaging\n"
    "• Oracle and SAP feature marketing on WhatsApp and AI in enterprise RFPs\n"
    "• Legal and AI compliance burden slows roadmaps if legal review is not pre-staged\n"
    "• Inconsistent capability answers erode trust if sales over-rotates single threads\n"
    "• Global policy forbidding casual WhatsApp may block GCC UX without approved channels"
)
slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Competitive SWOT - Workday GCC"}},
    "tables": [
        {
            "rows": [["Strengths", "Weaknesses"], [swot_s, swot_w]],
            "top_inches": 1.0,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
        {
            "rows": [["Opportunities", "Threats"], [swot_o, swot_t]],
            "top_inches": 3.15,
            "font_size_pt": 9,
            "header_row": True,
            "header_bg_color": "ink",
            "header_font_color": "paper",
            "header_height_inches": 0.25,
        },
    ],
    "speaker_notes": (
        "• SWOT sourced from March 2026 strategy context; reconcile with fresh scan.\n\n"
        "References:\n"
        "• GCC SWOT analysis dated 28 March 2026 (internal research folder)"
    ),
})

# Win/Loss
slides.append(sec("0 7", "Win / Loss"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss: Top Gap Themes"}},
    "tables": [{
        "rows": [
            ["Theme", "Severity", "Buyer evidence", "Product implication"],
            [
                "Omnichannel messaging (WhatsApp, SMS)",
                "High (competitive + customer)",
                "Ammad Alsairafi (Accenture): WhatsApp described as essential for immediate responses; Mahboob Khan (Baker Hughes): campaign channel limits versus Phenom-class messaging; competitive scan flags True Gap on first-party WhatsApp and WMS-only external SMS without CPaaS",
                "Ship governed WhatsApp and SMS paths with audit, tenant policy toggles, and PS-validated enablement per March 2026 scan",
            ],
            [
                "Statutory and nationalisation executive reporting",
                "High",
                "Mahboob Khan (Baker Hughes): penalties if localisation targets missed; scan flags True Gap on nationalisation executive dashboards OOTB and MOHRE statutory OOTB; political section cites fines and Qiwa linkage",
                "Invest in OOTB dashboard and report packs with role-based access and minimisation reviews for sensitive cuts",
            ],
            [
                "Interview scheduling and Microsoft ecosystem",
                "Medium (presales S5)",
                "PG-00009165: GCC populations and Outlook, Teams, HiredScore scheduling narrative; Ammad Alsairafi (Accenture): in-flow regulatory warnings for KSA notice; Mahboob Khan (Baker Hughes): Outlook felt simpler than Workday scheduling",
                "Clarify Scheduling SKU plus Paradox story; improve perceived ease; validate GCC calendar assumptions with PS",
            ],
            [
                "Semantic AI discovery versus keyword core",
                "Medium (demo risk)",
                "Mahboob Khan (Baker Hughes): database-wide match appetite; Arika Yamahata (Shell): HiredScore interest for high volume; scan classifies semantic without Skills Cloud or HiredScore as workaround not free semantic",
                "Activation and buyer-clear keyword versus semantic story with human oversight collateral",
            ],
        ],
        "left_inches": 0.3,
        "top_inches": 1.0,
        "width_inches": 9.4,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": (
        "• N equals one presales row; position as sparse corroboration.\n"
        "• Use real names for VP credibility.\n\n"
        "References:\n"
        "• GCC presales gap analysis dated 28 March 2026 (internal research folder)"
    ),
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Win/Loss: Theme Frequency"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Messaging", "Statutory dashboards", "Scheduling or Teams", "Semantic AI demo"],
        "series": [{"name": "Weight", "values": [4.0, 3.5, 2.5, 2.0]}],
        "title": "Gap theme weight (qualitative)",
        "left_inches": 0.7,
        "top_inches": 1.45,
        "width_inches": 9.0,
        "height_inches": 3.2,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "text_boxes": [TB(0.7, 4.75, 8.6, 0.7, [
        L1("Scores are qualitative weights combining customer intensity, competitive True Gap flags, and presales severity (N equals one row)."),
    ], 12)],
    "speaker_notes": "• Explain qualitative weighting; avoid implying statistical frequency.\n\nReferences:\n• Presales gap export March 2026; GCC PMF thematic report March 2026",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Win/Loss: GCC & EMEA Proxy"}},
    "tables": [{
        "rows": [
            ["Gap ID", "Theme", "Region marker", "Severity", "Notes"],
            [
                "PG-00009165",
                "Interview scheduling; Outlook; Teams; HiredScore experience",
                "GCC explicit in pain text",
                "S5 tolerable manual effort",
                "Pair with customer quotes on Outlook-comparison and KSA notice rules; validate native Scheduling SKU coverage with PS",
            ],
            [
                "EMEA proxy",
                "Calendar integrations and self-scheduling entitlement clarity",
                "Broader enterprise pattern",
                "n/a",
                "Use where GCC row sparse; still triangulate with March 2026 Scheduling SKU research",
            ],
            [
                "Competitive",
                "Oracle WhatsApp Booster packaging",
                "GCC RFP checkbox risk",
                "n/a",
                "Compare total cost of Booster plus provider plus Redwood prerequisites",
            ],
            [
                "Competitive",
                "SAP SmartRecruiters unified hiring narrative",
                "Global enterprise",
                "n/a",
                "Probe integration depth and GCC statutory honesty alongside AI story",
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
    "speaker_notes": "• Transparent about small presales N.\n\nReferences:\n• Presales gap export March 2026; GCC competitive scan March 2026",
})

# Ideation Hub
slides.append(sec("0 8", "Ideation hub"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub: Overview"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Internal P&T ideation export for Talent Acquisition slice reports about 9,922 idea records in dashboard metadata (March 2026 workbook snapshot); overall sentiment about negative 0.164 and effort strain about negative 1.23 on derived scores."),
        L1("Top capability hotspots by volume include Communications and Notifications (about 1,452), Job Requisitions (about 1,397), Candidate Job Application Flow (about 1,393), Candidates and Prospects (about 1,212), Offers (about 922), and Interviews (about 476)."),
        L1("Caveat: workbook stores dashboard tiles and partial verbatim tables; sampled lines rarely mention GCC keywords, so this block is hypothesis fuel for customer validation, not regional truth."),
    ], 14, notes=(
        "• Stress internal-only interpretation.\n\n"
        "References:\n"
        "• GCC brainstorm analysis dated 28 March 2026 (internal research folder)"
    ))],
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Ideation: Top Capability Areas"}},
    "charts": [{
        "chart_type": "bar",
        "categories": ["Comms", "Requisitions", "Apply flow", "Candidates", "Offers", "Interviews"],
        "series": [{"name": "Ideas", "values": [1452, 1397, 1393, 1212, 922, 476]}],
        "title": "Idea volume by capability (export)",
        "left_inches": 0.7,
        "top_inches": 1.45,
        "width_inches": 9.0,
        "height_inches": 3.2,
        "has_legend": False,
        "category_axis_font_size_pt": 9,
        "value_axis_font_size_pt": 9,
        "title_font_size_pt": 10,
    }],
    "speaker_notes": "• Numbers from internal brainstorm synthesis March 2026.\n\nReferences:\n• GCC brainstorm analysis dated 28 March 2026 (internal research folder)",
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Ideation Hub: Key Themes"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.0, [
        L0_bold("Comms-Channel", 14),
        L1("Internal Communications and Notifications row shows highest volume and among the most negative sentiment and effort in the capability table."),
        L1("Sample pattern: recruiters ask for clearer channel and notification control at high volume."),
        L1("Implication: aligns with customer WhatsApp and SMS pain; validate with GCC interviews."),
        L0_bold("Apply-Config", 14),
        L1("Verbatims emphasise per-requisition questionnaire granularity and honest progress UX versus misleading step counts."),
        L1("Quote pattern: frustration when full questionnaire packs apply to narrow roles."),
        L1("Implication: partner with career site Q3 scope; near-term fix mobile and apply hygiene."),
        L0_bold("Offer-Compliance", 14),
        L1("Offers and Compliance rows show sustained negative sentiment in aggregates."),
        L1("Themes include document naming, cross-border naming fields, and inline signing desires."),
        L1("Implication: pairs with Arabic RTL and offer agility recommendations."),
    ], 12, notes=(
        "• Three themes with three bullets each per PMF deck standard.\n\n"
        "References:\n"
        "• GCC brainstorm analysis dated 28 March 2026 (internal research folder)"
    ))],
})

# Primary research
slides.append(sec("0 9", "Primary research"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "GCC Customer Research Programme"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 2.8, [
        L1("Population: three senior recruiting leaders from GCC-focused enterprises across professional services, oilfield services, and integrated energy."),
        L1("Regional relevance: organisations with substantial Middle East hiring operations and multinational governance constraints."),
        L1("Timing: research conducted March 2026; transcripts read end to end for this analysis cycle."),
        L1("Method: in-depth semi-structured interviews on hiring practices, compliance needs, messaging channels, scheduling, discovery UX, reporting, and document quality."),
        L1("Triangulation: cross-checked with internal ideation aggregates, sparse presales gap export, macro strategy analysis (PESTEL, SWOT), and March 2026 competitive baseline scan."),
        L1("Limitation: SME transcript folder empty for this research cycle; expand with consultant and presales interviews next."),
    ], 14)],
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Interview Participants"}},
    "tables": [{
        "rows": [
            ["Participant", "Role", "Organisation"],
            ["P1", "Recruitment Lead (Cyber Security & Campus Hiring)", "Accenture"],
            ["P2", "Performance and Innovation Manager, Talent Acquisition", "Baker Hughes"],
            ["P3", "Product Owner, Talent and Resourcing", "Shell"],
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
    "speaker_notes": "• P labels match PMF report for traceability.\n\nReferences:\n• GCC PMF thematic analysis participant roster March 2026",
})

def customer_slide(pid, company, title_short, themes_quotes_jtbds, use_alt: bool):
    """themes_quotes_jtbds: list of (theme_header, [quote bullets], [jtbd bullets])"""
    paras = []
    for th, quotes, jtbds in themes_quotes_jtbds:
        paras.append(L0_bold(th, 14))
        for q in quotes:
            paras.append(L1(q))
        for j in jtbds:
            paras.append(L1(j))
    return {
        "master_index": 1,
        "layout_name": "Title Only_Alt" if use_alt else "Title Only",
        "placeholders": {"0": {"text": f"{pid} - {title_short}, {company}"}},
        "text_boxes": [TB(0.7, 1.2, 8.6, 3.0, paras, 12, notes=(
            f"• Stress strongest theme for {pid} in live readout.\n"
            "• Keep quotes short; full text in transcript files.\n\n"
            "References:\n"
            "• research/GCC/customer-transcripts/"
        ))],
    }

slides.append(customer_slide(
    "P1", "Accenture", "Recruitment Lead",
    [
        (
            "Compliance-aware scheduling",
            [
                '"If you are building a scheduling tool it would not block you but it will give you a notification in red you are not meeting the regulatory requirements." - insight on KSA guardrails (P1, Accenture)',
                '"If capability is added to Workday directly where we can schedule interviews it will be a lot better." - desire for in-product scheduling (P1, Accenture)',
            ],
            [
                "When I schedule interviews in KSA, I want in-flow warnings and documented exceptions, so I can avoid silent regulatory breaches.",
                "When hiring managers propose short-notice panels, I want consent captured in-system, so audits survive ministry scrutiny.",
            ],
        ),
        (
            "Omnichannel and operations",
            [
                '"WhatsApp is an absolute necessary you get immediate responses." - channel reality (P1, Accenture)',
                '"Every time we say we need this included we are given a two months deadline for developers offline contract." - offer agility pain (P1, Accenture)',
            ],
            [
                "When candidates ignore email, I want governed messaging paths, so I can sustain response rates without shadow IT.",
            ],
        ),
    ],
    False,
))

slides.append(customer_slide(
    "P2", "Baker Hughes", "TA Manager",
    [
        (
            "Discovery at volume",
            [
                '"Can most of the important information be integrated into a single tab when they are trying to go through 100 candidates or 200 candidates." - grid density (P2, Baker Hughes)',
                '"The system did not allow me to move candidates unless I am tagged to those requisitions five to ten minutes to assign the roles." - cross-req friction (P2, Baker Hughes)',
            ],
            [
                "When I review hundreds of applicants, I want one dense review surface, so I can decide faster with fewer tab switches.",
                "When I lead a req, I want to move talent across reqs without security theatre, so I do not lose hours to role tagging.",
            ],
        ),
        (
            "Nationalisation and channels",
            [
                '"We get penalties if we do not meet localization percentage." - stakes (P2, Baker Hughes)',
                '"Workday scheduling felt more complicated than scheduling a meeting via Outlook." - calendar comparison (P2, Baker Hughes)',
            ],
            [
                "When executives ask for workforce proof, I want dashboards that feel native, so I stop rebuilding Excel every quarter.",
            ],
        ),
    ],
    True,
))

slides.append(customer_slide(
    "P3", "Shell", "Talent Product Owner",
    [
        (
            "Reporting and franchise reality",
            [
                '"We did have to resort building a dashboard separately in PowerBI because the dashboard capabilities of Workday was not able to accommodate what we needed." - analytics gap (P3, Shell)',
            ],
            [
                "When leadership asks for multi-slice TA views, I want trustworthy in-product cuts, so I can retire shadow BI for standard questions.",
                "When franchise GCC volumes are small, I want lightweight auditable core data, so local compliance does not live only in spreadsheets.",
            ],
        ),
        (
            "Documents, RTL, and channel policy",
            [
                '"Arabic letters it would just be squares rather than the actual characters." - historical Docs risk (P3, Shell)',
                '"We are not supposed to use WhatsApp for official business because of scammers." - policy divergence (P3, Shell)',
            ],
            [
                "When offers must be bilingual, I want reliable Arabic rendering, so candidates trust the packet they sign.",
            ],
        ),
    ],
    False,
))

# Thematic analysis
slides.append(sec("1 0", "Thematic analysis"))

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Validated Themes 1-3 (GCC Core)"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.0, [
        L0_bold("Local compliance and interview rules", 14),
        L1("Key insight: KSA notice, panel metadata, and documented exceptions show up as explicit recruiter needs; political enforcement flows through Qiwa-linked contracts and MOHRE dashboards."),
        L1("Business impact: fines and permit risk concentrate executive attention; weak evidence breaks trust in nationalisation programmes."),
        L1("Product implications: configurable guardrails paired with Paradox and Scheduling SKU positioning; avoid implying legal advice in UI copy."),
        L0_bold("Omnichannel engagement and governance", 14),
        L1("Key insight: two customers position WhatsApp as essential; one global enterprise restricts WhatsApp for fraud and brand protection."),
        L1("Business impact: win rates hinge on credible governed messaging architecture versus competitors marketing native channels."),
        L1("Product implications: tenant policy toggles, audited threads, CPaaS paths, and clear SKU boundaries for SMS."),
        L0_bold("Recruiter discovery and efficiency", 14),
        L1("Key insight: tab sprawl, boolean limits, stage-locked notes, and assignee friction slow high-volume review."),
        L1("Business impact: recruiter time-on-task erodes NPS and strengthens point ATS stories in bake-offs."),
        L1("Product implications: grid density, search investment, lead cross-req patterns with security review, and honest AI entitlement story."),
    ], 12)],
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Validated Themes 4-7 (Depth & Tension)"}},
    "text_boxes": [TB(0.7, 1.2, 8.6, 3.0, [
        L0_bold("Scheduling and calendar reality", 14),
        L1("Key insight: Outlook comparison persists; presales row ties GCC to Teams and HiredScore scheduling experience."),
        L1("Business impact: calendar friction shows up in speed-to-interview metrics and hiring manager satisfaction."),
        L1("Product implications: enablement on Scheduling SKU; simplify perceived steps; validate GCC-specific calendar behaviour with PS."),
        L0_bold("Reporting and franchise roll-up", 14),
        L1("Key insight: global enterprise leans on PowerBI when in-product dashboards cannot answer executive cuts; franchise GCC may be Excel-led."),
        L1("Business impact: shadow analytics increases governance risk and slows decisions."),
        L1("Product implications: Prism and report packs for TA leadership; franchise-aware templates."),
        L0_bold("Offers, documents, Arabic fidelity", 14),
        L1("Key insight: historical Arabic glyph failures block trust; offer configuration delays push offline contracts."),
        L1("Business impact: offer errors are brand and legal exposure in KSA and UAE operational hiring."),
        L1("Product implications: RTL hardening for Docs; faster safe extension path for offer variants."),
        L0_bold("Career site and apply tension", 14),
        L1("Key insight: multi-hop Phenom to Workday apply pain and high mobile share collide with Q3 career site deferral."),
        L1("Business impact: leakage in apply funnel shows up as cost per hire and sourcing efficiency."),
        L1("Product implications: partner optimisation and mobile apply hygiene now; explicit Q3 scope for deeper redesign."),
    ], 12)],
})

slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
    "tables": [{
        "rows": [
            ["Theme", "P1", "P2", "P3", "Ideas", "Impact"],
            ["Compliance & interviews", "Strong", "Medium", "Low", "Interviews strain", "High"],
            ["Omnichannel", "High", "High", "Policy limit", "Comms volume", "Critical"],
            ["Discovery UX", "Medium", "High", "AI interest", "Candidates volume", "High"],
            ["Scheduling", "High", "High", "Ops", "Interviews", "High"],
            ["Reporting", "Low", "Medium", "High", "Noise", "Medium"],
            ["Offers / RTL", "High", "Low", "High", "Offers neg", "High"],
            ["Apply / career site", "Low", "High", "Low", "Career sites", "Tension"],
        ],
        "left_inches": 0.25,
        "top_inches": 1.0,
        "width_inches": 9.5,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• Qualitative convergence labels, not statistics.\n\nReferences:\n• GCC PMF thematic triangulation matrix March 2026",
})

# Gap analysis funnel
slides.append(sec("1 1", "Full funnel"))

gap_rows = [
    ["Attract", "Job board and posting depth versus local lists; Broadbean strategy must be explicit in bake-offs", "Medium", "Broadbean partner expansion; avoid promising native boards", "Mahboob Khan (Baker Hughes) on funnels", "Deepen certified board coverage messaging"],
    ["Convert", "Mobile apply and multi-hop partner apply journeys; career site scope tension with Q3 deferral", "Medium", "Partner optimisation now; scoped Q3 roadmap", "P2 Phenom chain; strategy Q3 note", "Ship mobile hygiene fixes; clarify timeline"],
    ["Screen", "Semantic AI expectations versus keyword core; HiredScore activation clarity", "Medium", "HiredScore beta; explainability pack", "P2 database match; P3 volume", "Run activation plays with legal collateral"],
    ["Schedule", "Outlook comparison; KSA notice and panel metadata; Teams ecosystem", "High", "Scheduling SKU; Paradox; configurable warnings", "P1 red warning; P2 Outlook; PG-00009165", "PS validation March 2026"],
    ["Offer", "Offer agility and offline contracts; Arabic RTL in documents", "High", "Faster safe extensions; RTL regression suites", "P1 two-month dev; P3 squares", "Legal sign-off on templates"],
    ["Comply", "Nationalisation dashboards and MOHRE statutory OOTB honesty", "High", "Executive packs; custom report patterns until native", "P2 penalties; PESTEL fines", "DAP on sensitive dimensions"],
    ["Measure", "Executive dashboards insufficient; PowerBI shadow analytics", "Medium", "Prism slices; TA leadership templates", "P3 PowerBI", "Reduce shadow BI for standard questions"],
]
gap_table = [["Funnel Stage", "Gap", "Severity", "Workaround", "Evidence", "Product implication"]] + [
    [r[0], r[1], r[2], r[3], r[4], r[5]] for r in gap_rows
]

slides.append({
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Gap Analysis"}},
    "tables": [{
        "rows": gap_table,
        "left_inches": 0.2,
        "top_inches": 1.0,
        "width_inches": 9.6,
        "font_size_pt": 7,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": (
        "• Gap severities aligned to March 2026 PMF synthesis and conservative product capability research; triangulate with presales and UAT before customer commitments.\n"
        "• Strong configuration paths may reduce perceived severity in sales conversations; True Gap lines retained where OOTB executive experience is the buyer ask.\n\n"
        "References:\n"
        "• GCC PMF thematic analysis dated 28 March 2026 (internal research folder)\n"
        "• GCC competitive scan dated 28 March 2026 (internal research folder)"
    ),
})

# Roadmap
slides.append(sec("1 2", "Roadmap"))

rice_rows = [
    ["1", "Governed GCC omnichannel", "Audited WhatsApp and SMS paths", "5,000", "3.0", "80%", "8", "1,500"],
    ["2", "Compliance-aware scheduling", "Paradox plus SKU plus KSA or UAE rules", "4,500", "2.75", "75%", "6", "1,547"],
    ["3", "Nationalisation executive reporting", "OOTB dashboards and packs", "4,000", "2.875", "70%", "9", "894"],
    ["4", "Recruiter velocity", "Grid, search, notes, cross-req", "5,000", "2.25", "80%", "10", "900"],
    ["5", "Arabic RTL offers and docs", "RTL hardening for Docs", "3,500", "2.75", "65%", "7", "893"],
    ["6", "HiredScore clarity", "Activation and semantic story", "4,000", "2.5", "75%", "4", "1,875"],
]
slides.append({
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
    "tables": [{
        "rows": [["#", "Title", "Action", "Reach", "I", "C", "E", "RICE"]] + [r for r in rice_rows],
        "left_inches": 0.25,
        "top_inches": 1.0,
        "width_inches": 9.5,
        "font_size_pt": 8,
        "header_row": True,
        "header_bg_color": "ink",
        "header_font_color": "paper",
        "header_height_inches": 0.25,
    }],
    "speaker_notes": "• RICE from PMF report; I shown as composite shorthand for exec table.\n\nReferences:\n• PMF report recommendations table dated 28 March 2026",
})

recs = [
    (
        "Governed GCC Omnichannel",
        "Customers need fast candidate response while global enterprises may restrict consumer messaging apps; conservative product research flags True Gap on first-party WhatsApp in core UI and on external SMS without CPaaS when only Workday Messaging is considered.",
        "Ammad Alsairafi (Accenture) stresses WhatsApp immediacy; Mahboob Khan (Baker Hughes) compares campaign channels to Phenom-class messaging; March 2026 scan reinforces sales-risk lines on SMS and WhatsApp.",
        "Deliver audited WhatsApp and SMS paths via core or approved Paradox and CPaaS architecture with tenant policy toggles, consent capture, subprocessors disclosure, and retention aligned to PDPL-class regimes.",
        "Q2 OKR KR1 and competitive checkbox pressure make this a now decision; delays concede bake-offs to Oracle WhatsApp packaging and regional bundles.",
        "GCC win rate versus Oracle or SAP on messaging demos; candidate response rate proxy in pilot tenants; reduction in shadow messaging tools reported by CS.",
    ),
    (
        "Compliance-Aware Scheduling",
        "Recruiters compare in-product scheduling to Outlook; KSA practices expect notice periods, panel metadata, and documented shorter-notice consent; presales row PG-00009165 ties GCC to Teams and HiredScore scheduling narrative.",
        "P1 describes red-warning guardrails; P2 states Outlook felt simpler; PG-00009165 severity five mentions GCC populations with Microsoft stack friction.",
        "Pair Paradox and Scheduling SKU enablement with configurable KSA and UAE rules, soft-block UX, and evidence trails for exceptions without claiming legal advice.",
        "Statutory digitisation through Qiwa and MOHRE raises expectations that hiring systems surface the same rigour as workforce systems.",
        "Time from invite to confirmed interview; reduction in manual coordinator touches; hiring manager self-service slot adoption.",
    ),
    (
        "Nationalisation Executive Reporting",
        "Boards and ministries expect auditable nationality and hiring-source evidence; customers describe penalties; conservative research flags True Gap on nationalisation executive dashboards OOTB.",
        "Mahboob Khan (Baker Hughes) cites localisation penalties; PESTEL cites AED-class fines and Nitaqat platformisation.",
        "Ship executive dashboard and report pack patterns for Nitaqat and Emiratisation-style evidence with role-based access, minimisation reviews, and export labelling.",
        "Political enforcement now flows through platforms rather than spreadsheets, increasing urgency for coherent recruiting plus HCM cuts.",
        "Hours per month spent rebuilding Excel roll-ups; audit findings on workforce composition reporting; customer satisfaction on compliance reviews.",
    ),
    (
        "Recruiter Velocity Parity",
        "High-volume review suffers tab sprawl, boolean limits, stage-locked notes, and assignee friction moving leads across requisitions.",
        "P2 asks for single-tab density; P1 cites minutes lost to assignee tagging; internal ideation shows high volume in Candidates and Requisitions rows.",
        "Invest in grid density, stronger search, pre-screen notes behaviour, and lead cross-req patterns with security and DAP review.",
        "Core ATS parity is Q2 Priority 3; weaknesses here appear in every enterprise demo loop.",
        "Recruiter time on candidate review tasks; NPS KR3 contribution; win themes in competitive debriefs.",
    ),
    (
        "Arabic RTL Offers and Docs",
        "Arabic rendering failures in generated documents historically blocked offers; offer configuration delays push offline contracts.",
        "P3 cites squares instead of Arabic glyphs; P1 cites two-month developer cycles for offer exceptions.",
        "RTL hardening for Workday Docs in GCC pilots with regression suites for Arabic glyphs and bilingual version control with legal sign-off.",
        "Priority 1 Arabic RTL in Q2 strategy aligns directly with customer trust stories.",
        "Offer defect rates in Arabic templates; time to produce compliant bilingual packets; candidate support tickets on document readability.",
    ),
]

for i, (rt, prob, ev, rec, why, metrics) in enumerate(recs, 1):
    title = f"Recommendation {i}: {rt}"
    slides.append({
        "master_index": 1,
        "layout_name": "Title Only_Alt" if i % 2 else "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [TB(0.7, 1.2, 8.6, 3.0, [
            L0_bold("Problem", 14),
            L1(prob),
            L0_bold("Evidence", 14),
            L1(ev),
            L0_bold("Recommendation", 14),
            L1(rec),
            L0_bold("Why now", 14),
            L1(why),
            L0_bold("Success metrics", 14),
            L1(metrics),
        ], 12)],
    })

slides.append({
    "master_index": 1,
    "layout_name": "Bumper Slide",
})

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

print("Wrote", OUT, "slides:", len(slides))
