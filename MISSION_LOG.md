# Mission Log

## Overview
This log tracks the state of all active product initiatives, decisions, and handoffs across the agentic PM workspace.

**GCC E2E freshness (log per run):** **101 fresh:** **Step 1** — Pattern 1a baseline scan: new `research/competitive/gcc/gcc-competitive-scan-[YYYY-MM-DD]-GCC-E2E-0NN.md` + matrix changelog (not recycled scan only). **105 fresh:** **Step 2a** — `research/GCC/105-user-research-findings.md` with **## Fresh pass attestation** before **@pmf-analyst**. **106 / 108 (optional):** when `brainstorm-sessions/` or `gap-data/` contain `.txt` / `.csv` / `.xlsx` / `.xls`, new analysis under `brainstorm-analysis/` or `gap-analysis/` with attestation (and `scripts/dump_research_folder_to_text.py` for spreadsheets) before **@pmf-analyst**.

**106 two-tier sources:** **Global** `research/brainstorm-sessions/` (multi-region data, content-filtered) + **Region-specific** `research/[Country]/brainstorm-sessions/` (folder-filtered). P&T Idea Results Dashboard lives in global folder; 106 extracts region-relevant rows via Tier 3 content filtering.

## Current Status
**Status:** OPERATIONAL — agents, skills, and rules catalogue aligned (May 2026 doc pass)
**Last Updated:** 7 May 2026 (dashboard scorecard v1.5; prototypes save/unsave + route catalogue)
**Workspace Version:** 1.5
**Active Agents:** 10+ (Orchestrator + specialists incl. **@pmf-analyst** report + **130** PMF deck + Functional Knowledge Authority)

**NOTE (27 March 2026):** Recent Step 2.75 runs in missions GCC-E2E-024 through GCC-E2E-028 analyzed presales gap data (Opportunity Detail.xlsx containing Gap ID, Severity, Product Capability columns) using agent 108-tableau-gap-analyser (legacy 107 deprecated). This data should have been analyzed by 108-tableau-gap-analyser per orchestrator specification. Agent 107 has been deprecated and removed. The data file has been moved from `research/GCC/win-loss-interviews/` to `research/GCC/gap-data/` for correct routing to 108 in future E2E runs.

## System Health
- Folder structure reorganised (Country-based PMF research)
- MDC rules in `.cursor/rules/` (incl. 050-functional-knowledge, **@pmf-analyst** PMF thematic analysis, **130** PMF slide generator)
- **21 MCP server folders** configured under Cursor (`mcps/`); see **`000-master-orchestrator.mdc`** for the active roster. **`user-jira-ghe`** may still require manual auth in Cursor Settings if stories or Jira automation fail.
- Documentation updated (research/README.md - comprehensive guide)
- Sequential thinking verification complete
- Functional Knowledge RAG layer OPERATIONAL (6/6 PDFs ingested, 49.4MB)
  - Admin-Guide-Authentication-and-Security.pdf (1.5MB)
  - Admin-Guide-Human-Capital-Management.pdf (12MB)
  - Admin-Guide-Manage-Workday.pdf (5.2MB)
  - Offer & Employment Agreement - Functional Overview (7.4MB)
  - Recruiting Data Purge - Functional Overview (19MB)
  - Recruiting Duplicate Management - Functional Overview (375KB)
- PMF Thematic Analysis: Country-based Braun & Clarke with Triangulation (**@pmf-analyst**)
- Prototypes: open from Vite dev server (`design/`, port **5199**). **Save/Unsave** on `docs/pm-agent-prototypes.html` persists to `docs/saved-prototypes.json` when served via **`python3 scripts/dashboard-server.py`** on port **8765** (same-origin `/api/save-prototype`).
- **Compliance lens (060):** MCPs touching Jira, Slack, or Confluence may surface **personal or customer-identifying data** — share minimum necessary excerpts, respect customer DPAs and regional privacy law, and keep **human review** on AI-influenced candidate decisions (GDPR Art. 22; EU AI Act high-risk recruiting context). **Playwright / SUV smoke** remains **dev SUV only**; do not aim automation at production tenants.

## Copy Review Timing Change (March 2026)

**Old flow**: 315 → 320 → 319 (copy review after prototype)
**New flow**: 315 PASS 1-2 → 319 (copy review) → 315 PASS 3-4 → 320 (build with approved copy) → 319 (spot-check)

**For in-flight missions** (GCC-E2E-005, GCC-CANDIDATE-GRID-001, etc.):
- Continue with old flow (already past 315)
- New missions (GCC-E2E-006+) will use new flow

**Benefits**:
- Copy issues caught before implementation
- Legal compliance validated upfront
- Less rework for 320 (prototype developer)
- Faster iteration cycle

## Strategic Learning & Best Practices

Full content (Noah session, PRD/slide skills, async delegation, gaps): [Archive](docs/mission-archive/STRATEGIC-LEARNING-2026-03-31.md)

## Active Missions

**Mission format template:** `docs/mission-archive/MISSION-FORMAT-TEMPLATE.md`

**Full narrative blocks** (artifacts, pipeline steps, notes): `docs/mission-archive/active-missions-full-detail-2026-03-31.md`

