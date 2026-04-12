#!/usr/bin/env python3
"""Build a live metric-name-resolved Value Realisation IUM snapshot.

This script queries Pharos via the local CLI, resolves Recruiting metrics by
metric_name, and writes a generated TypeScript module consumed by the design
prototype. It intentionally avoids trusting historical metric_id mappings.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "design" / "data-value-realization-iums.ts"
PHAROS_BIN = "/Users/david.denham/.local/bin/pharos"


@dataclass(frozen=True)
class MetricTarget:
    key: str
    label: str
    desired_name: str
    description: str
    unit: str
    notes: list[str]


HEADLINE_TARGETS = [
    MetricTarget(
        key="timeToHire",
        label="Avg Time to Hire",
        desired_name="Average Time to Hire",
        description="Average calendar days from first job posting date to latest offer accepted date per job requisition. Excludes Employment Agreement.",
        unit="days",
        notes=[
            "Resolved live by metric_name from internal_usage_metrics_report_kafka.",
            "Uses the latest month returned by Pharos for this metric.",
        ],
    ),
    MetricTarget(
        key="recruiterProductivity",
        label="Recruiter Productivity",
        desired_name="Recruiter Productivity",
        description="Average number of open job requisitions and evergreens per primary recruiter, averaged across recruiters on the tenant.",
        unit="count",
        notes=[
            "Resolved live by metric_name from internal_usage_metrics_report_kafka.",
            "Tracker wording is Recruiter Capacity; current live IUM metric name is Recruiter Productivity.",
        ],
    ),
    MetricTarget(
        key="offersAccepted",
        label="Offers Accepted",
        desired_name="Number of Offers accepted.",
        description="Average number of offers accepted per reporting tenant for the month.",
        unit="count",
        notes=[
            "Resolved live by metric_name from internal_usage_metrics_report_kafka.",
        ],
    ),
    MetricTarget(
        key="employmentAgreementAcceptance",
        label="Employment Agreement Acceptance",
        desired_name="Employment Agreement Acceptance",
        description="Average number of employment agreements accepted per reporting tenant for the month.",
        unit="count",
        notes=[
            "Resolved live by metric_name from internal_usage_metrics_report_kafka.",
        ],
    ),
    MetricTarget(
        key="internalJobApplications",
        label="Internal Job Applications",
        desired_name="Count of Internal Job Applications last month",
        description="Average number of internal job applications submitted per reporting tenant for the month.",
        unit="count",
        notes=[
            "Resolved live by metric_name from internal_usage_metrics_report_kafka.",
        ],
    ),
]

BREAKDOWN_TARGETS = {
    "gender": [
        MetricTarget(
            key="femaleGender",
            label="Female",
            desired_name="Count of job applications with female gender.",
            description="Average number of job applications with female gender per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="maleGender",
            label="Male",
            desired_name="Count of job applications with male gender.",
            description="Average number of job applications with male gender per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="noGenderAssigned",
            label="No Gender Assigned",
            desired_name="Count of job applications with no gender assigned.",
            description="Average number of job applications with no gender assigned per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="nonBinaryOrOtherGender",
            label="Non Male/Female Gender",
            desired_name="Count of job applications with non male/female gender.",
            description="Average number of job applications with non male/female gender per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
    ],
    "raceEthnicity": [
        MetricTarget(
            key="blackOrAfricanAmerican",
            label="Black or African American",
            desired_name="Count of job applications with a Black or African American ethnicity.",
            description="Average number of job applications with Black or African American ethnicity per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="asian",
            label="Asian",
            desired_name="Count of job applications with an Asian ethnicity.",
            description="Average number of job applications with Asian ethnicity per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="white",
            label="White",
            desired_name="Count of job applications with White ethnicity",
            description="Average number of job applications with White ethnicity per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="hispanicOrLatino",
            label="Hispanic or Latino",
            desired_name="Count of job applications with Hispanic or Latino ethnicity",
            description="Average number of job applications with Hispanic or Latino ethnicity per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="twoOrMoreRaces",
            label="Two or More Races",
            desired_name="Count of job applications with Two or More Races ethnicity",
            description="Average number of job applications with Two or More Races ethnicity per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
    ],
    "age": [
        MetricTarget(
            key="age17AndBelow",
            label="Age 17 and Below",
            desired_name="Number of job applications with candidates aged 17 and below",
            description="Average number of job applications with candidates aged 17 and below per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age18To24",
            label="Age 18-24",
            desired_name="Number of job applications with candidates aged between 18 and 24 created in the last month.",
            description="Average number of job applications with candidates aged 18-24 per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age25To34",
            label="Age 25-34",
            desired_name="Number of job applications with candidates aged between 25 and 34 created in the last month.",
            description="Average number of job applications with candidates aged 25-34 per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age35To44",
            label="Age 35-44",
            desired_name="Number of job applications with candidates aged between 35 and 44 created in the last month.",
            description="Average number of job applications with candidates aged 35-44 per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age45To54",
            label="Age 45-54",
            desired_name="Number of job applications with candidates aged between 45 and 54 created in the last month.",
            description="Average number of job applications with candidates aged 45-54 per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age55To64",
            label="Age 55-64",
            desired_name="Number of job applications with candidates aged between 55 and 64 created in the last month.",
            description="Average number of job applications with candidates aged 55-64 per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
        MetricTarget(
            key="age65Plus",
            label="Age 65+",
            desired_name="Number of job applications with candidates aged 65 or over created in the last month.",
            description="Average number of job applications with candidates aged 65 or over per reporting tenant for the month.",
            unit="count",
            notes=[],
        ),
    ],
}

TIME_TO_FILL_FALLBACK = {
    "key": "timeToFill",
    "label": "Avg Time to Fill",
    "metricName": None,
    "metricId": None,
    "environment": "UNKNOWN",
    "resolution": "legacy-unresolved",
    "latestYm": "2026-02",
    "latestValue": 127.9,
    "latestTenants": 542,
    "unit": "days",
    "description": "Legacy workspace snapshot for Time to Fill. A current live metric_name match was not found in internal_usage_metrics_report_kafka during the 12 April 2026 refresh.",
    "notes": [
        "Preserved temporarily to avoid dropping the existing card before a clean live replacement is found.",
        "Do not attach a historical metric_id to this card until the live metric_name is revalidated.",
    ],
    "series": [],
}


def run_pharos_sql(sql: str) -> list[dict[str, str]]:
    env = {"PATH": f"{Path(PHAROS_BIN).parent}:{Path(PHAROS_BIN).parent.parent / 'bin'}:/usr/bin:/bin"}
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


def normalise_name(text: str) -> str:
    return text.strip().lower()


def build_query() -> str:
    all_targets = HEADLINE_TARGETS + [target for group in BREAKDOWN_TARGETS.values() for target in group]
    name_list = ", ".join(
        "'" + target.desired_name.replace("'", "''") + "'"
        for target in all_targets
    )
    return f"""
