# Offer Step Metrics Research Plan

## What Is Safe To Say Now

- `dw.swh.bp_event_record_stats` contains real Offer step activity in PROD and is the best current source for step-level Offer metrics.
- A focused 30-day profile confirmed these high-volume Offer task names:
  - `Generate Document`
  - `Review Documents`
  - `Review Writer Generated Document`
  - `Add Documents`
  - `Manage Attachments`
- The same pass also surfaced related integration and document-view tasks such as `Put Review Document Event for eSignature Integration (Web Service)` and `Put eSignature Integration Data (Web Service)`.
- `swh_raw.oms_requests` and `swh_raw.cloudmaster_document_repository_event` are useful supporting sources for task semantics, payload discovery, and document activity, but they are not yet clean enough to chart candidate attachment types safely.

## Recommended PM Metrics

### Ship After One Narrow Validation Pass

These metrics are defensible if we validate exact task-name queries and monthly stability:

1. `Generate Document`
   - Monthly step volume
   - Active tenant count
   - Average step duration
   - P90 step duration

2. `Review Documents`
   - Monthly step volume
   - Active tenant count
   - Average step duration
   - Reopen / relaunch volume if the task variant is stable

3. `Review Writer Generated Document`
   - Monthly step volume
   - Active tenant count
   - Average step duration
   - Share of Offer flows that hit the writer-generated review path

4. `Add Documents`
   - Keep the existing IUM-backed section
   - Optionally add a step-volume trend from `bp_event_record_stats` if we want workflow activity as well as feature adoption

### Do Not Ship Yet

1. `Initiate Offer`
   - I have not yet proven a clean, stable task in the accessible tables that maps exactly to this label.
   - There is an `Offer (Web Service)` task, but that is not yet a safe substitute for a PM-facing chart.

2. Candidate attachment types
   - `Manage Attachments` exists, but we have not yet validated a stable field that cleanly exposes the business attachment category a PM would care about.
   - `cloudmaster_document_repository_event.document_kind` currently looks operational and repository-oriented, not like a clean candidate-facing attachment taxonomy.

## Proposed Query Plan

### Phase 1 - Exact-Name Validation

- Run exact-name monthly queries in `dw.swh.bp_event_record_stats` for:
  - `Generate Document`
  - `Review Documents`
  - `Review Writer Generated Document`
  - `Add Documents`
  - `Manage Attachments`
- Return:
  - monthly volume
  - active tenants
  - average and P90 duration
- Use 6-12 months in PROD.

### Phase 2 - Attachments Proof

- Pull small payload samples from `swh_raw.oms_requests` for `Manage Attachments`.
- Inspect `processed_element_json` and `oms_request_json` for stable fields that look like:
  - attachment type
  - document category
  - candidate-facing document purpose
- If a stable field exists, define a narrow metric set:
  - offers with attachments
  - attachment actions per offer
  - top attachment types
  - tenant adoption of attachment usage

### Phase 3 - Correlation Check

- Attempt a correlation path using keys such as:
  - `common_request_id`
  - `reference_id`
  - `task_id`
- Goal:
  - tie `Manage Attachments` task activity to document repository events
  - prove whether attachment-type metrics are business-meaningful or only technical repository events

## Dashboard Recommendation

If Phase 1 validates cleanly, add a new `Offer Steps` section above the Add Documents section with:

1. KPI cards
   - latest-month volume for `Generate Document`
   - latest-month volume for `Review Documents`
   - latest-month volume for `Review Writer Generated Document`
   - latest-month average duration for the slowest validated step

2. Trend chart
   - monthly volume by validated step

3. Efficiency chart
   - monthly average duration by validated step

4. Optional tenant adoption chart
   - tenants using each validated Offer step per month

Keep `Initiate Offer` and attachment-type charts out of the dashboard until Phase 2 proves them.
