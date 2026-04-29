Improve Code Readability

Improve the requested code areas so they read like prose.

## Review focus

- Prefer names and structure that make intent obvious without comments.
- When a comment explains *what* the code is doing, propose a refactor so the comment can be removed.
- Keep comments for *why* decisions, unusual trade-offs, or safeguards.

## What to look for

- Large blocks that should be extracted into small, purpose-named functions.
- Verbose setup code that can be wrapped in helper constructors or builders.
- Deeply nested conditionals that can be flattened with guard clauses.
- Repeated literals or shape-building logic that should be shared.

## Output format

Provide a concise list of suggestions grouped by priority:

- `High`: readability blockers that slow comprehension.
- `Medium`: worthwhile refactors that improve flow and naming.
- `Low`: polish suggestions.

For each suggestion include:

- `Where:` file and symbol
- `Why:` what is hard to read today
- `Refactor:` the specific extraction/rename/simplification to apply

Do not make edits unless the user explicitly asks you to implement them.
