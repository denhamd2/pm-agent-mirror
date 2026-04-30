## Current WIP status (30 Apr 2026)

### Ready now (agency pipeline prototype track)

- `design/agency-pipeline-card-v01.tsx`
- `design/main.tsx`
- `design/vite.config.ts`
- `docs/pm-agent-prototypes.html`
- `design/maestro-handoff/intent.md`
- `design/maestro-handoff/maestro-prompt.txt`
- `design/maestro-handoff/api-response-sample.json`
- `design/agency-pipeline-card-v01-reference.png`

Notes:
- Route wiring and production build validation succeeded after fixing `StatusIndicator` API usage in `agency-pipeline-card-v01`.
- Maestro handoff reached `plan_approval` in Contexto and is ready for manual continuation (expected with `target_element_wid: null`).

### Parked intentionally (separate stream, do not include in agency pipeline commit)

- `.cursor/skills/ask-consultant/SKILL.md`
- `docs/candidate-merge-duplicate-management-wiki.md`
- `docs/offers-employment-agreements-wiki.md`
- `docs/user-stories-draft.md`

Reason:
- These files belong to a separate consultant/wiki documentation track and are not required to ship `agency-pipeline-card-v01`.
