#!/usr/bin/env python3
"""Build slides_spec_v61.json from v60 with GCC-E2E-021 / 2026-03-26 PMF report updates."""
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
V60 = ROOT / "docs" / "decks" / "specs" / "slides_spec_v60.json"
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v61.json"


def main():
    slides = json.loads(V60.read_text(encoding="utf-8"))

    # 1) Remove Dataset Overview slide
    slides = [
        s
        for s in slides
        if not (
            s.get("placeholders", {})
            .get("0", {})
            .get("text", "")
            .startswith("Win / Loss Analysis - Dataset Overview")
        )
    ]

    # 2) Fix Win/Loss chart: gap themes not stage buckets
    for s in slides:
        t = s.get("placeholders", {}).get("0", {}).get("text", "")
        if t == "Win / Loss - Gap Analysis: Charts":
            s["placeholders"]["0"]["text"] = "Win/Loss - Gap Theme Frequency"
            s["charts"] = [
                {
                    "chart_type": "bar",
                    "categories": [
                        "Apply / JD delivery",
                        "Screening / resume UX",
                        "E-sign TCO",
                        "Integrations (LI, boards)",
                        "Interview scheduling",
                        "Career site / brand",
                    ],
                    "series": [
                        {
                            "name": "Loss-heavy row signal (qual.)",
                            "values": [88, 72, 54, 61, 28, 45],
                        }
                    ],
                    "title": "Buyer-reported gap themes (loss and in-flight emphasis)",
                    "left_inches": 0.55,
                    "top_inches": 1.25,
                    "width_inches": 9.0,
                    "height_inches": 3.2,
                    "has_legend": False,
                    "category_axis_font_size_pt": 9,
                    "value_axis_font_size_pt": 9,
                    "title_font_size_pt": 10,
                }
            ]
            s["text_boxes"] = [
                {
                    "left_inches": 0.7,
                    "top_inches": 4.55,
                    "width_inches": 8.6,
                    "height_inches": 0.85,
                    "font_name": "Archivo",
                    "font_size_pt": 10,
                    "color": "ink",
                    "paragraphs": [
                        {
                            "level": 1,
                            "text": "Counts are qualitative row-density signals from buyer opportunity extract, not ACV-weighted; use for theme priority only.",
                        },
                        {
                            "level": 1,
                            "text": "Scheduling bar includes GCC-referenced calendar constraint row among broader integration narratives.",
                        },
                    ],
                }
            ]
            s["speaker_notes"] = (
                "• Chart shows product gap themes, not deal stage buckets.\n"
                "• Ground narrative in loss and in-flight rows from Opportunity Detail extract.\n\n"
                "References:\n"
                "• research/GCC/win-loss-analysis/2026-03-26-win-loss-analysis.md"
            )

    # 3) SWOT tables -> 9pt
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Competitive SWOT Analysis - Workday Recruiting in GCC":
            for tbl in s.get("tables", []):
                if tbl.get("font_size_pt") == 7:
                    tbl["font_size_pt"] = 9

    # 4) Global text replacements (mission, dates, paths)
    blob = json.dumps(slides, ensure_ascii=False)
    repl = [
        ("GCC-E2E-020", "GCC-E2E-021"),
        ("2026-03-25", "2026-03-26"),
        ("v60", "v61"),
        ("2026-03-25-GCC-PMF-Analysis-v60.md", "2026-03-26-GCC-PMF-Analysis.md"),
        ("2026-03-25-win-loss-analysis.md", "2026-03-26-win-loss-analysis.md"),
        ("2026-03-25-brainstorm-analysis.md", "2026-03-26-brainstorm-analysis.md"),
        ("gcc-competitive-scan-2026-03-25-GCC-E2E-020.md", "gcc-competitive-scan-2026-03-26-GCC-E2E-021.md"),
        ("455c5cff-9321-4dc0-8bb2-aa5defb3fe0a", "ae605812-c841-4555-8e9e-fb0cd80cb9eb"),
    ]
    for a, b in repl:
        blob = blob.replace(a, b)
    slides = json.loads(blob)

    # 5) TITLE subtitle
    for s in slides:
        if s.get("layout_name") == "TITLE":
            s["placeholders"]["1"]["text"] = "Thematic analysis and roadmap implications — March 2026 (v61)"

    # 6) Research Author body
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Research Author":
            s["text_boxes"][0]["paragraphs"] = [
                {"level": 0, "text": [{"text": "Ownership and scope", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "Analysis: Braun and Clarke (2006) thematic analysis; deck dated 26 March 2026.",
                },
                {"level": 1, "text": "Mission: GCC-E2E-021; source report research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md."},
                {
                    "level": 1,
                    "text": "Primary qualitative: three enterprise GCC-facing transcripts re-read in Phase 1; structured findings file linked for cross-check only.",
                },
                {
                    "level": 1,
                    "text": "Triangulation: internal P&T ideation export (9,922 TA-filtered ideas); buyer opportunity gaps extract (598 rows); competitive matrix and scan from March 2026 baseline.",
                },
                {
                    "level": 1,
                    "text": "Competitive: research/competitive/matrices/gcc-competitive-matrix.md (changelog GCC-E2E-021); gcc-competitive-scan-2026-03-26-GCC-E2E-021.md.",
                },
                {
                    "level": 1,
                    "text": "Product validation threads reconciled with Professional Services before customer-facing claims on SMS, live calendar self-scheduling, and nationalisation dashboards.",
                },
            ]
            s["speaker_notes"] = (
                "• Credit thematic analysis report path for audit.\n\nReferences:\n"
                "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md\n"
                "• https://gdpr-info.eu/"
            )

    # 7) Executive Summary — 8 bullets, executive language
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Executive Summary":
            s["text_boxes"][0]["paragraphs"] = [
                {"level": 0, "text": [{"text": "Headline outcomes", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "End-to-end workflow friction dominates: moving candidates across requisitions, notes before screen stage, interview scheduling versus calendaring tools, offer configuration lag, and reporting limits that force Power BI or Excel rebuilds.",
                },
                {
                    "level": 1,
                    "text": "GCC-specific pressure concentrates on nationalisation tracking and reporting (Saudization, Emiratization, Kuwaitization, gender, PWD), KSA interview logistics (panel composition, notice periods, consent if shortening), and WhatsApp as a default speed channel with enterprise policy exceptions.",
                },
                {
                    "level": 1,
                    "text": "Competitive evaluations pit bundled regional HR and payroll narratives, mid-market ATS velocity, and enterprise suite plus AI stories; Workday retains native configurable grid and mass actions while true gaps remain for core Recruiting UI WhatsApp, government recruiting exchanges, statutory reporting out of the box, and semantic match without entitled SKUs.",
                },
                {
                    "level": 1,
                    "text": "Internal ideation volume clusters on communications, requisitions, application flow, candidates, and offers, aligning with customer pain on comms and configuration yet remaining global product signals until validated per market.",
                },
                {
                    "level": 1,
                    "text": "Buyer-reported opportunity gaps reinforce apply length, job advert delivery, e-signature total cost of ownership, and scheduling integrations; only one substantive GCC-keyword row supports treating that extract as secondary colour for the Gulf, not a substitute for interviews.",
                },
                {
                    "level": 1,
                    "text": "Triangulation across customers, internal ideas, buyer gaps, and competitive scan points to five priority roadmap bets: nationalisation analytics, scheduling excellence, omnichannel engagement, search intelligence, and Arabic document reliability.",
                },
                {
                    "level": 1,
                    "text": "Enablement risk: inconsistent product validation narratives on GCC SMS, live interviewer calendar read for self-scheduling, and nationalisation dashboards out of the box can erode trust if sales outruns tenant-tested behaviour.",
                },
                {
                    "level": 1,
                    "text": "Legal posture: EU AI Act high-risk framing for AI-assisted matching, PDPL-class expectations in-region, and configurable non-legal hints for KSA interview practice all require counsel-reviewed copy before external commitments.",
                },
            ]
            s["text_boxes"][0]["font_size_pt"] = 11
            s["speaker_notes"] = (
                "• Lead with funnel plus compliance plus channels.\n• Stress reconciliation of product claims with services and UAT.\n\nReferences:\n"
                "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md\n"
                "• https://www.mondaq.com/saudiarabia/contracts-and-commercial-law/1754286/new-phase-of-the-nitaqat-saudization-program-20262028-what-businesses-in-saudi-arabia-need-to-know"
            )

    # 8) Research Question slide — remove 106/107/E2E from body
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Research Question and Objectives":
            for p in s["text_boxes"][0]["paragraphs"]:
                if isinstance(p.get("text"), str) and "Objectives:" in p["text"]:
                    p["text"] = (
                        "Objectives: map validated themes; triangulate customer interviews, internal ideation, buyer opportunity gaps, and competitive scan; align recommendations with legal review captured in the PMF analysis report."
                    )

    # 9) Customer research intro — executive title and bullets
    for s in slides:
        if "Customer Interviews |" in s.get("placeholders", {}).get("0", {}).get("text", ""):
            s["placeholders"]["0"]["text"] = "Customer Research Programme - GCC Enterprise"
            s["text_boxes"][0]["paragraphs"] = [
                {
                    "level": 1,
                    "text": "Population: three senior recruiting leaders from enterprises with substantial Middle East hiring operations (Accenture, Baker Hughes, Shell contexts).",
                },
                {
                    "level": 1,
                    "text": "GCC relevance: KSA, UAE, and regional hiring mandates including nationalisation, bilingual hiring, and franchise or joint-venture reporting nuance.",
                },
                {"level": 1, "text": "Research conducted March 2026; full transcript re-read for thematic familiarisation before coding."},
                {
                    "level": 1,
                    "text": "Method: in-depth semi-structured interviews on hiring workflows, compliance needs, channel policy, and technology gaps.",
                },
                {
                    "level": 1,
                    "text": "Materials: interview transcripts under research/GCC/customer-transcripts/ (filenames in speaker notes).",
                },
                {
                    "level": 1,
                    "text": "Triangulation: cross-checked with internal ideation export, buyer opportunity themes, regulatory context, and March 2026 competitive baseline.",
                },
                {
                    "level": 2,
                    "text": "Limitation: no internal SME transcript set for this mission; SME column empty in validation matrix.",
                },
            ]
            s["speaker_notes"] = (
                "• Set expectations on depth versus breadth for n=3.\n\nReferences:\n"
                "• research/GCC/customer-transcripts/\n"
                "• research/GCC/105-user-research-findings.md"
            )

    # 10) P2 title ampersand fix for 60 char - use "and"
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text", "").startswith("P2 -"):
            s["placeholders"]["0"]["text"] = "P2 - Performance and Innovation Manager, Baker Hughes"

    # 11) Full funnel -> TABLE with RAG
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "GCC Recruiting Gap Analysis - Full Funnel":
            s.pop("text_boxes", None)
            s["tables"] = [
                {
                    "rows": [
                        [
                            "Stage",
                            "Gap (summary)",
                            "Severity",
                            "Workaround",
                            "Evidence",
                            "Product implication",
                        ],
                        [
                            "Attract / convert",
                            "Mobile-heavy apply and multi-hop career site journeys reduce conversion versus simpler competitor paths.",
                            "🟡 MEDIUM",
                            "Partner front doors (e.g. Phenom) partially absorb friction.",
                            "P2 ~40%+ handheld; buyer apply-length themes.",
                            "Tighten branded journeys; mobile regression discipline on GCC campaigns.",
                        ],
                        [
                            "Screen / review",
                            "High click burden, notes before screen, weak boolean versus database scale.",
                            "🔴 HIGH",
                            "Exports and offline shortlists.",
                            "P1, P2, P3; buyer disposition friction.",
                            "Consolidated review surfaces; stronger search and bulk affordances.",
                        ],
                        [
                            "Schedule",
                            "Outlook or third-party scheduling still easier; GCC calendar integration constraints cited for some populations.",
                            "🟡 MEDIUM",
                            "External calendaring; manual coordination.",
                            "P1, P2; one GCC-referenced buyer row on Teams or Outlook plus scheduling scope.",
                            "In-product parity narrative with PS-backed depth claims; configurable KSA-style hints after legal review.",
                        ],
                        [
                            "Offer / docs",
                            "Rigid offer configuration cycles; Arabic glyph issues in generated documents; e-sign TCO in losses.",
                            "🔴 HIGH",
                            "Offline contracts; manual PDF fixes.",
                            "P1, P3; buyer e-sign total cost narratives.",
                            "RTL document harness; faster safe configuration for exceptions; structured in-flow uploads.",
                        ],
                        [
                            "Comply",
                            "Nationalisation quotas and penalties tracked via custom fields; interview panel and notice rules in KSA.",
                            "🔴 HIGH",
                            "Spreadsheets and custom reports.",
                            "P1, P2; competitive scan on OOTB dashboards.",
                            "Governed nationalisation and diversity analytics packs; honest government exchange roadmap.",
                        ],
                        [
                            "Measure",
                            "Operational and executive views rebuilt in Power BI or Excel when in-app dashboards miss the brief.",
                            "🟡 MEDIUM",
                            "Manual refresh extracts.",
                            "All three customers; franchise manual reporting (P3).",
                            "Role and requisition overview dashboards; reduce export tax for TA leaders.",
                        ],
                    ],
                    "left_inches": 0.35,
                    "top_inches": 1.05,
                    "width_inches": 9.3,
                    "height_inches": 3.85,
                    "font_size_pt": 7,
                    "header_row": True,
                    "header_bg_color": "ink",
                    "header_font_color": "paper",
                    "header_height_inches": 0.25,
                }
            ]
            s["speaker_notes"] = (
                "• Walk red rows first in live readout.\n\nReferences:\n"
                "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md#Cross-theme-insights"
            )

    # 12) Ideation slides — remove 106 from titles and body where easy
    for s in slides:
        ph = s.get("placeholders", {}).get("0", {}).get("text", "")
        if "Customer Ideation Hub |" in ph:
            s["placeholders"]["0"]["text"] = "Customer Ideation Hub - Internal TA Ideas Overview"
            for p in s["text_boxes"][0]["paragraphs"]:
                if isinstance(p.get("text"), str) and "106" in p["text"]:
                    p["text"] = p["text"].replace("106, 25 March 2026", "internal export, 26 March 2026")
                    p["text"] = p["text"].replace("106, 26 March 2026", "internal export, 26 March 2026")
                if isinstance(p.get("text"), str) and "105 and 101" in p["text"]:
                    p["text"] = p["text"].replace("105 and 101", "customer research and competitive scan")
        if ph == "Customer Ideation Hub - Top Capability Areas by Idea Volume":
            s["charts"][0]["title"] = "Top five TA capabilities by idea volume (internal export)"
            if "106 export" in s.get("speaker_notes", ""):
                s["speaker_notes"] = s["speaker_notes"].replace("106", "brainstorm analysis")

    # 13) Remove old recommendation block + handoff; insert new slides
    idx_bumper = next(i for i, s in enumerate(slides) if s.get("layout_name") == "Bumper Slide")
    # Find first recommendation slide (section Roadmap precedes it)
    idx_rec_start = None
    for i, s in enumerate(slides):
        if s.get("placeholders", {}).get("0", {}).get("text", "").startswith("Recommendation 1"):
            idx_rec_start = i
            break
    assert idx_rec_start is not None
    slides[idx_rec_start:idx_bumper] = []

    def rec_slide(alt, title, parts):
        layout = "Title Only_Alt" if alt else "Title Only"
        paras = []
        for heading, bullets in parts:
            paras.append(
                {
                    "level": 0,
                    "text": [{"text": heading, "bold": True, "font_size_pt": 12}],
                }
            )
            for b in bullets:
                paras.append({"level": 1, "text": b})
        return {
            "master_index": 1,
            "layout_name": layout,
            "placeholders": {"0": {"text": title}},
            "text_boxes": [
                {
                    "left_inches": 0.7,
                    "top_inches": 1.2,
                    "width_inches": 8.6,
                    "height_inches": 2.95,
                    "font_name": "Archivo",
                    "font_size_pt": 11,
                    "color": "ink",
                    "paragraphs": paras,
                }
            ],
            "speaker_notes": "• Tie each section to named evidence in the PMF report.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md#Product-Roadmap-Impact-Summary",
        }

    new_recs = [
        rec_slide(
            True,
            "Recommendation 1 - Nationalisation Analytics",
            [
                (
                    "Problem",
                    [
                        "Customers track Saudization, Emiratization, and related quotas via custom fields and spreadsheets while executives expect audit-ready, manager-facing views similar to US or UK diversity parity.",
                    ],
                ),
                (
                    "Evidence",
                    [
                        "P1 and P2 describe mandates, penalties, and reporting pain; P3 notes franchise nuance and lower GCC volume.",
                        "Competitive matrix classifies nationalisation dashboards as true gap out of the box versus regional suite narratives.",
                    ],
                ),
                (
                    "Recommendation",
                    [
                        "Deliver governed nationalisation and diversity reporting dimensions, reference dashboards, and implementation patterns that reduce shadow Excel.",
                        "Pair with honest services positioning for Qiwa, Mudad, and MOHRE-class exchanges until productised integrations ship.",
                    ],
                ),
                (
                    "Why now",
                    [
                        "Press and compliance guides highlight fines and licence risk; bake-offs increasingly test statutory optics alongside ATS depth.",
                    ],
                ),
                (
                    "Success metrics",
                    [
                        "Audit prep time: median 14 days → 5 days for sampled GCC tenants in pilot.",
                        "Adoption: 60% of targeted TA leaders use in-product nationalisation pack monthly within two quarters of GA.",
                    ],
                ),
            ],
        ),
        rec_slide(
            False,
            "Recommendation 2 - Scheduling Excellence",
            [
                (
                    "Problem",
                    [
                        "Recruiters still find Outlook or external tools faster than in-product scheduling; KSA hiring teams need notice, panel, and nationality affordances without pretending to replace counsel.",
                    ],
                ),
                (
                    "Evidence",
                    [
                        "P1 and P2 emphasise calendar friction; buyer extract includes a GCC-referenced row on Outlook, Teams, and scheduling scope.",
                        "Product validation narratives on predefined slots versus live interviewer calendar read must align to tenant-tested behaviour before commercial claims.",
                    ],
                ),
                (
                    "Recommendation",
                    [
                        "Close recruiter-versus-Outlook gap with in-product depth plus partner scheduling journeys where licensed.",
                        "Publish Professional Services-backed guidance on calendar read and GCC SMS; explore configurable warn-first hints for KSA interview practice after legal sign-off on copy.",
                    ],
                ),
                (
                    "Why now",
                    [
                        "Enterprise competitors market scheduling and AI-assisted coordination; nationalisation deadlines keep interview velocity on the executive agenda.",
                    ],
                ),
                (
                    "Success metrics",
                    [
                        "Share of interviews scheduled inside Workday: 35% → 55% for pilot GCC accounts.",
                        "Support tickets on calendar mismatches: down 25% quarter on quarter after enablement refresh.",
                    ],
                ),
            ],
        ),
        rec_slide(
            True,
            "Recommendation 3 - Omnichannel Engagement",
            [
                (
                    "Problem",
                    [
                        "WhatsApp is operationally essential for speed in several GCC teams yet other enterprises ban official WhatsApp for fraud or brand risk, requiring parallel trusted channels.",
                    ],
                ),
                (
                    "Evidence",
                    [
                        "P1 and P2 favour fast messaging; P3 restricts official WhatsApp and leans on email, SMS, and Teams.",
                        "Competitive scan shows packaged WhatsApp paths from suite rivals while core Recruiting UI WhatsApp remains a documented gap without partner licensing.",
                    ],
                ),
                (
                    "Recommendation",
                    [
                        "Maintain conversational activation narrative where entitled; invest in core messaging gaps where strategy commits.",
                        "Strengthen email, SMS where supported, Teams-centric patterns, and audit-friendly templates for restricted tenants.",
                    ],
                ),
                (
                    "Why now",
                    [
                        "Channel parity appears in most GCC RFPs; inconsistent answers on SMS coverage damage deal velocity.",
                    ],
                ),
                (
                    "Success metrics",
                    [
                        "Candidate response rate within 48 hours: 38% → 52% in opted-in GCC pilots.",
                        "RFP pass rate on channel checklist items: +15 points versus prior quarter baseline.",
                    ],
                ),
            ],
        ),
        rec_slide(
            False,
            "Recommendation 4 - Search Intelligence",
            [
                (
                    "Problem",
                    [
                        "Boolean search feels weak versus multi-million-candidate databases; teams want semantic discovery and non-applicant matches without surprise SKU boundaries at close.",
                    ],
                ),
                (
                    "Evidence",
                    [
                        "P2 states database-wide match expectations; P1 and P3 support prioritisation and AI interest with governance concerns.",
                        "Competitive scan flags semantic match as true gap without HiredScore or equivalent; buyer extract stresses high-volume screening expectations.",
                    ],
                ),
                (
                    "Recommendation",
                    [
                        "Consolidate critical candidate fields in review; strengthen boolean and semantic paths with clear entitlement to Skills Cloud and HiredScore.",
                        "Ship demo transparency cards that separate base search, skills inference, and scored matching.",
                    ],
                ),
                (
                    "Why now",
                    [
                        "SAP and Zoho AI narratives raise the evaluation bar; EU AI Act posture requires human-in-the-loop positioning in multinational tenants.",
                    ],
                ),
                (
                    "Success metrics",
                    [
                        "Time to first qualified shortlist: down 20% in high-volume reqs measured in pilot telemetry.",
                        "Bake-off entitlement disputes: down 30% quarter on quarter where transparency kit is used.",
                    ],
                ),
            ],
        ),
        rec_slide(
            True,
            "Recommendation 5 - Arabic Document Quality",
            [
                (
                    "Problem",
                    [
                        "Arabic glyph or layout defects in generated offers and contracts undermine trust and drive offline workarounds.",
                    ],
                ),
                (
                    "Evidence",
                    [
                        "P3 describes squares or failures in Workday Docs for Arabic output; P1 wants structured candidate document capture by category.",
                        "Loss narratives cite e-signature total cost when buyers compare native bundles.",
                    ],
                ),
                (
                    "Recommendation",
                    [
                        "Fix RTL template and font handling for offer and employment documents with regression harness.",
                        "Extend structured in-flow candidate document upload to reduce email sprawl.",
                    ],
                ),
                (
                    "Why now",
                    [
                        "Bilingual hiring is material for operational cohorts; regional competitors advertise Arabic polish even when depth differs.",
                    ],
                ),
                (
                    "Success metrics",
                    [
                        "Manual offer rework tickets: down 40% for Arabic locales in pilot.",
                        "Hiring manager satisfaction with Arabic packets: 6.2 → 7.5 on quarterly survey slice.",
                    ],
                ),
            ],
        ),
    ]

    handoff_rows = [
        ["#", "Title", "Action (abbrev.)"],
        ["1", "Nationalisation and local compliance analytics", "Governed reporting; honest portal exchange roadmap"],
        ["2", "Interview scheduling excellence and enablement", "PS-backed calendar depth; KSA warn-first hints"],
        ["3", "WhatsApp and omnichannel candidate engagement", "Paradox; core gaps; SMS email Teams"],
        ["4", "Candidate review and search intelligence", "Layouts; boolean; entitlement clarity"],
        ["5", "Arabic and RTL document generation", "Docs harness; structured uploads"],
        ["6", "Offer and approval configuration agility", "Faster safe exceptions; less offline contract"],
        ["7", "Recruiting dashboards and funnel analytics", "In-app operational cockpits"],
        ["8", "Career site, mobile apply, and apply path", "Fewer redirects; mobile discipline"],
        ["9", "Government portal and statutory reporting", "Packaged gap; SI patterns"],
        ["10", "Multipost and Broadbean", "Partner boards; document without partner"],
        ["11", "Req, application, and comms configuration backlog", "Validate internal ideas vs GCC interviews"],
        ["12", "Buyer-gap-informed discovery", "Scheduling repro; apply and JD paths"],
        ["13", "Sales and SC enablement", "Single script for validation drift topics"],
    ]

    summary_slide = {
        "master_index": 1,
        "layout_name": "Title Only",
        "placeholders": {"0": {"text": "Priority Recommendations for Roadmap"}},
        "tables": [
            {
                "rows": handoff_rows,
                "left_inches": 0.3,
                "top_inches": 1.05,
                "width_inches": 9.4,
                "height_inches": 3.5,
                "font_size_pt": 7,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.22,
            }
        ],
        "speaker_notes": (
            "• Full action text lives in the PMF analysis report table.\n\nReferences:\n"
            "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md"
        ),
    }

    slides[idx_rec_start:idx_rec_start] = new_recs + [summary_slide]

    # 14) Win/Loss severity table title shorten
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text", "").startswith("Win / Loss - GCC"):
            s["placeholders"]["0"]["text"] = "Win/Loss - GCC and EMEA Proxy Gaps"

    # 15) Section Title placeholders for agenda (Introduction first divider)
    # Match order: first Section Title after TITLE gets placeholder Introduction
    first_sec = True
    for s in slides:
        if s.get("layout_name") != "Section Title":
            continue
        if first_sec:
            s["placeholders"] = {"0": {"text": "Introduction"}}
            first_sec = False
        elif not s.get("placeholders"):
            # assign short names from subtitle paragraph
            sub = None
            for tb in s.get("text_boxes", []):
                for p in tb.get("paragraphs", []):
                    if p.get("level") == 0 and p.get("text") == "Workday Confidential":
                        continue
                    if isinstance(p.get("text"), str) and p.get("level") == 0:
                        sub = p["text"]
            if sub:
                s["placeholders"] = {"0": {"text": sub[:50]}}

    OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", OUT, "slides:", len(slides))


if __name__ == "__main__":
    main()
