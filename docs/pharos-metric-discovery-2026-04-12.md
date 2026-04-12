# Pharos Metric Discovery - 12 April 2026

Goal: determine which tracker metrics can already be sourced from Pharos without waiting for new IUM implementation.

## Summary

Three metrics are effectively available now via live IUM discovery:

- Offers accepted
- Employment agreement acceptance
- Internal applications submitted

Applicant volume splits by gender, race/ethnicity, and age are also available now via live IUM discovery.

Several other metrics have partial or adjacent Pharos coverage, but not enough semantic fidelity to claim the tracker definition without caveats:

- Career site reach / apply start can be approximated from Career Hub event tables
- New hire retention has a retention study table, but it is not the recruiting-sourced 12-month new-hire retention definition from the tracker
- Offers / EAs issued and renegotiations have candidate tables, but none of the accessible tables cleanly reproduce the job-application event-chain logic

Several metrics still look blocked in Pharos for PM-ready use:

- Referral counts / referral hires
- Peakon new-hire scores
- JR Agent time
- Workday-driven sourcing percentage
- Quality hires

Latest environment re-check on 12 April 2026: for the live-resolved recruiting IUMs now wired into the workspace (`Average Time to Hire`, `Number of Offers accepted.`, `Employment Agreement Acceptance`, `Recruiter Productivity`, `Count of Internal Job Applications last month`), the latest visible month in the accessible warehouse path surfaced under `SANDBOX` only. Historical mixed-env presence may exist, but a clean current-month PROD replacement was not confirmed.

## Classification

| Metric | Classification | Best current Pharos path | Evidence | Key caveat |
| --- | --- | --- | --- | --- |
| Offers / EAs - `# Offers Accepted` | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2346 - Number of Offers accepted.` | Resolve by `metric_name`, not historical ID assumptions. |
| Offers / EAs - `# Employment Agreements Accepted` | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2360 - Employment Agreement Acceptance` | Same drift caveat; do not assume old ID mappings are still safe. |
| Applicant Volumes - gender split | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2336-2339` for male, female, no gender assigned, non male/female gender | Counts are available, but PM-facing labelling and governance need care. |
| Applicant Volumes - race / ethnicity split | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2375-2379`, `2438-2445` for ethnicity buckets | Counts are available, but category semantics vary by metric name. |
| Applicant Volumes - age split | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2359`, `2427-2433` for age buckets | `2359` conflicts with older dashboard assumptions, so resolve by name first. |
| Internal Mobility - `# Internal Applications Submitted` | Available now | `dw.swh_raw.internal_usage_metrics_report_kafka` | Live IUM discovery found `2349 - Count of Internal Job Applications last month` | Appears monthly count; still needs naming confirmation against tracker wording. |
| Candidate Experience - career site reach | Proxy only | `dw.user_data.talent_ml_career_hub_jobs_all_events` | Live profiling found high-volume `impression` events plus `click` and `apply` interactions | Looks Career Hub specific; not yet proven to equal external career site unique IP reach. |
| Candidate Experience - applications started | Proxy only | `dw.user_data.talent_ml_career_hub_jobs_apply_transformed` | Live profiling found `apply` click events across 200+ tenants | Looks like apply-click / start behaviour, not confirmed tracker metric parity. |
| Candidate Experience - applications submitted | Blocked / no clean source found | None confirmed | No matching IUM names found; no PM-ready submit table found in live discovery | Engineering may still be needed. |
| Retention - new hire retention | Proxy only | `dw.user_test.talent_ml_employee_retention_study` | Live schema includes `two_year_retention_rate`, tenant size, segment, industry, and recruiting usage flags | This is not the tracker definition of recruiting-sourced hires retained after 12 months. |
| Offers / EAs - issued | Proxy only | `dw.mixology.initiate_offer`, `dw.user_test.uxresearch_candidate_journey_woffers`, `dw.user_test.bp_job_appl_event_records` | Live discovery found candidate tables by name | Accessible tables are telemetry / journey oriented, not a clean job-app offer-event fact table. |
| Offers / EAs - renegotiated / total renegotiations | Proxy only | `dw.mixology.request_compensation_change` | Live discovery found table by name | Sample rows look like generic UX telemetry, not reliable renegotiation facts. |
| Referrals / referral hires | Blocked / proxy only | PCA usage proxy only via `customer360` + `task_to_pca_mapping` | Repo already shows `Create a Referral` and `Refer a Candidate Business Process` usage signals | Usage is not the same as referral counts or referral hires. No direct table found by name. |
| Engagement - Peakon new-hire scores | Blocked | `dw.uxresearch_test.sms_peakon_master` is adjacent only | Live schema shows aggregate usage and segment mix fields, not score or new-hire outcome fields | Name suggests Peakon, but contents do not match the tracker metric. |
| Other - JR Agent time | Blocked in Pharos | `dw.mixology.hire_employee` is adjacent only | Live schema shows UX telemetry for hire employee flow | Repo still points to Mixpanel, not Pharos, for JR Agent time. |
| Other - sourcing percentage | Blocked | None confirmed | No live table or IUM found that cleanly supports sourcing attribution | Tracker caveat still applies: source semantics are messy and tenant-specific. |
| Other - quality hires | Blocked | None confirmed | No live source found matching quality-hire semantics | Repo still points to HiredScore grading as a possible future path. |

## Live evidence highlights

### Live IUM metrics discovered

- `2346 - Number of Offers accepted.`
- `2360 - Employment Agreement Acceptance`
- `2349 - Count of Internal Job Applications last month`
- `2336-2339` - gender-based job application counts
- `2375-2379`, `2438-2445` - ethnicity / race-based job application counts
- `2359`, `2427-2433` - age-based job application counts

### Live table candidates discovered

- `dw.user_data.talent_ml_career_hub_jobs_all_events`
- `dw.user_data.talent_ml_career_hub_jobs_apply_transformed`
- `dw.user_test.talent_ml_employee_retention_study`
- `dw.user_test.bp_job_appl_event_records`
- `dw.mixology.initiate_offer`
- `dw.mixology.request_compensation_change`
- `dw.user_test.uxresearch_candidate_journey_woffers`
- `dw.uxresearch_test.sms_peakon_master`

## Interpretation notes

### Metric-ID drift is real

The warehouse now surfaces recruiting-related metric names that conflict with older dashboard assumptions about stable IDs. That means:

- do not hard-code newly discovered tracker metrics by ID alone
- resolve live metrics by `metric_name` first
- treat historical materialised dashboard IDs as potentially stale until reconciled

### Best immediate wins

If the goal is to avoid new IUM work where possible, the best near-term wins are:

1. Wire the live IUM-discovered metrics for offers accepted, EA acceptance, applicant demographic volumes, and internal job applications.
2. Treat career-site funnel as a separate discovery / validation task using Career Hub event tables.
3. Keep issued / renegotiation, referral hires, Peakon scores, sourcing %, and quality hires in the blocked or proxy-only bucket for now.

## Recommended next steps

1. Add live metric-name discovery queries to the standard Pharos playbook for tracker metrics.
2. Reconcile the newly discovered IUM names against any older materialised dashboard ID assumptions before reusing them.
3. For career-site funnel, run a focused validation on whether Career Hub events map to external career site behaviour and whether a submit-stage event exists.
4. For issued / renegotiation metrics, only proceed if a clean job-application event-chain source can be proven, not just UX telemetry.
