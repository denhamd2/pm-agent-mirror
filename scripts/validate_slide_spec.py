#!/usr/bin/env python3
"""
Slide Spec Density & Title Validator

Parses slides_spec_vN.json and validates every slide against 130 density rules
and 010 style guide constraints. BLOCKS generation if any slide fails.

Usage:
    python3 scripts/validate_slide_spec.py slides_spec_v84.json
    python3 scripts/validate_slide_spec.py slides_spec_v84.json --fix-titles

Exit codes:
    0 = all slides pass
    1 = one or more slides fail (DO NOT call create_presentation)
"""

import json
import re
import sys
from pathlib import Path

TITLE_HARD_LIMIT = 45
TITLE_TARGET = 40
MAX_RENDERED_LINES = 7
MAX_RENDERED_LINES_EXEC = 8

PROHIBITED_PATTERNS = [
    (r"\b0[0-9]{2}\b", "Rule number reference (e.g. 060, 130)"),
    (r"HRREC-\d+", "Jira ticket ID"),
    (r"\bDeployment Agent\b", "MCP tool name"),
    (r"\bDA thread", "MCP abbreviation"),
    (r"\bvalue-metrics\b", "Skill reference"),
    (r"\b(agent|orchestrator|pipeline|MCP|invoke|prompt|E2E|HITL|handoff|attestation)\b",
     "Prohibited agent/system terminology"),
    (r"\bPMF\b", "Research methodology acronym (use 'product-market fit' or remove)"),
]

PROHIBITED_NAMES = []

SLIDE_TYPE_LIMITS = {
    "pestel":         {"min_l1": 5, "max_l1": 6, "min_chars": 180, "max_chars": 240, "max_lines": 13.5},
    "exec_summary":   {"min_l1": 3, "max_l1": 4, "min_chars": 180, "max_chars": 250, "max_lines": 10.5},
    "customer":       {"min_l1": 4, "max_l1": 5, "min_chars": 200, "max_chars": 240, "max_lines": 11.5},
    "sme":            {"min_l1": 5, "max_l1": 8, "min_chars": 180, "max_chars": 220, "max_lines": 14.5},
    "themes":         {"min_l1": 5, "max_l1": 6, "min_chars": 140, "max_chars": 180, "max_lines": 14.5},
    "recommendation": {"min_l1": 4, "max_l1": 5, "min_chars": 160, "max_chars": 220, "max_lines": 10.5},
    "default":        {"min_l1": 3, "max_l1": 6, "min_chars": 100, "max_chars": 250, "max_lines": 8.5},
}


def classify_slide(title: str) -> str:
    t = title.lower()
    if "executive summary" in t:
        return "exec_summary"
    if t in ("political", "economic", "social", "technological", "environmental", "legal"):
        return "pestel"
    if re.match(r"^p\d+ ", t) or "customer interview" in t:
        return "customer"
    if re.match(r"^sme\d+ ", t) or "internal sme" in t:
        return "sme"
    if "theme" in t:
        return "themes"
    if "recommendation" in t:
        return "recommendation"
    return "default"


def get_title(slide: dict) -> str:
    placeholders = slide.get("placeholders", {})
    p0 = placeholders.get("0", {})
    if isinstance(p0, dict):
        return p0.get("text", "")
    if isinstance(p0, str):
        return p0
    return ""


def get_text_content(slide: dict) -> list[dict]:
    paragraphs = []
    for tb in slide.get("text_boxes", []):
        for para in tb.get("paragraphs", []):
            level = para.get("level", 0)
            text = para.get("text", "")
            if isinstance(text, list):
                text = "".join(r.get("text", "") for r in text)
            paragraphs.append({"level": level, "text": text, "chars": len(text)})
    return paragraphs


def estimate_rendered_lines(paragraphs: list[dict]) -> float:
    lines = 0.0
    for p in paragraphs:
        if p["level"] == 0:
            lines += 0.5
        else:
            chars = p["chars"]
            if chars <= 80:
                lines += 1.0
            elif chars <= 180:
                lines += 1.5
            elif chars <= 280:
                lines += 2.5
            else:
                lines += 3.0
    return lines


def check_prohibited_language(slide: dict, slide_num: int) -> list[str]:
    errors = []
    all_text = []

    title = get_title(slide)
    if title:
        all_text.append(title)

    for tb in slide.get("text_boxes", []):
        t = tb.get("text", "")
        if isinstance(t, str) and t:
            all_text.append(t)
        for para in tb.get("paragraphs", []):
            pt = para.get("text", "")
            if isinstance(pt, list):
                pt = "".join(r.get("text", "") for r in pt)
            if pt:
                all_text.append(pt)

    combined = " ".join(all_text)

    for pattern, description in PROHIBITED_PATTERNS:
        matches = re.findall(pattern, combined, re.IGNORECASE)
        if matches:
            matched_text = ", ".join(set(m if isinstance(m, str) else m[0] for m in matches[:3]))
            errors.append(f"Slide {slide_num}: {description} found: '{matched_text}'")

    for name in PROHIBITED_NAMES:
        if name.lower() in combined.lower():
            errors.append(f"Slide {slide_num}: Real name '{name}' found (must anonymise)")

    return errors


