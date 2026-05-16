# HRREC-82977 HITL diff review (automation vs current Jira)

Epic: [HRREC-82977](https://jira2.workday.com/browse/HRREC-82977).

## Scope

- **Original**: `all_invokes/story_NNN.json` wiki payloads + [`story-jira-mapping.json`](../story-jira-mapping.json).
- **Current**: Jira `fields.description` + summary fetched via `user-jira-ghe` `executeApi` (cached in [`current_descriptions.json`](current_descriptions.json)).
- **Compared**: 37 stories (keys **not** in `dedupe_do_not_recreate_keys`; HRREC-91980 story_000 excluded per mapping meta).

## Plan taxonomy (review buckets)

Heuristic mapping from diffs to the epic review categories (a story may have multiple buckets).

| Bucket | Count | Example keys |
|--------|-------|----------------|
| Wording_Gherkin | 17 | HRREC-91981, HRREC-91985, HRREC-91987, HRREC-91989 |
| Scope_trim | 14 | HRREC-91986, HRREC-91990, HRREC-91991, HRREC-91998 |
| Product_decision | 11 | HRREC-91985, HRREC-91987, HRREC-91988, HRREC-91989 |
| Metadata_only | 9 | HRREC-91983, HRREC-91984, HRREC-91997, HRREC-91999 |
| Dedupe_across_stories | 9 | HRREC-91986, HRREC-91990, HRREC-91991, HRREC-91998 |
| XO_UI_split | 2 | HRREC-91994, HRREC-92001 |
| UX_numeric | 1 | HRREC-92001 |

- **Metadata_only** — Normalised description text unchanged (summary may still change → also **Product_decision**).
- **Wording_Gherkin** — BDD rewrite, microcopy, CRLF aside, or more scenarios.
- **Scope_trim** — Fewer `h3` scenarios and/or major contraction / exploratory testing pivot.
- **Dedupe_across_stories** — Fewer scenarios **without** big expansion (likely moved concern to sibling).
- **Product_decision** — Summary, Notes research, negative scope, exploratory milestone, or major pivot.
- **UX_numeric** — Breakpoints / overlay behaviour spelled out.
- **Defer_error_UI** — Explicit 403/404 / security copy added vs original.
- **XO_UI_split** — REST/API/XO/HTTP language appears in current text but not in bulk wiki.

## Pattern frequency (heuristic tags)

| Tag | Count | Example keys |
|-----|-------|----------------|
| Jira_editor_CRLF | 27 | HRREC-91985, HRREC-91986, HRREC-91987, HRREC-91988 |
| Substantial_expansion | 16 | HRREC-91985, HRREC-91987, HRREC-91989, HRREC-91992 |
| Fewer_scenarios | 14 | HRREC-91986, HRREC-91990, HRREC-91991, HRREC-91998 |
| Unchanged_description | 9 | HRREC-91983, HRREC-91984, HRREC-91997, HRREC-91999 |
| Summary_rewritten | 7 | HRREC-91985, HRREC-91987, HRREC-91988, HRREC-91989 |
| Notes_research_backfill | 2 | HRREC-91995, HRREC-91996 |
| Other_copy_edit | 1 | HRREC-91981 |
| Summary_agency_scope_clarity | 1 | HRREC-91985 |
| Explicit_negative_scope_GenAI | 1 | HRREC-91989 |
| UX_numeric_or_breakpoint | 1 | HRREC-92001 |
| Push_overlay_refinement | 1 | HRREC-92001 |
| More_scenarios | 1 | HRREC-92003 |
| Notes_external_links | 1 | HRREC-92003 |
| Major_contraction_or_pivot | 1 | HRREC-92013 |
| Testing_exploratory_pivot | 1 | HRREC-92013 |

## Per-story snapshot (sortable)

| Key | Shard | H3 orig | H3 cur | Len Δ | Summary changed? | Plan buckets | Tags |
|-----|-------|---------|--------|-------|------------------|----------------|------|
| [HRREC-91981](https://jira2.workday.com/browse/HRREC-91981) | story_001 | 3 | 3 | +0 |  | Wording_Gherkin | Other_copy_edit |
| [HRREC-91983](https://jira2.workday.com/browse/HRREC-91983) | story_002 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-91984](https://jira2.workday.com/browse/HRREC-91984) | story_003 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-91985](https://jira2.workday.com/browse/HRREC-91985) | story_004 | 3 | 3 | +780 | yes | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Summary_rewritten, Summary_agency_scope_clarity |
| [HRREC-91986](https://jira2.workday.com/browse/HRREC-91986) | story_005 | 3 | 1 | -266 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-91987](https://jira2.workday.com/browse/HRREC-91987) | story_006 | 3 | 3 | +503 | yes | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Summary_rewritten |
| [HRREC-91988](https://jira2.workday.com/browse/HRREC-91988) | story_007 | 3 | 3 | +348 | yes | Product_decision | Jira_editor_CRLF, Summary_rewritten |
| [HRREC-91989](https://jira2.workday.com/browse/HRREC-91989) | story_008 | 3 | 3 | +520 | yes | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Explicit_negative_scope_GenAI, Summary_rewritten |
| [HRREC-91990](https://jira2.workday.com/browse/HRREC-91990) | story_009 | 3 | 1 | -146 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-91991](https://jira2.workday.com/browse/HRREC-91991) | story_010 | 3 | 1 | -86 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-91992](https://jira2.workday.com/browse/HRREC-91992) | story_011 | 3 | 3 | +863 |  | Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF |
| [HRREC-91993](https://jira2.workday.com/browse/HRREC-91993) | story_012 | 3 | 3 | +557 |  | Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF |
| [HRREC-91994](https://jira2.workday.com/browse/HRREC-91994) | story_013 | 3 | 3 | +554 | yes | Product_decision, Wording_Gherkin, XO_UI_split | Substantial_expansion, Jira_editor_CRLF, Summary_rewritten |
| [HRREC-91995](https://jira2.workday.com/browse/HRREC-91995) | story_014 | 3 | 3 | +608 |  | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Notes_research_backfill |
| [HRREC-91996](https://jira2.workday.com/browse/HRREC-91996) | story_015 | 3 | 3 | +731 |  | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Notes_research_backfill |
| [HRREC-91997](https://jira2.workday.com/browse/HRREC-91997) | story_016 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-91998](https://jira2.workday.com/browse/HRREC-91998) | story_017 | 3 | 2 | +224 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-91999](https://jira2.workday.com/browse/HRREC-91999) | story_018 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-92000](https://jira2.workday.com/browse/HRREC-92000) | story_019 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-92001](https://jira2.workday.com/browse/HRREC-92001) | story_020 | 3 | 3 | +786 |  | UX_numeric, Wording_Gherkin, XO_UI_split | Substantial_expansion, Jira_editor_CRLF, UX_numeric_or_breakpoint, Push_overlay_refinement |
| [HRREC-92002](https://jira2.workday.com/browse/HRREC-92002) | story_021 | 3 | 1 | -114 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-92003](https://jira2.workday.com/browse/HRREC-92003) | story_022 | 3 | 6 | +2519 |  | Product_decision, Wording_Gherkin | More_scenarios, Substantial_expansion, Jira_editor_CRLF, Notes_external_links |
| [HRREC-92004](https://jira2.workday.com/browse/HRREC-92004) | story_023 | 3 | 2 | +816 |  | Scope_trim, Wording_Gherkin | Fewer_scenarios, Substantial_expansion, Jira_editor_CRLF |
| [HRREC-92005](https://jira2.workday.com/browse/HRREC-92005) | story_024 | 3 | 2 | +882 |  | Scope_trim, Wording_Gherkin | Fewer_scenarios, Substantial_expansion, Jira_editor_CRLF |
| [HRREC-92006](https://jira2.workday.com/browse/HRREC-92006) | story_025 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-92007](https://jira2.workday.com/browse/HRREC-92007) | story_026 | 3 | 1 | +98 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-92008](https://jira2.workday.com/browse/HRREC-92008) | story_027 | 3 | 2 | +475 |  | Scope_trim, Wording_Gherkin | Fewer_scenarios, Substantial_expansion, Jira_editor_CRLF |
| [HRREC-92009](https://jira2.workday.com/browse/HRREC-92009) | story_028 | 3 | 1 | +438 |  | Scope_trim, Wording_Gherkin | Fewer_scenarios, Substantial_expansion, Jira_editor_CRLF |
| [HRREC-92010](https://jira2.workday.com/browse/HRREC-92010) | story_029 | 3 | 2 | +313 | yes | Dedupe_across_stories, Product_decision, Scope_trim | Fewer_scenarios, Jira_editor_CRLF, Summary_rewritten |
| [HRREC-92011](https://jira2.workday.com/browse/HRREC-92011) | story_030 | 3 | 1 | -117 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-92012](https://jira2.workday.com/browse/HRREC-92012) | story_031 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-92013](https://jira2.workday.com/browse/HRREC-92013) | story_032 | 3 | 0 | -1519 |  | Product_decision, Scope_trim | Fewer_scenarios, Major_contraction_or_pivot, Jira_editor_CRLF, Testing_exploratory_pivot |
| [HRREC-92014](https://jira2.workday.com/browse/HRREC-92014) | story_033 | 3 | 3 | +913 | yes | Product_decision, Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF, Summary_rewritten |
| [HRREC-92015](https://jira2.workday.com/browse/HRREC-92015) | story_034 | 3 | 2 | +368 |  | Dedupe_across_stories, Scope_trim | Fewer_scenarios, Jira_editor_CRLF |
| [HRREC-92016](https://jira2.workday.com/browse/HRREC-92016) | story_035 | 3 | 3 | +1113 |  | Wording_Gherkin | Substantial_expansion, Jira_editor_CRLF |
| [HRREC-92017](https://jira2.workday.com/browse/HRREC-92017) | story_036 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |
| [HRREC-92018](https://jira2.workday.com/browse/HRREC-92018) | story_037 | 3 | 3 | +0 |  | Metadata_only | Unchanged_description |

## HITL playbook (inferred “why” from patterns)

Narrative deep dive on **summary rewrites** and **substantial expansion** (evidence, drivers, 430 guidance): [HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md](HRREC-82977_PATTERN_DEEP_DIVE_SUMMARY_AND_EXPANSION.md).

1. **Summary rewrites** — Titles were tightened for **non-agency vs agency**, **UI-only** scope, or **split send stories** (e.g. compose vs To-field). *Skill:* tie summary to persona + channel + **MVP slice** in one line; avoid duplicating body.
2. **Substantial expansion** — BDD was rewritten into **formal recruiter voice**, **explicit error strings**, **REST vs UI** split, and **negative scope** (GenAI toolbar). *430:* add default **Notes** bullets for “no draft persistence” / “copy before refresh” when mid-session errors appear.
3. **Fewer scenarios** — Threads/list stories dropped to **two scenarios** or reporting pivoted to **exploratory milestone note** (HRREC-92013). *430 Step 5:* allow 2-scenario stories when second is **milestone/testing** deferral documented in Notes.
4. **UX / layout** — Push vs **overlay on XL**, modal shadow, **numeric breakpoints** added where design caught up. *430:* require **Workday breakpoint vocabulary** (M/S vs L/XL) alongside pixels when known.
5. **Dedupe / placement** — Channel-disabled vs empty state, agency tabs, security 403 paths surfaced on the **owning** story. Aligns with **Step 1c / §3c** already added to rules.
6. **Jira editor CRLF** — Many edits introduced `\r\n`; normalise in diff tools. *Skill:* no change needed if wiki push is consistent.

## Recommended rule / skill follow-ups

- **430**: Add a short **two-way email summary checklist** — non-agency default, UI-only vs data population, milestone exploratory one-liner pattern for non-functional regression stories.
- **430 Step 5**: When expanding error UX, require **Notes** cross-link if a sibling owns **generic REST error catalogue**.
- **435 §3d**: FLAG if **Then** quotes **exact customer strings** without **319** pass (several stories now have long headline/body pairs — good, but validator should ensure problem+solution pattern).
- **jira-recruiting-story-description SKILL**: Optional bullet — if HITL replaces body in Jira UI, re-export wiki via `GET` before next bulk automation run.

## Validator (435) strategy

- **Keep 435** as the **epic coherence** + **concern ownership** gate; removing it shifts rework to Three Amigos (this epic shows heavy HITL).
- **Thin maintenance**: link epic context (e.g. `CONTEXT.md`) to this folder; keep **435** as checklist + report template rather than duplicating long examples inline.
- **Fold into 430?** Only for **format-only** checks; keep **435** separate for **cross-story ownership** and **epic-level** gates (this batch shows **Dedupe_across_stories** + **Product_decision** dominating, which 430 alone will not catch reliably).

## Re-fetch current Jira text

Re-run `user-jira-ghe` `executeApi` with the key list in `inventory.json` or use `getTicketDetails` per key; overwrite `current_descriptions.json`.