# Candidate Tags REST service - driver's guide (new-window execution)

Reference companion for running Contexto's 3-workflow chain from a separate `~/contexto` Cursor window. Keep this open in the PM workspace while the Contexto window does the work.

**Session start**: 21 April 2026
**Dev SUV**: `i-01b78c8ca923546e8.workdaysuv.com` (superuser)
**Source plan**: `/Users/david.denham/.cursor/plans/candidate_tags_rest_service_ce2997dd.plan.md`
**Why this exists**: `cursor-app-control.move_agent_to_root` can't switch the active agent to `~/contexto` on this setup (tool assumes `main` branch; Contexto is `master`-default and you lack push permission on origin to create a `main` ref). Falling back to a manually opened Contexto window.

## Setup (one-off)

1. In Cursor: **File > Open Folder > `~/contexto`**. New window opens.
2. In that window's chat, confirm the workspace re-grounded: Contexto skills / rules should be visible; PM workspace context is gone. This is expected.
3. Verify env: in the Contexto chat, paste `cat .env | grep -E "^SUV_(HOST|USERNAME)"`. Should show `SUV_HOST=i-01b78c8ca923546e8.workdaysuv.com` and `SUV_USERNAME=superuser`.

## Source tasks (confirmed live)

| Role | Type | Descriptor | Instance ID | WID |
|---|---|---|---|---|
| Read (primary) | Web Service Task | Get Candidate Tags | `2996$5877` | `ab8b6416c42310001492a20f14fb0045` |
| Write (primary) | Web Service Task | Put Candidate Tag | `2996$5878` | `4332ad48336510000e8b7456fdf30049` |
| Read (UI companion) | Convenience Task | View Candidate Tags | `2998$33557` | `a624f92773c2100013ee629235ed0033` |
| Write (UI companion) | Convenience Task | Maintain Candidate Tags | `2998$33558` | `a624f92773c2100013ee66cb5e9f0036` |

## Stage 2 - Schema analysis (GET side)

**Type this exact command in the Contexto window chat**:

```
/xo-agent-schema-analysis ab8b6416c42310001492a20f14fb0045
```

Loads the schema-analysis workflow (6 steps). Expect these HITL halts:

| Step | Gate | Decision guide |
|---|---|---|
| 4 - Classify element contents | Each element row gets a disposition (Keep / Skip / Flatten / Loop). | Default: **Keep** any business-meaningful field; **Skip** obvious scaffolding (root Report_Data wrappers, protocol cruft). **Flatten** single-child composite holders. **Loop** repeating groups. Ask if uncertain - Contexto will explain each row. |
| 5 - Design representations | Embed shape: **View** (full body) vs **Summary** (collection rows) vs **Reference** (relationship pointer). | For Candidate Tags on first pass: **View + Summary** are the real deliverables; **Reference** where a tag points back to the candidate. Do not over-embed. |
| 6 - Implementation plan | Approve Summary table (non-negative integer counts). | Scan: BO count (≥1, likely the Candidate Tag class), CRF count (fields on that class), Rep count (one per Summary/View/Reference). If counts look wrong vs the disposition you picked in step 4, reject and re-enter step 4. |

**Outputs** (in `~/contexto/wip/candidate-tags/`):

- `schema-analysis-wip.md`
- `schema-design-wip.md`
- `schema-implementation-wip.md`

**If it halts unexpectedly**: look at `events.jsonl` in the same folder for the last-written event. Errors are usually a WID typo or a CRF lookup failure against a class that doesn't exist yet.

## Stage 3 - Schema analysis (PUT side)

**After Stage 2 completes cleanly**, type:

```
/xo-agent-schema-analysis 4332ad48336510000e8b7456fdf30049
```

Same 6 steps, different source. Key difference from GET pass:

- Expect step 4 disposition decisions to include **write-side semantics**: required-on-POST, patchable-on-PATCH, immutable-after-create.
- Step 6 should **merge** its implementation plan into the existing `schema-implementation-wip.md`, extending the Operations section to cover POST/PATCH/DELETE. If Contexto writes a separate file, manually merge the tables afterwards.

**HITL red flag**: if the PUT WST analysis suggests representations or BOs that don't match the GET pass, stop and reconcile before Stage 4. Two passes disagreeing = the implementation plan is unsafe to execute.

## Stage 4 - Schema implementation - **NO-RETURN BOUNDARY STARTS HERE**

**Every step of this workflow writes to the SUV. Nothing below this line is free to retry.**

Type:

```
/xo-agent-schema-implementation wip/candidate-tags/schema-implementation-wip.md
```

11 steps. Critical HITL halts:

