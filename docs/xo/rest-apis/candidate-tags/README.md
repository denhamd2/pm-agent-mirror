# Candidate Tags REST Endpoint

## Scope
Built from UI task `Maintain Candidate Tags` (`a624f92773c2100013ee66cb5e9f0036`) using the direct execution flow.

## Core Objects
- Service: `XOAgents` (`f25a77d68bd310001cc3c6bdf9f20000`)
- Collection resource: `candidateTags` (`466143eed9e61000279ad2edac150000`)
- View representation: `candidateTagView` (`466143eed9e610002792a15890790000`)
- Edit representation: `candidateTagEdit` (`466143eed9e610002794a9fbdce50000`)

## Operations
- GET: `getCandidateTags` (`466143eed9e61000279db810b1150000`)
- POST: `createCandidateTag` (`466143eed9e6100027a5eefdb90e0000`)
- PATCH: `updateCandidateTag` (`466143eed9e6100027a5dffd8a200000`)
- DELETE: `deleteCandidateTag` (`466143eed9e6100027a605d4c1ac0000`)

## Processing
- POST processing option: `466143eed9e6100027a80092ff830000`
- PATCH processing option: `466143eed9e6100027a85d23fe5d0000`
- DELETE processing option: blocked by constraint `A3211` (requires exactly one singular representation for class-based generation).

## Wrapper Registrations
- `get_candidate_tags` (`466143eed9e6100027bf9312a9020000`)
- `create_candidate_tag` (`466143eed9e6100027bfa705ac3b0000`)
- `update_candidate_tag` (`466143eed9e6100027bfd11bdf870000`)
- `delete_candidate_tag` (`466143eed9e6100027bfbcac2eee0000`)

## Artifacts
- `docs/xo/rest-apis/candidate-tags/artifacts/run-state.yaml`
- `docs/xo/rest-apis/candidate-tags/artifacts/schema-analysis-wip.md`
- `docs/xo/rest-apis/candidate-tags/artifacts/schema-design-wip.md`
- `docs/xo/rest-apis/candidate-tags/artifacts/schema-implementation-wip.md`
- `docs/xo/rest-apis/candidate-tags/artifacts/objects-modified.json`
- `docs/xo/rest-apis/candidate-tags/artifacts/smoke-results.json`

## Notes
- Metadata verification is complete for all created objects and wrapper registrations.
- Runtime CRUD smoke (execute POST/PATCH/DELETE and then GET checks) is recorded as not run from this session because there is no direct MCP invoker for newly registered wrappers in this surface.