| Mission | Status | Next gate / notes |
|---------|--------|-------------------|
| INTERVIEW-INTEL-001 | Complete | **All artefacts delivered:** PRD `docs/prds/interview-intelligence-agent-prd.md` (Legal 060 + Red Team 080 reviewed, revised); Design Brief `design/interview-intelligence-agent-design-brief.md` (318 peer reviewed, 319 copy reviewed); Prototype `http://localhost:5199/interview-intelligence-agent-v96` (3 views: Prep Card, Panel Feedback, Debrief). Innovation opportunity from GM April 2026 all-hands (interviewing and selection). |
| GCC-E2E-034 | In Progress | **Step 24 (410) complete:** Epic draft `docs/epics/gcc-interview-scheduling-compliance-nudges-epic-draft.md` (no Jira yet). **Step 23 (330):** Figma **https://www.figma.com/design/ErDsbk1VrnqI8hgknCu8O3** (*GCC Interview Scheduling Compliance Nudges v90*). Prototype at `http://localhost:5199/gcc-interview-scheduling-v90`. Selected: **#3 Interview Scheduling + Compliance Nudges** (RICE 1.80); PRD: `docs/prds/gcc-interview-scheduling-compliance-nudges-prd.md`; CI: matrix v1.25. Next: **420** story mapping (then 430 Jira epic + stories). |
| FRANCE-E2E-001 | In Progress | Step 2.75 done; **105** → **@pmf-analyst** → deck → downstream E2E |
| FRANCE-E2E-002 | In Progress | Story map step 27; story map review → Jira |
| INDIA-E2E-004 | In Progress | Step 410 epic next after 330 |
| GCC-E2E-002 | In Progress | 400→420→430 backlog for Recruiter Dashboard |
| DESIGN-CANON-001 | In Progress | Figma deep-dive when rate limit resets; HiredScore grid canonicalisation |
| GCC-E2E-008 | Blocked | HITL — PM select recommendation |
| INDIA-PMF-003 | Complete | PMF Research done; Selected: **#4 Mandatory Government ID UX** (RICE 1,575); Deck: `~/Downloads/India_Recruiting_PMF_Roadmap_v85.pptx` (59 slides); PMF: `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-003.md`; CI: `research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-003.md` |
| INDIA-PMF-004 | In Progress | **Step 10 (130) deck** — `docs/decks/specs/slides_spec_v86.json`; `~/Downloads/India_Recruiting_PMF_Roadmap_v86.pptx` (68 slides, v65-parity structure). Thematic: `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md`. **Step 4 CI** — `research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-004.md`; matrix **v1.10**. **106** — `research/India/brainstorm-analysis/2026-04-01-brainstorm-analysis.md`. Next: India E2E HITL / PRD if continuing. Driver: New market entry; Focus: high volume + Know Your Candidate. |
| INDIA-PMF-005 | In Progress | Step 1 - Strategy Context; Driver: New market entry; Focus: high-volume recruiting + Know Your Candidate / identity verification |
| INDIA-E2E-005 | In Progress | **PRD (Step 14):** `docs/prds/india-native-whatsapp-recruiting-prd.md` — **Native WhatsApp Messaging in Core Recruiting UI** (PM-selected). **06 Apr 2026:** PRD **revision 1** after **060**. **07 Apr 2026:** PRD **Red Team revision (1 pass)**. **315 PASS 1–2:** `design/india-native-whatsapp-recruiting-design-brief.md`. **07 Apr 2026:** **319** copy review + **318** peer review complete; **Final Verdict: APPROVED**; Copy Inventory updated in brief; consent/free-text strings **flagged for 060** before GA. Next: **320** prototype. PMF: `research/India/thematic-analysis/2026-04-06-India-PMF-Analysis-INDIA-E2E-005.md`. **130 deck:** `docs/decks/specs/slides_spec_v91.json`; `~/Downloads/India_Recruiting_PMF_Roadmap_v91.pptx`. CI: matrix v1.12. Driver: New market entry; WhatsApp + DPDP. |
| INDIA-PMF-006 | Complete | PMF Research + PRD + Design + Prototype + Backlog for Rec #4 (WhatsApp). **Spec:** `docs/decks/specs/slides_spec_v87.json`. **Deck:** `~/Downloads/India_Recruiting_PMF_Roadmap_v87.pptx` (66 slides). **PMF:** `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-006.md`. **PRD:** `docs/prds/india-whatsapp-sms-candidate-messaging-prd.md`. **Design Brief:** `design/india-whatsapp-candidate-messaging-design-brief.md` (318 APPROVED). **Prototype:** `design/india-whatsapp-candidate-messaging-v88.tsx`. **Figma:** https://www.figma.com/design/xfiN99c4hzqu9GeWZGREpy. **CI:** matrix v1.11. **Epic:** [HRREC-91286](https://jira2.workday.com/browse/HRREC-91286) (29 stories: VS1=13, VS2=10, VS3=6; SMS descoped). |
| UNIVERSAL-PROFILE-001 | Complete | Executed 200 to 321 for EUDI Wallet / Verifiable Credentials integration. PRD: `docs/prds/universal-profile-eudi-wallet-prd.md`. Design Brief: `design/universal-profile-eudi-wallet-design-brief.md`. Prototype: `design/universal-profile-eudi-wallet-v1.tsx`. |

### Stale Missions (archived 31 March 2026)

The following 30 missions were marked "Pipeline mid-flight" or stalled at HITL gates with no activity for 14+ days. They have been moved to `docs/mission-archive/stale-missions-2026-03-31.md`. To resume any mission, re-trigger the pipeline from the last known gate.

Archived: MISSION-009, MISSION-010, MISSION-011, MISSION-014, MISSION-015, MISSION-016, MISSION-017, GCC-E2E-003, GCC-E2E-004, GCC-E2E-005, GCC-E2E-006, GCC-E2E-007, GCC-E2E-009, GCC-E2E-011, GCC-E2E-012, GCC-E2E-014, GCC-E2E-015, GCC-E2E-018, GCC-E2E-019, GCC-E2E-020, GCC-E2E-021, GCC-E2E-022, GCC-E2E-023, GCC-E2E-024, GCC-E2E-027, GCC-E2E-032, GCC-E2E-033, IN-E2E-002, IN-E2E-003, INDIA-E2E-001

## Decision Log

### DECISION-026: Customer issue triage run recorded for HRREC-82310
**Date:** 21 April 2026  
**Context:** `/customer-issue-triage HRREC-82310` was executed to classify whether referral endorsement notification behaviour is WAD, configuration-related, or a software defect.  
**Choice:** Classified `HRREC-82310` as **Bug (90%)** using Salomon primary evidence plus XO metadata inspection, and appended a new six-column row to Confluence page **Customer Issue Triage POC** (version 9).  
**Rationale:** Salomon returned a direct symptom match for the same Endorse Candidate/Primary Recruiter notification failure, while XO task/element metadata aligned with the impacted path and did not contradict a defect classification.  
**Owner:** David Denham + PM triage workflow  
**Status:** Implemented

### DECISION-027: Customer issue triage batch recorded for three HRREC tickets
**Date:** 21 April 2026  
**Context:** `/customer-issue-triage HRREC-82310 HRREC-81610 HRREC-78147` was executed to classify each issue as WAD, Config, or Bug using Salomon primary guidance with XO metadata evidence and Deployment Agent expected-behaviour context.  
**Choice:** Classified all three as **Bug** with confidence scores: `HRREC-82310 (90%)`, `HRREC-81610 (84%)`, and `HRREC-78147 (88%)`, and appended a new six-column triage table section to Confluence page **Customer Issue Triage POC** (version 10).  
**Rationale:** Salomon evidence for each ticket identified known defect patterns or known bug-linked workarounds, while XO checks either supported the impacted execution paths (`HRREC-82310`, `HRREC-78147`) or provided neutral structural evidence without contradiction (`HRREC-81610`).  
**Owner:** David Denham + PM triage workflow  
**Status:** Implemented

