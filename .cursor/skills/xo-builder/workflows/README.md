# XO Builder Direct-Execution Workflow Maps

These files map execution-critical logic from Contexto workflows into PM-workspace runbooks for `rest-from-task`.

They are not a verbatim copy of Contexto step files. They capture:

- Required MCP calls.
- Required state transitions between phases.
- Required HITL checkpoints.
- Required output artifacts in the PM workspace.

## Files

- `schema-analysis-direct.md`
- `schema-implementation-direct.md`
- `processing-creation-direct.md`
- `state-contract.md`

## Source of Truth

The upstream behavioral source remains Contexto workflow definitions in `~/contexto/xo-agents/workflows/`.
When upstream behavior changes, update these direct-execution maps in the same PR that updates `rest-from-task.md`.
