---
name: xo-pr-comment-triage
description: >-
  Triage and resolve PR review comments with a controlled workflow for XO work.
  Fetches PR details and comments via user-jira-ghe MCP, validates branch
  context, proposes a fix plan, confirms with the PM, implements approved fixes,
  and summarises staged changes. Designed for repeated post-review remediation.
  Standalone only: no E2E pipeline chaining and no MISSION_LOG writes.
---

# XO PR Comment Triage

Resolve pull request comments in a predictable, PM-friendly workflow.

## Trigger Phrases

- `/xo-pr-comments`
- "fix PR comments"
- "triage PR review comments"
- "address review comments on this PR"

## Scope and Guardrails

- Standalone utility for PR comment remediation.
- No E2E routing, no workflow chaining, no `MISSION_LOG.md` writes.
- For XO/SUV writes, preserve existing `xo-builder` HITL safety rails.
- Ask before switching branches or stashing local work.

## Workflow

### 1) Parse input and fetch PR context

From a PR URL, extract:
- repo path (for example `org/repo`)
- PR number

Use `user-jira-ghe` MCP to fetch:
- PR metadata and changed files
- review comments

If tool names or args are uncertain, inspect MCP tool descriptors first and call the matching convenience tools.

### 2) Validate branch context

- Check current branch.
- Compare with PR head branch.
- If different, ask via `AskQuestion` whether to switch.
- If switching and uncommitted changes exist, ask before stashing.

### 3) Build a fix plan

For each comment:
- capture file/line and reviewer
- summarise the concern
- propose the concrete change
- flag ambiguity and ask focused follow-up questions

Present:

## Plan to Address PR Comments

### Comment N: [file:line] by @reviewer
> quoted comment

**Fix:** proposed change

### 4) Explicit implementation checkpoint

Ask via `AskQuestion`:
- Implement all changes as planned
- Modify the plan first
- Cancel

Only implement after explicit approval.

### 5) Implement approved fixes

- Apply each approved change.
- If a fix requires XO artefact edits, route through appropriate `xo-builder` mode and keep HITL intact.
- Track changed files and reason per comment.

### 6) Summarise outcome

Provide:
- files modified
- mapping of comments to fixes
- staged diff summary
- suggested commit message

If lint/test checks were run, include pass/fail and unresolved blockers.

## Output Template

```markdown
## Changes Summary

### Files Modified
- `path/to/file`: what changed and why

### Comment Coverage
- [file:line] @reviewer - addressed by <change>

### Staged for Commit
<diff stat summary>

### Suggested Commit Message
fix: address PR review comments
```

## Non-Goals

- Do not auto-merge or auto-push.
- Do not bypass approval checkpoints.
- Do not convert this into a generic code-review agent.
