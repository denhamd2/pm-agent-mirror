#!/usr/bin/env python3
"""Build shared tenant filter metadata for dashboard scoping.

Creates a TypeScript module that materialises:
- tenant company-size / region / industry enrichment
- recruiter-capacity monthly tenant series

Source of truth:
- dw.user_test.interview_dashboard_tenant_filters
- dw.swh_raw.internal_usage_metrics_report_kafka

Backfill mode: queries recruiter capacity in yearly batches (<=365-day
partition windows) to avoid query timeouts on wide scans.
"""

from __future__ import annotations

import csv
import io
import json
import subprocess
import textwrap
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "design" / "data-dashboard-tenant-filters.ts"
PHAROS_BIN = Path("/Users/david.denham/.local/bin/pharos")

YM_FLOOR = "2023-06"
BATCH_DAYS = 180
QUERY_TIMEOUT_S = 120


def _wd(iso_start: str, iso_end: str) -> str:
    return f"wd_event_date >= to_iso8601(DATE '{iso_start}') AND wd_event_date <= to_iso8601(DATE '{iso_end}')"

def _batch_boundaries() -> list[tuple[str, str]]:
    start = date.fromisoformat(f"{YM_FLOOR}-01")
    today = date.today()
    batches: list[tuple[str, str]] = []
    while start <= today:
        end = min(start + timedelta(days=BATCH_DAYS - 1), today)
        batches.append((start.isoformat(), end.isoformat()))
        start = end + timedelta(days=1)
    return batches

BATCHES = _batch_boundaries()


def run_pharos_sql(sql: str) -> list[dict[str, str]]:
    env = {
        "PATH": f"{PHAROS_BIN.parent}:{PHAROS_BIN.parent.parent / 'bin'}:/usr/bin:/bin",
        "HOME": str(Path.home()),
    }
    result = subprocess.run(
        [str(PHAROS_BIN), "sql", "run", "--sql", sql],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        timeout=QUERY_TIMEOUT_S,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Pharos exited {result.returncode}.\n"
            f"stderr: {result.stderr[-500:]}\nstdout: {result.stdout[-500:]}"
        )

    payload_line = None
    for line in reversed(result.stdout.splitlines()):
        line = line.strip()
        if line.startswith("{") and '"result"' in line:
            payload_line = line
            break
    if payload_line is None:
        raise RuntimeError(
            f"No JSON payload found in pharos output.\n"
            f"stdout (last 500): {result.stdout[-500:]}\n"
            f"stderr (last 500): {result.stderr[-500:]}"
        )

    payload = json.loads(payload_line)
    csv_text = payload["result"]["data"]
    reader = csv.DictReader(io.StringIO(csv_text))
    return list(reader)


def normalise(value: str | None, fallback: str = "Unknown") -> str:
    cleaned = (value or "").strip()
    return cleaned or fallback


def build_metadata() -> tuple[dict[str, dict[str, str]], list[str], list[str], list[str]]:
    rows = run_pharos_sql(
        textwrap.dedent(
            """
            SELECT tenant_name, company_size, segment, super_industry
            FROM dw.user_test.interview_dashboard_tenant_filters
            """
        ).strip()
    )

    metadata: dict[str, dict[str, str]] = {}
    segments: set[str] = set()
    regions: set[str] = set()
    industries: set[str] = set()

    for row in rows:
        tenant = normalise(row.get("tenant_name"), "").lower()
        if not tenant:
            continue
        segment = normalise(row.get("company_size"))
        region = normalise(row.get("segment"))
        industry = normalise(row.get("super_industry"))
        metadata[tenant] = {
            "segment": segment,
            "region": region,
            "industry": industry,
        }
        segments.add(segment)
        regions.add(region)
        industries.add(industry)

    return (
        dict(sorted(metadata.items())),
        sorted(segments),
        sorted(regions),
        sorted(industries),
    )


