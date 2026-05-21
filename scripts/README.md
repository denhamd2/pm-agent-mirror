# Scripts

Utility scripts for this workspace. Run Python helpers from the **repository root** unless a script docstring says otherwise.

## Slide specs and decks

Versioned JSON lives under [`docs/decks/specs/`](../docs/decks/specs/). [`slide_specs_dir.py`](slide_specs_dir.py) exports `SLIDE_SPECS_DIR` for scripts that read or write specs. [`.cursor/rules/130-pmf-slide-generator.mdc`](../.cursor/rules/130-pmf-slide-generator.mdc) and [`cleanup-old-artifacts.py`](cleanup-old-artifacts.py) target that directory.

| Script | Purpose |
|--------|---------|
| [`slide_specs_dir.py`](slide_specs_dir.py) | Canonical `Path` to `docs/decks/specs/` for Python generators. |
| [`generate_presentation.py`](generate_presentation.py) | Fallback when Slide Deck MCP is unavailable: reads `--spec` JSON (default: `docs/decks/specs/slides_spec.json`), writes PPTX under `~/Downloads` (or `PM_DECK_OUTPUT_DIR`). Requires clone at `~/mcp-servers/wday-slidemcp` or set `WDAY_SLIDEMCP_ROOT`. |
| [`apply_style_guide.py`](apply_style_guide.py) | Post-process `docs/decks/specs/slides_spec.json` (British English, em-dash, HiredScore wording). |
| [`validate_slide_spec.py`](validate_slide_spec.py) | Validates slide JSON; used by rules **110** / **130** and workspace-audit / slide-writer skills. |

## Research and repo hygiene

| Script | Purpose |
|--------|---------|
| [`dump_research_folder_to_text.py`](dump_research_folder_to_text.py) | Flattens `.xlsx` / `.xls` / other inputs under a research folder to markdown for agent ingestion (rules **106** / **108**, `research/README`). Install optional deps from [`requirements-research-xlsx.txt`](requirements-research-xlsx.txt) when needed. |
| [`cleanup-old-artifacts.py`](cleanup-old-artifacts.py) | Prunes old slide specs, PRDs, and other generated artefacts (`npm run cleanup:artifacts`). |
| [`verify_user_story_gap_review_skill_contract.py`](verify_user_story_gap_review_skill_contract.py) | Validates critical headings in gap-review skill docs; run after editing those files. |

## Design and prototypes

| Script | Purpose |
|--------|---------|
| [`dashboard-server.py`](dashboard-server.py) | Local HTTP server (port **8765**) with save-prototype API for `docs/pm-agent-prototypes.html`; see workspace-audit skill and `MISSION_LOG.md`. |
| [`figma_screen_inventory.py`](figma_screen_inventory.py) | Parses Figma MCP `get_metadata` XML (plain or `.gz`), deduplicates artboards, writes inventory markdown/JSON. See [`docs/figma-extraction-2way-email-2024/`](../docs/figma-extraction-2way-email-2024/README.md). |

## Analytics and dashboard data (regenerate `design/` / `docs`)

| Script | Purpose |
|--------|---------|
| [`build_hrrec_81393_agency_menu_daily_metrics.py`](build_hrrec_81393_agency_menu_daily_metrics.py), [`enrich_hrrec_81393_csv_post_job_totals.py`](enrich_hrrec_81393_csv_post_job_totals.py) | HRREC-81393 Pharos extracts and CSV backfill; see [`docs/analytics/hrrec-81393-post-job-agency-type-oms-metrics.md`](../docs/analytics/hrrec-81393-post-job-agency-type-oms-metrics.md). |
| [`build_dashboard_tenant_filter_data.py`](build_dashboard_tenant_filter_data.py) | Emits `design/data-dashboard-tenant-filters.ts`. |
| [`build_tree_tenant_series.py`](build_tree_tenant_series.py) | Emits `design/data-tree-tenant-series.ts`. |
| [`build_value_realization_ium_snapshot.py`](build_value_realization_ium_snapshot.py) | Emits `design/data-value-realization-iums.ts`. |
| [`build_employment_agreement_dashboard_data.py`](build_employment_agreement_dashboard_data.py) | Emits `design/data-employment-agreement-steps.ts`. |
| [`build_add_documents_offer_ea_impact.py`](build_add_documents_offer_ea_impact.py) | Reproducible impact analysis for adoption markdown (see `MISSION_LOG.md`). |
| [`merge_ea_into_add_documents_adoption_md.py`](merge_ea_into_add_documents_adoption_md.py) | Merges EA tenant-month data into adoption impact doc; see [`docs/add-documents-adoption-impact.md`](../docs/add-documents-adoption-impact.md). |

## Offer BP samples

| Script | Purpose |
|--------|---------|
| [`parse_offer_bp_config_xlsx.py`](parse_offer_bp_config_xlsx.py) | Lists worksheets and step labels for `research/Offer/bp-config-samples/*.xlsx`; see that folder’s README. |

## Small utilities

| Script | Purpose |
|--------|---------|
| [`convert_pdfs.py`](convert_pdfs.py), [`run_morning_roundup.py`](run_morning_roundup.py) | Ad hoc helpers. |
| [`update_mission_log.py`](update_mission_log.py) | One-off `MISSION_LOG.md` line replace; edit in-script before running. |
| [`test_pptx.py`](test_pptx.py) | Quick PPTX sanity check. |

## Removed one-off generators

Mission-specific slide-spec builders (India PMF versions, patch/fix scripts, and a few unused data scrapers) were **deleted from the tree** to reduce clutter. They were never maintained product code. To rerun an exact old generator, recover the file from **git history** (`git log --diff-filter=D --summary -- scripts/` or `git show <commit>:scripts/<name>.py`). For new decks, use **`130-pmf-slide-generator`**, author JSON under [`docs/decks/specs/`](../docs/decks/specs/), and the **Slide Deck MCP** (`create_presentation`, etc.).

Shell helpers (`*.sh`), npm-adjacent scripts, and requirements files in this folder are documented next to their callers (e.g. `design/package.json`, docs/git hooks).
