#!/usr/bin/env python3
"""Build slides_spec_v70.json from v69: GCC-E2E-030 content, remove forbidden Win/Loss slide, reorder recommendations."""
import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPECS = ROOT / "docs" / "decks" / "specs"
SRC = str(SPECS / "slides_spec_v69.json")
OUT = str(SPECS / "slides_spec_v70.json")

THEMATIC = "research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-030.md"


def p_sub(bold_label: str):
    return {
        "level": 0,
        "text": [{"text": bold_label, "bold": True, "font_size_pt": 12}],
    }


def p_body(level: int, text: str):
    return {"level": level, "text": text}


def rec_slide(layout: str, title: str, problem: str, evidence: str, rec: str, why: str, metrics: str):
    return {
        "master_index": 1,
        "layout_name": layout,
        "placeholders": {"0": {"text": title}},
        "text_boxes": [
            {
                "left_inches": 0.7,
                "top_inches": 1.2,
                "width_inches": 8.6,
                "height_inches": 3.2,
                "font_name": "Archivo",
                "font_size_pt": 11,
                "color": "ink",
                "paragraphs": [
                    p_sub("Problem"),
                    p_body(1, problem),
                    p_sub("Evidence"),
                    p_body(1, evidence),
                    p_sub("Recommendation"),
                    p_body(1, rec),
                    p_sub("Why now"),
                    p_body(1, why),
                    p_sub("Success metrics"),
                    p_body(1, metrics),
                ],
            }
        ],
        "speaker_notes": f"• Five-part structure for leadership readout.\n\nReferences:\n• {THEMATIC}",
    }


