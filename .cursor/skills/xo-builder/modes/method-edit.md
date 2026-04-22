# Mode: method-edit

**Tier:** 2 (guarded write) • **Workspace switch:** No • **Writes to SUV:** Yes

"Update this BA method" or "rename this EBE method." Edit an existing Build Attribute (BA), Evaluate Boolean Expression (EBE), or Evaluate Conditions (EC) method's display name or expression body via XO MCP. Diff-approve-apply-verify HITL required.

Runs from the PM workspace. No workspace switch. Writes are scoped to two fields only (display name, expression body).

## Worked Example Prompts

- "Make the following updates to the existing BA method `Planning Org Model@build Sparta Query to get All Rows for Plan Scenario parm(BA)*P*S*NT`, `f06f1890d6ca100039aa1c137e620000`: 1) Update the method name to `Sparta Query to get All Filled Rows for Plan Scenario parm`. 2) Update the expression so that the condition `C5633_29790 as planning_staffing_status_id = fromInstanceId('4477$2')` is included as a SQL filter."
- "Rename EBE method `<WID>` to `OfferAmountRequiredWhenStageIsOffer`."
- "Add a SQL filter `status_id = fromInstanceId('<WID>')` to BA method `<WID>`."
- "Change the expression on EC method `<WID>` to `candidateStage == 'Offer' && offerAmount != null`."

## Scope (v1)

This mode edits **only** these two fields on an existing BA / EBE / EC method:

- `displayName` - the method's human-readable name (as shown in XO tooling and on bindings).
- `expression` (or equivalent body field per method type: `booleanExpression` for EBE, `conditions` for EC, `sql` / `expression` for BA).

