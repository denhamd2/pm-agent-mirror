#!/usr/bin/env python3
"""Build daily/weekly OMS metrics for HRREC-81393 Agency menu usage.

This script runs partition-safe, per-day Pharos queries against:
  - dw.swh_raw.oms_requests

Outputs a CSV with:
  - NEW feature submissions (Agency Types menu):
      Post Job updates where processed_element_json contains both
      15$478022 (combined prompt workset) and 15604$ (Recruiting Agency Type)
  - OLD menu opens (Agency by Type):
      getReferencePrompt requests for prompt 45$17735
  - NEW menu opens (Agency Types):
      getReferencePrompt requests for prompt 45$28385
  - Total Post Job submissions and distinct tenants (denominator for adoption share / penetration)
  - Cumulative unique tenants (running union of distinct tenants across all sample dates)
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import subprocess
import time
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "docs" / "analytics" / "data" / "hrrec-81393-agency-menu-daily-metrics.csv"
PHAROS_BIN = "/Users/david.denham/.local/bin/pharos"


@dataclass(frozen=True)
class DailyMetrics:
    wd_event_date: str
    new_agency_types_submissions: int
    new_agency_types_tenants: int
    agency_by_type_opens: int
    agency_by_type_tenants: int
    agency_types_opens: int
    agency_types_tenants: int
    cumulative_tenants: int
    total_post_job_submissions: int
    total_post_job_tenants: int


def parse_date(raw: str) -> date:
    return datetime.strptime(raw, "%Y-%m-%d").date()


def daterange(start: date, end: date, step: int = 1) -> list[date]:
    days: list[date] = []
    current = start
    while current <= end:
        days.append(current)
        current += timedelta(days=step)
    return days


def run_pharos_sql(sql: str) -> list[dict[str, str]]:
    import os
    env = os.environ.copy()
    env["PATH"] = f"{Path(PHAROS_BIN).parent}:{env.get('PATH', '/usr/bin:/bin')}"
    result = subprocess.run(
        [PHAROS_BIN, "sql", "run", "--sql", sql],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
        env=env,
    )

    payload_line = None
    for line in reversed(result.stdout.splitlines()):
        stripped = line.strip()
        if stripped.startswith("{") and '"result"' in stripped:
            payload_line = stripped
            break
    if payload_line is None:
        raise RuntimeError("Could not locate JSON payload in pharos output")

    payload = json.loads(payload_line)
    csv_data = payload["result"]["data"]
    return list(csv.DictReader(io.StringIO(csv_data)))


def query_submissions(day: str) -> tuple[int, int]:
    sql = f"""
SELECT
  COUNT(*) AS new_agency_types_submissions,
  COUNT(DISTINCT tenant_n) AS new_agency_types_tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{day}'
  AND wd_env_type = 'PROD'
  AND task_id IN ('2997$13499', '2997$6945', '2997$6334')
  AND task_display_name = 'Post Job'
  AND read_or_update = 'U'
  AND processed_element_json LIKE '%15$478022%'
  AND processed_element_json LIKE '%15604$%'
""".strip()
    rows = run_pharos_sql(sql)
    if not rows:
        return (0, 0)
    row = rows[0]
    return (int(row.get("new_agency_types_submissions", "0") or 0), int(row.get("new_agency_types_tenants", "0") or 0))


def query_tenant_list(day: str) -> set[str]:
    """Return the set of distinct tenants using the NEW feature on a given day."""
    sql = f"""
SELECT DISTINCT tenant_n
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{day}'
  AND wd_env_type = 'PROD'
  AND task_id IN ('2997$13499', '2997$6945', '2997$6334')
  AND task_display_name = 'Post Job'
  AND read_or_update = 'U'
  AND processed_element_json LIKE '%15$478022%'
  AND processed_element_json LIKE '%15604$%'
""".strip()
    rows = run_pharos_sql(sql)
    return {r["tenant_n"] for r in rows if r.get("tenant_n")}


def query_total_post_job(day: str) -> tuple[int, int]:
    """All Post Job U events (denominator for adoption share and tenant penetration)."""
    sql = f"""
SELECT
  COUNT(*) AS total_post_job_submissions,
  COUNT(DISTINCT tenant_n) AS total_post_job_tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{day}'
  AND wd_env_type = 'PROD'
  AND task_id IN ('2997$13499', '2997$6945', '2997$6334')
  AND task_display_name = 'Post Job'
  AND read_or_update = 'U'
""".strip()
    rows = run_pharos_sql(sql)
    if not rows:
        return (0, 0)
    row = rows[0]
    return (
        int(row.get("total_post_job_submissions", "0") or 0),
        int(row.get("total_post_job_tenants", "0") or 0),
    )


def query_prompt_opens(day: str) -> tuple[int, int, int, int]:
    sql = f"""
