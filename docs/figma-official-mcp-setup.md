# Official Figma MCP (Cursor)

This workspace uses **Figma’s official MCP server** (remote), not third-party Figma bridges.

**Docs:** [Figma MCP – remote server installation](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) · [Local (desktop app) installation](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/) · [Tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)

## What is configured

In `~/.cursor/mcp.json`, server key **`figma`**:

```json
"figma": {
  "type": "http",
  "url": "https://mcp.figma.com/mcp"
}
```

This matches Figma’s **remote** MCP endpoint. The first time you use it, Cursor should prompt you to **Connect / authenticate** with Figma (OAuth).

### Preferred Cursor setup (Figma plugin)

Figma recommends installing their Cursor plugin (MCP + skills):

- In Cursor agent chat, run: **`/add-plugin figma`**

See: [Remote server – Cursor](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#cursor)

## Desktop-only option (no OAuth remote)

If you prefer the server that runs inside the **Figma desktop app**:

1. Figma desktop → open a Design file → **Dev Mode** (Shift D).
2. In the inspect panel, **Enable desktop MCP server** (runs at `http://127.0.0.1:3845/mcp`).
3. In `mcp.json`, you can add a second entry, for example:

```json
"figma-desktop": {
  "url": "http://127.0.0.1:3845/mcp"
}
```

(Use **either** remote **`figma`** or **`figma-desktop`** most of the time, so you are not confused by two sources.)

## Legacy local `figma-mcp` (removed)

If you previously had **`figma-mcp`** pointing at `workday-figma-mcp` and saw:

`Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@astra/create-mcp-server-engine'`

that local server was mis-built or missing dependencies. **Use only official `figma`** (remote HTTP above). Re-add a local stdio server only if you maintain a working build and need Workday-specific tools.

- **`figma`** – Official Figma MCP (this doc) – **keep this**.
- **`figma-mcp` / `workday-figma-mcp`** – **removed** from `~/.cursor/mcp.json` to stop startup errors; fix `npm install` in that repo if you ever need it again.

## Removed integration

The unofficial **Grab** package (`cursor-talk-to-figma-mcp` / `talk-to-figma`) is **not** used here. That required a WebSocket server and a separate Figma plugin; the official MCP replaces that pattern for typical design-in-IDE workflows.
