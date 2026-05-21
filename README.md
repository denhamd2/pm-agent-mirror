# Product Manager Agent Workspace

## Overview
This is a modular, agentic workspace for Senior Product Managers built for Cursor v2.6. It orchestrates multiple MCPs (see `.cursor/rules/000-master-orchestrator.mdc` for the canonical roster) to automate and enhance product management workflows.

## Capabilities

### 🎯 Core Functions

**Rules** steer how the AI behaves; **skills** are packaged workflows you can run on demand. Every skill has a short guide under `.cursor/skills/`; which tools plug in where is spelled out in `.cursor/rules/000-master-orchestrator.mdc`.

- **Pre-build story gap review** — Stress-test a batch of Jira stories before engineering commits and get a plain-language Confluence write-up (what is strong, what is risky, what tests are missing).
- **Customer issue triage** — Decide whether an incoming customer ticket is a real bug, a setup issue, or expected behaviour, and get suggested next steps for support or engineering.
- **Recruiting story descriptions** — Keep HRREC Jira stories in a consistent, recruiter-friendly format so delivery teams get the same quality of brief.
- **PRDs and specs** — Turn decisions into structured product requirement documents stored under `docs/prds/`.
- **Market and opportunity framing** — Competitive scans, jobs-to-be-done, and outcome-style metrics when you size or defend a bet.
- **Data and dashboards** — Recruiting analytics patterns and dashboard scaffolds when you need charts backed by internal data.
- **Design and slides** — Prototypes in the `design/` workspace and on-brand decks for stakeholder reviews.
- **Product config on a test tenant** — Careful, guarded changes to Workday configuration on a personal dev tenant, help closing out XO pull-request comments, and a quick browser smoke check after small UI or metadata edits.
- **Daily rhythm and Slack** — Morning roundups, drafted Slack replies, and “ask our internal knowledge base” style Q&A when those integrations are switched on.
- **Backlog and delivery** — Story mapping, backlog refinement, story quality checks, and Jira or GitHub automation when your integrations are connected.
- **Workspace housekeeping** — Optional health audit and cleanup of old generated files so the repo stays easy to navigate.

### 🔌 MCPs
The **Master Orchestrator** lists the active MCP roster (currently **21** integrated servers). Unsupported or optional plugins are not documented here—refer to `000-master-orchestrator.mdc` for names, purposes, and routing.

## Folder Structure

Handbooks and setup guides live under **[docs/onboarding/](docs/onboarding/README.md)** (start there after this README).

```
.
├── .cursor/rules/          # MDC rule files (agent behaviour)
├── docs/
│   ├── onboarding/         # QUICK_REFERENCE, INSTALLATION_NOTES, INDEX, setup docs
│   ├── templates/prd/     # Optional PRD template PDFs (see docs/templates/README.md)
│   ├── prds/               # Product requirements
│   └── ...
├── scripts/                # Automation, generate_presentation, cleanup, hooks
├── research/               # Market analysis and competitive intel
├── strategy/               # Strategy PDFs and context
├── functional-knowledge/   # Admin-guide PDF reference library
├── design/                 # Canvas Kit / Vite prototypes
├── inbox/                  # Slack triage samples
├── MISSION_LOG.md          # Project state tracking
├── scratchpad.example.md   # Copy to scratchpad.md (gitignored) for local notes
└── README.md               # This file
```

## Sharing with colleagues (MCP and secrets)

- **MCP passwords and tokens** belong in your user-level Cursor config (`~/.cursor/mcp.json`), not in this repository. The file [`.cursor/mcp.json`](.cursor/mcp.json) is gitignored so it is never pushed if you add a project-local copy.
- **Cursor IDE data (not in this repo):** under `~/.cursor/projects/<project-id>/`, folders such as `agent-tools/` may appear. They hold **ephemeral agent/shell output** for the IDE. You can delete an empty `agent-tools` folder locally; Cursor may recreate it. Do not treat that path as part of version control.
- Use [`.cursor/mcp.json.example`](.cursor/mcp.json.example) as a shape reference; copy to `~/.cursor/mcp.json`, fill in real values locally, and **never commit** secrets.
- See [docs/onboarding/INSTALLATION_NOTES.md](docs/onboarding/INSTALLATION_NOTES.md) and [docs/figma-official-mcp-setup.md](docs/figma-official-mcp-setup.md) for server-specific setup.

## Onboarding handbooks

Setup guides, quick reference, architecture, and validation live under **[docs/onboarding/](docs/onboarding/README.md)**. Start there after this README if you are onboarding a new machine or colleague.

## Getting Started

### For New Initiatives
1. Drop research files in `research/`
2. Mention "analyze this research" to trigger Market Intelligence agent
3. Use "create PRD" to generate requirements
4. Use "plan execution" to break down into Jira tickets

### For Design Work
1. Share Figma URLs or mention Canvas Kit components
2. The Canvas Designer agent will activate automatically
3. Code Connect mappings are created when needed

### For Communication
1. Drop Slack messages into `inbox/`
2. The Slack Responder will draft contextual replies
3. Review and send via the Slack MCP

## Rule System

Rules are located in `.cursor/rules/` and follow this numbering:
- **000-099**: Orchestration and coordination
- **100-199**: Research and intelligence
- **200-299**: Documentation and specifications
- **300-399**: Execution and delivery
- **400-499**: Design and UI
- **500-599**: Communication

## Design prototypes on Pages (optional)

GitHub Actions can publish **timestamped** static previews of `design/` to the **`gh-pages`** branch. See [docs/gh-pages-preview.md](docs/gh-pages-preview.md). To **open the latest preview in your browser** after the workflow runs, use **`./scripts/open-latest-design-preview.sh`** (`gh` CLI required).

## Git: auto-push to origin

After a one-time setup, **every `git commit` pushes your branch to `origin`** (your GHE remote). Saving files in the editor does **not** push until you commit.

```bash
./scripts/setup-git-hooks.sh
```

Details: [docs/git-auto-push.md](docs/git-auto-push.md). New clones should run the setup script once.

## Mission Log
Check `MISSION_LOG.md` for current project status, decisions, and handoffs.

## Tips
- Use `@sequential-thinking` for complex analysis
- Reference `@MISSION_LOG.md` to see current state
- Copy `scratchpad.example.md` to `scratchpad.md` for a local-only thinking space (not committed)
- The Master Orchestrator coordinates all agents automatically
- Each rule has specific triggers and globs for automatic activation

---

**Built for Cursor v2.6** | **MCP roster: see `000-master-orchestrator.mdc`** | **Optimized for Workday PMs**
