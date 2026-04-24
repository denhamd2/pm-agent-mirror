# Schema Design WIP - Candidate Tags

## Target API Shape
- Service name (proposed): `candidateTags`
- Resource path (proposed): `/candidate-tags`
- Scope: `GET`, `POST`, `PATCH`, `DELETE`

## Representations
### View Representation
Fields:
- `id`
- `descriptor`
- `candidateTagName`
- `inactive`
- `inUse`

### Edit Representation
Fields:
- `candidateTagName`
- `inactive`

## Operation Plan
- `GET /candidate-tags`
- `GET /candidate-tags/{id}`
- `POST /candidate-tags`
- `PATCH /candidate-tags/{id}`
- `DELETE /candidate-tags/{id}`

## Constraints
- `candidateTagName` required on POST.
- `inUse` is read-only (view only) and sourced by usage-count executable.
- Deletion should respect usage checks and return safe validation failure when in use.
