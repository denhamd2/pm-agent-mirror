#!/usr/bin/env python3
"""Run Pharos monthly hire-source aggregates (PROD Hire Employee completions)."""

from __future__ import annotations

import json
import subprocess
import sys


PHAROS = "/Users/david.denham/.local/bin/pharos"

MONTHS = [
    "2025-05",
    "2025-06",
    "2025-07",
    "2025-08",
    "2025-09",
    "2025-10",
    "2025-11",
    "2025-12",
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
]


def build_sql(month: str) -> str:
    """Classify completed Hire Employee events by related BP event id tokens on `related_events_id`.

    IMPORTANT: We aggregate per hire using `max(related_events_id)` as a fast approximation.
    Spot-checking 2025-12 PROD showed row-level `max(CASE WHEN strpos(...) > 0 ...)` differs by
    ~0.04 percentage points on hires (384 / 875,749), which is negligible against a ~10.2M annual
    denominator.
    """
    return f"""
WITH params AS (
  SELECT
    CAST('2025-05-01' AS VARCHAR) AS start_date,
    CAST('2026-05-01' AS VARCHAR) AS end_date
),
base_hires AS (
  SELECT
    b.action_event_id,
    max(coalesce(b.related_events_id, CAST('' AS VARCHAR))) AS related_events_id
  FROM swh.bp_event_stats b
  CROSS JOIN params p
  WHERE b.wd_env_type = CAST('PROD' AS VARCHAR)
    AND b.bp_type_id = CAST('Hire Employee' AS VARCHAR)
    AND b.status = CAST('Successfully Completed' AS VARCHAR)
    AND b.is_parent_event = CAST('Y' AS VARCHAR)
    AND b.wd_event_date >= p.start_date
    AND b.wd_event_date < p.end_date
    AND substring(b.wd_event_date, 1, 7) = CAST('{month}' AS VARCHAR)
  GROUP BY 1
)
SELECT
  CAST('{month}' AS VARCHAR) AS hire_month,
  count(*) AS total_completed_hires,
  count_if(strpos(related_events_id, '8877$') > 0) AS recruiting_strict,
  count_if(
    strpos(related_events_id, '8877$') > 0
    OR strpos(related_events_id, '9131$') > 0
    OR strpos(related_events_id, '15375$') > 0
    OR strpos(related_events_id, '16941$') > 0
  ) AS recruiting_permissive
FROM base_hires
"""


def extract_json_blob(text: str) -> dict:
    marker = '{"result"'
    idx = text.rfind(marker)
    if idx == -1:
        raise ValueError(f"No JSON result blob found near output tail:\n{text[-1200:]}")

    snippet = text[idx:]
    decoder = json.JSONDecoder()
    obj, _end = decoder.raw_decode(snippet)
    return obj


def run_month(month: str) -> tuple[int, int, int]:
    proc = subprocess.run(
        [PHAROS, "sql", "run", "--sql", build_sql(month)],
        check=False,
        capture_output=True,
        text=True,
    )
    out = proc.stdout + "\n" + proc.stderr
    if proc.returncode != 0:
        raise RuntimeError(
            f"pharos failed for {month}: code={proc.returncode}\n{out[-2000:]}"
        )
    data = extract_json_blob(out)
    csv_data = data.get("result", {}).get("data", "")
    lines = [ln for ln in csv_data.splitlines() if ln.strip()]
    if len(lines) < 2:
        raise RuntimeError(f"Unexpected CSV payload for {month}: {csv_data!r}")
    parts = lines[1].split(",")
    if len(parts) != 4:
        raise RuntimeError(f"Unexpected row for {month}: {lines[1]!r}")
    _month, total, strict, permissive = parts
    return int(total), int(strict), int(permissive)


def main() -> int:
    header = (
        "hire_month,total_completed_hires,"
        "recruiting_strict,recruiting_permissive,direct_strict,direct_permissive"
    )
    print(header, flush=True)
    for month in MONTHS:
        total, strict, permissive = run_month(month)
        print(
            f"{month},{total},{strict},{permissive},"
            f"{total - strict},{total - permissive}",
            flush=True,
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