### DECISION-028: `@qa-engineer` subagent + `suv-smoke-test` skill added for post-write UI smoke checks
**Date:** 21 April 2026  
**Context:** `@xo-developer`'s Tier 2 writes (`copy-edit`, `validation-edit`, `prompt-edit`, `method-edit`, `modulr-page`) confirmed XO metadata changed but did not confirm the user-facing UI changed. `@xo-code-reviewer` reviews artefact, not runtime. WATS was the wrong tool for a 30-second PM vibe-check after a guarded write. The Playwright MCP (`user-playwright-mcp`, 22 tools) was enabled but unused - no agent drove it.  
**Choice:** Added new `@qa-engineer` subagent (`.cursor/agents/qa-engineer-agent.md` + `qa-engineer-refs/{testing-playbook.md, expertise-profile.md}`) that delegates to a new `suv-smoke-test` skill (`.cursor/skills/suv-smoke-test/`) with six modes: `auth-handshake` (one-time SSO bootstrap to `.playwright/storageState.json`; gitignored), `label-check`, `validation-fire`, `method-regression`, `page-smoke`, `console-and-network`. Orchestrator updated to run `@xo-code-reviewer` + `@qa-engineer` **in parallel** after every UI-observable `@xo-developer` Tier 2 write; Advisory #17 extended to triage both streams into a single PM recap. MCP integration list bumped from 20 to 21 (Playwright MCP now documented as driven by `@qa-engineer`).  
**Rationale:** Fills the metadata-vs-rendered-UI verification gap without competing with WATS (which remains the right tool for persistent engineering-owned regression tests). Dev SUV only, persist-button blocklist enforced, storageState never committed. Fully out-of-pipeline; inherits the `xo-builder` isolation contract (no E2E, no MISSION_LOG writes, no rule chain).  
**Owner:** David Denham  
**Status:** Implemented; manual PM-assisted verification (run `/suv-smoke-test auth-handshake` + `/suv-smoke-test page-smoke` + a parallel `copy-edit` + `label-check` end-to-end) deferred to post-deploy - cannot be auto-executed because it requires interactive SSO.

### DECISION-029: `suv-smoke-test` auth contract rewritten and noise allowlist added after first live run
**Date:** 22 April 2026  
**Context:** First real `/suv-smoke-test auth-handshake` + `/suv-smoke-test page-smoke` run on a live Workday dev SUV (Job Requisition Workspace) surfaced two skill-level issues. (1) The auth contract overclaimed: pre-flight and mode docs told the PM that every smoke run "loads `.playwright/storageState.json` at start". It does not - the Playwright MCP's `browser_run_code` sandbox has no Node `fs`, so reloading that file is impossible. The smoke session persisted only because the Playwright MCP runs its own persistent `user-data-dir` profile that survives `browser_close`. The docs were silently wrong. (2) The `page-smoke` report on a clean page emitted 4 `[WARNING]` findings - two CDN CORS fallbacks on `*.workdaysuvcdn.com/.../toggles*` and two failed `uxInsights` analytics beacons at an AWS API Gateway endpoint. None are related to any change under test; all appear on every dev SUV page load. Leaving them as warnings trains the reader to ignore warnings and degrades `@xo-developer`'s Advisory #17 triage signal-to-noise.  
**Choice:** Two architectural fixes applied in one commit. (A) Rewrote `SKILL.md` §Authentication Lifecycle + all six mode docs to say the primary auth source is the Playwright MCP's persistent browser profile; `.playwright/storageState.json` is a recovery backup, never auto-reloaded. Replaced the "storageState mtime fresh" pre-flight check with a post-navigation session-presence probe (Flow step 1 of every smoke mode) that inspects the accessibility tree for login-form markers and emits `[ERROR] session-expired` if found. Renumbered Flow steps in `label-check`, `validation-fire`, `method-regression`, `page-smoke`. `console-and-network` is exempt (tail-only, no navigation). (B) Added skill-scoped `.cursor/skills/suv-smoke-test/noise-allowlist.md` with two initial entries: `cdn-toggles-cors-fallback` and `uxinsights-analytics-beacon`. `page-smoke` Rubrics 3-4 and `console-and-network` steps 3-4 now consult the allowlist and downgrade matched events to `[INFO] (allowlisted noise: <entry-id>)`; modes emit a rolled-up `[INFO] noise-allowlisted-matches: ...` summary line. Allowlist is downgrade-only, never suppresses, never cross-scopes. Updated `MODES.md` to reflect new auth framing.  
**Rationale:** Fixes two mismatches between the doc contract and runtime reality that would have compounded every time a PM ran the skill. Honest auth framing means the PM trusts the skill's diagnostics when a real session expires instead of getting false reassurance from a stale file check. Allowlist stops triage-layer noise without hiding it (still counted in summary) and is extensible when new persistent noise is observed. Both changes are documentation-level, no runtime behaviour shift beyond the probe + allowlist steps; low-risk, high-hygiene. Skill remains out of pipeline, still inherits the `xo-builder` isolation contract.  
**Owner:** David Denham (via `@.cursor/rules/090-agent-improvement-advisor.mdc`)  
**Status:** Implemented

### DECISION-024: HRREC-81393 Metrics Verified, Historical Backfill, and Dashboard Enhancement
**Date:** 17 April 2026  
**Context:** Needed to verify the adoption metrics are correct (exclude old flow), determine launch date, and provide a full adoption trend since launch.  
**Choice:** (1) Verified metrics via 4 probe queries: pre-launch baseline (19 Sep 2025, 1 early preview), post-launch signal (22 Sep 2025, 1,196 subs / 344 tenants), OLD path exclusion (1,188 correctly excluded), workset exclusivity (zero co-occurrence). (2) Calculated launch date from Toggle Intended Prod `2025.38` = 20 Sep 2025. (3) Ran weekly backfill (30 Saturdays, 20 Sep 2025 to 12 Apr 2026) with cumulative tenant tracking. (4) Added submissions trend line chart and cumulative tenant adoption chart to dashboard. (5) Added Toggle Intended Prod date mapping to `055-xo-integration.mdc`.  
**Rationale:**
- Verification confirms dual-filter (`15$478022` + `15604$`) correctly isolates NEW feature
- Cumulative tenant count (9 to 233 in 29 weeks) demonstrates steady organic growth
- Near-linear acquisition rate (~7.7 new tenants/week) shows no plateau
- Toggle Intended Prod rule makes launch date calculation reusable across features  
**Owner:** David Denham  
**Status:** Implemented

