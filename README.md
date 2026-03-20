# Product Manager Agent Workspace

## Overview
This is a modular, agentic workspace for Senior Product Managers built for Cursor v2.6. It orchestrates 12 active MCPs to automate and enhance product management workflows.

## Capabilities

### 🎯 Core Functions
- **Market Intelligence**: Analyze research using Notion search and Six-Hats thinking
- **PRD Creation**: Generate and publish product requirements to Confluence
- **Execution Planning**: Create Jira tickets and GitHub PRs using Jeff Patton story mapping
- **Design Integration**: Leverage Figma and Canvas Kit for UI work
- **Presentation Generation**: Create branded Workday slide decks automatically
- **Communication**: Draft Slack responses and triage messages

### 🔌 Active MCPs (12)
1. **Notion** - Knowledge base and task management
2. **Figma** - Design integration and Code Connect
3. **Slack** - Team communication
4. **Jira/GHE** - Issue tracking and version control
5. **Confluence** - Documentation
6. **Deployment Agent** - Workday-specific validations
7. **Canvas Kit** - Workday UI component library
8. **Slide Deck** - Branded presentation generation
9. **Tableau** - Data visualization
10. **Sequential Thinking** - Structured analysis
11. **Six Hats Thinking** - Decision frameworks
12. **Lightdash** - Metrics and analytics

## Folder Structure

```
.
├── .cursor/rules/       # MDC rule files
├── research/            # Market analysis and competitive intel
├── docs/prds/          # Product requirements documents
├── design/             # Figma links and Canvas Kit work
├── inbox/              # Slack messages for triage
├── MISSION_LOG.md      # Project state tracking
├── scratchpad.md       # Sequential thinking workspace
└── README.md           # This file
```

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
- The Master Orchestrator coordinates all agents automatically
- Each rule has specific triggers and globs for automatic activation

---

**Built for Cursor v2.6** | **Powered by 12 MCPs** | **Optimized for Workday PMs**
