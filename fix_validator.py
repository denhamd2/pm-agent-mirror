with open('/Users/david.denham/product-manager-agent/scripts/validate_slide_spec.py', 'r') as f:
    content = f.read()

limits_old = """SLIDE_TYPE_LIMITS = {
    "pestel": {"max_l1": 4, "max_chars": 240, "max_lines": 7.5},
    "exec_summary": {"max_l1": 4, "max_chars": 250, "max_lines": 8},
    "customer": {"max_l1": 4, "max_chars": 220, "max_lines": 7},
    "sme": {"max_l1": 6, "max_chars": 200, "max_lines": 8},
    "themes": {"max_l1": 6, "max_chars": 180, "max_lines": 8},
    "recommendation": {"max_l1": 5, "max_chars": 220, "max_lines": 8},
    "default": {"max_l1": 6, "max_chars": 250, "max_lines": 7.5},
}"""

limits_new = """SLIDE_TYPE_LIMITS = {
    "pestel":         {"min_l1": 3, "max_l1": 4, "min_chars": 160, "max_chars": 240, "max_lines": 7.5},
    "exec_summary":   {"min_l1": 3, "max_l1": 4, "min_chars": 180, "max_chars": 250, "max_lines": 8},
    "customer":       {"min_l1": 3, "max_l1": 4, "min_chars": 160, "max_chars": 220, "max_lines": 7},
    "sme":            {"min_l1": 4, "max_l1": 6, "min_chars": 140, "max_chars": 200, "max_lines": 8},
    "themes":         {"min_l1": 3, "max_l1": 6, "min_chars": 120, "max_chars": 180, "max_lines": 8},
    "recommendation": {"min_l1": 4, "max_l1": 5, "min_chars": 140, "max_chars": 220, "max_lines": 8},
    "default":        {"min_l1": 3, "max_l1": 6, "min_chars": 100, "max_chars": 250, "max_lines": 7.5},
}"""

content = content.replace(limits_old, limits_new)

checks_old = """        l1_count = sum(1 for p in paragraphs if p["level"] >= 1)
        max_chars = max((p["chars"] for p in paragraphs if p["level"] >= 1), default=0)
        rendered = estimate_rendered_lines(paragraphs)

        max_lines = limits["max_lines"]

        if rendered > max_lines:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Density overflow - "
                f"{rendered:.1f} rendered lines (max {max_lines}). "
                f"L1 bullets: {l1_count}, longest: {max_chars} chars. "
                f"Title: \\"{title[:50]}\\""
            )
            density_violations += 1

        if l1_count > limits["max_l1"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Too many L1 bullets - "
                f"{l1_count} (max {limits['max_l1']}). Title: \\"{title[:50]}\\""
            )

        if max_chars > limits["max_chars"]:
            warnings.append(
                f"Slide {slide_num} ({slide_type}): Longest bullet {max_chars} chars "
                f"(target {limits['max_chars']}). Title: \\"{title[:50]}\\""
            )"""

checks_new = """        l1_count = sum(1 for p in paragraphs if p["level"] >= 1)
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
                f"Title: \\"{title[:50]}\\""
            )
            density_violations += 1

        if l1_count > limits["max_l1"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Too many L1 bullets - "
                f"{l1_count} (max {limits['max_l1']}). Title: \\"{title[:50]}\\""
            )
            density_violations += 1
            
        if l1_count > 0 and l1_count < limits["min_l1"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Too few L1 bullets - "
                f"{l1_count} (min {limits['min_l1']}). Title: \\"{title[:50]}\\""
            )
            density_violations += 1

        if max_chars > limits["max_chars"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Longest bullet {max_chars} chars "
                f"(max {limits['max_chars']}). Title: \\"{title[:50]}\\""
            )
            density_violations += 1
            
        if l1_count > 0 and median_chars < limits["min_chars"]:
            errors.append(
                f"Slide {slide_num} ({slide_type}): Bullets too thin - median {median_chars} chars "
                f"(min {limits['min_chars']}). Title: \\"{title[:50]}\\""
            )
            density_violations += 1"""

content = content.replace(checks_old, checks_new)

with open('/Users/david.denham/product-manager-agent/scripts/validate_slide_spec.py', 'w') as f:
    f.write(content)