### DECISION-025: HRREC-81393 agency-scoped share, weekday calibration, exploratory IUM correlation
**Date:** 17 April 2026  
**Context:** Stakeholders needed a clearer denominator among customers who actually use agency types, validation that Saturday weekly samples are interpretable, and a cautious read on whether general recruiting IUMs differ for Agency Types adopters.  
**Choice:** (1) Documented **Metric D** (OLD-path `15604$` without `15$478022`) and **agency-scoped NEW share** approx. **54.3%** on 16 Apr 2026 (365 of 367 agency-touching tenants with NEW activity). (2) Recorded **Tuesday 15 Apr 2026** Metric A calibration (1,252 subs / 363 tenants) and total Post Job volume 129,646 for narrative on sampling. (3) Exported SANDBOX IUM **2358** and **2361** per tenant for **`wd_event_date`** Feb 2026 to `docs/analytics/data/ium-2358-2361-feb2026-tenant.csv`; ran **Mann-Whitney U** vs non-adopters from `tenant-agency-types-usage.csv` (significant; **confounded**). (4) Updated impact report, OMS metrics doc, and dashboard data; **no** new Value Driver Tree node until agency-scoped outcome IUM exists.  
**Rationale:** Agency-touch denominator answers a different question than global Post Job share; weekday spot-check bounds backfill interpretation; IUM tests are explicitly non-causal and use the only available warehouse month slice without timeout.  
**Owner:** David Denham  
**Status:** Implemented

### DECISION-023: HRREC-81393 PM Impact Report with calculated adoption metrics
**Date:** 17 April 2026  
**Context:** Raw OMS metrics (DECISION-021/022) needed PM-level interpretation to demonstrate feature impact for stakeholder communication.  
**Choice:** Created `docs/analytics/hrrec-81393-impact-report.md` with three calculated KPIs: (1) **Adoption Share** = NEW submissions / total Post Job submissions (~1.1%); (2) **Tenant Penetration** = NEW tenants / total Post Job tenants (~11%); (3) **Menu Migration** = NEW opens / (OLD + NEW opens) (~27-34%). Queried total Post Job denominators from OMS for two sample dates (2026-03-18 and 2026-04-16).  
**Rationale:** 
- Transforms raw counts into actionable PM metrics
- Low adoption share (1.1%) is contextualised as expected (not all postings use agency types)
- Tenant penetration (11%) demonstrates meaningful breadth
- Menu migration shows behaviour shift from legacy path
- Report includes follow-up metrics (sites per type, time-to-post, error rate, cohort retention)  
**Owner:** David Denham  
**Status:** Implemented

### DECISION-022: Automated daily HRREC-81393 Agency menu metrics backfill script
**Date:** 17 April 2026  
**Context:** Interactive Pharos queries for HRREC-81393 menu metrics are expensive on `dw.swh_raw.oms_requests` and can time out when run across broad date ranges. We needed a repeatable, partition-safe way to generate trend data for both OLD and NEW menu paths.  
**Choice:** Added `scripts/build_hrrec_81393_agency_menu_daily_metrics.py` to run per-day queries and emit `docs/analytics/data/hrrec-81393-agency-menu-daily-metrics.csv`. The script calculates: (A) NEW feature submissions using refined filter `processed_element_json` contains both `15$478022` and `15604$`; (B) OLD menu opens via prompt `45$17735`; (C) NEW menu opens via prompt `45$28385`. Added run instructions to `docs/analytics/hrrec-81393-post-job-agency-type-oms-metrics.md`.  
**Rationale:** 
- Makes metric collection repeatable and less error-prone
- Avoids broad scans by operating on `wd_event_date` partitions
- Preserves the refined NEW-submission definition and old/new prompt comparability  
**Owner:** David Denham  
**Status:** Implemented (smoke test passed for 2026-04-16)

