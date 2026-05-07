#!/usr/bin/env python3
"""Build slides_spec_v69.json from v68 with GCC-E2E-029 content and Product Strategy section."""
import json
import copy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
V68 = ROOT / "docs" / "decks" / "specs" / "slides_spec_v68.json"
OUT = ROOT / "docs" / "decks" / "specs" / "slides_spec_v69.json"

REPORT = "research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-029.md"
STRAT = "research/GCC/strategy-context-2026-03-27-GCC-E2E-029.md"


def pi(text: str):
    return {
        "level": 0,
        "text": [
            {"text": "Product implication: ", "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
            {"text": text, "bold": True, "font_size_pt": 12, "highlight": "FFFF00"},
        ],
    }


def product_strategy_slides():
    body = "0.7,1.2,8.6,2.8"
    l, t, w, h = map(float, body.split(","))
    return [
        {
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
                    "text": "S E C T I O N  0 4\nProduct strategy",
                }
            ],
        },
        {
            "master_index": 1,
            "layout_name": "Title Only",
            "placeholders": {"0": {"text": "Q2 2026 Product Priorities"}},
            "text_boxes": [
                {
                    "left_inches": l,
                    "top_inches": t,
                    "width_inches": w,
                    "height_inches": h,
                    "font_name": "Archivo",
                    "font_size_pt": 14,
                    "color": "ink",
                    "paragraphs": [
                        {
                            "level": 1,
                            "text": "GCC market readiness (strategic): channels (WhatsApp, SMS), nationalisation (Nitaqat, Emiratisation), Arabic RTL, Bayt/GulfTalent via Broadbean — target 10 new GCC wins by end Q2; zero product deal blockers.",
                        },
                        {
                            "level": 1,
                            "text": "AI candidate matching: activate HiredScore with explainability and human-in-the-loop; 5 beta tenants by end Q2; ~20% time-to-fill improvement for beta cohort.",
                        },
                        {
                            "level": 1,
                            "text": "Core ATS parity: bulk actions, mobile recruiter UX, Paradox scheduling, background-check integrations — parity with SAP/Oracle on key workflows.",
                        },
                        {
                            "level": 1,
                            "text": "OKRs: KR1 ten GCC customer wins (baseline 3); KR2 five AI matching beta tenants; KR3 Recruiting NPS 60 (from 52).",
                        },
                    ],
                }
            ],
            "speaker_notes": "• Anchor roadmap to Q2 bets and OKRs.\n\nReferences:\n• " + STRAT,
        },
        {
            "master_index": 1,
            "layout_name": "Title Only_Alt",
            "placeholders": {"0": {"text": "Regional Expansion Strategy"}},
            "text_boxes": [
                {
                    "left_inches": l,
                    "top_inches": t,
                    "width_inches": w,
                    "height_inches": h,
                    "font_name": "Archivo",
                    "font_size_pt": 14,
                    "color": "ink",
                    "paragraphs": [
                        {
                            "level": 1,
                            "text": "GCC: High priority — only region with dedicated Q2 Priority 1 and numeric new-logo OKR (10 wins); market entry focus on WhatsApp, nationalisation, Arabic.",
                        },
                        {
                            "level": 1,
                            "text": "Japan: Deepen — two-step offer, APPI, LINE; 5 expansions target.",
                        },
                        {
                            "level": 1,
                            "text": "India: Scale — DPDP, local boards; 8 customers. Australia: Maintain leader — Fair Work, SEEK; 3 expansions.",
                        },
                        {
                            "level": 1,
                            "text": "Implication: GCC recommendations that unlock communication, compliance reporting, Arabic, and distribution score highest business impact when evidence supports them.",
                        },
                    ],
                }
            ],
            "speaker_notes": "• Use for exec alignment on where Recruiting invests.\n\nReferences:\n• " + STRAT,
        },
        {
            "master_index": 1,
            "layout_name": "Title Only",
            "placeholders": {"0": {"text": "Competitive Positioning"}},
            "text_boxes": [
                {
                    "left_inches": l,
                    "top_inches": t,
                    "width_inches": w,
                    "height_inches": h,
                    "font_name": "Archivo",
                    "font_size_pt": 14,
                    "color": "ink",
                    "paragraphs": [
                        {
                            "level": 1,
                            "text": "Suite depth: HCM + Recruiting + Talent + Learning versus point ATS — single platform story versus phased SAP+SmartRecruiters integration tax.",
                        },
                        {
                            "level": 1,
                            "text": "AI-powered TA: HiredScore matching and grading plus Paradox scheduling and conversational CX; orchestration with measured efficiency outcomes.",
                        },
                        {
                            "level": 1,
                            "text": "Compliance-first: GDPR, EU AI Act, global privacy; explainability, consent, regional compliance on roadmap.",
                        },
                        {
                            "level": 1,
                            "text": "Acknowledge activation and partner coverage (Broadbean, Paradox) as implementation realities — lead with integrated suite plus compliant global hiring.",
                        },
                    ],
                }
            ],
            "speaker_notes": "• Messaging for bake-offs versus Oracle WhatsApp and regional bundles.\n\nReferences:\n• " + STRAT,
        },
    ]


