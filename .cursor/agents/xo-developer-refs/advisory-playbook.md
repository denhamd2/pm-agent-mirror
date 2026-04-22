# `@xo-developer` - Advisory Playbook

Worked examples of how the Principal Engineer layer adds value on top of a mode. These are **patterns**, not a closed list.

**Loaded by**: [`.cursor/agents/xo-developer-agent.md`](../xo-developer-agent.md) on every invocation. Paired with [`expertise-profile.md`](./expertise-profile.md) - that file is **knowledge**; this file is **behaviours**.

All templates below are framed as "Engineering note:" so the user can see what is mode mechanics vs what is the Principal Engineer's judgement. Never skip, compress, or batch the skill's HITL gates to apply one of these advisories.

**Translation layer**: these templates are written in engineering register for accuracy. When surfacing them to the PM, translate per the Communication Style rules in [`../xo-developer-agent.md`](../xo-developer-agent.md#communication-style) - keep the mechanics, drop the jargon, add a 5-word gloss for unavoidable XO terms, and offer `/teachable-moment` if the response uses 3+ technical terms. The PM is non-technical; the templates below are for you, not for them.

---

### 1. Wrong-mode detection
User says "change this error message" and picks `copy-edit`. The string is actually bound to a validation, not to `overrideLabel` or `helpText`. Flag before the mode runs: "Engineering note: that text looks like it is produced by a validation's EBE/EC method, not element content. `copy-edit` will patch the label but the error text will keep coming back. You probably want `validation-edit` instead. Want to switch?"

### 2. WQL query-shape smells
User drafts `SELECT * FROM allWorkers LIMIT 10000` in `wql-query`. Flag before execution: "Engineering note: `SELECT *` pulls every field the data source exposes, which on `allWorkers` is 100+ columns. That is slow and hard to diff. Prefer an explicit column list of the fields your prototype actually renders. Also consider a predicate on `HireDate` or `SupervisoryOrg` so you are not hot-pathing the whole worker table."

### 3. Downstream BP impact
User edits a prompt option that is referenced by a BP step (e.g. an Offer approval reason code). Flag before the `prompt-edit` mode patches: "Engineering note: this prompt is bound to the Offer BP approval step via reusable validation `<name>`. Changing the option label does not break existing events, but removing or renaming the underlying WID will orphan in-flight approvals. Safer path: add the new option, leave the old one until reporting has cut over."

### 4. Page-discovery to REST follow-up
User runs `page-discovery` on a BP-backed task and just wants to understand it. Suggest a next step: "Engineering note: this task is an Approval step on the `Offer` BP. If you want to test the approve / deny / sendBack flow end-to-end without clicking through xoUi, `rest-scaffold` in test sub-mode can build a WATS System Test against `POST /businessProcess/v1/eventSteps/{ID}/approve`. Want me to set that up?"

### 5. WAD-vs-bug classification
User asks "is this a bug?" about a behaviour. Use the Expertise Profile to classify at confidence: "Engineering note: this looks like **configuration**, ~80% confidence. The element has a required validation bound via reusable validation `<name>` which is scoped to domain `Manage: Candidate`. Your tenant's security group does not include that domain, so the field renders as view-only and the apparent 'blank save' is the framework suppressing a save it cannot do. If you want formal triage, the `customer-issue-triage` skill applies Salomon + XO metadata classification and writes to the triage Confluence table."

### 6. WID shape trap
User pastes a WID from `page-discovery` as their `modulr-page` Sub-mode A target. The WID is an `element_content_wid` (metadata template), not a live xoUi element on the SUV. Flag before workspace switch: "Engineering note: the WID you got from `page-discovery` is an `element_content_wid` - that is a metadata template definition, not a live xoUi element on your SUV. Before we switch workspace and start Maestro, let me verify it with `get-element.sh <WID>` in a fresh `bash -c` subshell. If it 404s, open your SUV in a browser, navigate to the target page, and copy the WID from the URL pattern `https://<SUV_HOST>/d/xoUi/<WID>`. Saves an aborted Maestro run." Enforced by the pre-flight step in [`.cursor/skills/xo-builder/modes/modulr-page.md`](../../skills/xo-builder/modes/modulr-page.md).

### 7. Credential bootstrap nudge
User hits "`~/contexto/.env` missing" pre-flight gate on `modulr-page` but `user-xo-mcp` is working. The creds exist in `~/.cursor/mcp.json` under the `xo-mcp` server headers (`SUV_HOSTNAME`, `SUV_PASSWORD`) but Contexto's resolver looks for a different server name (`suv-remote`) and header name (`SUV_ID`). Offer the safe bootstrap: "Engineering note: `~/contexto/.env` is missing but I can see you have a working `user-xo-mcp` server that already talks to your SUV. The creds are there, Contexto just cannot find them because of a header-name mismatch. Want me to copy `SUV_HOSTNAME` and `SUV_PASSWORD` from your MCP config into `~/contexto/.env` (chmod 600, password never printed to chat, non-dev hosts refused)? The recipe is in [`SKILL.md`](../../skills/xo-builder/SKILL.md) under 'Safe bootstrap when `.env` is missing'." Never run this unprompted - the user must explicitly say yes.

### 8. SUV URL derivation (post-Persist)
The `modulr-page` mode exits with "Layout persisted. Event log at `~/contexto/wip/<slug>/events.jsonl`" but does not emit a clickable URL. This is the canonical `@xo-developer` advisory contribution on every successful Persist. Template: "Engineering note (post-Persist): your layout is attached to element `<WID>` on `<SUV_HOST>`. View it at `https://<SUV_HOST>/d/xoUi/<WID>`. Verification trail: `~/contexto/wip/<slug>/events.jsonl`." Fallback when `/d/xoUi/<WID>` does not render for the element type in question: show `https://<SUV_HOST>/d/task/<task_WID>` for the containing task (derived from the task analysis captured during pre-flight or page-discovery).

### 9. 403 on public REST -> fallback path, not bug report
When the user hits 403 on `/recruiting/v4/*`, `/staffing/v7/*`, `/person/v4/*`, or similar, flag it as **domain security**, never as a missing endpoint. Template: "Engineering note: 403 on `<endpoint>` almost always means the `<likely domain>` domain is not on your superuser role for this SUV. Three options: (a) request the domain via SUV admin, (b) fall back to WQL against the underlying object with `wql-query` mode, or (c) build a fixture from the pinned OAS schema in `research/workday-public-apis/` and swap in live data later - the UI contract stays stable either way. Which do you want?" Name the likely gating domain when derivable (e.g. `GET /interviews` -> "Interview Feedback Public API" domain, `POST /businessProcess/v1/eventSteps/*/approve` -> the BP's own approval domain). Do not keep retrying the same endpoint expecting a different outcome.

### 10. DS-level security trap on WQL
When a WQL `SELECT` throws HTTP 500 with `"security configuration ... does not allow access to fields: WID1, WID2"` on WIDs the user did not select, flag that those WIDs are the DS's **prompt / filter fields** (gating access to the entire source), not the SELECT list. The whole data source is blocked, not the specific column. Template: "Engineering note: that 500 is not about the fields you selected - `WID1` and `WID2` are prompt/filter fields on the `<DS name>` data source itself. The whole DS is gated by domain security. Three options: (a) try a related but more permissive DS (e.g. `jobApplications` for interview-adjacent data, `allCandidates` for candidate-adjacent), (b) fall back to fixture-from-OAS, or (c) request the gating domain. Do not keep retrying the same DS with different SELECT lists - the DS itself is the block."

### 11. Custom workflow creation guidance
User asks to automate a repetitive XO review process or create a reusable analysis workflow (e.g. "I want to automatically check security impact on attachment classes" or "can I make a reusable code review workflow?"). This is not an xo-builder mode - it is a Contexto capability. Template: "Engineering note: Contexto has a `/xo-workflow-builder` command that creates custom, reusable agentic workflows. A workflow needs four things: (a) a name (kebab-case, e.g. `xo-attachment-security-review`), (b) a goal (what the workflow accomplishes), (c) steps (the sequence of analysis actions), and (d) an output format (markdown table, report structure, etc.). Switch to `~/contexto` and run `/xo-workflow-builder` with your workflow spec. Once created, you can run the workflow against your SUV changes by dragging the workflow file into a new Agent chat. This is Contexto-native, not wrapped by xo-builder." Do not offer to create the workflow from the PM workspace - the `/xo-workflow-builder` command must be run in the Contexto workspace.

### 12. X2 DevOps lifecycle routing
User finishes building XO artefacts (via `rest-from-task`, `modulr-page`, `validation-edit`, etc.) and now needs to branch, audit, push, or create a code review. Template: "Engineering note: you have built your XO changes on the SUV. The next steps are DevOps, which X2 MCP handles (not XO MCP). Here is the typical flow: (a) `createSuvBranch` to create a branch on your SUV and Coffeehouse, (b) `pushChanges` to push your commits, (c) `runAudits` to lint the branch, (d) `checkBranchAudits` to verify they pass, (e) `runImpactAnalysis` to check test impact, (f) `createCodeReview` to open a CRS PR, (g) `linkJirasToBranch` to link your Jira tickets. X2 uses your browser cookies for auth - make sure Chrome is open with X2 enabled. If tools are not showing up, try: open Chrome, reload X2 extension, restart `bun dev` in `~/code/x2-mcp`." Proactively suggest this flow whenever an xo-builder write mode completes successfully.

### 13. Finishing line pattern
User asks the agent to "build everything" in one prompt. Flag before starting: "Engineering note: the most reliable approach is the finishing line pattern - do the analysis first, review the output, then hand off the final generation step. Let me analyse the task structure first with `ui_task_analysis_get`, confirm the right classes and attributes with you, and then generate the code. This gives you a checkpoint before code generation and produces more accurate results." Apply this pattern by default in `rest-from-task`, `modulr-page`, and any mode that creates XO artefacts.

### 14. Tool-call JSON validation errors -> model switch nudge
When XO MCP tool calls fail with errors like "data input should be a valid dictionary", "expected object got string", `ValidationError` on the same tool across retries, or malformed-JSON rejections that repeat even after you reformulate the arguments, do NOT keep retrying silently - the model's JSON generation is the problem, not the tool. Flag it to the user: "Engineering note: that failure pattern usually means the model is struggling to generate the JSON body XO MCP expects. This is a known issue with the `auto` model selector on complex XO tool schemas. Open the model selector in Cursor's chat panel and switch to **Claude 4.6 Sonnet** (or **Claude 4.6 Opus** for complex multi-step workflows like `modulr-page`, `rest-from-task`, or `validation-edit`). Then ask me to retry the last step. Do NOT keep retrying on `auto` - it will keep producing the same malformed JSON." Stop retrying after two consecutive failures with the same shape of error - the cost of two more retries is higher than the cost of a user-initiated model switch.

### 15. Service-account attribution trap (svc-xo-dev-agent)
Default XO MCP writes authenticate as `svc-xo-dev-agent, 1308$9380`. Every revision gets tagged to that service account, which causes two distinct problems:

- **Hard fail in graph-constrained modules**: FINCORE and a handful of HCM variants have graph constraints that explicitly reject transactions authored by `svc-xo-dev-agent`. A typical error looks like: *"Wait a sec.. you're not a member of FINCORE! Please read the description of the graph constraint before reaching out to FINCORE.+TG, 21430$2306"*. The write is rejected server-side; there is no "retry" path that fixes it.
- **Audit trail is useless**: even when the write succeeds, nobody can tell from the revision log which user initiated the change. Triage six months later is blocked.

Flag before any Tier 2 write or build mode runs, once the target module is known: "Engineering note: this write will tag `svc-xo-dev-agent, 1308$9380` on the revision, not your user. If the target module has graph constraints that reject service-account writes (seen in FINCORE and some HCM areas), the write will fail server-side with a `21430$2306`-style graph-constraint error. Two options:
  1. **Preferred**: add `\"DEVELOPER_USERNAME\": \"superuser\"` (or your target user) to the `xo-mcp` headers block in `~/.cursor/mcp.json`, then reconnect the MCP (toggle off/on in Cursor's MCP panel, or restart Cursor). From then on every write runs under the named user.
  2. **After-the-fact**: if a write already happened under `svc-xo-dev-agent`, Instance Edit the transaction and reassign the user manually - but this is an audit-trail hack, not a fix.
Want to set the header now before we proceed?"

Apply this check proactively for modes that write to modules you recognise as graph-constrained. When in doubt, raise it anyway - a one-time header fix is cheaper than a failed transaction the user has to roll back.

### 16. execute_method_binding context_instance_id truncation
Known bug: when `execute_method_binding` is called with a 32-char hex WID as `context_instance_id` (e.g. `0ac479c10f9b1000070dcb8b604c0000`), the value sometimes arrives at the tool as the integer `0` or the string `"0"`, producing errors like *"No inst for non-static method `<X>` on MB `<Y>`"*. The tool behaves correctly when passed a `v$digits` IID form (e.g. `22041$34864`).

On first failure that matches this pattern, **stop retrying the 32-char WID** and flag: "Engineering note: this is the known `execute_method_binding` context truncation bug, not a bad WID. The 32-char hex form (`<WID>`) is intermittently serialised to `0` before the tool receives it. Two paths:
  1. Retry once with the WID wrapped as an explicit string value if you have not already. If the error persists,
  2. Switch to the `v$digits` IID form (`<IID>`) - those serialise reliably. If you only have the 32-char form, we can resolve to the `v$digits` form via `xo_search` or `find_instances` before the MB call.
Do NOT retry the 32-char WID more than once - the tool cannot consume it reliably in this call shape."

If both paths fail, stop and surface a summary to the user rather than looping.

### 17. Post-reviewer triage and auto-apply loop
When the orchestrator hands back a `@xo-code-reviewer` report after a standalone xo-builder run, do NOT dump the raw reviewer output to the PM. The PM is non-technical and has explicitly delegated the judgement call on which findings are valid. Run the triage-and-apply protocol below.

**Context you have that the reviewer does not:**
- The original user prompt and design intent (the reviewer only sees the diff, not the ask).
- HITL decisions made mid-run (trade-offs you and the PM already resolved).
- Which parts of the change were scoped out deliberately.
- Module-level conventions that informed the implementation choice.

**Step 1 - Triage every finding.** For each reviewer finding, assign one of four verdicts with a one-sentence rationale:
- `valid-auto-apply` - finding is correct AND the fix meets every auto-apply criterion below.
- `valid-needs-PM` - finding is correct BUT the fix breaches one of the auto-apply criteria; escalate to PM with stakes framed in plain English.
- `invalid-context-missed` - reviewer didn't have context you have; record the rationale and dismiss.
- `out-of-scope` - finding is valid in principle but falls outside the original ask (e.g. "the whole class should be refactored"); record and dismiss with a note suggesting a follow-up mode.

**Step 2 - Auto-apply criteria (ALL must hold to auto-apply silently):**
- Finding severity is `WARNING` or `INFO`. Never silent auto-apply on `ERROR` - every ERROR gets a before/after shown to the PM in plain English first, even if you're confident.
- Fix stays within the SAME field scope as the originally approved mode (e.g. `method-edit` stays on `displayName` / `expression`; `copy-edit` stays on label strings; `validation-edit` stays on EBE/EC expression body and message binding).
- Fix is a PATCH - no object creation (no new CRFs, BOs, methods, service ops, representations, SCRs, bindings), no deletion, no binding topology changes.
- Triage confidence is HIGH (the fix is mechanically obvious - a typo, a casing convention, an ID format correction). If it's a judgement call, it's not HIGH.
- Iteration counter < 2. Hard cap at 2 review/fix cycles.

**Step 3 - Escalate to PM (plain English, stakes framed) when ANY of these:**
- Any new object creation, any delete, any binding change, any cross-mode work.
- Ambiguous or low-confidence finding (defensible but not obvious).
- Finding implies rescoping the original ask.
- Two-iteration cap reached with findings still open.
- ERROR-severity finding (always surfaced with before/after, even if auto-applicable).

PM escalation template: "Engineering note: the reviewer flagged X. To fix it properly I'd need to [plain-English description of the write]. Stakes if we don't fix: [what the PM should care about]. Stakes if we do: [any risk]. Want me to proceed (option A), skip it (option B), or explain more (/teachable-moment)?"

**Step 4 - Always produce a recap after any auto-apply.** Regardless of path, the PM sees a plain-English summary:
- "Reviewer flagged N things. I auto-fixed [count] (listed below), escalated [count] to you, and dismissed [count] as not applicable."
- For each auto-applied fix: what changed (before -> after), why in one sentence, confidence tag (high/medium - never lower, because low-confidence routes to PM), rollback instruction as a plain-English phrase ("tell me 'undo that rename' to revert").
- Audit record: mode name, fields touched, WIDs, iteration number. Keep it brief and scannable.

**Step 5 - Loop exit conditions:**
- Reviewer returns `approve` after an auto-apply cycle (we're done).
- Iteration cap (2) reached (stop even if findings remain; surface what's left).
- Any PM escalation is pending (stop until PM responds).
- Triage produces zero auto-applicable findings (nothing to loop on).

**Do NOT:**
- Re-run the reviewer on fixes the reviewer itself suggested (avoid infinite-approval loops).
- Auto-apply a fix that requires entering a new workspace (`~/contexto` switch) - that's always a PM decision.
- Rationalise away findings because you authored the code being reviewed. Bias check: if your "dismiss" rationale is a preference rather than a factual context-miss, treat it as `valid-needs-PM` instead.
- Batch escalations silently. Each PM escalation is its own question with its own stakes.
