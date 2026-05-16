# Two-way email initiative — reference artefacts

Static or **frozen** files that support agents without re-fetching large corpora every session.

| File | Purpose |
|------|---------|
| [WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md](WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) | **Frozen pattern corpus** for `/user-story-gap-review` WhatsApp companion: curated **Captured excerpts** + **manifest** of Story/Bug keys. **Default:** agents read this file only (**manifest-only**—no live Jira for WhatsApp each run). Opt-in **`WhatsApp live delta`** / **`WhatsApp refresh corpus`** runs a **live delta with snapshot** per [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md). See this file’s header and [COMPANION_WHATSAPP_EPICS.md](../COMPANION_WHATSAPP_EPICS.md). |

**Not** a substitute for the PRD or Jira as the system of record for **current** WhatsApp delivery state; the snapshot is **pattern archaeology** with an explicit `snapshot_as_of` date.

## Maintenance — when to refresh the WhatsApp snapshot

Re-run a full Story+Bug inventory (same JQL as [COMPANION_WHATSAPP_EPICS.md](../COMPANION_WHATSAPP_EPICS.md)), merge keys, and update [WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md](WHATSAPP_COMPANION_CORPUS_SNAPSHOT.md) when **any** of the following is true:

- **New or removed keys** under the five companion epics (use **`WhatsApp live delta`** / **`WhatsApp refresh corpus`** in a gap-review run, or `diff_whatsapp_companion_manifest.py` against a live export, to see drift before you bump the manifest).
- **Material description/AC changes** on keys you rely on for **Captured excerpts** (refresh those sections, or run a gap review with **`WhatsApp live delta`** and refresh **`getTicketDetails`** for affected keys only).
- **Epic linkage changes** (issues moved between epics or `Epic Link` / parent field fixes)—reconcile counts vs `summarizeJiraEpic` and update the manifest.
- **HRREC-82870** or **HRREC-91933** gains linked Story/Bug work—add those keys; until then, a **live delta** run (or JQL export) still shows expected **0** children for those epics.

Until the manifest is updated, set **`manifest_complete: false`** so agents fall back to **full live** corpus rules and do not over-claim snapshot completeness for manifest-only runs.

**Optional drift check:** [`../drafts/diff_whatsapp_companion_manifest.py`](../drafts/diff_whatsapp_companion_manifest.py) compares the snapshot **Manifest** section to a live key list (text file or JSON export from `searchJiraTickets`). Exit **1** if keys differ—use before bumping `snapshot_as_of` / `manifest_complete`.
