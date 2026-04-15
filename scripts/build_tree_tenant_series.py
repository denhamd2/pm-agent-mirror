#!/usr/bin/env python3
"""Build per-tenant monthly time series for every Value Driver Tree metric.

Output: design/data-tree-tenant-series.ts

Backfill mode: queries Pharos in yearly batches (max 365-day partition windows)
to avoid query timeouts on heavy per-tenant scans, then merges all batches.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
import sys
import textwrap
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "design" / "data-tree-tenant-series.ts"
PHAROS_BIN = Path("/Users/david.denham/.local/bin/pharos")

YM_FLOOR = "2023-06"

# bp_event_stats / bp_event_record_stats are very large; only ~270d is feasible
BP_PARTITION_DAYS = 270
BP_YM_FLOOR = "2025-08"

# IUM and talent_ml tables are smaller; we can go back further in 180-day batches
IUM_BATCH_DAYS = 180


def _batch_boundaries(ym_floor: str, batch_days: int) -> list[tuple[str, str]]:
    """Return (iso_start, iso_end) pairs covering ym_floor..today in <=batch_days windows."""
    start = date.fromisoformat(f"{ym_floor}-01")
    today = date.today()
    batches: list[tuple[str, str]] = []
    while start <= today:
        end = min(start + timedelta(days=batch_days - 1), today)
        batches.append((start.isoformat(), end.isoformat()))
        start = end + timedelta(days=1)
    return batches

IUM_BATCHES = _batch_boundaries(YM_FLOOR, IUM_BATCH_DAYS)


QUERY_TIMEOUT_S = 300


def run_pharos(sql: str) -> list[dict[str, str]]:
    env = {
        "PATH": f"{PHAROS_BIN.parent}:{PHAROS_BIN.parent.parent / 'bin'}:/usr/bin:/bin",
        "HOME": str(Path.home()),
    }
    r = subprocess.run(
        [str(PHAROS_BIN), "sql", "run", "--sql", sql],
        cwd=ROOT, capture_output=True, text=True, env=env,
        timeout=QUERY_TIMEOUT_S,
    )
    if r.returncode != 0:
        raise RuntimeError(f"Pharos exit {r.returncode}: {r.stderr[-300:]}")
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


YM_EXPR = "CONCAT(CAST(year(CAST(creation_time AS date)) AS varchar),'-',LPAD(CAST(month(CAST(creation_time AS date)) AS varchar),2,'0'))"
YM_ED = "CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0'))"

BP_WD = f"wd_event_date >= to_iso8601(current_date - interval '{BP_PARTITION_DAYS}' day)"


def _wd_batch(iso_start: str, iso_end: str) -> str:
    return f"wd_event_date >= to_iso8601(DATE '{iso_start}') AND wd_event_date <= to_iso8601(DATE '{iso_end}')"


# --- Heavy BP queries: single 270-day partition, no batching ---

def q_bp_dur(bp: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/86400.0),4) AS val
        FROM dw.swh.bp_event_stats
        WHERE {BP_WD} AND bp_type_id='{bp}' AND status='Successfully Completed'
              AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{BP_YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_bp_comp(bp: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(100.0*SUM(CASE WHEN status='Successfully Completed' THEN 1 ELSE 0 END)
                     /NULLIF(CAST(COUNT(*) AS double),0),2) AS val
        FROM dw.swh.bp_event_stats
        WHERE {BP_WD} AND bp_type_id='{bp}'
        GROUP BY 1,2 HAVING {YM_EXPR}>='{BP_YM_FLOOR}' AND COUNT(*)>=5 ORDER BY 1,2
    """).strip()


