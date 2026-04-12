#!/usr/bin/env python3
"""
Insert Employment Agreement (EA) pre/post median duration + correlation columns into
docs/add-documents-adoption-impact.md.

EA tenant-month medians are read from design/data-employment-agreement-durations.ts
(Completed rows only; median_days field).

Methodology mirrors the existing Offer block in the doc:
  • Pre window: adoption-12 .. adoption-1 (calendar months)
  • Post window: adoption+1 .. adoption+12
  • Correlation: Pearson r between add_docs_active (0 pre, 1 post) and monthly median outcome across adoption-12..adoption+12, excluding the adoption month (month 0)

Environment note: the impact doc uses SANDBOX for IUM + Offer; EA rows in the TS bundle
are PROD. Re-run against a SANDBOX export of the same query before exec readouts.
"""

from __future__ import annotations

import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EA_TS = ROOT / "design" / "data-employment-agreement-durations.ts"
MD_PATH = ROOT / "docs" / "add-documents-adoption-impact.md"

ROW_RE = re.compile(
    r'\[\s*"([^"]+)"\s*,\s*"employment_agreement"\s*,\s*"(\d{4}-\d{2})"\s*,\s*"Completed"\s*,'
    r"\s*\d+\s*,\s*\d+\s*,\s*(null|-?\d+(?:\.\d+)?)\s*,\s*(null|-?\d+(?:\.\d+)?)\s*,\s*(null|-?\d+(?:\.\d+)?)\s*,"
)


def add_months(ym: str, delta: int) -> str:
    y, m = map(int, ym.split("-"))
    idx = y * 12 + (m - 1) + delta
    ny, nm = divmod(idx, 12)
    return f"{ny:04d}-{nm + 1:02d}"


def parse_ea_medians(path: Path) -> dict[tuple[str, str], float]:
    out: dict[tuple[str, str], float] = {}
    text = path.read_text(encoding="utf-8")
    for m in ROW_RE.finditer(text):
        tenant, month, _avg_d, med_d, _avg_st = m.groups()
        if med_d == "null":
            continue
        out[(tenant, month)] = float(med_d)
    return out


def month_range_inclusive(start: str, end: str) -> list[str]:
    """Inclusive list of YYYY-MM from start to end."""
    y1, m1 = map(int, start.split("-"))
    y2, m2 = map(int, end.split("-"))
    i1 = y1 * 12 + m1 - 1
    i2 = y2 * 12 + m2 - 1
    res = []
    for i in range(i1, i2 + 1):
        y, m = divmod(i, 12)
        res.append(f"{y:04d}-{m + 1:02d}")
    return res


def median(vals: list[float]) -> float | None:
    if not vals:
        return None
    s = sorted(vals)
    n = len(s)
    mid = n // 2
    if n % 2:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2.0


def pearson_r(xs: list[float], ys: list[float]) -> float | None:
    if len(xs) < 3 or len(xs) != len(ys):
        return None
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((xs[i] - mx) * (ys[i] - my) for i in range(n))
    dx = sum((x - mx) ** 2 for x in xs)
    dy = sum((y - my) ** 2 for y in ys)
    if dx <= 0 or dy <= 0:
        return None
    return num / math.sqrt(dx * dy)


def ea_stats_for_adopter(
    tenant: str,
    adoption: str,
    medians: dict[tuple[str, str], float],
) -> tuple[str, str, str, str, str, str]:
    """
    Returns:
      ea_pre, ea_post, ea_delta_pct, ea_r, ea_pre_m, ea_post_m
    as formatted strings for the markdown table (empty string if n/a).
    """
    pre_start = add_months(adoption, -12)
    pre_end = add_months(adoption, -1)
    post_start = add_months(adoption, 1)
    post_end = add_months(adoption, 12)
    corr_start = pre_start
    corr_end = post_end

    pre_months = month_range_inclusive(pre_start, pre_end)
    post_months = month_range_inclusive(post_start, post_end)
    pre_vals = [medians[(tenant, m)] for m in pre_months if (tenant, m) in medians]
    post_vals = [medians[(tenant, m)] for m in post_months if (tenant, m) in medians]

    pre_med = median(pre_vals)
    post_med = median(post_vals)

    # Correlation months: full window excluding adoption month
    corr_months = month_range_inclusive(corr_start, corr_end)
    corr_months = [m for m in corr_months if m != adoption]
    xs: list[float] = []
    ys: list[float] = []
    for m in corr_months:
        if (tenant, m) not in medians:
            continue
        xs.append(1.0 if m > adoption else 0.0)
        ys.append(medians[(tenant, m)])

    r = pearson_r(xs, ys)
    r_s = f"{r:.3f}" if r is not None else ""

    pre_s = f"{pre_med:.2f}" if pre_med is not None else ""
    post_s = f"{post_med:.2f}" if post_med is not None else ""
    delta_s = ""
    if pre_med is not None and post_med is not None and pre_med > 0:
        delta_s = f"{(post_med - pre_med) / pre_med * 100:.1f}%"

    return pre_s, post_s, delta_s, r_s, str(len(pre_vals)), str(len(post_vals))