Any other field (method type, class context, bindings, security, return shape) is **out of scope** and will be refused. For those:
- Creating a new method entirely -> use [validation-edit](validation-edit.md) (for EBE/EC methods tied to validations) or [rest-from-task](rest-from-task.md) (for BA methods generated as part of a new REST resource).
- Changing what the method is bound to -> route through 400 / 410 (epic definition + engineering review).
- Schema changes to the class the method runs against -> out of xo-builder scope entirely (see [MODES.md](../MODES.md#non-goals)).

## Inputs

- **Method WID** (`instance_id` for the `_get` / `_patch` call).
- **Method type** - one of `ba` (Build Attribute), `ebe` (Evaluate Boolean Expression), `ec` (Evaluate Conditions). If unsure, call the generic `method_get` first - the response will include the type.
- **Which field to change** (`displayName`, `expression`).
- **New value** for that field.
- Optional: **reason** for the change (your own audit trail - not written anywhere).

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Target method WID captured.
- [ ] Method type resolved (`ba` / `ebe` / `ec`) either from user input or from a `method_get` probe.
- [ ] Field and new value captured.
- [ ] Change is in scope (one of the two allowed fields).
- [ ] User acknowledges this writes to their dev SUV.
- [ ] For BA methods with SQL expressions: user has confirmed the new SQL is syntactically valid against the backing data source (this mode does not parse SQL).

## Tools Used

All from `user-xo-mcp`:

- `method_get` - generic read to resolve method type and fetch current state (fallback when the user does not know the type upfront).
- Type-specific `_get` / `_patch` pair:
  - BA methods: `ba_method_get` / `ba_method_patch` (or the equivalent exposed by the server; if only a generic `method_patch` is available, use that).
  - EBE methods: `ebe_evaluate_boolean_expression_method_get` / `ebe_evaluate_boolean_expression_method_patch`.
  - EC methods: `ec_evaluate_conditions_method_get` / `ec_evaluate_conditions_method_patch`.
- `method_binding_get` - confirm what the method is bound to before editing (advisory-only; do not modify bindings in this mode).

If the specific `_patch` tool for a method type is not available on your XO MCP server at runtime, **stop and tell the user** - do not fall back to a generic patch that might accept a malformed body.

## Flow (follows the Tier 2 HITL template)

1. **Read current state.**
   - If method type is known, call the type-specific `_get` (e.g. `ebe_evaluate_boolean_expression_method_get`).
   - If method type is not known, call generic `method_get` first, read the type from the response, then call the type-specific `_get`.
   - Capture current `displayName`, `expression` (or type-specific body field), and `versionToken` (required for PATCH optimistic concurrency control).
   - Optionally call `method_binding_get` and note the downstream consumers; surface them to the user so they understand the blast radius of a rename.
   - Show the user the current values and the bindings (read-only).

2. **Compute proposed diff.** Print it as a readable block, for example:

   ```
   Method: <WID> (type: ba)
   displayName
     Current: "Sparta Query to get All Rows for Plan Scenario parm(BA)*P*S*NT"
     Proposed: "Sparta Query to get All Filled Rows for Plan Scenario parm"
   expression (SQL)
     Current: SELECT ... FROM ... WHERE <existing conditions>
     Proposed: SELECT ... FROM ... WHERE <existing conditions>
       AND C5633_29790 as planning_staffing_status_id = fromInstanceId('4477$2')
   Bindings affected (read-only):
     - <binding WID 1> (descriptor)
     - <binding WID 2> (descriptor)
   ```

   Do not propose changes to any field the user did not ask about. If the user only asked for a rename, only show the `displayName` row.

3. **HITL checkpoint.** Ask: *"Approve this change? Reply `approve`, `reject`, or edit the proposed value."*
   - `approve` -> step 4.
   - `reject` -> stop; report "no changes made."
   - anything else -> treat as an edit; update and loop to step 2.

4. **Apply.** Call the type-specific `_patch` with:
   - `instance_id`: the method WID.
   - `versionToken`: the token from step 1.
   - only the field(s) the user approved.
   - any fields you did NOT touch are **omitted entirely** from the patch body (do not pass nulls or empty strings).

5. **Verify.** Re-call the type-specific `_get`. Compare the new values to the approved diff. Report back:
   - If match: "Applied. Verified. New name: '...'" and/or "New expression: ..."
   - If drift: surface the discrepancy clearly and stop. Do not retry silently.

## Guardrails

- **Refuse** any request to change fields other than `displayName` and `expression` in this mode. Tell the user which field they asked about and why it is out of scope (and where to route instead).
- **Refuse** any request to delete a method. DELETE is a different tool and a different risk profile; deletion can orphan validations and BA references downstream.
- **Refuse** any request to change the method's class context or return shape - those are schema changes and belong in 400.
- **Do not batch**. One method at a time in v1. If the user wants to rename five methods, confirm each one separately.
- **Surface bindings before the edit**. A rename looks harmless but breaks any hard-coded reference by display name (rare but possible). `method_binding_get` output must be shown in step 1.
- **For SQL expressions in BA methods**: do NOT attempt to lint or rewrite SQL. Accept the user's string verbatim. If execution fails after patch, report the error clearly and ask the user to correct the SQL, not guess at it.
- **Never skip the verify step**. If verify fails, treat the SUV as source of truth.

## Non-goals

- Creating a new BA / EBE / EC method (use [validation-edit](validation-edit.md) or [rest-from-task](rest-from-task.md) instead).
- Deleting methods.
- Changing method type (BA <-> EBE <-> EC requires a rewrite, not a patch).
- Changing method bindings or what consumes the method.
- Editing the class the method runs against.
- Bulk rename across multiple methods.
- Cross-tenant edits.

## Example run (demo prompt 1)

```
User: "Make the following updates to the existing BA method
       Planning Org Model@build Sparta Query to get All Rows for Plan Scenario parm(BA)*P*S*NT,
       f06f1890d6ca100039aa1c137e620000:
       1) Update the method name to Sparta Query to get All Filled Rows for Plan Scenario parm.
       2) Update the expression so that the condition
          C5633_29790 as planning_staffing_status_id = fromInstanceId('4477$2')
          is included as a SQL filter."

Mode:
  1. Pre-flight: WID captured, method type inferred as 'ba' from user phrasing ("BA method").
  2. Calls ba_method_get (instance_id = f06f...).
     Current displayName: "Sparta Query to get All Rows for Plan Scenario parm(BA)*P*S*NT"
     Current expression: "SELECT ... FROM ... WHERE <existing>"
     versionToken: "xyz987"
     method_binding_get -> [binding WID A (BA on Planning Org Model)]
  3. Shows diff (two fields: displayName, expression).
  4. User: "approve"
  5. Calls ba_method_patch with:
       { instance_id, versionToken,
         displayName: "Sparta Query to get All Filled Rows for Plan Scenario parm",
         expression: "SELECT ... FROM ... WHERE <existing> AND C5633_29790 as planning_staffing_status_id = fromInstanceId('4477$2')" }
  6. Re-reads -> both fields match. Reports success.
```

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
- **Post-write handoff**: per the orchestrator routing in [000-master-orchestrator.mdc](../../../rules/000-master-orchestrator.mdc), `@xo-code-reviewer` is auto-invoked after this mode completes (standalone, out-of-E2E) to review the patched method for structural and functional correctness.