def main():
    with open(SRC) as f:
        slides = json.load(f)

    slides = [
        s
        for s in slides
        if s.get("placeholders", {}).get("0", {}).get("text")
        != "Win/Loss: CRM Hygiene for Gulf"
    ]

    dump = json.dumps(slides)
    dump = dump.replace("GCC-E2E-029", "GCC-E2E-030")
    slides = json.loads(dump)

    # Executive Summary — align to 030 report opening
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Executive Summary":
            paras = s["text_boxes"][0]["paragraphs"]
            # Keep Headline outcomes + replace 5 bullets
            new_paras = [paras[0]]
            new_paras.extend(
                [
                    p_body(
                        1,
                        "GCC enterprise teams converge on speed, compliance evidence, and local channels together; scheduling friction, nationalisation pressure, weak discovery UX, and document localisation risk surface across interviews.",
                    ),
                    p_body(
                        1,
                        "Two customers treat WhatsApp as essential for closure; one global enterprise restricts official WhatsApp for policy and fraud concerns, so the narrative must emphasise governed channel choice rather than a single app mandate.",
                    ),
                    p_body(
                        1,
                        "March 2026 competitive baseline classifies first-party WhatsApp in core Recruiting UI and Qiwa/Mudad recruiting exchange as true gaps, while nationalisation executive views lean workaround-heavy; Arabic Docs claims need customer UAT before bake-offs.",
                    ),
                    p_body(
                        1,
                        "Internal ideation shows high volume and negative sentiment in Communications and Candidates surfaces; presales GCC extract is sparse (N=1) yet aligns directionally on Microsoft stack scheduling friction.",
                    ),
                    p_body(
                        1,
                        "Q2 strategy Priority 1 GCC readiness, Priority 2 AI matching, and Priority 3 core ATS parity align with the strongest signals; career site depth remains a customer pull against a quarter where marketing automation is de-prioritised.",
                    ),
                ]
            )
            s["text_boxes"][0]["paragraphs"] = new_paras
            s["speaker_notes"] = (
                "• Lead with governance split on messaging and compliance-first roadmap.\n\nReferences:\n"
                f"• {THEMATIC}\n"
                "• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-030.md"
            )

    # Win/Loss third slide + speaker notes on first
    for s in slides:
        t = s.get("placeholders", {}).get("0", {}).get("text", "")
        if t == "Win/Loss  -  Top Gap Themes":
            s["speaker_notes"] = (
                "• Themes combine customer interviews, internal ideation volumes, March 2026 competitive baseline, and sparse presales row.\n\nReferences:\n"
                "• research/GCC/gap-analysis/2026-03-27-gap-analysis-GCC-E2E-030.md\n"
                "• research/GCC/brainstorm-analysis/2026-03-27-brainstorm-analysis-GCC-E2E-030.md\n"
                f"• {THEMATIC}"
            )
        if t == "Win/Loss  -  GCC & Proxy Gaps":
            s["tables"][0]["rows"] = [
                ["Signal", "RAG", "Remediation"],
                [
                    "Presales PG-00009165 (GCC + Outlook/Teams stack)",
                    "🟡 MEDIUM (N=1)",
                    "Triangulate with interviews; not a frequency signal alone",
                ],
                [
                    "First-party WhatsApp in core Recruiting UI",
                    "🔴 HIGH",
                    "Roadmap governed messaging; compare Oracle/SAP packaging",
                ],
                [
                    "Qiwa / Mudad recruiting exchange",
                    "🔴 HIGH",
                    "Partner roadmap versus regional payroll plus hiring bundles",
                ],
                [
                    "Gulf geography fields in opportunity data",
                    "🟡 MEDIUM",
                    "Improve extracts for future severity-weighted buyer tables",
                ],
            ]
            s["speaker_notes"] = (
                "• Sparse GCC-scoped presales rows; rely on qualitative triangulation.\n\nReferences:\n"
                "• research/GCC/gap-analysis/2026-03-27-gap-analysis-GCC-E2E-030.md\n"
                "• research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-030.md"
            )

    # Gap Analysis + DA validation note
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Gap Analysis":
            for row in s["tables"][0]["rows"][1:]:
                if row[0] == "Comply":
                    row[2] = "🟡 MEDIUM"
                    row[3] = (
                        "OOTB nationality fields plus custom nationalisation reporting; executive dashboards still configuration-heavy versus competitor statutory packaging"
                    )
                if row[0] == "Schedule":
                    row[2] = "🟡 MEDIUM"
                    row[3] = (
                        "Native M365/Google self-scheduling; validate Scheduling entitlement and Paradox activation; embed KSA notice and consent patterns"
                    )
            s["speaker_notes"] = (
                "• Gap severities cross-checked with Deployment Agent March 2026 (thread c10c2110-02a1-4496-865d-2be5349050ff).\n"
                "• Reduced severity where native calendar and nationality foundations exist; WhatsApp and government exchange remain true gaps per product research.\n\n"
                "References:\n"
                f"• {THEMATIC}"
            )

    # Triangulation matrix
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Cross-Source Validation Matrix":
            s["tables"][0]["rows"] = [
                ["Theme", "Customer", "Ideation", "Presales", "PMF note"],
                [
                    "Local compliance & interviews",
                    "Strong (P1)",
                    "Compliance strain",
                    "PG-00009165 stack ref.",
                    "High",
                ],
                [
                    "Omnichannel & governance",
                    "Strong (P1–P2; P3 restricts)",
                    "Comms top volume",
                    "—",
                    "High; policy split",
                ],
                [
                    "Recruiter discovery",
                    "Strong (P2)",
                    "Grid/pools hypotheses",
                    "—",
                    "High",
                ],
                [
                    "Scheduling & calendars",
                    "Strong",
                    "Interviews friction",
                    "PG-00009165 (S5)",
                    "High; four-source",
                ],
                [
                    "Reporting & franchise",
                    "P1 export; P3 PowerBI",
                    "Reporting noise",
                    "—",
                    "Medium–high",
                ],
                [
                    "Offers, docs, Arabic",
                    "P3 squares; P1 upload",
                    "Offers cluster",
                    "—",
                    "High; validate vs UAT",
                ],
                [
                    "Career site & marketing",
                    "P2 Phenom pain",
                    "Career sites strain",
                    "—",
                    "Tension vs Q2 deprio",
                ],
            ]
            s["speaker_notes"] = (
                "• Matrix follows March 2026 thematic report triangulation.\n\nReferences:\n"
                f"• {THEMATIC}"
            )

    # Replace five recommendation slides (ordered placeholders)
    rec_titles = [
        "Recommendation 1: Governed omnichannel messaging",
        "Recommendation 2: Native nationalisation reporting",
        "Recommendation 3: KSA scheduling & Teams depth",
        "Recommendation 4: Arabic docs & secure intake",
        "Recommendation 5: HiredScore & AI matching",
    ]
    layouts = ["Title Only", "Title Only_Alt", "Title Only", "Title Only_Alt", "Title Only"]
    bodies = [
        (
            "Candidates expect fast replies on messaging channels; UAE and Saudi SMS lack native Workday delivery and first-party WhatsApp in core UI is absent, while some enterprises forbid unofficial WhatsApp for integrity reasons.",
            "Ammad Alsairafi and Mahboob Khan (Accenture, Baker Hughes) cite WhatsApp speed; Arika Yamahata (Shell) restricts official WhatsApp; competitive scan lists first-party core WhatsApp as true gap; internal ideation shows 1,452 Communications ideas with negative sentiment.",
            "Deliver governed core Recruiting messaging for GCC with audit, consent, and tenant policy; extend campaign channels beyond email where strategy permits; pair Paradox and integration paths with honest workaround language for SMS.",
            "Q2 Priority 1 GCC market readiness and ten new-logo OKR; Oracle and SAP package WhatsApp narratives in enterprise bake-offs.",
            "Candidate response rate by channel; reduction in off-system shadow messaging; audit-ready communication logs for security reviews.",
        ),
        (
            "Board-level nationalisation and MOHRE-class reporting often sit in custom fields, exports, and spreadsheets with penalty exposure and long configuration cycles.",
            "Mahboob Khan (Baker Hughes) cites localization percentages and band-aids versus out-of-the-box; Arika Yamahata (Shell) uses franchise Excel for smaller volumes; competitive baseline flags Qiwa/Mudad recruiting exchange as true gap.",
            "Productise Saudi/UAE and extensible nationalisation reporting and executive dashboards; publish partner roadmap for government recruiting exchange; reduce custom-field sprawl with audit-ready packs.",
            "Vision 2030-style workforce targets and RFP scrutiny on statutory evidence increase through 2026.",
            "Time-on-task for compliance packs; reduction in spreadsheet-side reporting; customer legal sign-off on country packs.",
        ),
        (
            "Recruiters still reach for Outlook when Workday feels slower; KSA expects advance interview notice, documented consent if shortened, and panel metadata for nationalisation reviews.",
            "Ammad Alsairafi (Accenture) describes three-day notice and consent; Mahboob Khan (Baker Hughes) finds Outlook easier in trials; presales row PG-00009165 references GCC populations with Outlook/Teams/HiredScore scheduling friction.",
            "Embed jurisdiction-aware hints and consent capture; deepen M365/Teams self-scheduling experience; align Paradox activation playbook with the same compliance surfaces.",
            "Core ATS parity priority and NPS 60 goal; calendar experience is a decision criterion next to compliance in GCC evaluations.",
            "Share of interviews scheduled inside Workday; recruiter minutes saved per requisition; reduction in external scheduling tool usage.",
        ),
        (
            "Offer configuration rigidity and email-led document chase create risk; Arabic output failures in generated documents block automation credibility for RTL hiring.",
            "Arika Yamahata (Shell): Arabic renders as squares in Workday Docs; Ammad Alsairafi (Accenture) wants categorised secure uploads versus email; Mahboob Khan (Baker Hughes) stresses bilingual operational hiring.",
            "Run customer UAT on Arabic Workday Docs versus live templates; ship categorised secure candidate uploads and safer offer exception patterns to cut email loops.",
            "Q2 Priority 1 localisation; RTL quality is visible in every GCC executive demo.",
            "Defect rate on Arabic document generation; reduction in offline contract workarounds; customer sign-off on template packs.",
        ),
        (
            "Boolean and field logic feel insufficient at millions of candidates; competitor narratives showcase semantic AI; entitlement story must stay honest versus Winston and Zia positioning.",
            "Mahboob Khan (Baker Hughes) cites two-million-candidate scale; Arika Yamahata (Shell) explores HiredScore; competitive matrix classifies semantic match without add-on SKUs as true gap.",
            "Land Q2 beta narrative for HiredScore with explainability, human review, and database-scale match insights; align disclosures with GDPR Article 22 and EU AI Act high-risk recruitment expectations where EU scope applies.",
            "Q2 OKR calls for five AI matching beta tenants; SAP Winston and regional AI stories set the evaluation bar.",
            "Beta tenant count; time-to-shortlist; win rate where discovery objections appeared; DPIA and oversight artefacts where required.",
        ),
    ]

    rec_slides_new = [
        rec_slide(layout, title, *body)
        for layout, title, body in zip(layouts, rec_titles, bodies)
    ]

    out = []
    i_rec = 0
    for s in slides:
        tx = s.get("placeholders", {}).get("0", {}).get("text", "")
        if tx.startswith("Recommendation ") and tx[15:16].isdigit() and ":" in tx:
            if i_rec < 5:
                out.append(rec_slides_new[i_rec])
                i_rec += 1
            continue
        out.append(s)

    if i_rec != 5:
        raise SystemExit(f"Expected 5 recommendation slides, replaced {i_rec}")

    # Priority table — E2E-030 handoff
    for s in out:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Priority Recommendations for Roadmap":
            s["tables"][0]["rows"] = [
                ["#", "Title", "Action"],
                [
                    "1",
                    "Governed omnichannel messaging",
                    "First-party or governed core messaging; audit, consent, tenant policy; campaign channels beyond email where permitted.",
                ],
                [
                    "2",
                    "Native nationalisation & statutory reporting",
                    "Saudi/UAE productised reporting; reduce custom sprawl; partner roadmap for Qiwa/Mudad exchange.",
                ],
                [
                    "3",
                    "Compliance-aware scheduling + M365/Teams",
                    "Jurisdiction hints; consent paths; close Outlook/Teams friction; Paradox playbook with KSA rules.",
                ],
                [
                    "4",
                    "Arabic-safe docs & structured intake",
                    "UAT on Arabic Docs; categorised secure uploads; offer exception patterns.",
                ],
                [
                    "5",
                    "HiredScore & AI matching activation",
                    "Beta narrative; explainability; human oversight and AI disclosure per legal review.",
                ],
                [
                    "6",
                    "Unified candidate review UX",
                    "Less tab sprawl; configurable grid; address internal grid hypotheses.",
                ],
                [
                    "7",
                    "In-product dashboards & franchise roll-ups",
                    "Cut PowerBI dependence for standard TA cuts; franchise packs.",
                ],
                [
                    "8",
                    "Core workflow parity",
                    "Cross-req moves; notes before screen; funnel history per req.",
                ],
                [
                    "9",
                    "Offer agility & faster exceptions",
                    "Reduce long dev-cycle perception; self-service safe patterns.",
                ],
                [
                    "10",
                    "Career site & apply simplification",
                    "Track Phenom redirect; align Q3 career roadmap without Q2 over-promise.",
                ],
            ]
            s["speaker_notes"] = (
                "• Summary table mirrors research recommendation set for roadmap selection.\n\nReferences:\n"
                f"• {THEMATIC}"
            )

    with open(OUT, "w") as f:
        json.dump(out, f, indent=2)
        f.write("\n")

    print("Wrote", OUT, "slides:", len(out))


if __name__ == "__main__":
    main()