def q_step(bp: str, task: str) -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/3600.0),4) AS val
        FROM dw.swh.bp_event_record_stats
        WHERE {BP_WD} AND bp_type_id='{bp}' AND task_name='{task}'
              AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{BP_YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_feedback() -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               ROUND(AVG(duration/3600.0),4) AS val
        FROM dw.swh.bp_event_record_stats
        WHERE {BP_WD} AND task_name='Rate Interview' AND duration>0
        GROUP BY 1,2 HAVING {YM_EXPR}>='{BP_YM_FLOOR}' ORDER BY 1,2
    """).strip()


def q_interview_rounds() -> str:
    return textwrap.dedent(f"""
        SELECT lower(tenant_n) AS tn, {YM_EXPR} AS ym,
               CAST(COUNT(*) AS double) AS val
        FROM dw.swh.bp_event_stats
        WHERE {BP_WD} AND bp_type_id='Interview'
        GROUP BY 1,2 HAVING {YM_EXPR}>='{BP_YM_FLOOR}' ORDER BY 1,2
    """).strip()


# --- Lighter IUM / talent_ml queries: batched for historical backfill ---

def q_volumes(iso_start: str, iso_end: str) -> str:
    wd = _wd_batch(iso_start, iso_end)
    return textwrap.dedent(f"""
        SELECT lower(tenant_name) AS tn,
               CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',
                      LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0')) AS ym,
               COUNT(*) AS apps,
               ROUND(AVG(CAST(duration_in_hours AS double)/24.0),4) AS bp_days
        FROM dw.user_data.talent_ml_interview_initiation_make_decision_events
        WHERE {wd}
        GROUP BY 1,2
        HAVING CONCAT(CAST(year(CAST(wd_event_date AS date)) AS varchar),'-',
                       LPAD(CAST(month(CAST(wd_event_date AS date)) AS varchar),2,'0'))>='{YM_FLOOR}'
        ORDER BY 1,2
    """).strip()


def q_add_docs(iso_start: str, iso_end: str) -> str:
    wd = _wd_batch(iso_start, iso_end)
    ym_ium = "CONCAT(CAST(year AS varchar),'-',LPAD(CAST(month AS varchar),2,'0'))"
    return textwrap.dedent(f"""
        SELECT lower(tenant_name) AS tn,
               {ym_ium} AS ym,
               ROUND(AVG(try_cast(value AS double)),4) AS val
        FROM dw.swh_raw.internal_usage_metrics_report_kafka
        WHERE {wd}
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


def _merge_batch_series(accumulated: dict, batch: dict) -> dict:
    """Merge a new batch of tenant series into the accumulator, keeping later values for duplicate months."""
    for tenant, pts in batch.items():
        if tenant not in accumulated:
            accumulated[tenant] = pts
        else:
            existing = {p["ym"]: p["value"] for p in accumulated[tenant]}
            for p in pts:
                existing[p["ym"]] = p["value"]
            accumulated[tenant] = [{"ym": ym, "value": v} for ym, v in sorted(existing.items())]
    return accumulated


def run_step(label: str, sql: str) -> dict:
    print(f"  {label}...", end=" ", flush=True)
    try:
        rows = run_pharos(sql)
        s = to_series(rows)
        print(f"{len(s)} tenants")
        return s
    except subprocess.TimeoutExpired:
        print(f"TIMEOUT ({QUERY_TIMEOUT_S}s) - empty")
        return {}
    except Exception as e:
        print(f"ERROR: {str(e)[:120]} - empty")
        return {}


def run_batched_step(label: str, query_fn, *args) -> dict:
    """Run a query function across all IUM batches and merge results."""
    accumulated: dict = {}
    for i, (iso_start, iso_end) in enumerate(IUM_BATCHES):
        tag = f"{label} batch {i+1}/{len(IUM_BATCHES)} [{iso_start}..{iso_end}]"
        print(f"  {tag}...", end=" ", flush=True)
        try:
            rows = run_pharos(query_fn(*args, iso_start, iso_end))
            batch = to_series(rows)
            accumulated = _merge_batch_series(accumulated, batch)
            print(f"+{len(batch)} tenants (total {len(accumulated)})")
        except subprocess.TimeoutExpired:
            print(f"TIMEOUT ({QUERY_TIMEOUT_S}s) - skipped")
        except Exception as e:
            msg = str(e)[:120]
            print(f"WARN: {msg}")
    return dict(sorted(accumulated.items()))


def tc(d: dict) -> str:
    lines = []
    for t, pts in sorted(d.items()):
        p = ",".join(f'{{"ym":"{x["ym"]}","value":{x["value"]}}}' for x in pts)
        lines.append(f'  {json.dumps(t)}: [{p}]')
    return "{\n" + ",\n".join(lines) + "\n  }"


EA = "Propose Compensation Offer/Employment Agreement"


def _run_batched_volumes() -> tuple[dict, dict]:
    """Batched version of the volumes query returning (job_apps, talent_bp)."""
    all_apps: dict[str, list] = {}
    all_bp: dict[str, list] = {}
    for i, (iso_start, iso_end) in enumerate(IUM_BATCHES):
        tag = f"[6/11] Volumes batch {i+1}/{len(IUM_BATCHES)} [{iso_start}..{iso_end}]"
        print(f"  {tag}...", end=" ", flush=True)
        try:
            rows = run_pharos(q_volumes(iso_start, iso_end))
            batch_apps: dict[str, list] = defaultdict(list)
            batch_bp: dict[str, list] = defaultdict(list)
            for r in rows:
                t = (r.get("tn") or "").strip().lower()
                ym = (r.get("ym") or "").strip()
                if not t or not ym:
                    continue
                av = sf(r.get("apps"))
                if av and av > 0:
                    batch_apps[t].append({"ym": ym, "value": round(av, 0)})
                bv = sf(r.get("bp_days"))
                if bv and bv > 0:
                    batch_bp[t].append({"ym": ym, "value": round(bv, 4)})
            all_apps = _merge_batch_series(all_apps, dict(batch_apps))
            all_bp = _merge_batch_series(all_bp, dict(batch_bp))
            print(f"apps +{len(batch_apps)}, bp +{len(batch_bp)}")
        except subprocess.TimeoutExpired:
            print(f"TIMEOUT ({QUERY_TIMEOUT_S}s) - skipped")
        except Exception as e:
            msg = str(e)[:120]
            print(f"WARN: {msg}")
    return dict(sorted(all_apps.items())), dict(sorted(all_bp.items()))


def main() -> None:
    print(f"Building tree tenant series")
    print(f"  BP tables: single {BP_PARTITION_DAYS}d window, months >= {BP_YM_FLOOR}")
    print(f"  IUM/talent_ml: {len(IUM_BATCHES)} batches of <={IUM_BATCH_DAYS}d, months >= {YM_FLOOR}")

    interview_bp = run_step("[1/11] Interview BP dur", q_bp_dur("Interview"))
    offer_dur = run_step("[2/11] Offer BP dur", q_bp_dur("Offer"))
    ea_dur = run_step("[3/11] EA BP dur", q_bp_dur(EA))
    oea_dur = merge(offer_dur, ea_dur, "sum")
    print(f"         -> combined Offer+EA dur: {len(oea_dur)} tenants")

    offer_comp = run_step("[4/11] Offer completion", q_bp_comp("Offer"))
    ea_comp = run_step("[5/11] EA completion", q_bp_comp(EA))
    oea_comp = merge(offer_comp, ea_comp, "avg")
    print(f"         -> combined Offer+EA comp: {len(oea_comp)} tenants")

    job_apps, talent_bp = _run_batched_volumes()
    print(f"         -> volumes: apps={len(job_apps)}, bp_time={len(talent_bp)} tenants")

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

    add_docs = run_batched_step("[11/11] Add Documents", q_add_docs)

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