def split_table_row(line: str) -> list[str]:
    """Split a markdown table row; preserve trailing empty cells (do not use strip('|'))."""
    s = line.strip()
    if len(s) >= 2 and s.startswith("|") and s.endswith("|"):
        s = s[1:-1]
    return [c.strip() for c in s.split("|")]


def merge_row(cells: list[str], ea: tuple[str, str, str, str, str, str]) -> list[str]:
    """Insert EA columns after Offer r (index 5)."""
    if len(cells) < 20:
        return cells
    pre, post, dlt, r, pm, psm = ea
    return (
        cells[:6]
        + [pre, post, dlt, r]
        + cells[6:14]
        + cells[14:16]
        + [pm, psm]
        + cells[16:20]
    )


def merge_header(cells: list[str]) -> list[str]:
    if len(cells) < 20:
        return cells
    ea_hdr = ["EA pre (d)", "EA post (d)", "EA delta %", "EA r"]
    return (
        cells[:6]
        + ea_hdr
        + cells[6:14]
        + cells[14:16]
        + ["EA pre m", "EA post m"]
        + cells[16:20]
    )


def main() -> int:
    medians = parse_ea_medians(EA_TS)
    lines = MD_PATH.read_text(encoding="utf-8").splitlines()
    out_lines: list[str] = []
    for line in lines:
        if line.startswith("|Tenant|"):
            if "EA pre (d)" in line:
                out_lines.append(line)
            else:
                cells = split_table_row(line)
                while len(cells) < 20:
                    cells.append("")
                out_lines.append("|" + "|".join(merge_header(cells[:20])) + "|")
            continue
        if line.startswith("|---|"):
            ncols = len(split_table_row(out_lines[-1])) if out_lines else 26
            out_lines.append("|" + "|".join(["---"] * ncols) + "|")
            continue
        if line.startswith("|") and not line.startswith("|##"):
            cells = split_table_row(line)
            if len(cells) >= 1 and cells[0] == "Tenant":
                out_lines.append(line)
                continue
            if len(cells) >= 2 and cells[0]:
                if len(cells) == 26:
                    out_lines.append(line)
                    continue
                tenant, adoption = cells[0], cells[1]
                while len(cells) < 20:
                    cells.append("")
                cells = cells[:20]
                ea = ea_stats_for_adopter(tenant, adoption, medians)
                merged = merge_row(cells, ea)
                out_lines.append("|" + "|".join(merged) + "|")
                continue
            out_lines.append(line)
            continue
        if line.startswith("- Source tables:") and "Employment Agreement duration" not in line:
            out_lines.append(
                "- Source tables: `dw.swh_raw.internal_usage_metrics_report_kafka` "
                "(metrics 1760, 2359, 2358), `dw.swh.bp_event_stats` "
                "(Offer duration, SANDBOX), `dw.swh.bp_event_stats` "
                "(Employment Agreement duration — `bp_type_id` = "
                "`Propose Compensation Offer/Employment Agreement`, PROD slice "
                "materialised in `data-employment-agreement-durations.ts`)"
            )
            continue
        out_lines.append(line)

    text = "\n".join(out_lines)
    if "EA columns use the same pre/post windows" not in text:
        text = text.rstrip() + (
            "\n\n- EA columns use the same pre/post windows and correlation definition as Offer. "
            "They are populated from Completed-event **median_days** in "
            "`data-employment-agreement-durations.ts` (PROD). For SANDBOX parity with the IUM "
            "and Offer columns, re-materialise tenant-month EA medians from SANDBOX and re-run "
            "`scripts/merge_ea_into_add_documents_adoption_md.py` after pointing it at that export.\n"
            "- EA is only meaningful for tenants that run "
            "`Propose Compensation Offer/Employment Agreement`; empty EA cells indicate no "
            "Completed median coverage in the pre/post windows.\n"
        )

    MD_PATH.write_text(text + "\n", encoding="utf-8")
    print(f"Updated {MD_PATH} (EA rows keyed from {len(medians):,} tenant-month medians)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
