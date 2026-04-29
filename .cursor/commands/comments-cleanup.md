Improve Comments and Documentation

Review code comments and documentation, then suggest a clean-up plan.

## Comment standards

- Do not keep comments that only restate *what* obvious code is doing.
- Keep comments that explain *why* a choice exists, especially when non-obvious.
- Ensure exported/public members have useful docs where that helps maintainability.

## What to suggest

- Comments that should be removed because code is already self-explanatory.
- Places where code should be refactored so explanatory comments become unnecessary.
- Missing docs for public APIs, complex algorithms, or unusual behaviour.
- Ambiguous or stale comments that now conflict with implementation.

## Output format

Use this structure:

## Comment and Documentation Review

### Remove
- file/symbol - comment text summary - reason

### Rewrite
- file/symbol - current problem - proposed comment focus ('why')

### Add
- file/symbol - what documentation is missing - recommended content

### Readability refactors to reduce comment need
- file/symbol - suggested extraction/rename/simplification

Do not apply changes unless the user asks you to implement them.