SELECT
  metric_id,
  metric_name,
  year,
  month,
  count(DISTINCT tenant_name) AS tenants,
  avg(try_cast(value AS double)) AS avg_value
FROM dw.swh_raw.internal_usage_metrics_report_kafka
WHERE wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND metric_name IN ({name_list})
GROUP BY 1, 2, 3, 4
ORDER BY metric_name, year, month
""".strip()


def build_environment_query() -> str:
    all_targets = HEADLINE_TARGETS + [target for group in BREAKDOWN_TARGETS.values() for target in group]
    name_list = ", ".join(
        "'" + target.desired_name.replace("'", "''") + "'"
        for target in all_targets
    )
    return f"""
SELECT
  metric_name,
  year,
  month,
  wd_env_type,
  count(DISTINCT tenant_name) AS tenants
FROM dw.swh_raw.internal_usage_metrics_report_kafka
WHERE wd_event_date >= to_iso8601(current_date - interval '365' day)
  AND metric_name IN ({name_list})
GROUP BY 1, 2, 3, 4
ORDER BY metric_name, year, month, wd_env_type
""".strip()


def sort_points(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    points: list[dict[str, Any]] = []
    for row in rows:
        year = int(row["year"])
        month = int(row["month"])
        if year == 0 or month == 0:
            continue
        avg_value = row["avg_value"]
        points.append(
            {
                "ym": f"{year:04d}-{month:02d}",
                "tenants": int(row["tenants"]),
                "avgValue": None if avg_value in ("", None) else float(avg_value),
            }
        )
    points.sort(key=lambda item: item["ym"])
    return points


def latest_point(points: list[dict[str, Any]]) -> dict[str, Any] | None:
    return points[-1] if points else None


def resolve_environment(rows: list[dict[str, str]]) -> str:
    latest_ym = None
    latest_rows: list[dict[str, str]] = []
    for row in rows:
        year = row.get("year")
        month = row.get("month")
        if not year or not month:
            continue
        ym = f"{int(year):04d}-{int(month):02d}"
        if latest_ym is None or ym > latest_ym:
            latest_ym = ym
            latest_rows = [row]
        elif ym == latest_ym:
            latest_rows.append(row)
    envs = sorted({row.get("wd_env_type", "").strip() for row in latest_rows if row.get("wd_env_type", "").strip()})
    if not envs:
        return "UNKNOWN"
    if len(envs) == 1:
        return envs[0]
    return "MIXED"


def as_snapshot(
    target: MetricTarget,
    rows_by_name: dict[str, list[dict[str, str]]],
    env_rows_by_name: dict[str, list[dict[str, str]]],
) -> dict[str, Any]:
    rows = rows_by_name.get(normalise_name(target.desired_name), [])
    env_rows = env_rows_by_name.get(normalise_name(target.desired_name), [])
    points = sort_points(rows)
    latest = latest_point(points)
    metric_id = int(rows[0]["metric_id"]) if rows else None
    return {
        "key": target.key,
        "label": target.label,
        "metricName": target.desired_name if rows else None,
        "metricId": metric_id,
        "environment": resolve_environment(env_rows),
        "resolution": "live" if rows else "legacy-unresolved",
        "latestYm": latest["ym"] if latest else None,
        "latestValue": latest["avgValue"] if latest else None,
        "latestTenants": latest["tenants"] if latest else 0,
        "unit": target.unit,
        "description": target.description,
        "notes": target.notes,
        "series": points,
    }


def to_ts(value: Any) -> str:
    return json.dumps(value, indent=2, sort_keys=False)


def main() -> None:
    rows = run_pharos_sql(build_query())
    env_rows = run_pharos_sql(build_environment_query())
    rows_by_name: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        rows_by_name.setdefault(normalise_name(row["metric_name"]), []).append(row)
    env_rows_by_name: dict[str, list[dict[str, str]]] = {}
    for row in env_rows:
        env_rows_by_name.setdefault(normalise_name(row["metric_name"]), []).append(row)

    headlines = {
        target.key: as_snapshot(target, rows_by_name, env_rows_by_name)
        for target in HEADLINE_TARGETS
    }
    headlines["timeToFill"] = TIME_TO_FILL_FALLBACK

    breakdowns = {
        group_name: [as_snapshot(target, rows_by_name, env_rows_by_name) for target in targets]
        for group_name, targets in BREAKDOWN_TARGETS.items()
    }

    query_meta = {
        "title": "Value Realisation IUM Snapshot",
        "source": "Pharos internal_usage_metrics_report_kafka",
        "resolutionMode": "metric_name_first",
        "queryDate": date.today().strftime("%d %b %Y"),
        "note": "Generated by scripts/build_value_realization_ium_snapshot.py. Live metrics are resolved by metric_name before displaying the currently observed metric_id. Environment labels reflect what the currently accessible warehouse returned for each metric name.",
    }

    rendered = "\n".join(
        [
            "// Generated by scripts/build_value_realization_ium_snapshot.py",
            "// Do not edit manually.",
            "",
            "export type ResolutionStatus = 'live' | 'legacy-unresolved';",
            "",
            "export interface MetricPoint {",
            "  ym: string;",
            "  tenants: number;",
            "  avgValue: number | null;",
            "}",
            "",
            "export interface MetricSnapshot {",
            "  key: string;",
            "  label: string;",
            "  metricName: string | null;",
            "  metricId: number | null;",
            "  environment: 'SANDBOX' | 'PROD' | 'MIXED' | 'UNKNOWN';",
            "  resolution: ResolutionStatus;",
            "  latestYm: string | null;",
            "  latestValue: number | null;",
            "  latestTenants: number;",
            "  unit: 'days' | 'count';",
            "  description: string;",
            "  notes: string[];",
            "  series: MetricPoint[];",
            "}",
            "",
            f"export const QUERY_META = {to_ts(query_meta)} as const;",
            "",
            f"export const VALUE_REALIZATION_IUMS: Record<string, MetricSnapshot> = {to_ts(headlines)};",
            "",
            f"export const APPLICANT_VOLUME_BREAKDOWNS: Record<string, MetricSnapshot[]> = {to_ts(breakdowns)};",
            "",
        ]
    )

    OUTPUT_PATH.write_text(rendered + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