def legal_slide_paragraphs():
    impl = (
        "Consent, minimisation, retention, and cross-border transfers must be designed against KSA, UAE, Qatar, Kuwait, Bahrain, and Oman rules in scope for each tenant and data flow, not a single undifferentiated GCC template; "
        "scheduling UX should surface compliance hints without legal advice. For AI-assisted matching touching EU individuals or establishments, apply EU AI Act high-risk recruitment obligations and GDPR Art. 22 and DPIA where required, alongside local PDPL and PDPA — human oversight remains mandatory."
    )
    return [
        {
            "level": 1,
            "text": "KSA: PDPL Royal Decree M/19 amended M/148 (2023); lawful processing, security, cross-border transfers, DPIA-style assessments for high-risk candidate processing (DLA Piper, SDAIA knowledge centre).",
        },
        {
            "level": 1,
            "text": "UAE: Federal Decree-Law No. 45 of 2021 PDPA (portal doc ID 1972); lawful basis, data subject rights, transfers for mainland employers; DIFC and ADGM may impose separate free-zone regimes — validate at deal time.",
        },
        {
            "level": 1,
            "text": "Qatar: Law No. 13 of 2016 (CRA) — lawful processing of candidate PII, transfer and outsourcing discipline when data leaves Qatar.",
        },
        {
            "level": 1,
            "text": "Kuwait: CITRA Administrative Decision 26/2024 — consent, purposes, security, access and breach notification; map to SMS, hosting, integrated messaging.",
        },
        {
            "level": 2,
            "text": "Bahrain Law 30/2018 (PDPA) and Oman Royal Decree 6/2022: sensitive data, adequacy for transfers, DPO and breach duties — confirm with customer Legal at DPA for Qatar, Kuwait, Bahrain, Oman deal specifics.",
        },
        pi(impl),
    ]


SECTION_REMAP = {
    "S E C T I O N  0 4\nPESTEL": "S E C T I O N  0 5\nPESTEL",
    "S E C T I O N  0 5\nCompetitive landscape": "S E C T I O N  0 6\nCompetitive landscape",
    "S E C T I O N  0 6\nWin / Loss": "S E C T I O N  0 7\nWin / Loss",
    "S E C T I O N  0 7\nIdeation hub": "S E C T I O N  0 8\nIdeation hub",
    "S E C T I O N  0 8\nPrimary research": "S E C T I O N  0 9\nPrimary research",
    "S E C T I O N  0 9\nThematic analysis": "S E C T I O N  1 0\nThematic analysis",
    "S E C T I O N  1 0\nFull funnel": "S E C T I O N  1 1\nFull funnel",
    "S E C T I O N  1 1\nRoadmap": "S E C T I O N  1 2\nRoadmap",
}


def main():
    slides = json.loads(V68.read_text(encoding="utf-8"))
    # Global string replace mission and report paths
    raw = json.dumps(slides)
    raw = raw.replace("GCC-E2E-028", "GCC-E2E-029")
    raw = raw.replace("2026-03-27-GCC-PMF-Analysis-GCC-E2E-028.md", "2026-03-27-GCC-PMF-Analysis-GCC-E2E-029.md")
    slides = json.loads(raw)

    # Update custom agenda (second slide)
    if slides[1].get("layout_name") == "Section Title" and "Agenda" in json.dumps(slides[1]):
        slides[1]["text_boxes"][1]["text"] = (
            "1. Executive summary and research challenge\n\n"
            "2. Strategic context and product strategy\n\n"
            "3. PESTEL analysis\n\n"
            "4. Competitive landscape\n\n"
            "5. Buyer signals, ideation, interviews\n\n"
            "6. Themes, triangulation, gap analysis\n\n"
            "7. Priority roadmap recommendations"
        )

    # Find PESTEL section index
    pestel_idx = None
    for i, s in enumerate(slides):
        tbs = s.get("text_boxes") or []
        for tb in tbs:
            if tb.get("text") == "S E C T I O N  0 4\nPESTEL":
                pestel_idx = i
                break
        if pestel_idx is not None:
            break
    if pestel_idx is None:
        raise SystemExit("PESTEL section not found")

    # Renumber section titles after insert
    for s in slides:
        for tb in s.get("text_boxes") or []:
            tx = tb.get("text")
            if isinstance(tx, str) and tx in SECTION_REMAP:
                tb["text"] = SECTION_REMAP[tx]

    # Insert product strategy block before (old) PESTEL — remapping already changed label to 05; find 05 PESTEL
    pestel_idx = None
    for i, s in enumerate(slides):
        for tb in s.get("text_boxes") or []:
            if tb.get("text") == "S E C T I O N  0 5\nPESTEL":
                pestel_idx = i
                break
        if pestel_idx is not None:
            break

    insert_block = product_strategy_slides()
    for j, block_slide in enumerate(insert_block):
        slides.insert(pestel_idx + j, copy.deepcopy(block_slide))

    # Legal slide: find Title Only_Alt with Legal
    for s in slides:
        if s.get("placeholders", {}).get("0", {}).get("text") == "Legal":
            for tb in s.get("text_boxes") or []:
                if "paragraphs" in tb:
                    tb["paragraphs"] = legal_slide_paragraphs()
                    tb["font_size_pt"] = 12
            s["speaker_notes"] = (
                "• Six GCC data regimes plus EU cross-border; deal-time Legal for QA/KW/BH/OM.\n\n"
                "References:\n"
                "• https://www.dlapiper.com/en-be/insights/publications/2024/02/saudi-arabias-new-personal-data-protection-law-in-force\n"
                "• https://uaelegislation.gov.ae/en/legislations/1972\n"
                "• https://www.cra.gov.qa/document/data-protection-law-no-13-of-2016\n"
                "• https://citra.gov.kw/sites/en/LegalReferences/Data_Privacy_Protection_Regulation.pdf\n"
                "• https://www.pdp.gov.bh/en/index.html\n"
                "• https://mtcit.gov.om/sectors/governance/personal\n"
                "• " + REPORT
            )
            break

    OUT.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", OUT, "slides:", len(slides))


if __name__ == "__main__":
    main()
