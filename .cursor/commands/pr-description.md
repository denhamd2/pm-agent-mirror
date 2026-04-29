Write a PR Description for This Branch

Create a structured PR description by comparing the current branch against a parent branch.

If the user names a parent branch, use it. If not, detect the best base (`origin/main` or `origin/master`).

## Steps

1. Identify comparison base and generate the diff.
2. Identify the most important production files (ignore noise-only edits).
3. Identify the most important test changes.
4. Summarise additional meaningful but secondary changes.
5. Call out noisy rename/move churn where relevant.

## Output format

Return markdown that can be pasted directly into a PR:

# <JIRA-KEY> <Change Theme>

## Summary
2-4 sentence business and engineering summary.

## Important Production Code Changes
| File | Description |
|------|-------------|
| `path/to/file` | What changed and why it matters |

## Important Test Changes
| File | Description |
|------|-------------|
| `path/to/test` | Coverage added or behaviour validated |

## Other Changes
Brief narrative of worthwhile secondary changes.

## Smaller Changes
Brief note on noisy or mechanical edits (renames, import churn, formatting sweeps).

## Quality bar

- Keep language concise and specific.
- Prefer impact-oriented descriptions over implementation trivia.
- Use British English spelling.
