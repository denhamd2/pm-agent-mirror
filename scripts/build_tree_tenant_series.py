#!/usr/bin/env python3
"""Build per-tenant monthly time series for every Value Driver Tree metric.

Output: design/data-tree-tenant-series.ts

Optimised for speed: queries only the last 8 months (tree shows 6) with
tight bp_type_id filters to avoid full-table scans.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
import sys
import textwrap
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "design" / "data-tree-tenant-series.ts"
PHAROS_BIN = Path("/Users/david.denham/.local/bin/pharos")

PARTITION_DAYS = 270  # ~9 months of partition coverage
YM_FLOOR = "2025-08"  # only keep months >= this


def run_pharos(sql: str) -> list[dict[str, str]]:
    env = {"PATH": f"{PHAROS_BIN.parent}:{PHAROS_BIN.parent.parent / 'bin'}:/usr/bin:/bin"}
    r = subprocess.run(
        [str(PHAROS_BIN), "sql", "run", "--sql", sql],
        cwd=ROOT, capture_output=True, text=True, check=True, env=env,
    )
    for line in reversed(r.stdout.splitlines()):
        line = line.strip()
        if line.startswith("{") and '"result"' in line:
            data = json.loads(line)["result"]["data"]
            return list(csv.DictReader(io.StringIO(data)))
    raise RuntimeError(f"No payload.\nstderr: {r.stderr[:400]}")


def sf(raw: str | None) -> float | None:
    if not raw or not raw.strip():
        return None
    try:
        v = float(raw)
        return v if v == v else None
    except (ValueError, TypeError):
        return None


def to_series(rows: list[dict], val_col: str = "val") -> dict[str, list[dict]]:
    s: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        t = (r.get("tn") or "").strip().lower()
        ym = (r.get("ym") or "").strip()
        v = sf(r.get(val_col))
        if t and ym and v is not None:
            s[t].append({"ym": ym, "value": round(v, 4)})
    for t in s:
        s[t].sort(key=lambda p: p["ym"])
    return dict(sorted(s.items()))


WD = f"wd_event_date >= to_iso8601(current_date - interval '{PARTITION_DAYS}' day)"
YM_EXPR = "CONCAT(CAST(year(CAST(creation_time AS date)) AS varchar),'-',LPAD(CAST(month(CAST(creation_time AS date)) AS varchar),2,'0'))"
YM_ED = "CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0'))"


def q_bp_dur(bp: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/86400.0),4) AS val
        FROM dw.swh.bp_event_stats
        WHERE {WD} AND bp_type_id='{bp}' AND status='Successfully Completed'
              AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_bp_comp(bp: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(100.0*SUM(CASE WHEN status='Successfully Completed' THEN 1 ELSE 0 END)
                     /NULLIF(CAST(COUNT(*) AS double),0),2) AS val
        FROM dw.swh.bp_event_stats
        WHERE {WD} AND bp_type_id='{bp}'
        GROUP BY 1,2 HAVING {YM_EXPR}>='{YM_FLOOR}' AND COUNT(*)>=5 ORDER BY 1,2
    """).strip()


