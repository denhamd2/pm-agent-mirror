# Mode: copy-edit

**Tier:** 2 (guarded write) • **Workspace switch:** No • **Writes to SUV:** Yes

"Change the copy on this element." Edit a UI element's user-visible label, help text, or automation ID via the XO MCP `element_content_patch` endpoint. Diff-approve-apply-verify HITL required.

Runs from the PM workspace. No workspace switch. Writes are scoped to three fields only.

## Worked Example Prompts

- "Change the label on field `<WID>` from 'Req'd By' to 'Required By'."
- "Update the help text on the Offer Amount field (`<WID>`) to 'Enter gross annual compensation in local currency.'"
- "Change the `automationId` on element content `<WID>` to `candidate-email-input`."
- "Rename the 'Hire Date' label to 'Start Date' on element content `<WID>`."

## Scope (v1)

This mode edits **only** these three fields on an existing `elementContent` instance:

- `overrideLabel` - the user-visible label.
- `helpText` - inline help text shown next to the field.
- `automationId` - test-automation identifier.

Any other field (security, bindings, class, visibility, work data) is **out of scope** and will be refused. For those, use the proper PM agent workflow ([200 PRD](../../../rules/200-prd-template.mdc) -> [400 Backlog](../../../rules/400-backlog-refinement.mdc)).

## Inputs

- **Element content WID** (`instance_id` for `element_content_get/patch`). If the user only has the parent element WID, use `ui_task_analysis_get` first to resolve the right element content.
- **Which field to change** (`overrideLabel`, `helpText`, or `automationId`).
- **New value** for that field.
- Optional: **reason** for the change (for your own audit trail - not written anywhere).

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Target `elementContent` WID captured.
- [ ] Field and new value captured.
- [ ] Change is in scope (one of the three allowed fields).
- [ ] User acknowledges this writes to their dev SUV.

## Tools Used

- `user-xo-mcp`:
  - `element_content_get` - fetch current state (see [mcps/user-xo-mcp/tools/element_content_patch.json](../../../../mcps/user-xo-mcp/tools/element_content_patch.json) for the companion GET).
  - `element_content_patch` - apply the change. Schema at [mcps/user-xo-mcp/tools/element_content_patch.json](../../../../mcps/user-xo-mcp/tools/element_content_patch.json).
- `ui_task_analysis_get` - fallback for resolving parent-element to element-content WID when the user only has the parent.

## Flow (follows the Tier 2 HITL template)

1. **Read current state.**
   - Call `element_content_get` with the `elementContent` WID.
   - Capture current `overrideLabel`, `helpText`, `automationId`, and `versionToken` (required for PATCH optimistic concurrency control).
   - Show the user the current values.

2. **Compute proposed diff.** Print it as a readable block, for example:

   ```
   Element content: <WID>
   Field: overrideLabel
   Current: "Req'd By"
   Proposed: "Required By"
   ```

   Do not propose changes to any field the user did not ask about.

3. **HITL checkpoint.** Ask: *"Approve this change? Reply `approve`, `reject`, or edit the proposed value."*
   - `approve` -> step 4.
   - `reject` -> stop; report "no changes made."
   - anything else -> treat as an edit; update and loop to step 2.

4. **Apply.** Call `element_content_patch` with:
   - `instance_id`: the elementContent WID.
   - `versionToken`: the token from step 1.
   - the one field the user approved.
   - any fields you did NOT touch are **omitted entirely** from the patch body (do not pass nulls or empty strings).

5. **Verify.** Re-call `element_content_get`. Compare the new values to the approved diff. Report back:
   - If match: "Applied. Verified. New label: '...'"
   - If drift: surface the discrepancy clearly and stop. Do not retry silently.

## Guardrails

- **Refuse** any request to change fields other than `overrideLabel`, `helpText`, `automationId` in this mode. Tell the user which field they asked about and why it's out of scope.
- **Refuse** any request to delete an element content. DELETE is a different tool and a different risk profile.
- **Do not batch**. One elementContent at a time in v1. If the user wants to rename five fields, confirm each one separately.
- **Never skip the verify step**. If verify fails, treat the SUV as source of truth.

## Non-goals

- Creating a new elementContent.
- Changing validations, bindings, security, or visibility.
- Bulk rename across a task.
- Cross-tenant edits.

## Example run

```
User: "Change the label on field <WID> from 'Req'd By' to 'Required By'."

Mode:
  1. Reads element_content_get -> current overrideLabel: "Req'd By", versionToken: "abc123"
  2. Shows diff:
       overrideLabel
       Current: "Req'd By"
       Proposed: "Required By"
  3. User: "approve"
  4. Calls element_content_patch with { instance_id, versionToken, overrideLabel: "Required By" }
  5. Re-reads -> overrideLabel now "Required By". Reports success.
```

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
- **Post-write handoff (UI-observable Tier 2)**: per the orchestrator routing in [000-master-orchestrator.mdc](../../../rules/000-master-orchestrator.mdc), `@xo-code-reviewer` (artefact review) and `@qa-engineer` (UI smoke via [`suv-smoke-test`](../../suv-smoke-test/SKILL.md)) are auto-invoked **in parallel** after this mode completes (standalone, out-of-E2E). Both streams feed back to `@xo-developer` for combined triage per [Advisory Behaviour #17](../../../agents/xo-developer-refs/advisory-playbook.md). Iteration cap: 2 cycles. PM never sees raw findings - `@xo-developer` produces one combined plain-English recap.