def check_font_sizes(slide: dict, slide_num: int) -> list[str]:
    errors = []
    
    for tb in slide.get("text_boxes", []):
        fs = tb.get("font_size_pt")
        if fs is not None and fs not in (7, 8, 9, 10, 12, 14, 16):
            errors.append(f"Slide {slide_num}: Invalid text_box font_size_pt {fs}. Must be 12, 14, 16 (or 7-10 for tables/charts).")
            
        for para in tb.get("paragraphs", []):
            pfs = para.get("font_size_pt")
            if pfs is not None and pfs not in (7, 8, 9, 10, 12, 14, 16):
                errors.append(f"Slide {slide_num}: Invalid paragraph font_size_pt {pfs}. Must be 12, 14, 16.")
            
            txt = para.get("text", "")
            if isinstance(txt, list):
                for r in txt:
                    rfs = r.get("font_size_pt")
                    if rfs is not None and rfs not in (7, 8, 9, 10, 12, 14, 16):
                        errors.append(f"Slide {slide_num}: Invalid run font_size_pt {rfs}. Must be 12, 14, 16.")
    return errors


def validate(spec_path: str, sme_names: list[str] | None = None) -> tuple[bool, list[str]]:
    global PROHIBITED_NAMES
    if sme_names:
        PROHIBITED_NAMES = sme_names

    with open(spec_path) as f:
        slides = json.load(f)

    errors = []
    warnings = []
    title_violations = 0
    density_violations = 0
    language_violations = 0

    for i, slide in enumerate(slides):
        slide_num = i + 1
        layout = slide.get("layout_name", "unknown")

        if layout in ("TITLE", "Bumper Slide"):
            continue

        title = get_title(slide)

        if layout == "Section Title":
            lang_errs = check_prohibited_language(slide, slide_num)
            if lang_errs:
                errors.extend(lang_errs)
                language_violations += len(lang_errs)
            continue

        if title:
            tlen = len(title)
            if tlen > TITLE_HARD_LIMIT:
                errors.append(
                    f"Slide {slide_num}: Title EXCEEDS {TITLE_HARD_LIMIT}-char limit "
                    f"({tlen} chars): \"{title}\""
                )
                title_violations += 1
            elif tlen > TITLE_TARGET:
                warnings.append(
                    f"Slide {slide_num}: Title in caution zone "
                    f"({tlen} chars, target {TITLE_TARGET}): \"{title}\""
                )

        paragraphs = get_text_content(slide)
        slide_type = classify_slide(title)
        limits = SLIDE_TYPE_LIMITS.get(slide_type, SLIDE_TYPE_LIMITS["default"])

        l1_count = sum(1 for p in paragraphs if p["level"] >= 1)
        l1_chars = [p["chars"] for p in paragraphs if p["level"] >= 1]
        max_chars = max(l1_chars, default=0)
        median_chars = sorted(l1_chars)[len(l1_chars)//2] if l1_chars else 0
        rendered = estimate_rendered_lines(paragraphs)

        max_lines = limits["max_lines"]

        if rendered > max_lines:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Density overflow - "
                f"{rendered:.1f} rendered lines (max {max_lines}). "
                f"L1 bullets: {l1_count}, longest: {max_chars} chars. "
                f"Title: \"{title[:50]}\""
            )
            density_violations += 1

        if l1_count > limits["max_l1"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Too many L1 bullets - "
                f"{l1_count} (max {limits['max_l1']}). Title: \"{title[:50]}\""
            )
            density_violations += 1
            
        if l1_count > 0 and l1_count < limits["min_l1"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Too few L1 bullets - "
                f"{l1_count} (min {limits['min_l1']}). Title: \"{title[:50]}\""
            )
            density_violations += 1

        if max_chars > limits["max_chars"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Longest bullet {max_chars} chars "
                f"(max {limits['max_chars']}). Title: \"{title[:50]}\""
            )
            density_violations += 1
            
        if l1_count > 0 and median_chars < limits["min_chars"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Bullets too thin - median {median_chars} chars "
                f"(min {limits['min_chars']}). Title: \"{title[:50]}\""
            )
            density_violations += 1

        lang_errs = check_prohibited_language(slide, slide_num)
        if lang_errs:
            errors.extend(lang_errs)
            language_violations += len(lang_errs)
            
        font_errs = check_font_sizes(slide, slide_num)
        if font_errs:
            errors.extend(font_errs)

    print("=" * 70)
    print("SLIDE SPEC VALIDATION REPORT")
    print("=" * 70)
    print(f"File: {spec_path}")
    print(f"Total slides: {len(slides)}")
    print(f"Title violations:    {title_violations}")
    print(f"Density violations:  {density_violations}")
    print(f"Language violations:  {language_violations}")
    print("-" * 70)

    if errors:
        print(f"\nERRORS ({len(errors)}) — BLOCKS generation:\n")
        for e in errors:
            print(f"  [FAIL] {e}")

    if warnings:
        print(f"\nWARNINGS ({len(warnings)}) — review recommended:\n")
        for w in warnings:
            print(f"  [WARN] {w}")

    if not errors and not warnings:
        print("\n  All slides PASS validation.")

    print("-" * 70)

    if errors:
        print(f"\nVERDICT: BLOCKED — {len(errors)} error(s). Fix before create_presentation.")
        return False, errors
    else:
        print(f"\nVERDICT: PASS — 0 errors, {len(warnings)} warning(s).")
        return True, warnings


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/validate_slide_spec.py <slides_spec_vN.json> [--sme-names Name1,Name2]")
        sys.exit(1)

    spec_file = sys.argv[1]
    sme_names = None

    for arg in sys.argv[2:]:
        if arg.startswith("--sme-names="):
            sme_names = arg.split("=", 1)[1].split(",")

    if not Path(spec_file).exists():
        print(f"Error: {spec_file} not found")
        sys.exit(1)

    passed, _ = validate(spec_file, sme_names)
    sys.exit(0 if passed else 1)
