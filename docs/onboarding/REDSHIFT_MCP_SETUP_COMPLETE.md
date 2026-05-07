# Redshift MCP Setup Complete! 

## ✅ What I Fixed

The Redshift MCP was trying to install from npm Artifactory (which didn't have the package), but I found it's actually maintained by Akash Majumder in a GHE repository.

## What I Did

1. **Found the real source**: Located the Redshift MCP in Akash's GHE repo: `https://ghe.megaleo.com/akash-majumder/redshift-mcp-server`

2. **Cloned and installed it**:
   - Cloned to `~/mcp-servers/redshift-mcp-server/`
   - Installed `uv` (Python package manager)
   - Installed all Python dependencies
   - Made scripts executable

3. **Updated your Cursor configuration**: Changed from the broken npm approach to using the local installation

## How It Works Now

Your `~/.cursor/mcp.json` now points to:
```
~/mcp-servers/redshift-mcp-server/run_mcp_server_uv.sh
```

This uses:
- **Auth**: `okta2aws` (your Okta AWS credentials)
- **Region**: `us-west-2`

## Next Steps

**Restart Cursor** (completely quit and reopen) and the Redshift MCP should connect automatically.

## How to Use It

Once Cursor restarts, you can ask me:
- "List all Redshift schemas"
- "Show me tables in the recruiting_analytics schema"
- "Query time_to_fill metrics from Redshift"

The MCP will query the **Tableau public views** that live in Redshift - bypassing the disabled VizQL limitation!

## Troubleshooting

If it doesn't connect after restarting Cursor:
1. Check if your Okta AWS session is active: `AWS_PROFILE=okta2aws aws sts get-caller-identity`
2. If expired, refresh with: `okta2aws --profile okta2aws`
3. Check the MCP logs in Cursor Settings → Tools & MCP → redshift-mcp-server

---

**You're all set!** The Redshift MCP is installed and configured. Just restart Cursor and you'll be able to query your Tableau data.
