#!/usr/bin/env python3
"""
Build a defensible Add Documents impact summary for Offer and Employment Agreement.

Inputs:
  - docs/add-documents-adoption-impact.md (tenant-level pre/post medians + coverage)

Output:
  - docs/add-documents-adoption-impact-defensible.md
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from statistics import mean, median

ROOT = Path(__file__).resolve().parents[1]
SRC_MD = ROOT / "docs" / "add-documents-adoption-impact.md"
OUT_MD = ROOT / "docs" / "add-documents-adoption-impact-defensible.md"


@dataclass
class Row:
    tenant: str
    adoption_month: str
    offer_pre: float | None
    offer_post: float | None
    ea_pre: float | None
    ea_post: float | None
    offer_pre_m: int | None
    offer_post_m: int | None
    ea_pre_m: int | None
    ea_post_m: int | None
    ttf_pre: float | None
    ttf_post: float | None
    tth_pre: float | None
    tth_post: float | None


@dataclass
class EffectSummary:
    n: int
    pre_median: float | None
    post_median: float | None
    level_change_median: float | None
    level_change_winsor_mean: float | None
    weighted_level_change: float | None
    ci_low: float | None
    ci_high: float | None
    avg_pre_m: float | None
    avg_post_m: float | None


def split_row(line: str) -> list[str]:
    s = line.strip()
    if len(s) >= 2 and s.startswith("|") and s.endswith("|"):
        s = s[1:-1]
    return [c.strip() for c in s.split("|")]


def to_float(s: str) -> float | None:
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def to_int(s: str) -> int | None:
    if not s:
        return None
    try:
        return int(float(s))
    except ValueError:
        return None


def parse_rows(path: Path) -> list[Row]:
    lines = path.read_text(encoding="utf-8").splitlines()
    header = next((x for x in lines if x.startswith("|Tenant|")), None)
    if not header:
        raise RuntimeError("Could not find table header.")
    cols = split_row(header)
    idx = {name: i for i, name in enumerate(cols)}

    rows: list[Row] = []
    for line in lines:
        if not line.startswith("|") or line.startswith("|---") or line.startswith("|Tenant|"):
            continue
        cells = split_row(line)
        if len(cells) < len(cols):
            continue
        rows.append(
            Row(
                tenant=cells[idx["Tenant"]],
                adoption_month=cells[idx["Adoption month"]],
                offer_pre=to_float(cells[idx["Offer pre (d)"]]),
                offer_post=to_float(cells[idx["Offer post (d)"]]),
                ea_pre=to_float(cells[idx["EA pre (d)"]]),
                ea_post=to_float(cells[idx["EA post (d)"]]),
                offer_pre_m=to_int(cells[idx["Offer pre m"]]),
                offer_post_m=to_int(cells[idx["Offer post m"]]),
                ea_pre_m=to_int(cells[idx["EA pre m"]]),
                ea_post_m=to_int(cells[idx["EA post m"]]),
                ttf_pre=to_float(cells[idx["TTF pre (d)"]]),
                ttf_post=to_float(cells[idx["TTF post (d)"]]),
                tth_pre=to_float(cells[idx["TTH pre (d)"]]),
                tth_post=to_float(cells[idx["TTH post (d)"]]),
            )
        )
    return rows


def winsorise(values: list[float], lower_pct: float, upper_pct: float) -> list[float]:
    if not values:
        return []
    s = sorted(values)
    n = len(s)
    lo_i = max(0, min(n - 1, int(math.floor((lower_pct / 100.0) * (n - 1)))))
    hi_i = max(0, min(n - 1, int(math.ceil((upper_pct / 100.0) * (n - 1)))))
    lo = s[lo_i]
    hi = s[hi_i]
    return [min(max(v, lo), hi) for v in values]


def bootstrap_ci(values: list[float], stat_fn, n_boot: int = 2000, alpha: float = 0.05) -> tuple[float | None, float | None]:
    if len(values) < 3:
        return None, None
    rng = random.Random(42)
    n = len(values)
    stats: list[float] = []
    for _ in range(n_boot):
        sample = [values[rng.randrange(n)] for _ in range(n)]
        stats.append(stat_fn(sample))
    stats.sort()
    lo = int((alpha / 2) * (n_boot - 1))
    hi = int((1 - alpha / 2) * (n_boot - 1))
    return stats[lo], stats[hi]


def summarise(rows: list[Row], outcome: str, min_pre_m: int, min_post_m: int, winsor: tuple[float, float]) -> EffectSummary:
    pre_vals: list[float] = []
    post_vals: list[float] = []
    deltas: list[float] = []
    weights: list[float] = []
    pre_ms: list[int] = []
    post_ms: list[int] = []

    for r in rows:
        if outcome == "offer":
            pre, post, pre_m, post_m = r.offer_pre, r.offer_post, r.offer_pre_m, r.offer_post_m
        else:
            pre, post, pre_m, post_m = r.ea_pre, r.ea_post, r.ea_pre_m, r.ea_post_m
        if pre is None or post is None or pre_m is None or post_m is None:
            continue
        if pre_m < min_pre_m or post_m < min_post_m:
            continue
        pre_vals.append(pre)
        post_vals.append(post)
        deltas.append(post - pre)
        weights.append(float(min(pre_m, post_m)))
        pre_ms.append(pre_m)
        post_ms.append(post_m)

    n = len(deltas)
    if n == 0:
        return EffectSummary(0, None, None, None, None, None, None, None, None, None)
    w_denom = sum(weights)
    weighted = sum(d * w for d, w in zip(deltas, weights)) / w_denom if w_denom > 0 else None
    wd = winsorise(deltas, winsor[0], winsor[1])
    ci_lo, ci_hi = bootstrap_ci(wd, mean)
    return EffectSummary(
        n=n,
        pre_median=median(pre_vals),
        post_median=median(post_vals),
        level_change_median=median(deltas),
        level_change_winsor_mean=mean(wd),
        weighted_level_change=weighted,
        ci_low=ci_lo,
        ci_high=ci_hi,
        avg_pre_m=mean(pre_ms),
        avg_post_m=mean(post_ms),
    )


def choose_threshold(rows: list[Row], outcome: str, preferred: int = 6, fallback: int = 3, min_n: int = 5) -> int:
    preferred_s = summarise(rows, outcome, preferred, preferred, (5, 95))
    if preferred_s.n >= min_n:
        return preferred
    fallback_s = summarise(rows, outcome, fallback, fallback, (5, 95))
    if fallback_s.n >= min_n:
        return fallback
    return 1


def fmt(v: float | None, d: int = 3) -> str:
    return "n/a" if v is None else f"{v:.{d}f}"


def sensitivity(rows: list[Row], outcome: str) -> list[tuple[int, str, int, float | None, float | None]]:
    out: list[tuple[int, str, int, float | None, float | None]] = []
    for m in (3, 6, 9):
        for name, bounds in (("none", (0, 100)), ("w10-90", (10, 90)), ("w05-95", (5, 95))):
            s = summarise(rows, outcome, m, m, bounds)
            out.append((m, name, s.n, s.level_change_median, s.level_change_winsor_mean))
    return out


def segment_checks(rows: list[Row], outcome: str, min_m: int) -> list[tuple[str, int, float | None, float | None]]:
    out: list[tuple[str, int, float | None, float | None]] = []
    for year in ("2023", "2024", "2025", "2026"):
        cohort = [r for r in rows if r.adoption_month.startswith(year)]
        s = summarise(cohort, outcome, min_m, min_m, (5, 95))
        out.append((f"adoption-year-{year}", s.n, s.level_change_median, s.level_change_winsor_mean))

    low: list[Row] = []
    high: list[Row] = []
    for r in rows:
        base = r.offer_pre if outcome == "offer" else r.ea_pre
        if base is None:
            continue
        (low if base < 1.0 else high).append(r)
    s_low = summarise(low, outcome, min_m, min_m, (5, 95))
    s_high = summarise(high, outcome, min_m, min_m, (5, 95))
    out.append(("baseline-<1d", s_low.n, s_low.level_change_median, s_low.level_change_winsor_mean))
    out.append(("baseline->=1d", s_high.n, s_high.level_change_median, s_high.level_change_winsor_mean))
    return out


def placebo(rows: list[Row], min_m: int) -> tuple[EffectSummary, EffectSummary]:
    ttf_rows: list[Row] = []
    tth_rows: list[Row] = []
    for r in rows:
        ttf_rows.append(
            Row(
                tenant=r.tenant,
                adoption_month=r.adoption_month,
                offer_pre=r.ttf_pre,
                offer_post=r.ttf_post,
                ea_pre=None,
                ea_post=None,
                offer_pre_m=r.offer_pre_m,
                offer_post_m=r.offer_post_m,
                ea_pre_m=None,
                ea_post_m=None,
                ttf_pre=None,
                ttf_post=None,
                tth_pre=None,
                tth_post=None,
            )
        )
        tth_rows.append(
            Row(
                tenant=r.tenant,
                adoption_month=r.adoption_month,
                offer_pre=r.tth_pre,
                offer_post=r.tth_post,
                ea_pre=None,
                ea_post=None,
                offer_pre_m=r.offer_pre_m,
                offer_post_m=r.offer_post_m,
                ea_pre_m=None,
                ea_post_m=None,
                ttf_pre=None,
                ttf_post=None,
                tth_pre=None,
                tth_post=None,
            )
        )
    return (
        summarise(ttf_rows, "offer", min_m, min_m, (5, 95)),
        summarise(tth_rows, "offer", min_m, min_m, (5, 95)),
    )


def build_report(rows: list[Row]) -> str:
    offer_m = choose_threshold(rows, "offer")
    ea_m = choose_threshold(rows, "ea")
    offer = summarise(rows, "offer", offer_m, offer_m, (5, 95))
    ea = summarise(rows, "ea", ea_m, ea_m, (5, 95))
    ctrl_m = min(offer_m, ea_m)
    ttf_ctrl, tth_ctrl = placebo(rows, ctrl_m)
    offer_s = sensitivity(rows, "offer")
    ea_s = sensitivity(rows, "ea")
    offer_seg = segment_checks(rows, "offer", offer_m)
    ea_seg = segment_checks(rows, "ea", ea_m)
    today = datetime.now().strftime("%d %B %Y")

    lines: list[str] = []
    lines.append("# Add Documents Impact - Defensible Offer/EA Estimate")
    lines.append("")
    lines.append(f"- Generated: {today}")
    lines.append("- Source: `docs/add-documents-adoption-impact.md` (589 Add Documents adopters)")
    lines.append("- Environment lock: Offer values in this source are SANDBOX; EA values are currently PROD-derived from `data-employment-agreement-durations.ts`.")
    lines.append("- Metric-definition lock: this report estimates operational BP event-duration level shifts (`post_days - pre_days`), not the tracker chain metric (`Time in Offer/EA` from first event start to final completed event on one job application).")
    lines.append(
        f"- Cohort gate for primary estimate: Offer `pre_m/post_m >= {offer_m}`; "
        f"EA `pre_m/post_m >= {ea_m}`. (Auto-fallback from 6 when strict gate returns underpowered cohorts.)"
    )
    lines.append("")
    lines.append("## PM / DS Bottom Line")
    lines.append("- A single full-cohort Offer/EA impact remains non-defensible while Offer and EA are environment-misaligned and chain-metric definitions are not yet implemented.")
    lines.append("- With strict cohort rules, we can provide directional operational estimates using level effects, winsorised means, and uncertainty ranges.")
    lines.append("")
    lines.append("## Primary Estimates (days)")
    lines.append("")
    lines.append("| Outcome | Cohort n | Pre median | Post median | Median level change | Winsor mean change (5-95) | 95% CI | Weighted level change* | Avg pre m | Avg post m |")
    lines.append("|---|---:|---:|---:|---:|---:|---|---:|---:|---:|")
    lines.append(
        f"| Offer | {offer.n} | {fmt(offer.pre_median)} | {fmt(offer.post_median)} | {fmt(offer.level_change_median)} | "
        f"{fmt(offer.level_change_winsor_mean)} | [{fmt(offer.ci_low)}, {fmt(offer.ci_high)}] | {fmt(offer.weighted_level_change)} | "
        f"{fmt(offer.avg_pre_m,2)} | {fmt(offer.avg_post_m,2)} |"
    )
    lines.append(
        f"| Employment Agreement | {ea.n} | {fmt(ea.pre_median)} | {fmt(ea.post_median)} | {fmt(ea.level_change_median)} | "
        f"{fmt(ea.level_change_winsor_mean)} | [{fmt(ea.ci_low)}, {fmt(ea.ci_high)}] | {fmt(ea.weighted_level_change)} | "
        f"{fmt(ea.avg_pre_m,2)} | {fmt(ea.avg_post_m,2)} |"
    )
    lines.append("")
    lines.append("*Weighting uses month-coverage proxy (`min(pre_m, post_m)`) because explicit event volumes are not available in the current table.")
    lines.append("")
    lines.append("## Sensitivity: threshold and winsorisation")
    lines.append("")
    lines.append("### Offer")
    lines.append("| min pre/post m | winsor | n | median level change | winsor mean change |")
    lines.append("|---:|---|---:|---:|---:|")
    for m, w_name, n, med_d, w_mean in offer_s:
        lines.append(f"| {m} | {w_name} | {n} | {fmt(med_d)} | {fmt(w_mean)} |")
    lines.append("")
    lines.append("### Employment Agreement")
    lines.append("| min pre/post m | winsor | n | median level change | winsor mean change |")
    lines.append("|---:|---|---:|---:|---:|")
    for m, w_name, n, med_d, w_mean in ea_s:
        lines.append(f"| {m} | {w_name} | {n} | {fmt(med_d)} | {fmt(w_mean)} |")
    lines.append("")
    lines.append("## Segment consistency (available dimensions in this artefact)")
    lines.append("")
    lines.append("### Offer")
    lines.append("| Segment | n | median level change | winsor mean change |")
    lines.append("|---|---:|---:|---:|")
    for seg, n, med_d, w_mean in offer_seg:
        lines.append(f"| {seg} | {n} | {fmt(med_d)} | {fmt(w_mean)} |")
    lines.append("")
    lines.append("### Employment Agreement")
    lines.append("| Segment | n | median level change | winsor mean change |")
    lines.append("|---|---:|---:|---:|")
    for seg, n, med_d, w_mean in ea_seg:
        lines.append(f"| {seg} | {n} | {fmt(med_d)} | {fmt(w_mean)} |")
    lines.append("")
    lines.append("## Trend sanity checks (control-style outcomes)")
    lines.append("")
    lines.append("| Outcome | n | median level change | winsor mean change | 95% CI |")
    lines.append("|---|---:|---:|---:|---|")
    lines.append(
        f"| Time to Fill (TTF) | {ttf_ctrl.n} | {fmt(ttf_ctrl.level_change_median)} | "
        f"{fmt(ttf_ctrl.level_change_winsor_mean)} | [{fmt(ttf_ctrl.ci_low)}, {fmt(ttf_ctrl.ci_high)}] |"
    )
    lines.append(
        f"| Time to Hire (TTH) | {tth_ctrl.n} | {fmt(tth_ctrl.level_change_median)} | "
        f"{fmt(tth_ctrl.level_change_winsor_mean)} | [{fmt(tth_ctrl.ci_low)}, {fmt(tth_ctrl.ci_high)}] |"
    )
    lines.append("")
    lines.append("## Caveats and next data steps")
    lines.append("- This is not a causal estimate; it is a stricter association summary.")
    lines.append("- Offer and EA remain environment-misaligned in this source.")
    lines.append("- Next step for PM-grade headline: rebuild from warehouse with explicit event volumes and one environment, then run fixed-effects event-study / DiD panel.")
    lines.append("- Tracker chain metric remains a separate workstream until job-application event chaining is implemented.")
    lines.append("")
    return "\n".join(lines) + "\n"


def main() -> int:
    rows = parse_rows(SRC_MD)
    report = build_report(rows)
    OUT_MD.write_text(report, encoding="utf-8")
    print(f"Wrote {OUT_MD} ({len(rows)} adopters parsed).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