### DECISION-021: HRREC-81393 Agency menu usage measured via OMS (dual metrics + refined submission filter)
**Date:** 17 April 2026  
**Context:** [HRREC-81393](https://jira2.workday.com/browse/HRREC-81393) added **Agency Types** (bulk post by type) alongside existing **Agency by Type** (type then sites). No IUM; wide Pharos scans on `oms_requests` time out.  
**Choice:** Document canonical Pharos SQL in `docs/analytics/hrrec-81393-post-job-agency-type-oms-metrics.md`. **Submissions (NEW feature):** Post Job `U` rows with `processed_element_json` matching **both** workset `15$478022` and class prefix `15604$` (excludes OLD drill path where `15604$` can appear under `15$157785`). **OLD vs NEW menu intent:** count `getReferencePrompt` rows with `oms_request` containing `45$17735` (Agency by Type) vs `45$28385` (Agency Types). Run per `wd_event_date` for performance.  
**Rationale:** Gives a definitive adoption signal for VS4 and a comparable navigation proxy for the legacy GST; avoids overstating NEW usage when counting `15604$` alone.  
**Owner:** David Denham  
**Status:** Implemented (sample PROD snapshots: 2026-03-18 and 2026-04-16 recorded in analytics doc)

### DECISION-020: XO MCP extended to epic definition and story validation
**Date:** 17 April 2026  
**Context:** Backlog refinement had XO guidance in 400/420/430, but early epic framing (410) and post-creation quality gate (435) did not yet explicitly validate scope and parity against XO task/service metadata.  
**Choice:** Updated `.cursor/rules/410-epic-definition.mdc` and `.cursor/rules/435-story-validator.mdc` to add XO MCP grounding and validation paths (`xo_search`, `ui_task_analysis_get`, element checks, and service metadata parity checks) for existing-task/service features.  
**Rationale:** 
- Improves epic scope quality before story mapping starts
- Adds objective parity checks during post-creation validation
- Reduces risk of duplicate or mis-scoped stories reaching sprint planning  
**Owner:** David Denham + PM backlog quality workflow  
**Status:** Implemented

### DECISION-019: XO MCP expanded into backlog refinement workflow
**Date:** 17 April 2026  
**Context:** XO MCP had been integrated for PRD and design grounding, but backlog refinement rules still lacked explicit guidance for mapping UI-task constraints and API coverage into story slices and acceptance criteria.  
**Choice:** Updated `.cursor/rules/400-backlog-refinement.mdc`, `.cursor/rules/420-story-mapping.mdc`, and `.cursor/rules/430-story-writing.mdc` to require XO MCP usage for existing-task/service features (search, task analysis, element deep dives, and service metadata checks) and to surface UI-vs-REST validation gaps as explicit story scope.  
**Rationale:** 
- Improves story-map quality by grounding VS1 in real task constraints
- Reduces rework from missing required fields and hidden validation dependencies
- Produces stronger AC/BDD with explicit parity-gap coverage between UI and API  
**Owner:** David Denham + PM backlog workflow  
**Status:** Implemented

### DECISION-018: XO MCP integrated for PM technical grounding
**Date:** 17 April 2026  
**Context:** PRD and design workflows needed direct access to XO task and metadata structure so scope, validations, and API coverage could be grounded in current implementation details rather than narrative-only sources.  
**Choice:** Installed Contexto and integrated XO MCP into Cursor config; updated orchestrator and workflow rules to treat XO MCP as a first-class source for PRD grounding (200), design discovery (315), and backlog validation mapping. Added dedicated guidance in `.cursor/rules/055-xo-integration.mdc`.  
**Rationale:** 
- Improves PRD accuracy with real task/field/validation context
- Reduces design rework by validating existing task behaviour early
- Strengthens story quality by exposing UI-vs-REST validation gaps earlier  
**Owner:** David Denham + PM orchestrator  
**Status:** Implemented

### DECISION-017: Dashboard filters standardise on tenant enrichment dimensions
**Date:** 13 April 2026  
**Context:** The Average Time to Hire and Recruiter Capacity dashboards had drifted into different filter models. Time to Hire still used region and cloud-platform controls that did not consistently scope every chart, while Recruiter Capacity only exposed a time-range filter. The Value Realisation landing page also repeated too many secondary links in its dashboard section.  
**Choice:** Materialise shared tenant enrichment from `dw.user_test.interview_dashboard_tenant_filters` plus recruiter-capacity tenant series, standardise both dashboards on four top-level filters (`Segment`, `Region`, `Industry`, `Tenant`), and make the Time to Hire cards and charts recompute from the selected tenant scope instead of relying on partial overlays. Keep Recruiter Capacity honest by applying the new filters to the primary load metric and using scoped context only where single-dimension aggregates exist. Simplify Value Realisation so the dashboard panel emphasises `Product Value Outcomes` and a separate `Adoption & Usage Metrics` section.  
**Rationale:** 
- Aligns the two flagship outcome dashboards to one consistent information architecture
- Stops Time to Hire from showing filter controls that only partly affect the underlying visuals
- Uses real tenant enrichment rather than inventing synthetic scope dimensions
- Reduces clutter on Value Realisation by removing links already surfaced elsewhere  
**Owner:** David Denham + PM dashboard workflow  
**Status:** Implemented

### DECISION-016: Value driver tree goes live-only and Value Realisation separates navigation from evidence
**Date:** 13 April 2026  
**Context:** The value driver tree still mixed live metrics with a visible future placeholder for Offer / EA chain timing, and the Value Realisation landing page had become crowded because dashboard navigation, tracker coverage, live IUM inventory, and method notes all competed in one scroll. The BP durations page also drifted visually from the shared navigation shell because its body was wider than the centred nav column.  
**Choice:** Remove future-only nodes from the value driver tree, replace the Offer / EA branch with measured live metrics already materialised in the repo, standardise connectors to a single dashed treatment, and surface semantic edge labels alongside correlation strength. Reorganise Value Realisation into tabs (`Dashboards`, `Coverage & Live Metrics`, `Methods & Notes`) while keeping the two core business outcome cards at the top. Align BP durations content to the same centred width as the global nav shell.  
**Rationale:** 
- Keeps the tree analytically honest by showing only live working metrics
- Prevents the UX from overstating blocked instrumentation as if it were part of the current product story
- Restores scanability on the Value Realisation page by separating dashboard choice from evidence and caveats
- Makes BP durations feel like part of the same dashboard system instead of a wider standalone page  
**Owner:** David Denham + PM dashboard workflow  
**Status:** Implemented

### DECISION-004: PMF roadmap decks — **130** after **@pmf-analyst**
**Date:** 22 March 2026  
**Context:** Full PMF PowerPoints were previously **@pmf-analyst** Phase 6b; separation improves handoff clarity.  
**Choice:** **@pmf-analyst** produces the markdown report only; **130-pmf-slide-generator** builds `docs/decks/specs/slides_spec_vN.json` and `~/Downloads/[Country]_Recruiting_PMF_Roadmap_vN.pptx` from that report. GCC E2E: **@pmf-analyst** → **130** → HITL → **@competitive-intel** → …  
**Owner:** PM + orchestrator rules update  

### DECISION-005: Value Realization Metrics Integration Pattern
**Date:** 31 March 2026  
**Context:** Need standardized metric selection for PRDs + ad-hoc metric suggestions across PM workflows. Jamie Moore maintains Talent Acquisition metrics tracker (40+ metrics across 10 categories).  
**Options Considered:** 
- Rule (`.cursor/rules/017-value-metrics.mdc`) - 140 CSV rows = heavy token load; passive context, not interactive suggestion engine
- Sub-agent (`.cursor/agents/value-metrics-agent.md`) - Overkill for metric suggestion; no heavy research needed; unnecessary isolation overhead
- **Skill (`.cursor/skills/value-metrics/`) + Reference CSV (`docs/metrics/`)** - SELECTED  
**Choice:** **Skill** (`/value-metrics`) + **Reference CSV** (`docs/metrics/talent-acquisition-value-metrics.csv`)  
**Rationale:**
- **Reusable**: Used by 200-prd-writer (Step 2.5 auto-invoked), @pmf-analyst (Step 3.5 for recommendations), 410-epic-definition (Step 1.5 for epics), 130-pmf-slide-generator (fallback), 100-market-intelligence, 110-slide-generator, 400-backlog-refinement
- **Interactive**: Provides intelligent metric suggestions (not passive reference)
- **Dual-mode**: Works standalone (`/value-metrics suggest [feature]`) AND auto-invoked by agents
- **Lightweight**: No heavy research, just smart CSV parsing and category mapping
- **Separation of concerns**: Data (CSV maintained by Jamie Moore) separate from logic (skill)
- **Easy updates**: Jamie updates CSV without touching skill code
- **Version control**: Git tracks metric evolution over time
- **Portable**: Other tools (Python, Tableau) can read same CSV  
**Implementation:**
- CSV stored: `docs/metrics/talent-acquisition-value-metrics.csv`
- Skill created: `.cursor/skills/value-metrics/SKILL.md` (3 capabilities: suggest, list, show)
- 200-prd-writer updated: Step 2.5 auto-invokes `/value-metrics suggest` after Feature Solution draft
- Returns 3 relevant metrics with rationale, calculation, status, Jira link
- Category mapping: Maps feature keywords to metric categories (Time to Hire, Candidate Experience, etc.)
- Reduces metric selection time from 5-10 min → 30 seconds  
**Tested with:**
- AI-powered candidate screening → Time to Hire, Productivity, Candidate Experience ✅
- Internal mobility career pathing → Internal Mobility metrics ✅
- Interview scheduling automation → Interview Time/Volumes metrics ✅  
**Owner:** David Denham (PM)  
**Status:** Implemented and documented in `.cursor/skills/README.md`

**Update - 31 March 2026: Enhanced to 3-Tier Metrics Hierarchy**

**Context:** Initial implementation only suggested Business Value (BV) metrics from CSV. User requested enhancement to support Workday Talent Product methodology: 3-tier hierarchy (BV → PV → Adoption/Usage) with JTBD integration.

**Enhancement Implemented:**
- **JTBD integration**: Skill now auto-invokes `/jtbd` to extract customer job statement
- **PV derivation**: Generates 3 Product Value metrics from JTBD (Time/Volume/Quality patterns)
- **Auto-linking**: PV→BV relationships with causality logic (Direct/Indirect/Weak confidence)
- **Adoption/Usage generation**: Feature-specific metrics (% of users, actions per user)
- **New reference files**:
  - `pv-derivation-guide.md` - PV metric patterns from JTBD with 15 worked examples
  - `pv-bv-linkage-map.md` - Causality rules for auto-linking with confidence levels
- **200-prd-writer updated**: Step 2.5 now receives complete metrics package (not just BV)
- **PRD template updated**: Overview table now includes Impact → Product Outcomes → Outputs hierarchy

**Benefits:**
- Complete metrics framework (was BV-only, now BV + PV + Adoption/Usage)
- JTBD-grounded PV metrics (traceability to customer jobs)
- Auto-linked PV→BV relationships (shows business impact path)
- Matches Workday Talent Product methodology (screenshot-validated)
- Time savings: 15-20 min → 30 sec (3x more comprehensive than before)

**Testing:**
- ✅ AI screening: 2 BV + 3 PV (with multi-BV link) + 1 Adoption + 1 Usage
- ✅ WhatsApp GCC: 3 BV + 3 PV (regional adaptation) + 1 Adoption + 1 Usage
- ✅ Interview scheduling: 2 BV + 3 PV (negative metric) + 1 Adoption + 1 Usage
- All tests PASS (100% success rate)
- Test report: `.cursor/skills/value-metrics/test-report-2026-03-31.md`

**Production Status:** ✅ Ready for production use in next PRD workflow

**Update - 31 March 2026: Extended to Epic and PMF Recommendation Workflows**

**Context:** Metrics framework successfully integrated in PRD workflow (200). User requested extension to:
1. Epic creation (410) - carry forward from PRD or generate fresh for standalone epics
2. PMF recommendations (@pmf-analyst) - 1 BV metric per Priority 1 recommendation
3. JTBD resource validation - verify `/value-metrics` can access JTBD persona research

**Enhancements Implemented:**

**410-epic-definition.mdc**:
- **New Step 1.5**: Extract or Generate Value Metrics
  - Scenario A (from PRD): Extract 3-tier metrics from PRD "Strategic Value & Outcomes"
  - Scenario B (standalone): Invoke `/value-metrics suggest [epic description]`
- **Updated epic template**: Add "Success metrics (for Jira epic)" section with 3-tier hierarchy
- **430 integration**: Jira epic description now includes value metrics from draft

**@pmf-analyst (`.cursor/agents/pmf-analyst-agent.md`)**:
- **New Step 3.5**: Suggest Value Metrics per Recommendation
  - Invokes `/value-metrics` for each Priority 1 recommendation (max 5)
  - Selects 1 BV metric per recommendation (aligned with RICE Business Impact)
  - Documents "Success Metric" subsection with baseline/target in report
- **Recommendation Quality Filter**: Ensures recommendations are feature/capability-focused
  - ✅ Valid: Native capabilities, workflow automation, compliance features, integrations, UX improvements
  - ❌ Invalid: "Language pack", "work with pre-sales", "train CS", "improve docs", GTM activities
  - Applied before metrics invocation to ensure roadmap relevance

**130-pmf-slide-generator.mdc**:
- **Success Metrics section enhanced**: Extract BV metric from @pmf-analyst "Success Metric" subsection
- **Fallback for legacy reports**: If @pmf-analyst report lacks metrics, 130 invokes `/value-metrics` directly
- **Format**: "[BV Metric]: [Baseline] → [Target] ([% improvement])"

**JTBD Resource Integration** (`.cursor/skills/value-metrics/SKILL.md`):
- **Documented integration flow**: `/value-metrics` → `/jtbd` → JTBD Library → PV derivation
- **Resource paths validated**:
  - Primary: `/jtbd` skill (`.cursor/skills/jtbd-analysis/SKILL.md`) with JTBD Library (lines 184-225)
  - Extended: `docs/jtbd-recruiting-hr-professional-and-manager.md` (curated excerpt)
  - Persona PDFs: `docs/workday-user-research/*.pdf` (HR Professional, Frontline Manager, External Candidate)
- **Status**: ✅ JTBD resources accessible; JTBD Library contains Workday-specific recruiting jobs matching PDF structure

**Benefits:**
- **Epic-level value tracking**: Epics now have same metrics rigor as PRDs
- **Roadmap BV metrics**: PMF recommendations gain quantified success metrics
- **Recommendation quality**: Feature-focused filter prevents "language pack" / GTM anti-patterns
- **130 resilience**: Works with enhanced or legacy @pmf-analyst reports
- **JTBD transparency**: Integration documented; resource paths validated

**Scope Coverage:**
- ✅ PRD workflow (200) - 3-tier metrics with JTBD
- ✅ Epic workflow (410) - From PRD or standalone generation
- ✅ PMF workflow (@pmf-analyst → 130) - 1 BV metric per recommendation
- Remaining: Backlog (400/420/430) - carries forward from epic/PRD (no additional changes needed)

**Production Status:** ✅ Ready for next epic creation and PMF workflow

### DECISION-009: Live Pharos tracker metric classification
**Date:** 12 April 2026  
**Context:** Jamie Moore's tracker still listed several Recruiting value metrics as blocked or waiting for Engineering, but live Pharos verification was needed to separate genuinely missing instrumentation from already-exposed data that had simply not been wired into the workspace guidance.  
**Choice:** Classify tracker metrics into three buckets: available now, proxy-only, or blocked. Treat newly discovered Recruiting IUMs as real candidates for Offers accepted, Employment Agreement acceptance, internal job applications, and applicant demographic volumes, but resolve them by `metric_name` first because live warehouse discovery showed metric-ID drift versus older dashboard assumptions. Record the findings in `docs/pharos-metric-discovery-2026-04-12.md`, update `docs/stats-warehouse-data-sources.json`, and extend `.cursor/skills/pharos-analytics/SKILL.md` with the new live-discovery cautions.  
**Rationale:** 
- Avoids unnecessary new IUM requests where Pharos already exposes usable metrics
- Prevents accidental misuse of stale metric IDs in future dashboard work
- Keeps proxy-only sources clearly separated from tracker-grade metrics
- Preserves the evidence path for later wiring and PM review  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-010: Value Realisation uses live metric-name resolution
**Date:** 12 April 2026  
**Context:** The Value Realisation and Data Sources surfaces still embedded older hard-coded IUM assumptions, including the stale belief that `2361` meant Positions Filled. Live Pharos verification showed the current warehouse meaning is `Recruiter Productivity`, while the previous Time to Fill mapping is no longer cleanly discoverable by metric name.  
**Choice:** Add a generated metric snapshot (`design/data-value-realization-iums.ts`) built by `scripts/build_value_realization_ium_snapshot.py`, and use it to drive Value Realisation + Data Sources copy by metric name first. Replace the third top card with Recruiter Capacity powered by live `Recruiter Productivity`, remove the old Positions Filled headline card, wire newly available metrics (offers accepted, employment agreement acceptance, internal job applications, applicant volumes), and keep Time to Fill as an explicitly labelled legacy snapshot until a clean live replacement is found.  
**Rationale:** 
- Stops the UI from repeating stale `2360` / `2361` mappings
- Creates a reproducible refresh path for future Pharos drift
- Surfaces the metrics that are genuinely available now without waiting for new IUM work
- Makes unresolved metrics explicit instead of silently attaching the wrong ID  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-011: Metric audit alignment policy and legacy source labelling
**Date:** 12 April 2026  
**Context:** Dashboard copy, warehouse guidance, and materialised extracts had drifted apart. The main issues were silent median-to-average fallback in the bottleneck strip, stale live-ID labelling on the positions and Time to Fill dashboards, and duplicated Data Scientist guidance that still described older scorecard and IUM assumptions.  
**Choice:** Standardise on median Time to Hire for bottleneck, peer-comparison, and scorecard-correlation work; keep average Time to Hire for headline IUM KPI trends; explicitly label any average fallback in the UI; treat the Time to Fill and open-vs-filled positions dashboards as legacy historical extracts until fresh live metric-name validation exists; update dashboard headers, the IUM snapshot generator, the source inventory, and the Data Scientist guidance to reflect current environment and metric-name-first rules.  
**Rationale:** 
- Makes the PM-facing dashboards honest about what is live, legacy, and mixed-environment
- Preserves useful historical context without letting stale metric IDs masquerade as live truth
- Keeps the statistical policy simple and repeatable across future dashboard work
- Restores separation of concerns: subagent for judgement, skill for warehouse truth, inventory for catalogue  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-012: Recruiter Capacity gets its own dashboard and the Recruiting suite gets a metric tree
**Date:** 12 April 2026  
**Context:** The Value Realisation landing page surfaced Recruiter Capacity using the live `Recruiter Productivity` IUM, but it incorrectly routed to the broader Interview Metrics dashboard. At the same time, PM work needed a single visual model connecting lagging Recruiting outcomes to process metrics, throughput drivers, and leading product levers without overstating causal certainty.  
**Choice:** Add a dedicated `recruiter-capacity` dashboard powered by the live Recruiter Productivity IUM plus adjacent interview and adoption context, repoint the Value Realisation card to that route, and add a new data-backed `recruiting-metric-tree` page with an infinite-canvas layout. Classify metric-tree links as `Measured`, `Directional`, or `Future`, and keep tracker gaps such as live Time to Fill replacement and job-app-chain Offer/EA timing explicitly labelled rather than inferred.  
**Rationale:** 
- Gives Recruiter Capacity a PM-focused surface instead of burying it inside interview-only analytics
- Makes the tracker-to-live-metric mapping explicit: tracker term `Recruiter Capacity`, live IUM name `Recruiter Productivity`
- Creates a reusable lagging-to-leading decision tool that combines outcome metrics, BP timing, adoption signals, and tracker gaps
- Preserves data honesty by separating measured relationships from directional logic and future instrumentation  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-015: Metrics tree becomes a value-driver canvas and nav is de-cluttered
**Date:** 13 April 2026  
**Context:** The standalone tree still behaved like a dashboard because large left and right explainer panels consumed canvas space, and the metrics shell still duplicated navigation with a grouped sub-nav plus quick jump. The tree content also mixed genuine drivers with descriptive or vanity metrics.  
**Choice:** Remove the side panels from the tree and keep only a minimal zoom/reset control; refocus the metric set into a smaller value-driver model (`Average Time to Hire` <- `Recruiter Capacity`, `Time in Interview BP`, `Offer / EA Timing` <- `Job Applications`, `Interview Rounds`, `Add Documents`); rename the tree surface to `Value Driver Tree`; make the global nav non-sticky; flatten the metrics sub-nav into a single compact row; and remove the duplicate quick-jump control and explanatory sub-nav header copy.  
**Rationale:** 
- Restores the tree as a canvas-first artefact rather than another dashboard with side rails
- Keeps only metrics with a plausible driver relationship to the north-star outcome
- Removes visual duplication and header weight from the metrics shell
- Uses the more precise `Value Driver Tree` framing now that the page is intentionally not a broad metric catalogue  
**Owner:** David Denham + PM dashboard workflow  
**Status:** Implemented

### DECISION-014: Scorecard benchmarks and KPI tree move to clearer PM framing
**Date:** 13 April 2026  
**Context:** The refined metrics shell still left ambiguity between outcomes, impact, and operational dashboards. At the same time, the customer scorecard hero cards were not using the two customer KPIs PMs actually need first, and the KPI tree needed more screen real estate plus a cleaner level model.  
**Choice:** Reframe the metrics IA around `Portfolio Overview`, `Hiring Outcomes`, `Recruiting Operations`, and `Feature Adoption`; open the Recruiting KPI Tree in a dedicated standalone window with no shared chrome; restructure the tree into three levels (`Business Value Outcomes`, `Product Value Outcomes`, `Adoption & Usage`); replace the customer scorecard hero cards with customer-specific `Avg. Time to Hire` and `Recruiter Capacity`, benchmarked against the tenant's region segment and industry medians; show the full global feature-correlation table by default; and append an explicit `Ready for Hire` placeholder in bottleneck views until duration data is materialised.  
**Rationale:** 
- Makes the metrics suite easier to scan because business outcomes, operational diagnostics, and adoption levers are no longer mixed together
- Gives the KPI tree the full-screen space it needs to behave like a true exploratory canvas rather than another dashboard tile
- Puts the most decision-relevant customer KPIs first and adds contextual peer benchmarks without pretending they are causal scores
- Restores the expected recruiting flow sequence by showing `Ready for Hire` transparently even while the duration extract remains incomplete  
**Owner:** David Denham + PM dashboard workflow  
**Status:** Implemented

### DECISION-013: Unified app shell and grouped metrics navigation
**Date:** 13 April 2026  
**Context:** The dashboard suite had grown into two visually inconsistent navigation rows. The PM Agent title disappeared once users entered a metric page, and all dashboards were flattened into one long button list with weak information hierarchy.  
**Choice:** Replace the old dual-row button treatment with a persistent top app shell that always shows the `PM Agent Dashboard` title, promotes `Metrics` to a first-class primary section, and groups metric dashboards into clearer IA buckets (`Overview & Benchmarks`, `Outcomes`, `Pipeline & Operations`, `Adoption & Impact`). Keep a compact dashboard quick-jump selector on metric pages and remove the duplicate local tab row from the PM dashboard body.  
**Rationale:** 
- Restores orientation by keeping the workspace title visible across every dashboard
- Reduces button overload and makes the metric suite easier to scan
- Establishes a clearer hierarchy: workspace sections first, then metric groups, then specific dashboards
- Creates a reusable shell pattern for future metrics pages without repeating custom nav per screen  
**Owner:** David Denham + PM dashboard workflow  
**Status:** Implemented

### DECISION-008: Defensible Add Documents Offer/EA impact methodology
**Date:** 11 April 2026  
**Context:** The existing Add Documents impact table was useful for exploration but not defensible for PM decision-making due to sparse cohort coverage, percentage deltas on near-zero baselines, and Offer/EA environment mismatch (SANDBOX vs PROD).  
**Choice:** Add a reproducible impact script (`scripts/build_add_documents_offer_ea_impact.py`) that publishes `docs/add-documents-adoption-impact-defensible.md` using level effects (post-pre days), winsorised means, bootstrap confidence intervals, threshold sensitivity checks, and segment consistency checks. Lock output language to operational event-duration estimands and explicitly separate from tracker chain metric `Time in Offer/EA`.  
**Rationale:** 
- Replaces fragile `% delta` interpretation with robust day-level effects
- Makes underpowered strict gates explicit via threshold fallback logic
- Provides reproducible methodology and caveats for PM/DS reviews
- Keeps next-step path clear for single-environment panel re-run with explicit event volumes  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-007: Employment Agreement sub-BP dashboard + Add Documents EA cohort columns
**Date:** 11 April 2026  
**Context:** Extend the BP duration dashboard with an Employment Agreement sub-BP (tile, Offer-style operational charts, task-level analytics, Add Documents footer) and align the Add Documents adoption impact artefact with EA median time pre/post plus per-customer correlations.  
**Choice:** Materialise EA aggregates in `design/data-employment-agreement-durations.ts` / `data-employment-agreement-steps.ts`; wire `data-bp-durations-by-segment.ts` and `bp-duration-dashboard.tsx`; add `scripts/merge_ea_into_add_documents_adoption_md.py` to merge EA columns into `docs/add-documents-adoption-impact.md` from Completed-event medians (`bp_type_id` = `Propose Compensation Offer/Employment Agreement`). Use `[1:-1].split('|')` for markdown table parsing (never `strip('|')`, which drops trailing empty cells).  
**Rationale:** Keeps SANDBOX IUM/Offer columns intact while documenting PROD EA provenance until a SANDBOX EA export exists; reproducible regen via script.  
**Owner:** David Denham + design prototype  
**Status:** Implemented (run `npm run typecheck` in `design/` with raised Node heap if needed)

### DECISION-006: Canonical Stats Warehouse Inventory
**Date:** 11 April 2026  
**Context:** Recent dashboard work exposed duplicated and partially stale warehouse guidance across the Data Scientist agent and the Pharos analytics skill. The Add Documents work also confirmed that metric IDs `1757`-`1760` currently map to verified Add Documents metrics in this workspace, not the older placeholder labels.  
**Choice:** Create a canonical stats warehouse inventory at `docs/stats-warehouse-data-sources.json`, use the Pharos skill as the authoritative query-pattern guide, and slim the Data Scientist agent so it references the inventory rather than duplicating table catalogues. Also add a PM-facing Data Sources view inside `design/pm-agent-dashboard.tsx`.  
**Rationale:** 
- Reduces drift between agent instructions, skills, and dashboards
- Gives the PM a single plain-English source inventory for dashboard provenance
- Keeps separation of concerns clear: agent = workflow and analysis framing; skill = query protocol; inventory = source catalogue
- Preserves caution on exploratory Offer step and attachment sources until they are fully validated  
**Owner:** David Denham + Data Scientist workflow  
**Status:** Implemented

### DECISION-003: HITL Autonomy - Always Honor User Selections
**Date:** Tuesday Mar 18, 2026  
**Context:** MISSION-008 user selected #5 (WhatsApp), but orchestrator overrode and executed #1 (Nationalization) instead, assuming user wanted "fresh" work since WhatsApp was done in MISSION-007  
**Problem:** Violates user autonomy; HITL becomes meaningless if selections are overridden  
**Decision:** ALWAYS honor HITL selections exactly as given. Never check if recommendation was "done before" or substitute different recommendations. Execute pipeline fresh for whatever user selects, regardless of prior missions.  
**Rationale:** 
- User has business context the agent doesn't (priorities, versioning, iteration, testing)
- Features evolve (Phase 1→2), PRDs get versioned (v1→2), evidence gets refreshed
- HITL selection IS the decision—execution should be automatic
- Checking/overriding breaks trust in the HITL process
**Implementation:** Updated 000-master-orchestrator.mdc Step 4 (explicit "do not override" guidance) and added "HITL Autonomy" operating principle  
**Owner:** 090-agent-improvement-advisor  
**Status:** Implemented and documented

### DECISION-001: Functional Knowledge RAG Architecture
**Date:** Tuesday Mar 17, 2026 22:06 PST  
**Context:** Need authoritative Workday functional guidance for all PM agents  
**Decision:** Implement 050-functional-knowledge.mdc as always-on RAG layer  
**Rationale:** 
- Ensures all agents have access to authoritative Workday knowledge
- Citations provide traceability and compliance
- Critical for UDMF, country-specific offers, and GDPR compliance
**Owner:** Master Orchestrator + Functional Knowledge Authority  
**Status:** Implemented and operational

### DECISION-002: PMF Research Methodology
**Date:** Tuesday Mar 17, 2026 22:12 PST  
**Context:** Need rigorous qualitative research capability for regional PMF analysis  
**Decision:** Implement Braun & Clarke thematic analysis via @pmf-analyst  
**Rationale:**
- Gold-standard method for qualitative analysis in product research
- 6-phase process ensures rigor and validity
- Focus on semantic meaning, not just keyword frequency
- Evidence-based themes lead to actionable PMF insights
- Geographic filtering ensures regional relevance
**Owner:** Master Orchestrator + PMF Researcher  
**Status:** Implemented and awaiting data

## Handoff Queue
- [ ] **2026-04-17 Morning Roundup refresh:** `user-jira-ghe` MCP returned `Session not found. Please re-initialize.` for `searchJiraTickets` / `discoverApis`; morning roundup regenerated with competitor news only, Jira sections left empty until MCP session is re-initialised in Cursor Settings.

## Notes

- This file is maintained by the Master Orchestrator (`000-master-orchestrator.mdc`).
- **Active mission narratives** (artifacts, pipeline steps, long notes): `docs/mission-archive/active-missions-full-detail-2026-03-31.md`
- Completed and superseded mission **full blocks** live in `docs/mission-archive/completed-missions-archive.md` (and per-mission files under `docs/mission-archive/` where linked from the index table).
- **Last structural cleanup:** 31 March 2026.

## Archived Missions

Completed missions archived to `docs/mission-archive/completed-missions-archive.md`.
