#!/usr/bin/env python3
"""Generate slides_spec_v82.json for India PMF roadmap (IN-E2E-005)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v82.json"

MI = 1


def section(num: str, subtitle: str) -> dict:
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
                "text": f"S E C T I O N  {num}\n{subtitle}",
            }
        ],
    }


def body_box(paragraphs, top=1.2, height=2.8, fs=14):
    return {
        "left_inches": 0.7,
        "top_inches": top,
        "width_inches": 8.6,
        "height_inches": height,
        "font_name": "Archivo",
        "font_size_pt": fs,
        "color": "ink",
        "paragraphs": paragraphs,
    }


def pi_para(text_after: str):
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": text_after, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }


def pestel_slide(title: str, bullets: list[str], implication: str, refs: str) -> dict:
    paras = [{"level": 1, "text": b} for b in bullets]
    paras.append(pi_para(implication))
    return {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": title}},
        "text_boxes": [body_box(paras, fs=12)],
        "speaker_notes": refs,
    }


def alt_toggle(i: int, base: str, alt: str) -> str:
    return base if i % 2 == 0 else alt


slides = []

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

lo, la = "Title Only", "Title Only_Alt"


def add_content(layout, title, paragraphs, notes, fs=14, height=2.8):
    slides.append(
        {
            "master_index": MI,
            "layout_name": layout,
            "placeholders": {"0": {"text": title}},
            "text_boxes": [body_box(paragraphs, fs=fs, height=height)],
            "speaker_notes": notes,
        }
    )


# Section + Executive summary
slides.append(section("0 1", "Research challenge"))
add_content(
    lo,
    "Executive Summary",
    [
        {
            "level": 0,
            "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 14}],
        },
        {
            "level": 1,
            "text": "Scale, trust, and compliance collide: identity risk, resume fraud, industrial duplicates, and India offer or BGC flexibility clash with US-default rigidity.",
        },
        {
            "level": 1,
            "text": "Governance sits outside Workday: email approvals, OTP and ID friction, weak acceptance signals, and task noise push leaders to parallel tools.",
        },
        {
            "level": 1,
            "text": "Competitive scans show true gaps on native +91 SMS, WhatsApp in core UI, UIDAI Aadhaar eKYC, and Naukri-class multipost; suite, UDMF, and BGV remain differentiators.",
        },
        {
            "level": 1,
            "text": "Priority bets: government-ID-aware dedupe, hardened identity capture, bulk review with governed AI, offer or EA lifecycle, audited career-site PII edits, in-system approvals.",
        },
    ],
    "• Stress trust chain plus throughput as one problem.\n• Cite DPDP and labour code timing as forcing functions.\n• Land on partner-truth for channels and boards.\n\nReferences:\n• PMF analysis: research/India/thematic-analysis/2026-03-31-India-PMF-Analysis-IN-E2E-005.md",
    fs=14,
)

slides.append(section("0 2", "Research challenge"))
add_content(
    la,
    "Research Question and Objectives",
    [
        {"level": 1, "text": "How should Workday Recruiting win India enterprise and high-volume programmes on trust, compliance, and recruiter throughput?"},
        {"level": 1, "text": "Objectives: validate funnel frictions, channel reality, identity and dedupe needs, offer or BGC flexibility, and governance gaps versus global suite strengths."},
        {"level": 1, "text": "Methods: strategy context, PESTEL, SWOT, competitive intelligence, five internal SMEs, five customer voices (P1–P5), thematic synthesis with triangulation."},
        {"level": 1, "text": "Scope: India-hosted recruiting; presales win or loss exports and ideation CSV corpora were not available for this cycle (explicit data-gap slides follow)."},
    ],
    "• Keep questions executive; avoid methodology jargon in-room.\n• Note data gaps honestly; primary research still converges.\n\nReferences:\n• Strategy context: research/India/strategy-context-2026-03-31-IN-E2E-005.md",
)

slides.append(section("0 3", "Context review"))
add_content(
    lo,
    "Strategic Context - Why India Now",
    [
        {"level": 1, "text": "Labour Codes central commencement (21 Nov 2025) and DPDP phased rules increase documentation, consent, and audit expectations across hiring and onboarding."},
        {"level": 1, "text": "IMARC sizes India ATS near USD 0.30B (2024) toward USD 0.50B by 2033 (~7.2% CAGR); economic growth supports continued enterprise ATS investment."},
        {"level": 1, "text": "Buyers compare suite depth with local omnichannel stories; honest parity on SMS, WhatsApp, Aadhaar, and boards is now an RFP fixture."},
        {"level": 1, "text": "Workday’s Q2 India row targets eight customers with DPDP compliance and local board reach as named pillars alongside global AI and GCC bets."},
    ],
    "• Tie political and legal timing to sales urgency.\n• Anchor growth stats to IMARC and strategy markdown.\n\nReferences:\n• PESTEL: research/India/pestel-analysis-India-2026-03-31-IN-E2E-005.md\n• Strategy: strategy/markdown/product-priorities-q2-2026.md",
)

add_content(
    la,
    "India Market Momentum - Key Indicators",
    [
        {"level": 1, "text": "HCM software market (India) cited near USD 927.5M (2024) with double-digit CAGR outlooks to early 2030s (IMARC, 2026 fetch)."},
        {"level": 1, "text": "WhatsApp user bases in India cited in mid-hundreds of millions; mobile-first apply and recruiter workflows are default, not optional."},
        {"level": 1, "text": "Public cloud in India sized ~USD 10.9B (2024) toward ~USD 30.4B by 2029 (~22.6% CAGR, IDC narrative) supporting SaaS delivery and integrations."},
        {"level": 1, "text": "GenAI in HR is widely piloted but shallow on outcomes; privacy brakes reinforce consent-first automation positioning for screening and matching."},
    ],
    "• Use ranges cautiously; cite analyst definitions.\n• Bridge cloud growth to integration and security expectations.\n\nReferences:\n• IMARC HCM and ATS pages; IDC India cloud PR",
)

slides.append(section("0 4", "Product strategy"))
add_content(
    lo,
    "Q2 2026 Product Priorities",
    [
        {"level": 1, "text": "India scale growth: eight customers targeted in Q2 with DPDP compliance programmes and local job board reach via certified partner distribution."},
        {"level": 1, "text": "AI candidate matching: HiredScore activation with explainability and human review aligns to India volume hiring when consent and oversight are credible."},
        {"level": 1, "text": "Core ATS parity: bulk actions, mobile recruiter experience, BGV integrations, and Paradox scheduling reduce table-stakes objections in India cycles."},
        {"level": 1, "text": "GCC market readiness remains corporate Priority 1; messaging and compliance patterns there still inform India buyer expectations on channels and auditability."},
    ],
    "• Lead with India row first; then corporate priorities for context.\n• Cross-check product-priorities-q2-2026.md.\n\nReferences:\n• research/India/strategy-context-2026-03-31-IN-E2E-005.md",
)

add_content(
    la,
    "Regional Expansion Strategy",
    [
        {"level": 1, "text": "India: medium priority; eight Q2 wins; DPDP compliance and local boards as explicit hooks in quarterly markdown."},
        {"level": 1, "text": "GCC: high priority; ten Q2 wins; WhatsApp, nationalisation, Arabic, and boards blockers drive corporate OKR focus."},
        {"level": 1, "text": "Japan: medium; five expansions; two-step offer and APPI compliance deepen multinational templates."},
        {"level": 1, "text": "Australia: medium; three expansions; Fair Work Act and SEEK integration maintain leadership narrative."},
    ],
    "• Table sourced from strategy context regional expansion section.\n\nReferences:\n• strategy/markdown/product-priorities-q2-2026.md",
)

add_content(
    lo,
    "Competitive Positioning - Differentiation",
    [
        {"level": 1, "text": "Suite depth: hire-to-retire coherence, security model, and global rollout patterns versus point ATS and regional HRMS bundles."},
        {"level": 1, "text": "AI-powered: HiredScore and Workday AI with human-in-the-loop versus undifferentiated agentic demos from enterprise incumbents."},
        {"level": 1, "text": "Compliance-first: configurable consent, retention, and purge levers mapped to DPDP expectations when paired with customer legal programmes."},
        {"level": 1, "text": "Vulnerabilities: job board coverage via partners first, mobile recruiter parity gaps, and scheduling depth tied to Paradox activation."},
    ],
    "• Align to strategy context competitive positioning bullets.\n\nReferences:\n• research/India/strategy-context-2026-03-31-IN-E2E-005.md",
)

slides.append(section("0 5", "PESTEL"))
# PESTEL six slides (factor titles only)
pestel_refs = (
    "• Present factor anchors; keep implication visible.\n\nReferences:\n"
    "• research/India/pestel-analysis-India-2026-03-31-IN-E2E-005.md"
)
slides.append(
    pestel_slide(
        "Political",
        [
            "Four Labour Codes commenced centrally on 21 Nov 2025, consolidating 29 legacy statutes; state rules still evolve (Mint, Lexology commentary).",
            "EPFO pushed UAN onboarding via UMANG with Aadhaar face authentication from 1 Aug 2025 (Indian Express, EPFO circulars).",
            "Code on Social Security 2020 framing plus e-Shram registration narratives expand formal workforce coverage (PIB-style reporting).",
            "Centre-state alignment on wages and OSH rules remains uneven; enterprises expect configurable hiring documentation and audit trails.",
        ],
        "Workday should ship India labour-code-aware hiring templates, contract-type configurability, and clear boundaries between recruiting data and benefits enrolment integrations.",
        pestel_refs,
    )
)
slides.append(
    pestel_slide(
        "Economic",
        [
            "IMF and OECD commentary cluster near 6–7%+ real GDP growth for FY26–FY27 (Indian press summaries, Jan 2026).",
            "IMARC cites India HCM at USD 927.5M (2024) toward USD 2,861.9M by 2033 at 12.35% CAGR (2025–2033).",
            "India ATS sized USD 0.30B (2024) toward USD 0.50B by 2033 at ~7.2% CAGR; drivers include AI, cloud, remote hiring, and labour compliance.",
            "Naukri JobSpeak shows resilient white-collar hiring with strong non-IT pockets and AI role growth in 2025 commentary.",
        ],
        "Prioritise cloud-native, compliance-aware differentiators that defend suite TCO against point ATS vendors while capturing ATS growth inside the HCM envelope.",
        pestel_refs,
    )
)
slides.append(
    pestel_slide(
        "Social",
        [
            "India is WhatsApp’s largest national market; third-party summaries cite ~535–550M+ users and very high smartphone-user penetration (Findly, 2025–2026).",
            "Household surveys indicate ~85.5% of households had at least one smartphone in early 2025 (NSO-style survey via public summaries).",
            "Internet penetration narratives cite ~70% in DataReportal 2026 India reports alongside ~1.03B users (methodology-sensitive).",
            "Enterprise hiring liquidity stays metro-heavy (Bengaluru, Pune, Gujarat industrial pockets per Naukri commentary) with English dominant in MNC recruiting.",
        ],
        "Assume mobile apply and recruiter mobility by default; integrate partner-led WhatsApp with DPDP-aligned consent, retention, and logging on every touchpoint.",
        pestel_refs,
    )
)
slides.append(
    pestel_slide(
        "Technological",
        [
            "IDC sizes India public cloud services at USD 10.9B (2024) toward USD 30.4B (2029) at 22.6% CAGR; SaaS and AI workloads are catalysts.",
            "BCG-style India press summaries state >90% of companies pilot GenAI in HR but only ~38% see strong relevance; ~51% cite privacy concerns.",
            "MeitY India AI Governance Guidelines launched 5 Nov 2025 under IndiaAI Mission (trust, fairness, accountability, safety principles).",
            "CERT-In expectations on logging and incident reporting intersect candidate databases; dual duties with DPDP breach processes matter for SaaS vendors.",
        ],
        "Ship India-ready AI with privacy-by-design defaults, tenant human review for high-impact matching, strong audit logs, and APIs suited to cloud-forward procurement.",
        pestel_refs,
    )
)
slides.append(
    pestel_slide(
        "Environmental",
        [
            "SEBI BRSR and BRSR Core evolution increases structured workforce and diversity disclosures for top listed entities (ESG legal commentary, 2025).",
            "Renewable-energy hiring press cites high-teens percentage hiring growth expectations for FY25 with skill-gap and attrition risks (IANS-style summaries).",
            "No single Indian statute mandates carbon-per-hire in ATS; environmental signal is indirect via customer sustainability reporting and sector hiring demand.",
            "DATA GAP: limited recruiting-specific environmental regulation; still surface analytics that support customer ESG narratives without over-rotating the core ATS roadmap.",
        ],
        "Expose diversity and funnel metrics that reconcile to HCM analytics for BRSR consumers; support skills metadata for green roles without carbon-accounting scope creep.",
        pestel_refs,
    )
)
slides.append(
    pestel_slide(
        "Legal",
        [
            "DPDP Act 2023 and 2025 Rules phase in through 2026–2027 with DPBI processes; consent must be specific, informed, and withdrawable (LiveLaw, CADP summaries).",
            "IT Act Section 43A and SPDI Rules 2011 remain operational for sensitive personal data and reasonable security practices (WIPO Lex text).",
            "Four Labour Codes (Nov 2025) raise documentation and industrial-relations expectations; background checks need standalone consent beyond offer boilerplate (practitioner themes).",
            "GDPR Article 22 and EU AI Act Annex III still bind EU-affected processing; high-risk recruitment AI requires human oversight and technical documentation.",
        ],
        "Implement granular consent and notice UX, retention and erasure workflows, subprocessors governance, and AI logging that satisfies India diligence and EU deployer duties where applicable.",
        pestel_refs,
    )
)

slides.append(section("0 6", "Competitive landscape"))

# Competitive tables - no height_inches per 130
def comp_table(rows):
    return {
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


slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Competitive Landscape - Regional Specialists"}},
        "tables": [
            comp_table(
                [
                    ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
                    [
                        "Keka",
                        "INR packaging; multipost and SMS narratives; SpringVerify BGV guides; mid-market velocity",
                        "Narrower global enterprise depth vs suite vendors",
                        "Strong for high-volume India SMB and mid-market",
                        "RFP benchmark on local channels",
                    ],
                    [
                        "Darwinbox",
                        "AI and Microsoft fabric stories; PDP landing pages; regional HRMS bundle",
                        "Enterprise security and global template depth varies",
                        "Competes on time-to-value in India enterprise",
                        "Omnichannel marketing pressure",
                    ],
                    [
                        "Zoho Recruit",
                        "Marketplace WhatsApp and Zia mobile; TCO story; verification apps ecosystem",
                        "Enterprise RFP depth vs global HCM suite",
                        "Strong self-serve and SMB appeal",
                        "Sets expectations on marketplace ID flows",
                    ],
                    [
                        "PeopleStrong / greytHR",
                        "Omnichannel and India payroll adjacency; Zwayam Amplify posting narratives",
                        "Global multinational template comparisons",
                        "Bundled HRMS positioning in India",
                        "Local board reach cited in marketing",
                    ],
                ]
            )
        ],
        "speaker_notes": "• Ground claims in in-competitive-matrix.md v1.8.\n\nReferences:\n• research/competitive/in/in-competitive-scan-2026-03-31-IN-E2E-005.md",
    }
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Competitive Landscape - Global Platforms"}},
        "tables": [
            comp_table(
                [
                    ["Vendor", "Key Strengths", "Key Weaknesses", "India Fit", "Notes"],
                    [
                        "SAP SuccessFactors",
                        "SmartRecruiters embedded narrative; enterprise incumbency; India press Mar 2026",
                        "Slower innovation perception vs best-of-breed ATS in some cycles",
                        "MNC India RFP staple",
                        "AI story narrowing differentiation",
                    ],
                    [
                        "Oracle Fusion",
                        "Agentic applications and Recruiting Booster narratives; global ERP footprint",
                        "Complexity and implementation cost",
                        "Large enterprise India deals",
                        "Mar 2026 India announcements",
                    ],
                    [
                        "iCIMS",
                        "Frontline AI and omnichannel flows; high-volume story Mar 2026",
                        "Suite adjacency vs Workday HCM",
                        "BPO and high-volume segments",
                        "Raises SMS and web conversational bar",
                    ],
                    [
                        "Workable",
                        "Paid Naukri integration marketing; SMB ease of use",
                        "Limited enterprise India suite depth",
                        "Benchmark for board posting UX",
                        "Partner-first board pattern contrast",
                    ],
                ]
            )
        ],
        "speaker_notes": "• Align to scan headlines; avoid unsourced claims.\n\nReferences:\n• research/competitive/matrices/in-competitive-matrix.md",
    }
)

# SWOT 4x2 table
S = (
    "Suite hire-to-retire coherence for MNC India; native BGV business process and connectors; "
    "UDMF duplicate management; DPDP-style configurable consent, retention, and purge; bulk grid and baseline matching"
)
W = (
    "True gaps: native +91 SMS, native WhatsApp in core Recruiting UI, native UIDAI Aadhaar eKYC, "
    "OOTB Naukri-class multipost; mobile recruiter partial parity; Paradox-grade scheduling without partners"
)
O = (
    "Q2 India eight-customer row with DPDP and boards; AI matching activation with human-in-the-loop; "
    "Labour Code Nov 2025 documentation demand; partner-led channel closure; BRSR metrics consumers"
)
T = (
    "Darwinbox, Keka, Zoho omnichannel bundling; SAP and Oracle AI press; DPDP and CERT-In dual breach optics; "
    "RFP risk if Aadhaar or SMS paths are overclaimed; high-volume churn if scale pain persists"
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Competitive SWOT - Workday in India"}},
        "tables": [
            {
                "rows": [
                    ["Strengths", "Weaknesses"],
                    [S, W],
                    ["Opportunities", "Threats"],
                    [O, T],
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
        "speaker_notes": "• Single four-quadrant SWOT table; semicolon-separated cells.\n\nReferences:\n• research/India/swot-analysis-India-2026-03-31-IN-E2E-005.md",
    }
)

slides.append(section("0 7", "Win / Loss"))

wl_notes = (
    "• Explain absence of presales gap export for this mission.\n"
    "• Point to interviews and competitive intelligence for gap identification.\n\nReferences:\n"
    "• Mission scope: no presales gap-analysis export ingested"
)

for t, bullets in [
    (
        "Win/Loss - Dataset Not Available",
        [
            "Presales win and loss gap exports were not run for this research cycle; no severity-weighted CRM extract is available to chart.",
            "Roadmap prioritisation therefore leans on customer interviews, internal SME perspectives, competitive matrix true gaps, and strategy context.",
            "When exports resume, regenerate standard gap theme, chart, and proxy slides to align sales loss reasons with product investment cases.",
        ],
    ),
    (
        "Win/Loss - Theme Analysis Deferred",
        [
            "Top-N gap theme tables require structured opportunity fields and consistent region tagging in presales exports.",
            "Until hygiene is restored, treat competitive scan severity labels and customer quotes as primary gap evidence, not win-loss frequency counts.",
            "Product teams should agree a single India gap taxonomy with Sales Ops before rebuilding charts.",
        ],
    ),
    (
        "Win/Loss - Charts Placeholder",
        [
            "Horizontal bar charts of gap themes are omitted because no numeric frequency series exists for this mission.",
            "Use competitive matrix Native, Workaround, True Gap columns plus TP India scale anecdotes to illustrate impact qualitatively.",
            "Revisit chart slide after next presales export refresh.",
        ],
    ),
    (
        "Win/Loss - Evidence Sources This Cycle",
        [
            "Customer evidence: P1–P5 at Teleperformance India on approvals, IDs, duplicates, offers, and dashboards.",
            "Competitive evidence: India competitive scan and matrix v1.8 with validated true-gap callouts on SMS, WhatsApp, Aadhaar, and boards.",
            "Internal evidence: five Workday SMEs on fraud scale, offer flexibility, BGC orchestration, and WhatsApp behaviour.",
        ],
    ),
]:
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only" if len(slides) % 2 == 0 else "Title Only_Alt",
            "placeholders": {"0": {"text": t}},
            "text_boxes": [body_box([{"level": 1, "text": b} for b in bullets], fs=14)],
            "speaker_notes": wl_notes,
        }
    )

slides.append(section("0 8", "Ideation Hub"))

id_notes = (
    "• Internal brainstorm corpora and idea CSVs were not in scope.\n"
    "• Primary research substitutes for ideation volume signals.\n\nReferences:\n"
    "• research/India raw-data not present for this mission"
)

for t, bullets in [
    (
        "Ideation Hub - Corpus Not Available",
        [
            "No customer ideation CSV or raw idea export was available for this mission; overview counts and histograms are omitted by design.",
            "Use SME and customer interviews to prioritise themes instead of idea-volume rankings.",
            "When ideation exports return, rebuild the standard three-slide ideation block.",
        ],
    ),
    (
        "Ideation Hub - Top Areas Deferred",
        [
            "Capability-area bar charts require aggregated idea taxonomies and stable product component mappings.",
            "Interim proxy: competitive matrix gap themes plus PMF recommendation RICE table for prioritisation narrative.",
            "Coordinate with Ideas portal owners for India-tagged exports.",
        ],
    ),
    (
        "Ideation Hub - Verbatims Deferred",
        [
            "Key verbatim theme slides need scrubbed internal quotes with component tags; none were cleared for this deck build.",
            "Customer quotes on slides P1–P5 and SME slides carry the qualitative weight instead.",
            "Add ideation quotes only after privacy review.",
        ],
    ),
    (
        "Ideation Hub - Triangulation Instead",
        [
            "Six-source triangulation matrix in the thematic section replaces ideation volume storytelling for this version.",
            "Convergence on trust chain, industrial operations, India offer or BGC, governance, channels, and throughput is strong despite missing ideation counts.",
            "Next refresh: pair triangulation with ideation counts when both exist.",
        ],
    ),
]:
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only" if len(slides) % 2 == 0 else "Title Only_Alt",
            "placeholders": {"0": {"text": t}},
            "text_boxes": [body_box([{"level": 1, "text": b} for b in bullets], fs=14)],
            "speaker_notes": id_notes,
        }
    )

slides.append(section("0 9", "Primary research"))

add_content(
    lo,
    "Internal SME Interviews - Workday Experts",
    [
        {"level": 1, "text": "Five Workday SMEs: product leadership, field readiness, global services, India enterprise architecture, and Accenture strategic customer engagement."},
        {"level": 1, "text": "Multi-customer visibility spans Lowe’s high-volume India paths, Genpact talent supply chain, Accenture-scale fraud and duplicates, and major partner programmes."},
        {"level": 1, "text": "Timing: January 2025 through November 2024 notes depending on SME; materials support triangulation before customer readout."},
        {"level": 1, "text": "Purpose: stress-test India scale, Know Your Candidate, offer or BGC flexibility, and channel behaviour hypotheses."},
        {"level": 1, "text": "Limitation: internal lens supplements but does not replace P1–P5 customer voices in the following section."},
    ],
    "• Name SMEs on next slide; customers stay P1–P5.\n\nReferences:\n• research/India/105-sme-research-findings.md",
    fs=14,
)

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only_Alt",
        "placeholders": {"0": {"text": "Internal SME Interview Participants"}},
        "tables": [
            {
                "rows": [
                    ["SME ID", "Name", "Role", "Context"],
                    ["SME1", "Bernie", "VP, Talent Product Management", "India FY27 focus; KYC and fraud at scale"],
                    ["SME2", "Fabiola Navarro", "Sr. Product Advisor, Field Readiness", "Lowe’s India volume; offers and BGC"],
                    ["SME3", "Santosh Gulia", "Sr. Functional Consultant, Global Services", "India BGC variability; WhatsApp; documents"],
                    ["SME4", "David Lodola", "Enterprise Architect, India Services", "Genpact scale; impersonation; Tydy BGC"],
                    ["SME5", "David Phillips", "Director, SCE (Accenture)", "~200k duplicates; DNH; interview ID checks"],
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
        "speaker_notes": "• Cite internal transcript paths in appendix verbally.\n\nReferences:\n• research/India/internal-sme-transcripts/",
    }
)


def sme_slide(title, themes):
    paras = []
    for sub, bs in themes:
        paras.append({"level": 0, "text": [{"text": sub, "bold": True, "font_size_pt": 12}]})
        for b in bs:
            paras.append({"level": 1, "text": b})
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only" if len(slides) % 2 == 0 else "Title Only_Alt",
            "placeholders": {"0": {"text": title}},
            "text_boxes": [body_box(paras, fs=12, height=3.0)],
            "speaker_notes": "• Tie SME claims to customer slides where possible.\n\nReferences:\n• 105-sme-research-findings.md",
        }
    )


sme_slide(
    "SME1 - Bernie, VP Talent PM",
    [
        (
            "KYC and fraud",
            [
                "Resume and candidate fraud framed like banking KYC; order-of-magnitude ~100k resumes per month called out.",
                "Accenture named as a heavy segment illustrating India scale risk.",
            ],
        ),
        (
            "Partners and roadmap",
            [
                "BrightHire partnership discussed for interview evidence supporting skills consistency.",
                "India product gaps and local address rollout flagged for FY27 planning conversations.",
            ],
        ),
    ],
)
sme_slide(
    "SME2 - Fabiola Navarro, Field",
    [
        (
            "India offers",
            [
                "Compensation disclosure is complex on every India-scoped project: tables, calcs, often two candidate documents.",
                "Start-date and offer changes after milestones appear more often than US templates expect.",
            ],
        ),
        (
            "BGC flexibility",
            [
                "India populations may progress before all BGC results return; customers need reinitiate and loop-back UX.",
                "Review-document sprawl across offer and BGC business processes hurts candidate experience.",
            ],
        ),
    ],
)
sme_slide(
    "SME3 - Santosh Gulia, Services",
    [
        (
            "Documents and stages",
            [
                "Candidate attachment hub requested for non-standard documents beyond rigid templates.",
                "ID proof before interview matters for fraud cases on a major partner programme (~7 lakh people cited).",
            ],
        ),
        (
            "Channels and consent",
            [
                "WhatsApp preferred over SMS for back-and-forth and link sharing at India penetration.",
                "GDPR-style marketing opt-in starves reach; clients ask about region-configurable opt-out where legal.",
            ],
        ),
    ],
)
sme_slide(
    "SME4 - David Lodola, Architect",
    [
        (
            "Mass scale",
            [
                "Genpact-style programmes run 100–200 reqs with too many clicks; mass offers and approvals are needed.",
                "Worksheets not used for some mass flows; opportunity to productise patterns.",
            ],
        ),
        (
            "Trust chain",
            [
                "Impersonation risk: applicant not same as interview attendee; facial recognition raised as example only.",
                "Career site edits to name, address, and phone carry weak audit trails and BGC risk.",
            ],
        ),
    ],
)
sme_slide(
    "SME5 - David Phillips, SCE",
    [
        (
            "Volume and DNH",
            [
                "~200k duplicate applications cited; auto-merge limited to two records drives manual merges.",
                "Do Not Hire auto-disposition requested against ex-employee and similar lists at India scale.",
            ],
        ),
        (
            "Fraud and identity",
            [
                "High competition drives application fraud; AI-assisted pattern detection could return time to hiring managers.",
                "Interview-stage ID validation aligns with Lodola impersonation theme.",
            ],
        ),
    ],
)

slides.append(section("1 0", "Primary research"))

add_content(
    la,
    "1:1 Customer Interviews - India Enterprise",
    [
        {"level": 1, "text": "Five senior recruiting leaders and hiring managers from Teleperformance India covering specialist, leadership, and high-volume agent programmes."},
        {"level": 1, "text": "Organisations operate India-scale hiring with agency networks, confidential leadership pipelines, and multi-site peaks up to thousands of hires per week."},
        {"level": 1, "text": "Research conducted December 2025; semi-structured interviews on workflows, compliance, and Workday friction points."},
        {"level": 1, "text": "Transcripts analysed for themes; findings triangulated with internal SMEs, competitive intelligence, and strategy context."},
        {"level": 1, "text": "Participants anonymised as P1–P5 with company retained for enterprise credibility."},
        {"level": 1, "text": "Limitation: single-employer deep dive; patterns require validation with additional India BPO and IT tenants."},
    ],
    "• Keep methodology in notes; slide stays executive.\n\nReferences:\n• research/India/105-user-research-findings.md",
    fs=14,
    height=3.1,
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
                    ["P1", "Recruitment Manager (specialist team)", "TP (India)"],
                    ["P2", "Recruitment Manager (JR to payroll)", "TP (India)"],
                    ["P3", "Leadership or confidential hiring", "TP (India)"],
                    ["P4", "Agent hiring lead (high volume)", "TP (India)"],
                    ["P5", "Frontline hiring manager (multi-site)", "TP (India)"],
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
        "speaker_notes": "• Map P IDs consistently across deck.\n\nReferences:\n• TP India transcripts Dec 2025",
    }
)


def p_slide(n, role_co, themes_quotes_jtbd):
    paras = []
    for sub, items in themes_quotes_jtbd:
        paras.append({"level": 0, "text": [{"text": sub, "bold": True, "font_size_pt": 12}]})
        for it in items:
            paras.append({"level": 1, "text": it})
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only_Alt" if n % 2 else "Title Only",
            "placeholders": {"0": {"text": f"P{n} - {role_co}"}},
            "text_boxes": [body_box(paras, fs=12, height=3.1)],
            "speaker_notes": f"• Emphasise quotes that resonate with India scale.\n\nReferences:\n• P{n} transcript TP India Dec 2025",
        }
    )


p_slide(
    1,
    "Recruitment Manager, TP (India)",
    [
        (
            "Role focus",
            [
                "'Sourcing, interviews, resumes, offers, and follow-up' anchor daily work for a small specialist pod.",
                "Splits time between hands-on recruiting and team goals, attendance, and performance routines.",
            ],
        ),
        (
            "JTBD",
            [
                "When leading a specialist pod, I want a single system of record for hiring steps and team admin, so I reduce parallel status chasing.",
            ],
        ),
    ],
)
p_slide(
    2,
    "Recruitment Manager, TP (India)",
    [
        (
            "Email-first approvals",
            [
                "'Approvals live on email then I raise the job requisition in Workday' describes dual-system latency.",
                "~60-person team; managers send mapped position codes via email before reqs appear in Workday.",
            ],
        ),
        (
            "JTBD",
            [
                "When opening approved headcount, I want managers to raise accurate reqs with correct org and finance tags, so I avoid rework before candidates apply.",
            ],
        ),
    ],
)
p_slide(
    3,
    "Leadership Recruiter, TP (India)",
    [
        (
            "Governance and reporting",
            [
                '"No useful Workday reports… Thrive and Excel carry progress views" summarises leadership pipeline visibility gap.',
                '"~16–17% drop before offer accept" ties process weight to join-rate risk.',
            ],
        ),
        (
            "IDs and volume",
            [
                '"Candidates say they do not receive OTP" highlights government ID friction before offer release.',
                '"~700 applications… open each one separately" shows bulk review gap on high-volume reqs.',
            ],
        ),
        (
            "JTBD",
            [
                "When closing leadership hires under India compliance, I want mandatory ID capture and in-system approvals, so I protect join rates and audit trails.",
            ],
        ),
    ],
)
p_slide(
    4,
    "Agent Hiring Lead, TP (India)",
    [
        (
            "Agency scale",
            [
                "'300-400 agencies' with manual per-upload approval consumes full days of recruiter time.",
                "Duplicate source attribution errors drive fee disputes; first-source logic from legacy ATS is missed.",
            ],
        ),
        (
            "Offers",
            [
                "'Regenerate offer cannot fix compensation after accept' cited with hundreds of correction cases at go-live.",
            ],
        ),
        (
            "JTBD",
            [
                "When running thousands of agency applications, I want government-ID-aware dedupe and fair source rules, so I remove click-approval roles and pay agencies correctly.",
            ],
        ),
    ],
)
p_slide(
    5,
    "Hiring Manager, TP (India)",
    [
        (
            "Peak operations",
            [
                '"Saturday maintenance… India six-day week" ties platform windows to revenue-impacting downtime.',
                '"Duplication… validate on Aadhaar number" states need beyond name, phone, and email matching.',
            ],
        ),
        (
            "Offers at scale",
            [
                '"100–150 offers per day" with limited regenerate and no mass offer actions drives manual legal letters.',
            ],
        ),
        (
            "JTBD",
            [
                "When hiring thousands weekly across sites, I want resilient onboarding IDs and scalable offer amendments, so peaks do not cost revenue or compliance risk.",
            ],
        ),
    ],
)

slides.append(section("1 1", "Thematic analysis"))

themes_grouped = [
    (
        "Validated Themes 1-2 (Trust and Scale)",
        [
            (
                "Know Your Candidate",
                [
                    "P5 wants Aadhaar-class dedupe; SMEs cite impersonation and ~100k resumes per month fraud context.",
                    "Reduces fee disputes, BGC reopen risk, and executive distrust in India programmes.",
                    "Roadmap: government-ID-aware UDMF, interview-stage assurance, legal minimisation on Aadhaar claims.",
                ],
            ),
            (
                "Industrial operations",
                [
                    "P4 cites full-day vendor approvals; Phillips cites ~200k duplicates and two-record merge limits.",
                    "Manual scale drives shadow processes and agency conflict churn.",
                    "Roadmap: bulk-safe vendor rules, multi-way merge policy, DNH automation, mass actions.",
                ],
            ),
        ],
    ),
    (
        "Validated Themes 3-4 (India HR Reality)",
        [
            (
                "Offer and BGC flexibility",
                [
                    "Fabiola and customers cite two-document offers, post-hire changes, and regenerate limits.",
                    "Join-rate loss when process is onerous; hundreds of compensation corrections cited.",
                    "Roadmap: controlled regenerate, batch cohort amend, BGC reinitiate UX, richer pre-vendor payload.",
                ],
            ),
            (
                "Governance in system of record",
                [
                    "P3 and P5 describe approvals outside Workday; screenshot audits on acceptance.",
                    "Weak in-product visibility invites Excel and Thrive workarounds.",
                    "Roadmap: stage-wise approvals with attachments, role-scoped dashboards, cleaner notifications.",
                ],
            ),
        ],
    ),
    (
        "Validated Themes 5-6 (Channels and Funnel)",
        [
            (
                "Channels and consent",
                [
                    "WhatsApp default socially; matrix lists native WhatsApp and +91 SMS as true gaps.",
                    "Santosh notes opt-in starves marketing reach at India volumes.",
                    "Roadmap: partner reference architectures with consent, logging, opt-out; avoid false native claims.",
                ],
            ),
            (
                "Throughput and screening",
                [
                    "P3 cannot parse from major boards; optional resume inflates review cost.",
                    "Bernie and Phillips emphasise fraud detection need at extreme volumes.",
                    "Roadmap: bulk disposition, mandatory resume option, HiredScore activation with human oversight.",
                ],
            ),
        ],
    ),
]

for gtitle, pairs in themes_grouped:
    paras = []
    for name, triple in pairs:
        paras.append({"level": 0, "text": [{"text": name, "bold": True, "font_size_pt": 12}]})
        paras.append({"level": 1, "text": f"Insight: {triple[0][:98]}"})
        paras.append({"level": 1, "text": f"Impact: {triple[1][:98]}"})
        paras.append({"level": 1, "text": f"Product: {triple[2][:118]}"})
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only" if len(slides) % 2 == 0 else "Title Only_Alt",
            "placeholders": {"0": {"text": gtitle}},
            "text_boxes": [body_box(paras, fs=12, height=3.0)],
            "speaker_notes": "• Two themes per slide for density control.\n\nReferences:\n• 2026-03-31 India PMF Analysis IN-E2E-005",
        }
    )

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Cross-Source Validation Matrix"}},
        "tables": [
            {
                "rows": [
                    ["Theme", "Strategy", "PESTEL", "SWOT", "CI", "SME", "Customer"],
                    [
                        "Trust chain",
                        "AI and India compliance",
                        "DPDP and identity rails",
                        "UDMF strength; Aadhaar gap",
                        "True Gap Aadhaar",
                        "Strong",
                        "P3–P5",
                    ],
                    [
                        "Industrial ops",
                        "Core ATS parity",
                        "Economic scale",
                        "Bulk grid strength",
                        "UDMF native",
                        "Accenture scale",
                        "P4 vendor load",
                    ],
                    [
                        "Offer and BGC",
                        "Local workflows",
                        "Labour codes Nov 2025",
                        "BGC BP strength",
                        "eSign competition",
                        "Fabiola, Santosh",
                        "P3–P5",
                    ],
                    [
                        "Governance",
                        "India eight-customer row",
                        "Auditability",
                        "Excel workaround",
                        "Enterprise AI noise",
                        "Config vs adoption",
                        "All five",
                    ],
                    [
                        "Channels",
                        "Messaging roadmap",
                        "WhatsApp social",
                        "True Gap SMS or WA",
                        "Paradox path",
                        "Santosh",
                        "P5 ops context",
                    ],
                    [
                        "Throughput",
                        "Priority 2 AI",
                        "GenAI shallow",
                        "HiredScore opportunity",
                        "SAP or Oracle AI",
                        "Bernie fraud",
                        "P3 700 applicants",
                    ],
                ],
                "left_inches": 0.25,
                "top_inches": 1.05,
                "width_inches": 9.5,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.22,
            }
        ],
        "speaker_notes": "• Walk row by row; cite convergence verbally.\n\nReferences:\n• PMF triangulation table IN-E2E-005",
    }
)

slides.append(section("1 2", "Full funnel"))

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
                        "Limited native multipost to Naukri-class boards",
                        "MEDIUM",
                        "Broadbean multiposter; Studio custom",
                        "Competitive matrix; P3 link posting",
                        "Validate board lists per deal; honest RFP tables",
                    ],
                    [
                        "Convert",
                        "Government ID and OTP friction before offer",
                        "HIGH",
                        "Manual chasing; support escalations",
                        "P3 OTP failures; policy vs UX mismatch",
                        "Mandatory gating, persistence, notifications",
                    ],
                    [
                        "Screen",
                        "No bulk candidate review; optional resume",
                        "HIGH",
                        "One-by-one opens",
                        "P3 ~700 applicants",
                        "Bulk grid disposition; mandatory resume option",
                    ],
                    [
                        "Offer",
                        "Regenerate limits; weak accept signals",
                        "HIGH",
                        "Screenshots; manual checks",
                        "P3–P5 acceptance and regenerate quotes",
                        "Offer lifecycle: notify, regenerate, batch amend",
                    ],
                    [
                        "Comply",
                        "Approvals and evidence outside Workday",
                        "HIGH",
                        "Email packets",
                        "P2–P5 offline approvals",
                        "In-system approvals with attachments and audit",
                    ],
                    [
                        "Measure",
                        "Leadership dashboards and aging weak",
                        "MEDIUM",
                        "Thrive and Excel",
                        "P3 reporting quotes",
                        "Role-scoped recruiting operational analytics",
                    ],
                ],
                "left_inches": 0.2,
                "top_inches": 1.0,
                "width_inches": 9.6,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.22,
            }
        ],
        "speaker_notes": "• Severity is directional; validate with Deployment Agent in sales cycles.\n\nReferences:\n• PMF recommendations and TP India interviews",
    }
)

slides.append(section("1 3", "Roadmap"))

recs = [
    (
        "Recommendation 1: ID-Aware Dedupe Rules",
        [
            "Extend UDMF and source-of-hire for India-legal PAN, permitted Aadhaar use cases, and UAN with minimisation and legal sign-off.",
            "Add first-source wins within cooling-off and bulk-safe vendor approval rules that preserve rehire and compliance constraints.",
            "RICE ~2267 directional from PMF table; reach ~8000 recruiters quarterly proxy.",
        ],
    ),
    (
        "Recommendation 2: Identity Capture and OTP Paths",
        [
            "Align mandatory government ID steps with UX; persist fields; surface OTP failure paths for candidates and recruiters.",
            "Pair notices and consent flows with DPDP programme guidance from customer legal teams.",
            "RICE ~4200 directional; highest score in PMF table.",
        ],
    ),
    (
        "Recommendation 3: Bulk Review and HiredScore",
        [
            "Bulk shortlist and disposition for high-volume reqs; optional mandatory resume; activate HiredScore with explainability defaults.",
            "Align to fraud detection roadmap themes and EU AI Act human oversight narrative for enterprise buyers.",
            "RICE ~2362 directional.",
        ],
    ),
    (
        "Recommendation 4: Career Site PII Audit Trail",
        [
            "Audited edits for name, address, and phone on external career experiences with recruiter-visible risk flags tied to BGC.",
            "Reduce impersonation and mismatch reopen loops called out by Lodola and trust themes.",
            "RICE ~2340 directional.",
        ],
    ),
    (
        "Recommendation 5: In-System Approval Chains",
        [
            "First-party approval workflows for position and compensation with attachments and history; cut email parallel system.",
            "Supported unanimously by P1–P5 narratives on governance gaps.",
            "RICE ~2109 directional.",
        ],
    ),
]

for i, (title, bullets) in enumerate(recs, 1):
    slides.append(
        {
            "master_index": MI,
            "layout_name": "Title Only" if i % 2 else "Title Only_Alt",
            "placeholders": {"0": {"text": title}},
            "text_boxes": [body_box([{"level": 1, "text": b} for b in bullets], fs=14)],
            "speaker_notes": "• Tie each recommendation to metrics named in PMF success metric section.\n\nReferences:\n• 2026-03-31 India PMF Analysis IN-E2E-005",
        }
    )

# Handoff table
handoff_rows = [
    ["#", "Title", "RICE", "Reach", "Impact", "Conf", "Effort"],
    ["1", "ID-aware dedupe and source precedence", "2267", "8000", "3.0", "85%", "9 pm"],
    ["2", "Identity capture and OTP reliability", "4200", "12000", "3.0", "70%", "6 pm"],
    ["3", "Bulk review and HiredScore activation", "2362", "9000", "3.0", "70%", "8 pm"],
    ["4", "Career site PII audit trail", "2340", "8000", "2.25", "65%", "5 pm"],
    ["5", "In-system req and offer approvals", "2109", "10000", "2.25", "75%", "8 pm"],
    ["6", "Offer and EA lifecycle improvements", "1100", "6000", "2.75", "80%", "12 pm"],
    ["7", "DNH auto-disposition", "840", "3000", "2.0", "70%", "5 pm"],
    ["8", "Multi-way duplicate merge", "422", "2500", "2.25", "60%", "8 pm"],
    ["9", "BGC orchestration depth", "844", "5000", "2.25", "75%", "10 pm"],
    ["10", "Mass offer and EA actions", "682", "4000", "2.5", "75%", "11 pm"],
]

slides.append(
    {
        "master_index": MI,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [
            {
                "rows": handoff_rows,
                "left_inches": 0.25,
                "top_inches": 1.1,
                "width_inches": 9.5,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ],
        "speaker_notes": "• Full sixteen-row table lives in PMF markdown; top ten shown for legibility.\n\nReferences:\n• Research handoff table in PMF analysis",
    }
)

slides.append({"master_index": MI, "layout_name": "Bumper Slide"})

OUT.write_text(json.dumps(slides, indent=2), encoding="utf-8")
print(f"Wrote {len(slides)} slides to {OUT}")
