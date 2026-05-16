# Lightdash and Peanut MCP Installation Notes

## Status Summary

**Repositories cloned**: ✅
- `~/mcp-servers/lightdash-public/` (Lightdash full application with MCP endpoint)
- `~/mcp-servers/peanut-mcp/` (Peanut bug triage MCP)

**MCP configuration**: ✅ (with placeholders)
- Both MCPs added to `~/.cursor/mcp.json` with documentation comments
- Credentials required before activation (see below)

**Workflow integration**: ✅
- Orchestrator updated with routing logic for both MCPs
- 130-pmf-slide-generator: Lightdash metrics integration documented
- 200-prd-template: Lightdash success metrics integration documented
- 315-design-brief-creation: Peanut code search integration documented
- 100-market-intelligence: Peanut bug analysis integration documented

**Dashboard updated**: ✅
- AgentFlowTab.tsx now shows 13 MCPs (added Lightdash, Peanut, Browser)
- Node metadata updated to reflect optional MCP usage

---

## Required Actions to Complete Installation

### 1. Lightdash Setup

**What it is**: Lightdash is Workday's internal BI tool. The cloned repo contains the full Lightdash application which exposes an MCP HTTP endpoint at `/api/v1/mcp`.

**Your current config** (`~/.cursor/mcp.json` line 68-73):
```json
"lightdash-public": {
  "type": "http",
  "url": "WORKDAY_LIGHTDASH_URL/api/v1/mcp",
  "headers": {
    "Authorization": "ApiKey LIGHTDASH_PAT_TOKEN"
  }
}
```

**To activate**:
1. Find your Workday Lightdash instance URL (e.g., `https://lightdash.workday.com`)
2. Generate a Personal Access Token:
   - Log into Lightdash → Settings → Personal Access Tokens → Generate New Token
3. Update `~/.cursor/mcp.json`:
   - Replace `WORKDAY_LIGHTDASH_URL` with your instance URL
   - Replace `LIGHTDASH_PAT_TOKEN` with your generated PAT
4. Restart Cursor

**Use cases**:
- Query recruiting metrics in PMF decks (130-pmf-slide-generator)
- Data-driven success metrics in PRDs (200-prd-template)
- Real-time KPIs: time-to-fill, funnel conversion, adoption rates

---

### 2. Peanut Setup

**What it is**: Peanut is a Workday MCP for bug triage, root cause analysis, code search, and commit analysis.

**Current status**: ❌ **Requires build and authentication**

The cloned repo requires Workday Artifactory access to install dependencies (Workday-internal packages like `@astra/create-mcp-server-engine`).

**Your current config** (`~/.cursor/mcp.json` line 74-82):
```json
"peanut-mcp": {
  "command": "node",
  "args": ["/Users/david.denham/mcp-servers/peanut-mcp/dist/cli.js"],
  "env": {
    "JIRA_TOKEN": "YOUR_JIRA_PAT",
    "GHE_TOKEN": "YOUR_GHE_TOKEN"
  }
}
```

**To activate**:

#### Option A: Use the automated installer (recommended)
The repo includes setup scripts that handle global installation from Artifactory:

```bash
cd ~/mcp-servers/peanut-mcp
./scripts/setup-cursor.sh
```

This will:
1. Install `@workday/peanut-mcp` globally from Artifactory
2. Prompt for your Jira and GHE tokens
3. Configure `~/.cursor/mcp.json` automatically

**Prerequisites**:
- Node.js 22+
- Artifactory npm access configured in `~/.npmrc`

If you don't have Artifactory access set up:
1. Follow [Workday workstation setup guide](https://uiplatform.workday.build/docs/learn/tutorials/setup/setup-your-workstation/#6-configure-npm-yarn-and-pnpm-for-artifactory-access) (Option #1)
2. Generate an Artifactory token and add to `~/.npmrc`

#### Option B: Manual build from local clone
```bash
cd ~/mcp-servers/peanut-mcp
# First, configure Artifactory access (see above)
npm install --legacy-peer-deps
npm run build
```

If `npm install` fails with an `ERESOLVE` peer-dependency error on `@modelcontextprotocol/ext-apps`, use `--legacy-peer-deps` as above.

Then update `~/.cursor/mcp.json` with:
- Your Jira PAT from https://jira2.workday.com/secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens
- Your GHE token from https://ghe.megaleo.com/settings/tokens (scopes: `repo`, `admin:org` → `read:org`)

#### Option C: Use Peanut Skills (lightweight alternative)
If you don't need the full MCP server, Peanut also ships as lightweight Cursor skills:

```bash
curl -fsSL https://docs.workday.build/UIC/peanut-mcp/setup-bug-triage-skill.sh | bash
```

This installs to `~/.cursor/skills/bug-triage/` with no server, no tokens, and works with local git tools.

**Use cases**:
- Code search during design (315-design-brief-creation)
- Bug pattern analysis for competitive gaps (100-market-intelligence)
- Root cause analysis for customer-reported issues
- **Customer Issue Triage** (`.cursor/skills/customer-issue-triage/SKILL.md`): optional **Step 4p** when Step 1c `peanut_eligible` is true—requires `user-peanut-mcp` connected and `~/.peanut/config.json` with repo roots (`previewConfig` / `collectBugData`). Peanut complements XO; it does not replace SUV metadata inspection.

**Local clones and history:** `git.repos` in `~/.peanut/config.json` must point at **real** `.git` directories on disk. **Shallow clones** (`git clone --depth 1`) hide older commits—run **`git fetch --unshallow`** in each repo root (or re-clone without `--depth`) before relying on Peanut for historical commit windows. For **WhatsApp companion vs 2WE** optional anchor passes (3–8 keys), megaleo roots such as **`UIC/sliding-side-panel`**, **`recruiting/two-way-messaging`**, and **`xo-code-reviews/hrrec`** are typical—see [`.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md`](../../.cursor/skills/user-story-gap-review/reference-companion-whatsapp.md) (**Optional Peanut** + **Operator preflight**).

---

## Verification

After setup, verify both MCPs:

**Lightdash**:
```bash
curl -H "Authorization: ApiKey YOUR_PAT" \
  https://YOUR_LIGHTDASH_URL/api/v1/mcp \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

**Peanut**:
Ask in Cursor: "Search for CandidateCard component in recruiting-ui repo"

---

## Troubleshooting

### Lightdash 401/403
- PAT may be expired → Regenerate in Lightdash Settings
- URL may be incorrect → Verify with your team

### Peanut installation fails with `E403`
- Artifactory access not configured → Follow workstation setup guide
- `~/.npmrc` may need `WD_NPM_TOKEN` environment variable

### Peanut MCP not responding
- Jira/GHE tokens may be expired → Regenerate tokens
- Check `~/.cursor/mcp.json` paths and env vars are correct
- Restart Cursor after config changes
- **Customer Issue Triage skill**: if `collectBugData` returns `needsConfig`, create or fix `~/.peanut/config.json` (see Peanut repo docs) so repo paths resolve

---

## References

- **Lightdash repo**: `~/mcp-servers/lightdash-public/`
- **Peanut repo**: `~/mcp-servers/peanut-mcp/`
- **Peanut docs**: `~/mcp-servers/peanut-mcp/docs/` (getting started, troubleshooting, configuration)
- **Master orchestrator**: `.cursor/rules/000-master-orchestrator.mdc` (routing logic, MCP list)
- **Workflow wiring**: 130/200/315/100 rules updated with optional MCP usage

---

Last updated: 2026-04-09
