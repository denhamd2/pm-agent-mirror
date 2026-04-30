# Mode: prompt-edit

**Tier:** 2 (guarded write) • **Workspace switch:** No • **Writes to SUV:** Yes

"Tweak this prompt" or "add a prompt option." Edit a Prompt or PromptGroup via XO MCP `prompt_patch` / `prompt_group_patch`. Diff-approve-apply-verify HITL required. Deleting existing options requires an explicit second confirmation.

Runs from the PM workspace. No workspace switch. Targets the user's dev SUV only.

## Worked Example Prompts

- "Add a new prompt option `Contract` to prompt group `<WID>` after `Full-Time`."
- "Rename the prompt option `Req'd` to `Required` on prompt `<WID>`."
- "Change the default value on prompt `<WID>` to `Pending Review`."
- "Reorder the members of prompt group `<WID>` so `Internal` appears before `External`."
- "Remove the `Legacy` option from prompt group `<WID>`." *(destructive; will require second confirmation)*

## Scope (v1)

- **Edit** a Prompt: text, localization, default value.
- **Edit** a PromptGroup: name, member ordering, add or remove members.
- **Add** new options to a Prompt or PromptGroup (non-destructive).
- **Remove** options from a Prompt or PromptGroup (destructive - requires a second confirmation).
- Out of scope in v1: prompt resources, smart-prompts, prompt values referenced through external REST lookups, creating brand-new Prompts or PromptGroups (use XO tooling directly for that).

## Inputs

- **Prompt or PromptGroup WID** (the user can say "this prompt" if they've just come from `page-discovery` on a prompt-backed field; ask for the WID explicitly).
- **What to change** - new text, new default, new option, remove option, reorder members.
- Optional: **reason** (for your own trail).

## Pre-Flight

- [ ] Global pre-flight from [../SKILL.md](../SKILL.md#global-pre-flight-common-to-all-modes) passed.
- [ ] Target WID captured and type confirmed (Prompt vs PromptGroup).
- [ ] Change described precisely (old -> new).
- [ ] User acknowledges this is a dev-SUV write.
- [ ] If removing options: user acknowledges destruction and is prepared to confirm twice.

## Tools Used

All from `user-xo-mcp`:

- `prompt_get` / `prompt_patch` - read and write a Prompt.
- `prompt_group_get` / `prompt_group_patch` - read and write a PromptGroup.
- `xo_search` - resolve name to WID if needed.
- (Optional read-only) `method_binding_get` - confirm the prompt is wired to a UI response.

## Flow (follows the Tier 2 HITL template)

1. **Read current state.**
   - For a Prompt: `prompt_get` -> capture text, default, options, `versionToken`.
   - For a PromptGroup: `prompt_group_get` -> capture name, members in order, `versionToken`.
   - Show the user the current state as a side-by-side-ready block.

2. **Compute proposed diff.** Format: `old -> new` for each field being changed.

   **Non-destructive example (add an option):**
   ```
   PromptGroup: <WID>
   Members (current -> proposed):
     1. "Shortlisted"            1. "Shortlisted"
     2. "Interviewing"           2. "Interviewing"
     3. "Offer"                  3. "Offer"
                                 4. "Offer Accepted"  (NEW)
     4. "Hired"                  5. "Hired"
     5. "Rejected"               6. "Rejected"
   ```

   **Destructive example (remove an option):**
   ```
   PromptGroup: <WID>
   Members (current -> proposed):
     1. "Shortlisted"            1. "Shortlisted"
     2. "Interviewing"           2. "Interviewing"
     3. "Offer"                  (REMOVED)
     4. "Hired"                  3. "Hired"
     5. "Rejected"               4. "Rejected"
   ```

3. **HITL checkpoint 1.** *"Approve this change? Reply `approve`, `reject`, or edit."*
   - `approve` -> if destructive, go to step 3b; otherwise step 4.
   - `reject` -> stop; report no changes made.
   - edit -> loop to step 2.

3b. **HITL checkpoint 2 (destructive only).** *"This change will remove existing options and may break any existing records referencing them. Confirm with `delete-allowed` to proceed, or anything else to cancel."*
   - `delete-allowed` -> step 4.
   - anything else -> stop; report no changes made.

4. **Apply.** Call `prompt_patch` or `prompt_group_patch` with:
   - `instance_id`.
   - `versionToken` from step 1.
   - only the fields that changed. Fields not touched are omitted.

5. **Verify.** Re-read the target. Confirm the new state matches the approved diff. Report success or surface drift.

## Guardrails

- **Destructive changes require two confirmations.** Do not short-circuit checkpoint 2.
- **Never reorder silently.** If the user asks for "add X", keep existing order unless they explicitly ask for reorder.
- **No new Prompts/PromptGroups in v1.** If the user says "create a new prompt," refuse and route them to proper XO tooling or a PM agent workflow.
- **No smart-prompt or prompt-resource edits in v1.** These have more complex binding semantics and are out of scope.
- **Versioning**: always include `versionToken`.

## Non-goals

- Creating brand-new prompts or prompt groups.
- Editing prompt resources, smart-prompts, or external prompt values.
- Bulk edits across multiple prompts.
- Cross-tenant changes.

## Example (non-destructive)

```
User: "Add an 'Offer Accepted' option to the candidate stage prompt group <WID>."

Mode:
  1. prompt_group_get -> members: Shortlisted, Interviewing, Offer, Hired, Rejected; versionToken: v42.
  2. Diff: add "Offer Accepted" at position 4.
  3. User: "approve"
  4. prompt_group_patch with new members + versionToken.
  5. Re-read -> "Offer Accepted" present at position 4. Reports success.
```

## End-of-run

- Do not switch workspace (none was used).
- Do not write to `MISSION_LOG.md`.
- Ask the user if they want to run another mode. Do not assume.
- **Post-write handoff (UI-observable Tier 2)**: per the orchestrator routing in [000-master-orchestrator.mdc](../../../rules/000-master-orchestrator.mdc), `@xo-code-reviewer` (artefact review) and `@qa-engineer` (UI smoke via [`suv-smoke-test`](../../suv-smoke-test/SKILL.md), typically `label-check` or `page-smoke`) are auto-invoked **in parallel** after this mode completes (standalone, out-of-E2E). Both streams feed back to `@xo-developer` for combined triage per [Advisory Behaviour #17](../../../agents/xo-developer-refs/advisory-playbook.md). Iteration cap: 2 cycles. PM never sees raw findings - `@xo-developer` produces one combined plain-English recap.
