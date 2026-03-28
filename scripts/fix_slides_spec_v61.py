#!/usr/bin/env python3
"""Post-process slides_spec_v61.json: executive language, competitive tables, P1-P3 depth, SWOT bullets."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "slides_spec_v61.json"
slides = json.loads(path.read_text(encoding="utf-8"))


def walk_strings(obj, fn):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "speaker_notes" and isinstance(v, str):
                obj[k] = fn(v)
            else:
                walk_strings(v, fn)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            walk_strings(item, fn)


def clean_notes(s: str) -> str:
    s = s.replace("E2E handoff", "roadmap selection table")
    s = s.replace("101 + DA", "competitive matrix and product validation")
    s = s.replace("101 scan dates", "March 2026 competitive scan")
    s = s.replace("from 107 report", "from win-loss analysis export")
    s = s.replace("from 106 executive summary", "from internal ideation executive summary")
    return s


walk_strings(slides, clean_notes)

# --- Research Author ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Research Author":
        ps = s["text_boxes"][0]["paragraphs"]
        ps[2]["text"] = "Mission: March 2026 GCC research programme; source report research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md."
        ps[5]["text"] = (
            "Competitive: research/competitive/matrices/gcc-competitive-matrix.md (March 2026 changelog); "
            "point-in-time scan research/competitive/gcc/gcc-competitive-scan-2026-03-26-GCC-E2E-021.md (filename; cite as March 2026 GCC scan in live talk)."
        )

# --- Research Question ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Research Question and Objectives":
        paras = s["text_boxes"][0]["paragraphs"]
        paras[1]["text"] = (
            "Assess GCC Recruiting PMF using customer ground truth, internal ideation volume, buyer opportunity narratives, and structured competitive parity."
        )
        paras[4]["text"] = (
            "Out of scope: replacing binding legal advice; inferring Gulf deal truth solely from North America-heavy opportunity gap rows."
        )
        s["speaker_notes"] = (
            "• Tie objectives to roadmap prioritisation.\n\nReferences:\n"
            "• Braun and Clarke (2006)\n"
            "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md#Methodology"
        )

# --- 5-Phase ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Research Approach - 5-Phase Framework":
        paras = s["text_boxes"][0]["paragraphs"]
        paras[1]["text"] = (
            "Phase 1: Familiarisation — re-read all P1–P3 transcripts listed in the PMF analysis report; structured findings document is not a substitute."
        )
        paras[4]["text"] = (
            "Phase 4: Theme review — triangulation matrix versus internal ideation, buyer gaps, and competitive claims."
        )
        paras[5]["text"] = (
            "Phase 5: Definition and reporting — roadmap priorities and recommendations summary for leadership selection."
        )

# --- PESTEL / Economic scan line ---
for s in slides:
    for tb in s.get("text_boxes", []):
        for p in tb.get("paragraphs", []):
            t = p.get("text")
            if isinstance(t, str):
                if "GCC-E2E-021" in t and "Competitive scan" in t:
                    p["text"] = t.replace(
                        "Competitive scan (GCC-E2E-021) notes",
                        "March 2026 competitive scan notes",
                    )
                if t.startswith("Government digitalisation:") and "101 classifies" in t:
                    p["text"] = t.replace(
                        "101 classifies recruiting data exchange",
                        "Structured competitive analysis classifies recruiting data exchange",
                    )
                if t.startswith("Deployment Agent:"):
                    p["text"] = (
                        "Product validation: predefined slot self-scheduling versus live interviewer-calendar self-serve — "
                        "bake-off workaround when buyers expect full sync."
                    )


# --- Global Platforms fourth bullet ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Competitive Landscape - Global Platforms":
        paras = s["text_boxes"][0]["paragraphs"]
        paras[3]["text"] = (
            "March 2026 matrix reconciliation: WhatsApp remains a true gap in core Recruiting UI versus packaged competitor paths; "
            "GCC SMS may require Studio plus carrier partner patterns versus standard supported-country lists — validate per tenant."
        )

# --- SWOT bullet cells ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Competitive SWOT Analysis - Workday Recruiting in GCC":
        s["speaker_notes"] = (
            "• SWOT summarises competitive matrix and product validation.\n"
            "• Do not claim full RTL PDF parity without PS and UAT.\n\nReferences:\n"
            "• research/competitive/matrices/gcc-competitive-matrix.md"
        )
        rows = s["tables"][0]["rows"]
        rows[1][0] = (
            "• Suite depth, security model, global HCM adjacency\n"
            "• Paradox narrative for conversational engagement\n"
            "• Configurable grid and mass actions proof point\n"
            "• Compliance strength (GDPR-class, localisation depth)"
        )
        rows[1][1] = (
            "• WhatsApp true gap in core UI versus packaged rivals\n"
            "• Scheduling depth claims need PS-backed validation\n"
            "• Qiwa or Mudad recruiting exchange true gap\n"
            "• Arabic complex document caveats versus regional ATS polish"
        )
        s["tables"][1]["rows"][1][0] = (
            "• Activate Paradox; document Studio plus CPaaS paths\n"
            "• Elevate nationalisation reporting toward first-class analytics\n"
            "• Skills Cloud plus HiredScore packaging clarity in demos"
        )
        s["tables"][1]["rows"][1][1] = (
            "• Bundled regional suites on statutory optics\n"
            "• SAP or Oracle AI and messaging roadmaps\n"
            "• Buyer TCO comparisons on native e-sign and scheduling"
        )

# --- Regional + Global: replace bullets with mandatory tables ---
for s in slides:
    title = s.get("placeholders", {}).get("0", {}).get("text", "")
    if title == "Competitive Landscape - Regional Specialists":
        s.pop("text_boxes", None)
        s["tables"] = [
            {
                "rows": [
                    [
                        "Vendor",
                        "Key strengths",
                        "Key weaknesses",
                        "GCC fit",
                        "Notes",
                    ],
                    [
                        "Bayzat-class regional HR",
                        "• HR plus payroll plus ATS bundle\n• Mudad and WPS adjacency narrative\n• Local compliance storytelling",
                        "• Narrower global enterprise depth\n• Smaller R&D surface versus global suite",
                        "Strong where buyers want statutory bundle optics",
                        "Common in mid-market GCC evaluations per March 2026 scan",
                    ],
                    [
                        "Zoho Recruit",
                        "• Monthly shipping cadence (2026 hiring metrics content)\n• Arabic language set; Zia semantic narrative\n• WhatsApp plus telephony marketplace patterns",
                        "• Enterprise governance depth below Workday bar\n• Mid-market positioning in large RFPs",
                        "High for price-sensitive velocity demos",
                        "Raises bar for mid-market bake-off polish",
                    ],
                    [
                        "HiBob Hiring",
                        "• Integrated ATS with Bob HCM (2024 milestone)\n• Quote-based commercial motion\n• Simple hiring manager UX",
                        "• Limited GCC statutory depth versus regional suites\n• Narrower advanced recruiting workflows",
                        "Attractive for growing GCC subsidiaries",
                        "Check Dubai office and partner coverage per deal",
                    ],
                    [
                        "Other regional ATS",
                        "• Local job board relationships\n• Arabic-first support in some vendors",
                        "• Fragmented integrations\n• Variable security posture",
                        "Situational for niche industries",
                        "Validate security and scale before enterprise shortlist",
                    ],
                ],
                "left_inches": 0.35,
                "top_inches": 1.05,
                "width_inches": 9.3,
                "height_inches": 3.35,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ]
    if title == "Competitive Landscape - Global Platforms":
        s.pop("text_boxes", None)
        s["tables"] = [
            {
                "rows": [
                    [
                        "Vendor",
                        "Key strengths",
                        "Key weaknesses",
                        "GCC fit",
                        "Notes",
                    ],
                    [
                        "SAP plus SmartRecruiters",
                        "• March 2026 unified experience narrative\n• Winston matching; fraud and consent storylines\n• AI hiring positioning in enterprise compares",
                        "• Phased integration complexity\n• Dual-vendor services motion",
                        "Wins when AI and brand unity trump single-vendor object model",
                        "Stress Workday single object model in response",
                    ],
                    [
                        "Oracle",
                        "• Redwood plus Recruiting Booster WhatsApp packaging\n• 26A gen-AI recruiting docs narrative",
                        "• Booster plus provider TCO and governance\n• Suite upgrade cadence risk",
                        "Strong when buyers want packaged messaging channel",
                        "Contrast governance and TCO of add-on stack",
                    ],
                    [
                        "Workday",
                        "• Enterprise security and BP depth\n• Paradox conversational ATS through Workday (2026 newsroom)\n• Native grid and mass actions",
                        "• Core UI WhatsApp gap; portal exchanges true gap\n• Calendar and SMS claims need tenant validation",
                        "Best fit for global enterprise with GCC hubs",
                        "Lead with honesty on entitlements and PS patterns",
                    ],
                ],
                "left_inches": 0.35,
                "top_inches": 1.05,
                "width_inches": 9.3,
                "height_inches": 3.35,
                "font_size_pt": 8,
                "header_row": True,
                "header_bg_color": "ink",
                "header_font_color": "paper",
                "header_height_inches": 0.25,
            }
        ]

# --- Win/Loss table: remove code column header to executive ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Win / Loss - Top Product Gap Themes (Severity-Weighted)":
        rows = s["tables"][0]["rows"]
        rows[0][2] = "Buyer signal tag"
        s["speaker_notes"] = (
            "• Internal tags support traceability to analysis appendix.\n\nReferences:\n"
            "• research/GCC/win-loss-analysis/2026-03-26-win-loss-analysis.md"
        )

# --- AI spotlight: remove 106, 060 from slide body ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Customer Ideation Hub - AI Ideas Spotlight":
        paras = s["text_boxes"][0]["paragraphs"]
        paras[1]["text"] = (
            "Internal hypothesis H4 ties accurate application progress to perceived broken flows — pairs with AI self-service narratives."
        )
        paras[3]["text"] = (
            "Legal: EU AI Act high-risk framing for recruitment AI — human oversight mandatory in customer-facing messaging (counsel review)."
        )

# --- Validated themes slides: executive narrative ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Validated Themes 1-4 - Customer and cross-source convergence":
        s["text_boxes"][0]["paragraphs"] = [
            {
                "level": 0,
                "text": [{"text": "Candidate review efficiency", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "All three customers lose time across tabs, stages, and assignee rules; internal ideation echoes grid-scale pain; buyer gaps cite resume disposition friction.",
            },
            {
                "level": 0,
                "text": [{"text": "Search and AI-assisted matching", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "Universal demand for stronger discovery; buyer extract stresses high-volume screening; competitive scan flags semantic match without entitled SKUs.",
            },
            {
                "level": 0,
                "text": [{"text": "Interview scheduling", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "Two customers strongly prefer external calendars; one GCC-referenced buyer row on Outlook, Teams, and scheduling scope; calendar depth claims need validation.",
            },
            {
                "level": 0,
                "text": [{"text": "Offers, documents, RTL", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "Offer rigidity and Arabic document defects erode trust; buyer losses cite e-signature total cost; internal ideas echo offer-document operations volume.",
            },
        ]
        s["speaker_notes"] = (
            "• Use matrix slide next for numeric convergence.\n\nReferences:\n"
            "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md"
        )
    if s.get("placeholders", {}).get("0", {}).get("text") == "Validated Themes 5-8 - Nationalisation, channels, mobile, reporting":
        s["text_boxes"][0]["paragraphs"] = [
            {
                "level": 0,
                "text": [{"text": "Nationalisation and local compliance", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "Strong P1 and P2 pressure; franchise nuance at P3; competitive matrix shows out-of-the-box dashboard gap versus regional suite claims.",
            },
            {
                "level": 0,
                "text": [{"text": "Omnichannel comms and WhatsApp", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "All three discuss channels; internal comms volume leads TA ideas; buyers compare native messaging bundles in competitive notes.",
            },
            {
                "level": 0,
                "text": [{"text": "Mobile apply and career site", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "P2 cites ~40%+ handheld traffic and redirect stacks; buyer losses reference apply length; internal ideas stress application UX trust.",
            },
            {
                "level": 0,
                "text": [{"text": "Reporting and BI spill-over", "bold": True, "font_size_pt": 12}],
            },
            {
                "level": 1,
                "text": "All three rebuild operational views in Power BI or Excel; opportunity extract less direct but supports upstream friction narrative.",
            },
        ]
        s["speaker_notes"] = (
            "• Connect reporting theme to dashboards recommendation in PMF report.\n\nReferences:\n"
            "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md"
        )

# --- Triangulation matrix header ---
for s in slides:
    if s.get("placeholders", {}).get("0", {}).get("text") == "Cross-Source Validation Matrix":
        s["tables"][0]["rows"][0] = ["Theme", "Customer", "Internal ideas", "Buyer gaps", "PMF impact"]
        s["tables"][0]["rows"][6][3] = "GCC calendar row"
        s["tables"][0]["rows"][7][3] = "Apply loss themes"
        s["speaker_notes"] = (
            "• Full matrix including empty SME column in PMF report.\n\nReferences:\n"
            "• research/GCC/thematic-analysis/2026-03-26-GCC-PMF-Analysis.md#Triangulation-matrix"
        )

# --- P1 deep slide ---
p1_paras = [
    {"level": 0, "text": [{"text": "Candidate review efficiency", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"We cannot keep context when every move copies security boundaries\" — navigation tax across requisitions and notes slows shortlisting (P1, Accenture).",
    },
    {
        "level": 2,
        "text": "Exploratory call notes captured before formal screen stage create duplicate effort when policies block early disposition.",
    },
    {
        "level": 0,
        "text": [{"text": "Nationalisation and reporting", "bold": True, "font_size_pt": 12}],
    },
    {
        "level": 1,
        "text": "\"Penalties mean we cannot afford fuzzy headcount views\" — quotas and audit expectations drive custom-field sprawl (P1, Accenture).",
    },
    {
        "level": 1,
        "text": "When ministries move targets quarterly, I want manager-ready nationality views in product, so I can defend hiring mix without overnight Excel rebuilds.",
    },
    {
        "level": 0,
        "text": [{"text": "Interview logistics (KSA)", "bold": True, "font_size_pt": 12}],
    },
    {
        "level": 1,
        "text": "\"Three-day notice is non-negotiable unless the candidate signs consent\" — panel composition and nationality recording described as compliance-sensitive (P1, Accenture).",
    },
    {
        "level": 1,
        "text": "When panels mix nationalities, I want configurable warn-first hints after legal review, so recruiters reduce compliance risk without pretending to be counsel.",
    },
    {
        "level": 0,
        "text": [{"text": "Scheduling versus Outlook", "bold": True, "font_size_pt": 12}],
    },
    {
        "level": 1,
        "text": "Scheduling still faster in Outlook for several workflows; in-product flows need parity on notifications and hiring-manager slot hygiene.",
    },
]

p2_paras = [
    {"level": 0, "text": [{"text": "Search and database rediscovery", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"Boolean feels weaker than our database size deserves\" — asks for matches across roughly two million candidates including non-applicants (P2, Baker Hughes).",
    },
    {
        "level": 1,
        "text": "When I run executive searches, I want one trustworthy semantic model, so I can surface passive talent without exporting to spreadsheets.",
    },
    {
        "level": 0,
        "text": [{"text": "Mobile and career site journey", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"Handheld traffic is huge — every extra hop kills conversion\" — ~40%+ mobile apply with Phenom-to-Workday redirect friction cited (P2, Baker Hughes).",
    },
    {
        "level": 2,
        "text": "Arabic language importance rises for operational and blue-collar cohorts versus English-led corporate roles.",
    },
    {
        "level": 0,
        "text": [{"text": "WhatsApp and campaigns", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"Candidates simply answer faster on WhatsApp\" — operational expectation for immediate responses in GCC and Saudi campaigns (P2, Baker Hughes).",
    },
    {
        "level": 1,
        "text": "When speed matters for hard-to-fill roles, I want policy-safe messaging options, so I can respect enterprise controls while staying competitive.",
    },
    {
        "level": 0,
        "text": [{"text": "Nationalisation in operational hiring", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "Kuwaitization and similar quotas remain visible even when corporate requisitions default to English job copy.",
    },
]

p3_paras = [
    {"level": 0, "text": [{"text": "Policy-governed messaging", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"Official WhatsApp is blocked here — we still need trustworthy threads in Workday\" — fraud and brand risk drive channel restrictions (P3, Shell).",
    },
    {
        "level": 1,
        "text": "When governance forbids consumer WhatsApp, I want verifiable email and Teams-centric workflows, so audit can trace recruiter outreach end to end.",
    },
    {
        "level": 0,
        "text": [{"text": "Arabic documents and offers", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "\"Squares instead of Arabic in generated PDFs erode hiring-manager confidence\" — RTL defects in Workday Docs cited for offers (P3, Shell).",
    },
    {
        "level": 2,
        "text": "Structured upload by document category requested to replace email sprawl for confidential attachments.",
    },
    {
        "level": 0,
        "text": [{"text": "Franchise reporting nuance", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "GCC franchise footprint carries lower volume than integrated opcos yet still rebuilds leadership views manually when dashboards miss the brief.",
    },
    {
        "level": 0,
        "text": [{"text": "Reporting spill-over", "bold": True, "font_size_pt": 12}]},
    {
        "level": 1,
        "text": "Exports to Power BI remain default when in-product operational cuts cannot answer executive questions quickly.",
    },
    {
        "level": 1,
        "text": "When leaders ask for funnel health by requisition family, I want in-app cockpits, so franchise teams stop reconciling email attachments.",
    },
]

for s in slides:
    t = s.get("placeholders", {}).get("0", {}).get("text", "")
    if t == "P1 - Recruiter Lead, Accenture":
        s["text_boxes"][0]["paragraphs"] = p1_paras
        s["text_boxes"][0]["height_inches"] = 3.05
    if t == "P2 - Performance and Innovation Manager, Baker Hughes":
        s["text_boxes"][0]["paragraphs"] = p2_paras
        s["text_boxes"][0]["height_inches"] = 3.05
    if t == "P3 - Product Owner, Shell":
        s["text_boxes"][0]["paragraphs"] = p3_paras
        s["text_boxes"][0]["height_inches"] = 3.05

path.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("Patched", path)