def q_step(bp: str, task: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/3600.0),4) AS val
        FROM dw.swh.bp_event_record_stats
        WHERE {WD} AND bp_type_id='{bp}' AND task_name='{task}'
              AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_feedback() -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/3600.0),4) AS val
        FROM dw.swh.bp_event_record_stats
        WHERE {WD} AND task_name='Rate Interview' AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_volumes() -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_name) AS tn,
               CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',
                      LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0')) AS ym,
               COUNT(*) AS apps,
               ROUND(AVG(CAST(duration_in_hours AS double)/24.0),4) AS bp_days
        FROM dw.user_data.talent_ml_interview_initiation_make_decision_events
        WHERE wd_event_date >= to_iso8601(current_date - interval '{PARTITION_DAYS}' day)
        GROUP BY 1,2
        HAVING CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',
                       LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0'))>='{YM_FLOOR}'
        ORDER BY 1,2
    """).strip()


def q_interview_rounds() -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               CAST(COUNT(*) AS double) AS val
        FROM dw.swh.bp_event_stats
        WHERE {WD} AND bp_type_id='Interview'
        GROUP BY 1,2 HAVING {YM_EXPR}>='{YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_add_docs() -> str:
    ym_ium = "CONCAT(CAST(year AS varchar),'-',LPAD(CAST(month AS varchar),2,'0'))"
    return textwrap.dedent(f"""
        SELECT lower(tenant_name) AS tn,
               {ym_ium} AS ym,
               ROUND(AVG(try_cast(value AS double)),4) AS val
        FROM dw.swh_raw.internal_usage_metrics_report_kafka
        WHERE wd_event_date >= to_iso8601(current_date - interval '{PARTITION_DAYS}' day)
              AND metric_name='Add Document references with documents'
              AND wd_env_type='SANDBOX' AND try_cast(value AS double)>0
        GROUP BY 1,2 HAVING {ym_ium}>='{YM_FLOOR}' ORDER BY 1,2
    """).strip()


def merge(a: dict, b: dict, how: str = "avg") -> dict:
    result: dict[str, list[dict]] = {}
    for t in sorted(set(a)|set(b)):
        am = {p["ym"]: p["value"] for p in a.get(t, [])}
        bm = {p["ym"]: p["value"] for p in b.get(t, [])}
        pts = []
        for ym in sorted(set(am)|set(bm)):
            av, bv = am.get(ym), bm.get(ym)
            if av is not None and bv is not None:
                val = (av+bv)/2 if how == "avg" else av+bv
            else:
                val = av if av is not None else bv
            if val is not None:
                pts.append({"ym": ym, "value": round(val, 4)})
        if pts:
            result[t] = pts
    return dict(sorted(result.items()))


def run_step(label: str, sql: str) -> dict:
    print(f"  {label}...", end=" ", flush=True)
    rows = run_pharos(sql)
    s = to_series(rows)
    print(f"{len(s)} tenants")
    return s


def tc(d: dict) -> str:
    lines = []
    for t, pts in sorted(d.items()):
        p = ",".join(f'{{"ym":"{x["ym"]}","value":{x["value"]}}}' for x in pts)
        lines.append(f'  {json.dumps(t)}: [{p}]')
    return "{\n" + ",\n".join(lines) + "\n  }"


EA = "Propose Compensation Offer/Employment Agreement"


def main() -> None:
    print(f"Building tree tenant series (months >= {YM_FLOOR}, partition {PARTITION_DAYS}d)")

    interview_bp = run_step("[1/11] Interview BP dur", q_bp_dur("Interview"))
    offer_dur = run_step("[2/11] Offer BP dur", q_bp_dur("Offer"))
    ea_dur = run_step("[3/11] EA BP dur", q_bp_dur(EA))
    oea_dur = merge(offer_dur, ea_dur, "sum")
    print(f"         -> combined Offer+EA dur: {len(oea_dur)} tenants")

    offer_comp = run_step("[4/11] Offer completion", q_bp_comp("Offer"))
    ea_comp = run_step("[5/11] EA completion", q_bp_comp(EA))
    oea_comp = merge(offer_comp, ea_comp, "avg")
    print(f"         -> combined Offer+EA comp: {len(oea_comp)} tenants")

    print("  [6/11] Interview volumes...", end=" ", flush=True)
    vol_rows = run_pharos(q_volumes())
    job_apps: dict[str, list] = defaultdict(list)
    talent_bp: dict[str, list] = defaultdict(list)
    for r in vol_rows:
        t = (r.get("tn") or "").strip().lower()
        ym = (r.get("ym") or "").strip()
        if not t or not ym:
            continue
        av = sf(r.get("apps"))
        if av and av > 0:
            job_apps[t].append({"ym": ym, "value": round(av, 0)})
        bv = sf(r.get("bp_days"))
        if bv and bv > 0:
            talent_bp[t].append({"ym": ym, "value": round(bv, 4)})
    job_apps = dict(sorted(job_apps.items()))
    talent_bp = dict(sorted(talent_bp.items()))
    print(f"apps={len(job_apps)}, bp_time={len(talent_bp)} tenants")

    for t, pts in talent_bp.items():
        if t not in interview_bp:
            interview_bp[t] = pts
    interview_bp = dict(sorted(interview_bp.items()))

    int_rounds = run_step("[7/11] Interview rounds", q_interview_rounds())
    feedback = run_step("[8/11] Feedback time", q_feedback())

    offer_doc = run_step("[9a/11] Offer doc review", q_step("Offer", "Review Documents"))
    ea_doc = run_step("[9b/11] EA doc review", q_step(EA, "Review Documents"))
    doc_review = merge(offer_doc, ea_doc, "avg")
    print(f"         -> combined doc review: {len(doc_review)} tenants")

    offer_appr = run_step("[10a/11] Offer approval", q_step("Offer", "Bulk Approve"))
    ea_appr = run_step("[10b/11] EA approval", q_step(EA, "Bulk Approve"))
    approval = merge(offer_appr, ea_appr, "avg")
    print(f"         -> combined approval: {len(approval)} tenants")

    add_docs = run_step("[11/11] Add Documents", q_add_docs())

    all_series = {
        "time-in-interview-bp": interview_bp,
        "offer-duration": offer_dur,
        "ea-duration": ea_dur,
        "offer-ea-duration": oea_dur,
        "offer-completion": offer_comp,
        "ea-completion": ea_comp,
        "offer-ea-completion": oea_comp,
        "job-applications": job_apps,
        "interview-rounds": int_rounds,
        "feedback-time": feedback,
        "document-review": doc_review,
        "approval-time": approval,
        "add-documents": add_docs,
    }

    blocks = [f"  '{k}': {tc(v)}" for k, v in all_series.items()]
    names = sorted(set().union(*(s.keys() for s in all_series.values())))

    ts = (
        f"// Auto-generated by scripts/build_tree_tenant_series.py\n"
        f"// Generated: {date.today().isoformat()}\n"
        f"// Per-tenant monthly series for Value Driver Tree filtering.\n"
        f"// Sources: bp_event_stats, bp_event_record_stats, talent_ml_interview_*, IUM\n"
        f"\n"
        f"export interface TreeTenantPoint {{\n"
        f"  ym: string;\n"
        f"  value: number;\n"
        f"}}\n"
        f"\n"
        f"export const TREE_TENANT_SERIES: Record<string, Record<string, TreeTenantPoint[]>> = {{\n"
        + ",\n".join(blocks) +
        f"\n}};\n"
        f"\n"
        f"export const TREE_TENANT_NAMES: string[] = {json.dumps(names)};\n"
    )

    OUTPUT_PATH.write_text(ts)
    total = sum(len(p) for s in all_series.values() for p in s.values())
    print(f"\nWrote {OUTPUT_PATH}")
    print(f"  {len(all_series)} metrics, {len(names)} tenants, {total} data points")


if __name__ == "__main__":
    main()
