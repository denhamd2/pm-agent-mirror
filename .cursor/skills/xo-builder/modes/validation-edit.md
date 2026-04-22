# Mode: validation-edit

**Tier:** 2 (guarded write) • **Workspace switch:** No • **Writes to SUV:** Yes

"Add a validation that says X" or "edit this validation." Create or patch a Validation on an element, element content, or attribute, with a condition (boolean expression or evaluate-conditions method) and an error/warning message (word-bucket). Diff-approve-apply-verify HITL required; multi-step writes are explicitly announced and approved as a batch.

Runs from the PM workspace. No workspace switch. Targets the user's dev SUV only.

## Worked Example Prompts

- "Add a validation that requires 'Offer Amount' when the candidate stage is 'Offer' - error severity, message 'Offer amount is required at this stage.'"
- "Edit the validation on element `<WID>` so the error message reads 'Start date must be after today.'"
- "Add a rule that blocks Submit when `backgroundCheckStatus != 'Complete'` on element content `<WID>`."
- "Require 'Hiring Manager' on the Offer Approval step - reusable validation bound to the Offer class."
- "Change the severity on validation `<WID>` from `error` to `warning`."

## Scope

- **Create** a new Validation (`POST /validations/`) attached to an element, elementContent, or attribute.
- **Patch** an existing Validation (`PATCH /validations/{WID}`) - condition, severity, error message, or scope.
- **Create UI-only gating** via `reusable_validation_implementation_create` + `ui_reusable_validation_bindings_create` when the validation should bind to UI reuse instead of a raw element.
- Out of scope in v1: deleting validations, cross-task copy, changes to word buckets themselves.

## Inputs

- **Target** - one of:
  - `forElement` (element WID), or
  - `forElementContent` (elementContent WID), or
  - `forAttribute` (attribute WID + class WID).
- **Human-language rule** - e.g. "Start date must be after today", "Offer amount is required when stage is Offer".
- **Severity** - `error` or `warning` (resolved to a `validationSeverity` WID via `xo_search`).
- **Error or warning message** - resolved to a `wordBucket` WID (existing) via `xo_search` or `word_bucket_get` lookup. Creating a new word bucket is out of scope for v1.
- **Execution phase** - when the condition evaluates: on submit, on change, etc. (resolved to `validationPhase` WID).
- Optional: scope to `attributeScopes[]` if the validation applies only to certain attributes.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Target resolved (exactly one of `forElement`, `forElementContent`, `forAttribute`).
- [ ] Human rule captured in one sentence.
- [ ] Severity captured.
- [ ] Word bucket for the message either already exists (WID captured) or confirmed to be created out-of-band before this mode.
- [ ] User acknowledges this will POST a Validation (multi-step sequence if a condition method is required).

## Tools Used

All from `user-xo-mcp`:

- `validation_get` - read existing Validation (for edit flow).
- `validation_create` / `validation_patch` - create/update the Validation itself.
- `ec_evaluate_conditions_method_create` - create an EC (evaluate-conditions) method for simpler single-condition validations.
- `ebe_evaluate_boolean_expression_method_create` - create an EBE (evaluate-boolean-expression) method for multi-clause or complex boolean logic.
- `method_get` / `method_binding_get` - inspect an existing method before reusing it.
- `word_bucket_get` / `xo_search` - resolve the message text to an existing word-bucket WID.
- `reusable_validation_implementation_create` - only when UI-only gating is needed.
- `ui_reusable_validation_bindings_create` - bind a reusable validation to a UI element.
- `class_get` / `class_data_view_get` - read the backing class to confirm the attributes referenced by the condition actually exist before creating the method.

## Flow (follows the Tier 2 HITL template, with a multi-step twist)

1. **Dry-run read.** Fetch the backing class (`class_get`) and data view (`class_data_view_get`) for the target's class. Confirm every attribute referenced in the human-language rule exists. If any don't, stop and tell the user.

2. **Plan the writes.** Produce a full write plan as a single block before any API call. Example:

   ```
   Plan (3 writes):
     1. ec_evaluate_conditions_method_create
        -> creates EC method "StartDateAfterToday"
        -> returns method WID (used in step 3)
     2. xo_search + word_bucket_get resolution
        -> finds existing wordBucket WID "abc..." for "Start date must be in the future."
     3. validation_create
        -> validation body:
           { validationSeverity: <errorWID>, executionPhaseActive: <phaseWID>,
             forElement: <elementWID>, method: <methodWID from step 1>,
             errorWordBucket: <bucketWID from step 2> }
   ```

   Show the full plan, not just the first step.

3. **HITL checkpoint for the plan.** Ask: *"Approve this 3-step plan? Reply `approve` to run all steps, `reject` to abort, or edit."*
   - `approve` -> proceed through all steps in order; on any step failure, stop and report state.
   - `reject` -> stop; report "no changes made."
   - edit -> loop to step 2.

4. **Apply in sequence.** Execute the plan. After each step, capture the returned WID and inject it into the next step. Do NOT re-ask for approval between steps unless a step fails (in which case stop).

5. **Verify.** Re-fetch the Validation (`validation_get`) and its method (`method_get`). Confirm:
   - Validation is linked to the correct target.
   - Method WID matches what step 1 created.
   - Error word bucket matches.
   - Severity and phase match.

   Report drift if any.

## Guardrails

- **Refuse** to proceed if the referenced attributes don't exist on the backing class.
- **Refuse** to create a word bucket in this mode. Direct the user to create it out-of-band first and pass the WID.
- **Batched approval is explicit and shown up-front.** Never start writing after step 1 and claim you'll "ask later about step 2."
- **Versioning** - for `validation_patch`, always include the `versionToken` from the prior GET.
- **Never mix EC and EBE methods in one plan.** Pick the simplest one that fits the rule.
- **No cross-task copy**. If the user says "apply this validation to 5 other fields," refuse and ask them to run this mode once per target.

## Example: simple required-if rule

```
User: "Require 'Offer Amount' when the candidate stage is 'Offer'."

Mode:
  Pre-flight:
    - target: elementContent WID for 'Offer Amount' field
    - rule: required_if( candidateStage == 'Offer' )
    - severity: error
    - message: word bucket "Offer amount is required at this stage." (WID resolved via xo_search)

  Dry-run read:
    - class_get -> backing class has attributes `candidateStage`, `offerAmount`. OK.

  Plan (3 writes):
    1. ebe_evaluate_boolean_expression_method_create
       expression: "candidateStage == 'Offer' && offerAmount == null"
       -> method WID pending
    2. xo_search(wordBucket, "Offer amount is required at this stage.") -> WID abc...
    3. validation_create
       { forElementContent: <WID>, method: <methodWID>, validationSeverity: <errorSeverityWID>,
         executionPhaseActive: <onChangeWID>, errorWordBucket: abc... }

  User: "approve"

  Applies all three. Verifies via validation_get. Reports success.
```

## Non-goals

- Deleting validations.
- Editing word buckets.
- Creating new classes or attributes.
- Bulk-create / bulk-patch across tasks.
- Cross-tenant changes.

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
