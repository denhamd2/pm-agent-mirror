# Full-file extraction — 2-Way Email Recruiting (`HpAOHGAeXBORpHnyhsCMja`)

This folder captures a **metadata-first** full-file pass over the canonical Workday Recruiting reference file ([`330-figma-integration.mdc`](../../.cursor/rules/330-figma-integration.mdc)).

## What was pulled from Figma

| Artifact | Description |
|----------|-------------|
| [`raw-metadata-page-cover.xml`](raw-metadata-page-cover.xml) | `get_metadata` snapshot for canvas **Cover Page** (`nodeId=0:1`). |
| [`raw-metadata-page-mvp-26r2.xml.gz`](raw-metadata-page-mvp-26r2.xml.gz) | Gzip of `get_metadata` for canvas **↪ MVP 26R2+ Designs** (`nodeId=4:7577`, ~19k lines). Use this to re-run inventory without calling MCP. |
| [`screen-inventory.md`](screen-inventory.md) | Human-readable table of **deduplicated** artboards + skipped duplicates. |
| [`screen-inventory.json`](screen-inventory.json) | Same data for tooling. |
| [`pending-design-context.json`](pending-design-context.json) | Queue of `nodeId` values for `get_design_context` (screenshots + reference code). |
| [`screens/`](screens/) | One folder per kept screen with `README.md` (deep link + MCP snippet). |

## Pages in scope

Only canvases for which we successfully retrieved **`get_metadata`** during this run:

1. **Cover Page** (`0:1`) — single artboard `208:10116`.
2. **↪ MVP 26R2+ Designs** (`4:7577`) — primary content page (matches your seed URL).

This file may contain **additional Figma pages** (other `node-id`s). Without listing the whole document via REST or extra MCP calls, those pages are **not** included here. To extend: call `get_metadata(fileKey, pageNodeId)` for each canvas, save XML next to the files above, and run [`scripts/figma_screen_inventory.py`](../../scripts/figma_screen_inventory.py) per page.

## Deduplication rules

Implemented in [`scripts/figma_screen_inventory.py`](../../scripts/figma_screen_inventory.py):

- Consider **direct children** of `<canvas>` that pass artboard heuristics (exclude wide ~111px-tall section banners and tiny frames).
- Collapse duplicates using **`normalize(name) + width × height`**; keep the **first** `nodeId` in sorted-id order within each group.

## Design context (`get_design_context`)

During implementation, **Figma MCP returned a View-seat rate limit** on further tool calls, so **per-screen MCP extracts are not committed** here. When quota resets (or seat/plan changes), run `get_design_context` for each id in [`pending-design-context.json`](pending-design-context.json) and save output under the matching [`screens/`](screens/) folder.

Reference: [Figma plans / MCP usage](https://www.figma.com/files/700476218173909198/recents-and-sharing?upgrade_request_type=expert&entry_point=mcp_rate_limit_deeplink) (message surfaced by MCP at limit).

## Regenerate inventory

```bash
python3 scripts/figma_screen_inventory.py \
  docs/figma-extraction-2way-email-2024/raw-metadata-page-mvp-26r2.xml.gz \
  --write docs/figma-extraction-2way-email-2024/
```

If you regenerate from the MVP gzip only, **re-merge** the **Cover Page** section into `screen-inventory.md` / `screen-inventory.json`, restore [`screens/cover-page-208-10116/`](screens/cover-page-208-10116/), and prepend `208:10116` to `pending-design-context.json` (or extend `figma_screen_inventory.py` to accept multiple XML inputs).

## Suggested flow (reference)

See [`flow-overview.mmd`](flow-overview.mmd) for a lightweight navigation map (not authoritative IA—only ordering by design sections).
