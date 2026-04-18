#!/usr/bin/env python3
"""Add total Post Job submission and tenant counts to HRREC-81393 weekly CSV.

Uses the same denominator definition as docs/analytics/hrrec-81393-impact-report.md:
  Post Job U events for task_id IN ('2997$13499', '2997$6945', '2997$6334').

Reads docs/analytics/data/hrrec-81393-agency-menu-daily-metrics.csv and writes
the same path with two extra columns (or refreshes them if present).
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "docs" / "analytics" / "data" / "hrrec-81393-agency-menu-daily-metrics.csv"
PHAROS_BIN = Path("/Users/david.denham/.local/bin/pharos")


def run_totals(day: str) -> tuple[int, int]:
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
    result = subprocess.run(
        [str(PHAROS_BIN), "sql", "run", "--sql", sql],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    for line in reversed(result.stdout.splitlines()):
        stripped = line.strip()
        if stripped.startswith("{") and '"result"' in stripped:
            payload = json.loads(stripped)
            csv_data = payload["result"]["data"]
            row = next(csv.DictReader(io.StringIO(csv_data)))
            return (
                int(row.get("total_post_job_submissions", "0") or 0),
                int(row.get("total_post_job_tenants", "0") or 0),
            )
    raise RuntimeError("Could not parse pharos output")


def main() -> None:
    if not CSV_PATH.is_file():
        raise SystemExit(f"Missing {CSV_PATH}")

    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    fieldnames = list(rows[0].keys()) if rows else []
    for col in ("total_post_job_submissions", "total_post_job_tenants"):
        if col not in fieldnames:
            fieldnames.append(col)

    for i, row in enumerate(rows):
        day = row["wd_event_date"]
        print(f"[{i + 1}/{len(rows)}] {day} ...")
        subs, tenants = run_totals(day)
        row["total_post_job_submissions"] = str(subs)
        row["total_post_job_tenants"] = str(tenants)

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)

    print(f"Wrote {CSV_PATH}")


if __name__ == "__main__":
    main()
