# Document templates (PDFs)

Optional reference PDFs for PRD drafting live under **`prd/`** (for example the Workday PRD template and FY27 strategy PDF).

For **new PRDs**, prefer the **`/write-prd`** skill ([`.cursor/skills/write-prd/SKILL.md`](../../.cursor/skills/write-prd/SKILL.md)) and rule **200**—maintained workflow with Deployment Agent and value metrics. The legacy **interview-only** slash-command prompt was archived to [`.cursor/commands/archive/prd-draft.md`](../../.cursor/commands/archive/prd-draft.md); restore to `.cursor/commands/` if you still want that command in the palette. If you replace PDFs under `prd/`, keep the same names or update paths in that archived file.

Jira epic/story creation from PRDs is handled by orchestration rules (**410**, **420**, **430**) and the **user-jira-ghe** MCP, not a separate workspace config folder.