| Step | Gate | What to watch |
|---|---|---|
| 1 - WIP validation | Contexto refuses to proceed if any WID in the WIP is a placeholder (e.g. `<TBD>`, `null`, `WID_HERE`). | Fix placeholders by re-running relevant parts of Stage 2/3, not by hand-editing the WIP. |
| 3 - CRFs (Class Report Fields) | For composite fields it will ask about `Create IOP` vs `Create GRA` traversal. | IOP (Instance Output Path) = scalar leaf, GRA (Generic Report Access) = relationship hop. If the WIP already has the traversal chosen, approve. If Contexto is asking, default to whatever the source WST's existing traversal is. |
| 5 - Representations | Dependency order: embedded Summary/Reference must land before their parent View. | If it fails mid-creation, the created reps are stuck - rollback is manual via XO MCP DELETE. |
| 10 - Review | Graph constraints check; cross-reference vs WIP. | Any finding that doesn't resolve to a trivial fix = halt and raise with David. Do not force-proceed. |

**Audit trail**: `~/contexto/wip/candidate-tags/events.jsonl` logs every SUV write with WID. This is your rollback map.

## Stage 5 - Processing creation (POST/PATCH wiring)

After Stage 4 completes, type:

```
/xo-agent-processing-analysis 4332ad48336510000e8b7456fdf30049 <NEW_SERVICE_OPERATION_WID>
```

Where `<NEW_SERVICE_OPERATION_WID>` is the POST operation WID created in Stage 4 step 8. Contexto will surface it.

6 steps. Critical halts:

| Step | Gate | Decision guide |
|---|---|---|
| 3 - Investigate REST | Surfaces gaps between UI-sourced data and REST DPU. | Accept gaps only if Contexto explains the mapping. Reject if any required field is unmapped. |
| 4 - Plan approval | Reusable Processing Plan + Constructor IOP tree. | Scan for "magic" WIDs - if Contexto pulled a WID from thin air rather than from the WIP, reject. |

## Stage 6 - Smoke test (still in `~/contexto` window)

From the Contexto chat, the agent will have `suv_rest_call` available. Exact calls:

```
# GET collection
suv_rest_call GET /<service-prefix>/v1/candidateTags

# GET one
suv_rest_call GET /<service-prefix>/v1/candidateTags/<WID>

# POST create
suv_rest_call POST /<service-prefix>/v1/candidateTags  body={shape from schema-design-wip.md}

# PATCH update
suv_rest_call PATCH /<service-prefix>/v1/candidateTags/<WID>  body={patch}

# DELETE
suv_rest_call DELETE /<service-prefix>/v1/candidateTags/<WID>
```

The exact service prefix is decided in Stage 2 step 5 (representation design) - check `schema-design-wip.md`.

**403 on any of these** = domain security on the newly-created Service Operation. Not a bug in the build. Request the domain via SUV admin OR accept the service operates read-only until domain is wired. This is the same trap as the Interview Feedback API - already captured in [`xo-developer-agent.md`](../../.cursor/agents/xo-developer-agent.md) Advisory Pattern 9.

## Stage 7 - Return to PM workspace

Close the `~/contexto` Cursor window. Come back to this one. Summarise in a reply message:

- Final WIDs for: Service, Service Collection Resource, each Service Operation
- Any SUV writes that rolled back or were left in inconsistent state
- Which HITL gates were unexpected (feeds Stage 8)

**Do NOT write to MISSION_LOG.md**. xo-builder isolation contract applies.

## Stage 8 - Meta follow-up (deferred)

After Stage 7 debrief, if the execution surfaced learnings worth codifying, open a fresh PM-workspace session with:

> Route through 090-agent-improvement-advisor: draft spec for a new xo-builder mode wrapping schema-analysis / schema-implementation / processing-creation. Inputs from candidate-tags execution debrief.

090 decides architectural fit before any implementation. Do not bundle with this execution.

## Known blockers captured during Stage 0/1

1. **`cursor-app-control.move_agent_to_root` assumes `main` branch**. Fails on master-default repos. The tool's first action is a git fetch of `refs/heads/main` from origin, which returns `fatal: couldn't find remote ref`. No tool argument to override. *Workaround used: manual File > Open Folder.*
2. **No push permission to `cle/contexto.git`**. Cannot create a `refs/heads/main` on origin to satisfy the tool. Non-fatal for this workflow; relevant if any future automation tries to migrate Contexto branches.
3. **GHE PAT was logged to chat output** during `git remote -v` inspection. **Rotated?** Track yes/no here: [ ]

## Engineering notes

- Dev SUV only. Every SUV write is permanent on `i-01b78c8ca923546e8`.
- Contexto operates under its own rules (`.cursorrules` at `~/contexto`) and BMAD workflow discipline. Those are in effect for Stages 2-6; PM workspace rules are not.
- If Stages 4 or 5 partially execute and then halt, the WIP + `events.jsonl` is the truth. Do not hand-edit the SUV via Workday UI to "fix" things - rollback through the audit trail or accept the partial state.
- Rough timing: Stage 2 = 30-60 min, Stage 3 = 30-45 min, Stage 4 = 60-120 min, Stage 5 = 45-90 min, Stage 6 = 15 min. Full chain 3-6 hours real time.