SELECT
  COUNT(CASE WHEN oms_request LIKE '%45$17735%' THEN 1 END) AS agency_by_type_opens,
  COUNT(DISTINCT CASE WHEN oms_request LIKE '%45$17735%' THEN tenant_n END) AS agency_by_type_tenants,
  COUNT(CASE WHEN oms_request LIKE '%45$28385%' THEN 1 END) AS agency_types_opens,
  COUNT(DISTINCT CASE WHEN oms_request LIKE '%45$28385%' THEN tenant_n END) AS agency_types_tenants
FROM dw.swh_raw.oms_requests
WHERE wd_event_date = '{day}'
  AND wd_env_type = 'PROD'
  AND task_display_name = 'getReferencePrompt -> get reference prompt (System)'
""".strip()
    rows = run_pharos_sql(sql)
    if not rows:
        return (0, 0, 0, 0)
    row = rows[0]
    return (
        int(row.get("agency_by_type_opens", "0") or 0),
        int(row.get("agency_by_type_tenants", "0") or 0),
        int(row.get("agency_types_opens", "0") or 0),
        int(row.get("agency_types_tenants", "0") or 0),
    )


def write_csv(path: Path, metrics: list[DailyMetrics]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "wd_event_date",
                "new_agency_types_submissions",
                "new_agency_types_tenants",
                "agency_by_type_opens",
                "agency_by_type_tenants",
                "agency_types_opens",
                "agency_types_tenants",
                "cumulative_tenants",
                "total_post_job_submissions",
                "total_post_job_tenants",
            ],
        )
        writer.writeheader()
        for item in metrics:
            writer.writerow(
                {
                    "wd_event_date": item.wd_event_date,
                    "new_agency_types_submissions": item.new_agency_types_submissions,
                    "new_agency_types_tenants": item.new_agency_types_tenants,
                    "agency_by_type_opens": item.agency_by_type_opens,
                    "agency_by_type_tenants": item.agency_by_type_tenants,
                    "agency_types_opens": item.agency_types_opens,
                    "agency_types_tenants": item.agency_types_tenants,
                    "cumulative_tenants": item.cumulative_tenants,
                    "total_post_job_submissions": item.total_post_job_submissions,
                    "total_post_job_tenants": item.total_post_job_tenants,
                }
            )


def build_metrics(start: date, end: date, step: int, sleep_seconds: float) -> list[DailyMetrics]:
    output: list[DailyMetrics] = []
    days = daterange(start, end, step)
    cumulative_tenants: set[str] = set()
    for idx, day in enumerate(days, start=1):
        day_str = day.isoformat()
        print(f"[{idx}/{len(days)}] Querying {day_str} ...")
        submissions_count, submissions_tenants = query_submissions(day_str)
        day_tenants = query_tenant_list(day_str)
        cumulative_tenants |= day_tenants
        by_type_opens, by_type_tenants, types_opens, types_tenants = query_prompt_opens(day_str)
        total_subs, total_tenants = query_total_post_job(day_str)
        output.append(
            DailyMetrics(
                wd_event_date=day_str,
                new_agency_types_submissions=submissions_count,
                new_agency_types_tenants=submissions_tenants,
                agency_by_type_opens=by_type_opens,
                agency_by_type_tenants=by_type_tenants,
                agency_types_opens=types_opens,
                agency_types_tenants=types_tenants,
                cumulative_tenants=len(cumulative_tenants),
                total_post_job_submissions=total_subs,
                total_post_job_tenants=total_tenants,
            )
        )
        if sleep_seconds > 0 and idx < len(days):
            time.sleep(sleep_seconds)
    return output


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build daily HRREC-81393 Agency menu usage metrics CSV.")
    parser.add_argument("--start-date", required=True, help="Start date (inclusive), format YYYY-MM-DD")
    parser.add_argument("--end-date", required=True, help="End date (inclusive), format YYYY-MM-DD")
    parser.add_argument(
        "--step-days",
        type=int,
        default=1,
        help="Step between sample dates in days (default: 1 for daily; use 7 for weekly)",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT),
        help=f"Output CSV path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--sleep-seconds",
        type=float,
        default=0.0,
        help="Optional pause between days to reduce backend pressure (default: 0)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    start = parse_date(args.start_date)
    end = parse_date(args.end_date)
    if end < start:
        raise ValueError("end-date must be on or after start-date")

    metrics = build_metrics(start, end, args.step_days, args.sleep_seconds)
    output_path = Path(args.output)
    write_csv(output_path, metrics)
    print(f"Wrote {output_path} ({len(metrics)} day rows)")


if __name__ == "__main__":
    main()
