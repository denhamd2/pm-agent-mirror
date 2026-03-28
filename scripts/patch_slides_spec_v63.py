#!/usr/bin/env python3
"""Patch slides_spec_v63.json for GCC-E2E-026: paths, tables, insert Rec 6."""
import json
import copy

SPEC = "/Users/david.denham/product-manager-agent/slides_spec_v63.json"

REPLACEMENTS = [
    ("2026-03-26-GCC-E2E-022", "2026-03-27-GCC-E2E-026"),
    ("gcc-competitive-scan-2026-03-26", "gcc-competitive-scan-2026-03-27"),
    ("2026-03-26-brainstorm-analysis.md", "2026-03-27-brainstorm-analysis-GCC-E2E-026.md"),
    ("2026-03-26-win-loss-analysis-GCC-E2E-022.md", "2026-03-27-win-loss-analysis-GCC-E2E-026.md"),
    ("Thematic analysis and roadmap \u2014 March 2026 (v62)", "Thematic analysis and roadmap \u2014 March 2026 (v63)"),
    ("26 March 2026", "27 March 2026"),
]

REC6_SLIDE = {
    "master_index": 1,
    "layout_name": "Title Only",
    "placeholders": {
        "0": {"text": "Rec 6 - Government Exchanges"}
    },
    "text_boxes": [
        {
            "left_inches": 0.7,
            "top_inches": 1.2,
            "width_inches": 8.6,
            "height_inches": 2.95,
            "font_name": "Archivo",
            "font_size_pt": 11,
            "color": "ink",
            "paragraphs": [
                {"level": 0, "text": [{"text": "Problem", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "Government recruiting and workforce platforms (Qiwa, Mudad-class) sit adjacent to payroll in regional suites; buyers expect credible exchange stories in GCC bake-offs.",
                },
                {"level": 0, "text": [{"text": "Evidence", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "Competitive baseline classifies Qiwa and Mudad recruiting data exchange as a true gap versus bundled regional HR narratives; Bayzat stresses Mudad payroll depth.",
                },
                {"level": 0, "text": [{"text": "Recommendation", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "Publish roadmap or packaged integration patterns for government recruiting exchanges; align competitive response with honest scope and services-led delivery where product is not yet native.",
                },
                {"level": 0, "text": [{"text": "Why now", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "Statutory adjacency and nationalisation enforcement increase scrutiny of end-to-end hire-to-report narratives in GCC RFPs.",
                },
                {"level": 0, "text": [{"text": "Success metrics", "bold": True, "font_size_pt": 12}]},
                {
                    "level": 1,
                    "text": "RFP technical pass rate on government exchange questions: +10 points in targeted pilots where patterns exist.",
                },
                {
                    "level": 1,
                    "text": "Implementation playbook reuse: two reference architectures published for services-led GCC deployments.",
                },
            ],
        }
    ],
    "speaker_notes": "\u2022 Pair with nationalisation reporting recommendation.\n\nReferences:\n\u2022 research/competitive/gcc/gcc-competitive-scan-2026-03-27-GCC-E2E-026.md",
}


def strip_table_height(slides):
    for slide in slides:
        for t in slide.get("tables") or []:
            t.pop("height_inches", None)


def replace_strings(obj):
    if isinstance(obj, str):
        s = obj
        for a, b in REPLACEMENTS:
            s = s.replace(a, b)
        return s
    if isinstance(obj, list):
        return [replace_strings(x) for x in obj]
    if isinstance(obj, dict):
        return {k: replace_strings(v) for k, v in obj.items()}
    return obj


def main():
    with open(SPEC) as f:
        slides = json.load(f)

    slides = replace_strings(slides)
    strip_table_height(slides)

    # Insert Rec 6 before "Priority Recommendations for Roadmap"
    out = []
    inserted = False
    for s in slides:
        ph = (s.get("placeholders") or {}).get("0", {}).get("text", "")
        if ph == "Priority Recommendations for Roadmap" and not inserted:
            out.append(copy.deepcopy(REC6_SLIDE))
            inserted = True
        out.append(s)
    if not inserted:
        raise SystemExit("Could not find Priority Recommendations slide")

    with open(SPEC, "w") as f:
        json.dump(out, f, indent=2)
        f.write("\n")

    print("Patched:", SPEC, "slides:", len(out))


if __name__ == "__main__":
    main()
