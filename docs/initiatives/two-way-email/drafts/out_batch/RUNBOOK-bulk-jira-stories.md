# Runbook: bulk-create two-way-email story map issues (Jira)

Bulk-create for [`story-shards/`](../story-shards) on epic **[HRREC-82977](https://jira2.workday.com/browse/HRREC-82977)** is **complete** (as of 2026-05-13): `story_000` … `story_037` all have keys in [`story-jira-mapping.json`](story-jira-mapping.json). This runbook remains for **re-runs, dedup checks, and recovery** if a POST must be retried.

Original scope: **`story_000`** was first created as **[HRREC-91980](https://jira2.workday.com/browse/HRREC-91980)**; **`story_001` … `story_037`** via **`user-jira-ghe` → `executeApi`** (wrap files + invoke batches). There is **no** `wrap_000.txt`.

## Preconditions

- Jira MCP authenticated (`user-jira-ghe`). If tools return **`Session not found. Please re-initialize`**, open Cursor MCP settings, **restart or re-authenticate** the `user-jira-ghe` server, then continue (parallel sub-agents can invalidate the parent session—prefer **sequential** `executeApi` from one agent after a fresh MCP init).

## Progress log (manual)

| Date | Note |
|------|------|
| 2026-05-13 | `story_000` → [HRREC-91980](https://jira2.workday.com/browse/HRREC-91980). `story_001` → [HRREC-91981](https://jira2.workday.com/browse/HRREC-91981). `story_002`–`story_037` → [HRREC-91983](https://jira2.workday.com/browse/HRREC-91983) … [HRREC-92018](https://jira2.workday.com/browse/HRREC-92018) (sequential `executeApi` after MCP session OK). Canonical mapping: [`story-jira-mapping.json`](story-jira-mapping.json). |

- Epic, component **Candidate Two-Way Messaging**, Scrum **HRREC-Team 007** (`customfield_15100`), blank AC wiki grid (`customfield_23317`), assignee **`david.denham`**, labels split from comma-separated shard `labels` — all encoded in the generated inner POST (see prior session).

## Dedup: do not create duplicates

| Jira key | Role |
|----------|------|
| HRREC-91974 | Hand-filed empty-state placeholder ([`jira-first-placeholder-HRREC-empty-state.md`](../jira-first-placeholder-HRREC-empty-state.md)) |
| HRREC-91975 | Hand-filed notification story ([`jira-second-story-HRREC-notification.md`](../jira-second-story-HRREC-notification.md)) |
| HRREC-91978, HRREC-91979 | Earlier bulk wave (confirm on epic before re-POST) |
| HRREC-91980 | **`story_000`** — already created |

Shards **`story_001`–`story_003`** mention **HRREC-91946 / 91947 / 91948** in summaries (init references). New POSTs still create **new** keys; only skip if the PM decides those narratives are already covered elsewhere.

## Artifacts (this folder)

| Path | Purpose |
|------|---------|
| [`story-jira-mapping.json`](story-jira-mapping.json) | Shard ↔ summary ↔ `jira_key` (update after each successful POST) |
| [`mcp_wrap_b64/wrap_NNN.txt`](mcp_wrap_b64/wrap_001.txt) | One-line `executeApi` body for shard `story_NNN` (001–037). Paths in JSON are relative to **this** `out_batch/` directory. |
| [`generate-story-jira-mapping.py`](generate-story-jira-mapping.py) | Regenerate mapping JSON from shards; `--merge` keeps existing keys |

Refresh summaries without losing keys:

```bash
cd "$(dirname "$0")"
python3 ./generate-story-jira-mapping.py --merge ./story-jira-mapping.json
```

## Single-story execution (parent or any agent)

1. Load the one-line script (no line-number prefix):

   ```bash
   CODE="$(cat "$(pwd)/mcp_wrap_b64/wrap_009.txt")"
   # pwd = .../docs/initiatives/two-way-email/drafts/out_batch
   ```

2. Call **`user-jira-ghe` / `executeApi`** with argument `{ "code": <exact contents of $CODE> }` (paste or tool; the file is one line, ~11.5k chars).

3. On **201**, read `data.key` (or equivalent) from the response; set in `story-jira-mapping.json` for the matching `shard` (`story_009`), set `status` to `created`, `jira_url` to `https://jira2.workday.com/browse/<KEY>`.

4. On **4xx/5xx**, log `summary` + body; retry once after a few seconds (rate limit).

## Parallel sub-agents (recommended)

Use **four** workers to cap concurrency (~10 issues each). Each worker only touches its index range and updates **only** those rows in `story-jira-mapping.json` (or returns a JSON snippet for the parent to merge).

| Worker | `wrap_NNN.txt` range | Shards |
|--------|----------------------|--------|
| A | 001–009 | story_001 … story_009 |
| B | 010–018 | story_010 … story_018 |
| C | 019–027 | story_019 … story_027 |
| D | 028–037 | story_028 … story_037 |

**Rules:** one POST per shard; if a key already exists for that shard, skip; stagger starts by ~2s if you see 429.

### Copy-paste: Worker A (001–009)

```text
You are creating Jira stories for epic HRREC-82977 using user-jira-ghe executeApi only.
For each N in 001,002,...,009:
  - Read the single-line file (absolute path):
    /Users/david.denham/product-manager-agent/docs/initiatives/two-way-email/drafts/out_batch/mcp_wrap_b64/wrap_NNN.txt
  - Call executeApi with arguments { "code": "<entire file contents, one line>" }.
  - Record { "shard": "story_NNN", "jira_key", "ok", "status" } for each call.
Return a compact JSON array of results. Do not recreate HRREC-91974,91975,91978,91979,91980.
```

### Worker B (010–018)

Same as A, with `010`–`018` and paths `wrap_010.txt` … `wrap_018.txt`.

### Worker C (019–027)

Same with `019`–`027`.

### Worker D (028–037)

Same with `028`–`037`.

After all workers finish, the **parent** runs:

```bash
python3 ./generate-story-jira-mapping.py --merge ./story-jira-mapping.json
```

then merges the returned `jira_key` values into `stories[]` (or hand-edits the file), and commits.

## Field reference (REST)

- Epic link: `customfield_10006` = `"HRREC-82977"`
- Scrum team: `customfield_15100` = `[{ "id": "122500" }]`
- AC: `customfield_23317` = blank wiki table (header + three empty rows per 430 Step 6)

## Sandbox reminders (executeApi)

- Use `const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;` (no global `AsyncFunction`).
- Prefer the **one-line** `wrap_NNN.txt` payloads here; they wrap inner POST logic without hitting single-argument size limits.