def build_recruiter_capacity_series() -> dict[str, list[dict[str, float | str]]]:
    """Query recruiter capacity in yearly batches and merge."""
    accumulated: dict[str, dict[str, float]] = {}

    for i, (iso_start, iso_end) in enumerate(BATCHES):
        print(f"  RC batch {i+1}/{len(BATCHES)} [{iso_start}..{iso_end}]...", end=" ", flush=True)
        try:
            rows = run_pharos_sql(
                textwrap.dedent(
                    f"""
                    SELECT
                      lower(tenant_name) AS tenant_name,
                      CONCAT(CAST(year AS varchar), '-', LPAD(CAST(month AS varchar), 2, '0')) AS ym,
                      ROUND(AVG(try_cast(value AS double)), 4) AS avg_value
                    FROM dw.swh_raw.internal_usage_metrics_report_kafka
                    WHERE wd_event_date >= to_iso8601(DATE '{iso_start}') AND wd_event_date <= to_iso8601(DATE '{iso_end}')
                      AND metric_name = 'Recruiter Productivity'
                      AND wd_env_type = 'SANDBOX'
                      AND try_cast(value AS double) > 0
                    GROUP BY 1, 2
                    ORDER BY 1, 2
                    """
                ).strip()
            )
            batch_count = 0
            for row in rows:
                tenant = normalise(row.get("tenant_name"), "").lower()
                ym = normalise(row.get("ym"), "")
                value_raw = normalise(row.get("avg_value"), "")
                if not tenant or not ym or not value_raw:
                    continue
                if tenant not in accumulated:
                    accumulated[tenant] = {}
                accumulated[tenant][ym] = round(float(value_raw), 4)
                batch_count += 1
            print(f"+{batch_count} points")
        except subprocess.TimeoutExpired:
            print(f"TIMEOUT ({QUERY_TIMEOUT_S}s) - skipped")
        except Exception as e:
            msg = str(e)[:120]
            print(f"WARN: {msg}")

    series_by_tenant: dict[str, list[dict[str, float | str]]] = {}
    for tenant in sorted(accumulated):
        series_by_tenant[tenant] = [
            {"ym": ym, "value": v}
            for ym, v in sorted(accumulated[tenant].items())
        ]
    return series_by_tenant


def to_ts(value: object) -> str:
    return json.dumps(value, indent=2, sort_keys=True)


def _load_existing_metadata() -> tuple[dict, list, list, list] | None:
    """Fall back to metadata already in the output file if the source table is unavailable."""
    if not OUTPUT_PATH.exists():
        return None
    import re
    text = OUTPUT_PATH.read_text()
    m = re.search(r"TENANT_FILTER_METADATA.*?=\s*(\{.*?\})\s*as const", text, re.DOTALL)
    if not m:
        return None
    try:
        raw = json.loads(m.group(1))
    except json.JSONDecodeError:
        return None
    metadata = dict(sorted(raw.items()))
    segs: set[str] = set()
    regs: set[str] = set()
    inds: set[str] = set()
    for v in metadata.values():
        segs.add(v.get("segment", "Unknown"))
        regs.add(v.get("region", "Unknown"))
        inds.add(v.get("industry", "Unknown"))
    return metadata, sorted(segs), sorted(regs), sorted(inds)


def _load_existing_rc_series() -> dict[str, list[dict[str, float | str]]] | None:
    """Fall back to RC series already in the output file if queries fail."""
    if not OUTPUT_PATH.exists():
        return None
    import re
    text = OUTPUT_PATH.read_text()
    m = re.search(r"RECRUITER_CAPACITY_TENANT_SERIES.*?=\s*(\{.*?\})\s*as const", text, re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def main() -> None:
    try:
        metadata, segments, regions, industries = build_metadata()
        print(f"  Metadata: {len(metadata)} tenants from Pharos")
    except Exception as e:
        print(f"  Metadata query failed ({e}), falling back to existing file")
        fallback = _load_existing_metadata()
        if fallback is None:
            raise RuntimeError("No existing metadata to fall back to") from e
        metadata, segments, regions, industries = fallback
        print(f"  Metadata: {len(metadata)} tenants from existing file")

    recruiter_capacity = build_recruiter_capacity_series()
    total_pts = sum(len(v) for v in recruiter_capacity.values())
    if total_pts == 0:
        print("  RC batches returned no data; falling back to existing file")
        existing = _load_existing_rc_series()
        if existing:
            recruiter_capacity = existing
            total_pts = sum(len(v) for v in recruiter_capacity.values())
            print(f"  RC fallback: {len(recruiter_capacity)} tenants, {total_pts} points")

    contents = f"""// Auto-generated by scripts/build_dashboard_tenant_filter_data.py
// Source: dw.user_test.interview_dashboard_tenant_filters + Recruiter Productivity IUM
// Generated: {date.today().isoformat()}

export type DashboardTenantFilterMeta = {{
  segment: string;
  region: string;
  industry: string;
}};

export const TENANT_FILTER_METADATA: Record<string, DashboardTenantFilterMeta> = {to_ts(metadata)} as const;

export const SEGMENT_OPTIONS = {to_ts(segments)} as const;
export const REGION_OPTIONS = {to_ts(regions)} as const;
export const INDUSTRY_OPTIONS = {to_ts(industries)} as const;

export const RECRUITER_CAPACITY_TENANT_SERIES: Record<string, Array<{{ ym: string; value: number }}>> = {to_ts(recruiter_capacity)} as const;
"""
    OUTPUT_PATH.write_text(contents)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
