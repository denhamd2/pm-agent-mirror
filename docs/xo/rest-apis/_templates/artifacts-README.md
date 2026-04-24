# REST Conversion Artifacts Template

Copy these files into `docs/xo/rest-apis/<resource-slug>/artifacts/` at the start of a `rest-from-task` run:

- `run-state.yaml`
- `objects-modified.json`
- `smoke-results.json`

Then write phase artifacts into the same folder:

- `schema-analysis-wip.md`
- `schema-design-wip.md`
- `schema-implementation-wip.md`
- `processing-wip.md`

Do not overwrite an existing run directory. Create a new run subdirectory when rerunning the same resource.
