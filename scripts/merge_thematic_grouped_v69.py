#!/usr/bin/env python3
"""Replace 6 single-theme slides with 2 grouped thematic slides (v65 pattern)."""
import json

from slide_specs_dir import SLIDE_SPECS_DIR

path = SLIDE_SPECS_DIR / "slides_spec_v69.json"
slides = json.loads(path.read_text(encoding="utf-8"))

def find_idx(title_substr):
    for i, s in enumerate(slides):
        ph = s.get("placeholders") or {}
        t = ph.get("0", {}).get("text", "")
        if title_substr in t:
            return i
    raise KeyError(title_substr)

i0 = find_idx("Funnel Density")
i1 = find_idx("Cross-Source Validation Matrix")
if i1 <= i0:
    raise SystemExit("bad indices")

# Remove [i0:i1]
del slides[i0:i1]

sub = lambda t: {"level": 0, "text": [{"text": t, "bold": True, "font_size_pt": 12}]}
tb = {
    "left_inches": 0.7,
    "top_inches": 1.2,
    "width_inches": 8.6,
    "height_inches": 2.8,
    "font_name": "Archivo",
    "font_size_pt": 12,
    "color": "ink",
}

g1 = {
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {"0": {"text": "Validated Themes 1-4 (GCC)"}},
    "text_boxes": [
        {
            **tb,
            "paragraphs": [
                sub("Funnel density and ergonomics"),
                {
                    "level": 1,
                    "text": "P1–P3 cite navigation tax, notes before screen, weak per-requisition funnel; internal ideation shows very high volume on candidates and application flow.",
                },
                {
                    "level": 1,
                    "text": "Business impact: throughput falls in GCC and global enterprise; export-heavy dashboards raise time-to-fill and churn risk.",
                },
                {
                    "level": 1,
                    "text": "Product implications: consolidated review surfaces, clearer BPS guidance on notes, Hub and funnel dashboards, transparent move and copy.",
                },
                sub("Discovery, search, and matching"),
                {
                    "level": 1,
                    "text": "P2 wants database-wide match including non-applicants at two-million scale; P3 explores HiredScore; baseline classifies semantic match without add-on SKUs as true gap.",
                },
                {
                    "level": 1,
                    "text": "Business impact: weak discovery undermines differentiation versus Zoho Zia and SAP Winston when entitlements are unclear.",
                },
                {
                    "level": 1,
                    "text": "Product implications: explicit Skills Cloud and HiredScore entitlements, explainability, human review, similar-candidate on requisitions.",
                },
                sub("Scheduling and orchestration"),
                {
                    "level": 1,
                    "text": "P1 wants end-to-end orchestration with KSA notice, consent, panel metadata; P2 favours Outlook in trials; PG-00009165 flags Microsoft stack narrative (supporting).",
                },
                {
                    "level": 1,
                    "text": "Business impact: fragmentation delays interviews and weakens Paradox value versus Oracle calendar stories.",
                },
                {
                    "level": 1,
                    "text": "Product implications: clear Scheduling SKU story, configurable compliance hints, panel metadata, PS and tenant validation before absolute native claims.",
                },
                sub("Offers, documents, configuration"),
                {
                    "level": 1,
                    "text": "P1 cites offer rigidity; P3 Arabic square glyphs in Docs; baseline flags RTL complex generated documents as workaround-class.",
                },
                {
                    "level": 1,
                    "text": "Business impact: document failures block GCC and RTL markets; offline contract workarounds increase rework.",
                },
                {
                    "level": 1,
                    "text": "Product implications: faster safe configuration, RTL hardening with customer UAT, structured in-flow document collection.",
                },
            ],
        }
    ],
    "speaker_notes": "• Grouped themes 1-4 for executive pacing; twelve bullets across four themes.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-029.md",
}

g2 = {
    "master_index": 1,
    "layout_name": "Title Only_Alt",
    "placeholders": {"0": {"text": "Validated Themes 5-6 (GCC)"}},
    "text_boxes": [
        {
            **tb,
            "paragraphs": [
                sub("Nationalisation and local reporting"),
                {
                    "level": 1,
                    "text": "P1–P3 describe quotas, penalties, custom fields, franchise Excel; PESTEL cites Emiratization and Nitaqat enforcement.",
                },
                {
                    "level": 1,
                    "text": "Business impact: audit-ready reporting is board-level; workaround positioning must stay honest versus competitor statutory packaging.",
                },
                {
                    "level": 1,
                    "text": "Product implications: first-class dimensions and report packs; honest native versus workaround for MOHRE and nationalisation dashboards; PS patterns.",
                },
                sub("Omnichannel comms and journey"),
                {
                    "level": 1,
                    "text": "P1–P2 treat WhatsApp as speed-critical; P3 bans official WhatsApp; 1,452 internal comms ideas; baseline lists first-party core WhatsApp and UAE/Saudi SMS as workaround-class paths (partner or Twilio/Studio) versus Oracle packaged WhatsApp.",
                },
                {
                    "level": 1,
                    "text": "Business impact: policy divergence needs multi-tenant controls and audit trails; bake-offs compare omnichannel depth to Oracle and regional bundles.",
                },
                {
                    "level": 1,
                    "text": "Product implications: Paradox activation, SMS framework paths with consent and retention, verified email and Teams outreach, mobile apply quality.",
                },
            ],
        }
    ],
    "speaker_notes": "• Grouped themes 5-6; six bullets across two themes.\n\nReferences:\n• research/GCC/thematic-analysis/2026-03-27-GCC-PMF-Analysis-GCC-E2E-029.md",
}

# Insert at same position i0
slides[i0:i0] = [g1, g2]

path.write_text(json.dumps(slides, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("Thematic merged; slide count:", len(slides))
