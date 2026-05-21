# Product Manager Agent Workspace

## Overview
This is a modular, agentic workspace for Senior Product Managers built for Cursor v2.6. It orchestrates multiple MCPs (see `.cursor/rules/000-master-orchestrator.mdc` for the canonical roster) to automate and enhance product management workflows.

## Capabilities

### 🎯 Core Functions

Rules live under [`.cursor/rules/`](.cursor/rules/); reusable **workflows** live as **skills** under [`.cursor/skills/`](.cursor/skills/) (full inventory: [`.cursor/skills/README.md`](.cursor/skills/README.md)). Some of the main ones wired into this workspace:

- **Net-new story gap review** — **`/user-story-gap-review`**: Jira-scoped pre-build gap analysis with Salomon (internal KB + Jira index + Slack archive), Deployment Agent, read-only **XO MCP**, and signal-gated **Peanut** for the Dev lens; publishes a **seven-column** Confluence Storage report (exec summary, verdicts, suggested missing BDD). See [`user-story-gap-review/SKILL.md`](.cursor/skills/user-story-gap-review/SKILL.md).
- **Customer issue triage** — Classify customer-reported Jiras (WAD vs config vs bug) with evidence, XO grounding, optional Peanut, and batch closure guidance. See [`customer-issue-triage/SKILL.md`](.cursor/skills/customer-issue-triage/SKILL.md).
- **HRREC Jira story descriptions** — Standard recruiting story body layout and golden-draft alignment. See [`jira-recruiting-story-description/SKILL.md`](.cursor/skills/jira-recruiting-story-description/SKILL.md).
- **PRDs & specs** — **`/write-prd`**: structured PRDs under `docs/prds/` using the **200** template rule; Confluence when MCPs allow. See [`write-prd/SKILL.md`](.cursor/skills/write-prd/SKILL.md).
- **Market intelligence & framing** — Research and competitive analysis (**100–199** rules); **`/jtbd`** ([`jtbd-analysis`](.cursor/skills/jtbd-analysis/SKILL.md)) and **`/value-metrics`** ([`value-metrics`](.cursor/skills/value-metrics/SKILL.md)); Six-Hats / sequential thinking MCPs where enabled.
- **Data & dashboards** — Pharos-oriented SQL patterns and dashboard scaffolding for **@data-scientist**. See [`pharos-analytics`](.cursor/skills/pharos-analytics/SKILL.md) and [`create-dashboard`](.cursor/skills/create-dashboard/SKILL.md).
- **Design & slides** — Figma and Canvas Kit flows in **`design/`** (**300–499** rules); branded Workday decks via **`/slide-writer`**. See [`slide-writer/SKILL.md`](.cursor/skills/slide-writer/SKILL.md).
- **Workday XO / SUV engineering** — Guarded XO, ModulR, and REST work on a dev SUV (**`xo-builder`**); PR comment triage for XO branches (**`xo-pr-comment-triage`**); post-edit UI smoke via **`@qa-engineer`** and [`suv-smoke-test`](.cursor/skills/suv-smoke-test/SKILL.md).
- **Rituals & comms** — **`/morning-roundup`** ([`morning-roundup`](.cursor/skills/morning-roundup/SKILL.md)); Slack drafting / triage (**500** rules); deep internal Q&A patterns via [`ask-consultant`](.cursor/skills/ask-consultant/SKILL.md) where Salomon is configured.
- **Backlog & execution** — Story mapping, backlog refinement, story validation, and Jira/PR automation (**400–499** rules + MCPs when connected).
- **Workspace hygiene** — **`/workspace-audit`** and **`/cleanup`** for repo health and stale artefacts. See [`workspace-audit`](.cursor/skills/workspace-audit/SKILL.md) and [`cleanup-old-artifacts`](.cursor/skills/cleanup-old-artifacts/SKILL.md).

**Orchestration**: MCP roster and agent routing are defined in [`.cursor/rules/000-master-orchestrator.mdc`](.cursor/rules/000-master-orchestrator.mdc).

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
