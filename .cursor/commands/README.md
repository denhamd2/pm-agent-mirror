# Cursor Commands (`.cursor/commands/`)

**Commands vs skills:** **Commands** here are markdown prompts surfaced in the Cursor **Commands** palette. **Skills** live under [`.cursor/skills/`](../skills/) (`SKILL.md` + references)—better for long, maintained workflows, scripts, and cross-links. Both sit under `.cursor/` and typically load **rules** from [`.cursor/rules/`](../rules/) for guardrails. See also [`.cursor/rules/advisory-methods/094-cursor-architecture-guide.md`](../rules/advisory-methods/094-cursor-architecture-guide.md).

## Active commands (repository root)

| File | Purpose | Skill / rule overlap |
|------|---------|----------------------|
| [`prd-to-mockups.md`](prd-to-mockups.md) | PRD + Jira → mockup spec + HTML prototype | Distinct from **315/320**; orchestration-heavy one-shot |
| [`pr-description.md`](pr-description.md) | Branch diff → paste-ready PR markdown | No dedicated skill; keep |
| [`threat_model.md`](threat_model.md) | Security / threat-modelling prompt | Complements **060** / red-team style reviews; keep |
| [`comments-cleanup.md`](comments-cleanup.md) | PR comment cleanup helper | No skill equivalent; keep |
| [`code-readability-improvements.md`](code-readability-improvements.md) | Readability refactor guidance | General engineering; keep |

## Archived

| File | Reason |
|------|--------|
| [`archive/prd-draft.md`](archive/prd-draft.md) | Superseded by **`/write-prd`** ([`write-prd/SKILL.md`](../skills/write-prd/SKILL.md)) + **200-prd-template** for maintained PRD output. The archived file is the old **interview-only** prompt; copy back to `.cursor/commands/prd-draft.md` if you want it in the command palette again. |

## `agent-tools` (not here)

Ephemeral tool output may appear under `~/.cursor/projects/<id>/agent-tools/` on your machine. That path is **Cursor-managed**, not part of this git repo—see [README.md](../../README.md) (Sharing with colleagues).
