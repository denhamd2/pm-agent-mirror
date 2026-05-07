# Mode: validation-analysis

**Tier:** 1 (read-only) • **Workspace switch:** No • **Writes to SUV:** No

"Compare validations between UI task and REST API." This mode produces a gap matrix showing which UI task validations are covered by the REST operation vs which need porting.

Runs from the PM workspace. No workspace switch. No SUV writes - this is a read-only analysis mode.

## Worked Example Prompts

- "What validations are missing from the REST API?"
- "Compare validations between task `<WID>` and REST operation `<WID>`"
- "Validation gap analysis for the Offer API"
- "Which UI validations should I port to the REST surface?"
- "Are all validations covered after that rest-from-task build?"

## Scope

- **Read** UI task validations via `ui_task_analysis_get` with `validations_only: true`.
- **Read** REST operation constraints via `service_operation_get` and related tools.
- **Produce** a gap matrix table comparing the two surfaces.
- **Offer** to batch-invoke `validation-edit` for rows marked `PORT_NEEDED`.
- Out of scope: creating or patching validations directly (that's `validation-edit`).

## Inputs

- **UI Task WID** (required) - the source task whose validations you want to analyse.
- **Service Operation WID** (optional) - the REST operation to compare against. If omitted:
  - Check for a recent `rest-from-task` run in `docs/xo/rest-apis/*/schema-implementation-wip.md` frontmatter.
  - If found, infer the Service Operation WID(s) from the frontmatter.
  - If not found, ask the user.

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] UI Task WID resolves via `ui_task_analysis_get`.
- [ ] Service Operation WID resolves via `service_operation_get` (or is inferred from recent build).

## Tools Used

All from `user-xo-mcp`:

- `ui_task_analysis_get` (with `validations_only: true`) - extract UI task validations.
- `service_operation_get` - read REST operation metadata.
- `service_representation_workday_owned_get` - read representation constraints.
- `representation_content_workday_owned_get` - read field-level constraints.
- `validation_get` - inspect individual validations when needed.
- `xo_search` - resolve WIDs by name when the user provides a display name.

## Flow

1. **Resolve inputs.** Confirm UI Task WID and Service Operation WID(s). If the user ran `rest-from-task` recently, offer to infer from the build artifacts.

2. **Extract UI validations.** Call `ui_task_analysis_get` with `validations_only: true`. For each element content with validations, capture:
   - Element content WID and label
   - Validation source WID and descriptor
   - Error message text
   - Validation parameters (work data dependencies)

3. **Extract REST constraints.** For each Service Operation:
   - Read the Edit representation via `service_representation_workday_owned_get`.
   - For each representation content field, check:
     - `required` flag
     - `minLength` / `maxLength` constraints
     - `pattern` (regex) constraints
     - Linked validations via `validation_get` if applicable

4. **Build gap matrix.** For each UI validation, determine REST status:
   - `NATIVE` - the REST operation already enforces an equivalent constraint (required field, format validation, etc.)
   - `PORT_NEEDED` - the UI validation has no REST equivalent; recommend porting via `validation-edit`
   - `SKIP` - the validation is UI-specific (e.g. conditional visibility based on display state) and not applicable to REST

5. **Present matrix.** Output a markdown table:

   ```markdown
   | UI Element | Validation | Error Message | REST Status | Recommendation |
   |---|---|---|---|---|
   | Offer Amount | Required when stage=Offer | "Offer amount is required" | PORT_NEEDED | Port via validation-edit |
   | Start Date | Must be future date | "Start date must be after today" | NATIVE | No action (required + format) |
   | Interview Notes | Max 500 chars | "Notes too long" | NATIVE | No action (maxLength) |
   | Background Check | View-only when pending | (display constraint) | SKIP | UI-only, not applicable |
   ```

6. **Offer follow-up.** If any `PORT_NEEDED` rows exist:

   > [N] validations need porting. Want me to batch-create them? I'll run `validation-edit` for each with your approval per row. Or pick specific rows to port.

   Do NOT auto-invoke `validation-edit`. The PM must explicitly approve each port.

## Guardrails

- **Read-only.** This mode does not write to the SUV. All writes go through `validation-edit` with its own HITL gates.
- **No auto-port.** Never invoke `validation-edit` without explicit user confirmation per validation.
- **Bounded scope.** Only analyse the specific task and operation(s) provided. Do not crawl related tasks.
- **Honest gaps.** If the gap analysis cannot determine status (e.g. custom EBE logic that is hard to compare), mark as `UNKNOWN` and suggest manual review.

## Example: Offer task vs Offer REST API

```
User: "What validations are missing from the Offer REST API?"

Mode:
  Pre-flight:
    - UI Task: "Create Offer" (WID: abc123...)
    - Service Operation: POST /offers (WID: def456...) - inferred from recent rest-from-task

  Extract UI validations:
    - ui_task_analysis_get(instance_id="abc123...", validations_only=true)
    - Found 8 validations across 5 element contents

  Extract REST constraints:
    - service_operation_get(WID="def456...")
    - Edit rep has 12 fields; 4 required, 2 with format constraints

  Gap matrix:

  | UI Element | Validation | Error Message | REST Status | Recommendation |
  |---|---|---|---|---|
  | Offer Amount | Required when stage=Offer | "Offer amount required" | PORT_NEEDED | Port via validation-edit |
  | Currency | Required | "Currency is required" | NATIVE | No action |
  | Start Date | Future date | "Must be after today" | PORT_NEEDED | Port via validation-edit |
  | Expiration | After start | "Must be after start" | PORT_NEEDED | Port via validation-edit |
  | Hiring Manager | Required | "Hiring manager required" | NATIVE | No action |
  | Offer Letter | PDF only | "Only PDF allowed" | SKIP | Attachment format; out of scope |
  | Internal Notes | Max 1000 | "Notes too long" | NATIVE | No action (maxLength) |
  | Approval Status | View-only | (display constraint) | SKIP | UI-only |

  Result: 3 PORT_NEEDED, 4 NATIVE, 2 SKIP.

  Follow-up:
  > 3 validations need porting. Want me to batch-create them via validation-edit?
```

## Non-goals

- Creating or editing validations (use `validation-edit`).
- Analysing non-validation constraints (e.g. BP approval rules).
- Cross-task comparison (e.g. "compare Edit Offer vs Create Offer validations").
- Production SUV analysis (dev SUV only).

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- If the user wants to port validations, hand off to `validation-edit` mode with explicit HITL per row.
- Ask the user if they want to run another mode. Do not assume.
