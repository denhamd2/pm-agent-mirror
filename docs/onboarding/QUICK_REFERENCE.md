# Quick Reference Guide

## Agent Activation Triggers

### Master Orchestrator (000)
- **Always Active**: Reads MISSION_LOG.md, routes work, maintains state
- Mention: "what's the status", "orchestrate", "coordinate"

### Market Intelligence (100)
- **Triggers**: Files in `/research/`, "analyze research", "competitive analysis"
- **MCPs**: Six-Hats, Sequential Thinking
- **Outputs**: Analysis reports to `/research/`

### Slide Generator (110)
- **Triggers**: "create slides", "make presentation", "deck"
- **MCPs**: Slide Deck, parse_template, create_presentation
- **Outputs**: PowerPoint to `~/Downloads/`

### PRD Specialist (200)
- **Triggers**: "create PRD", "write requirements", files in `/docs/prds/`
- **MCPs**: Deployment Agent, Confluence
- **Outputs**: PRDs to `/docs/prds/` and Confluence

### Execution Planner (300)
- **Triggers**: "plan execution", "create tickets", "story mapping"
- **MCPs**: Jira/GHE, Confluence
- **Outputs**: Jira epics/stories, story maps to `/docs/prds/`

### Canvas Designer (400)
- **Triggers**: Figma URLs, "design", "Canvas Kit", files in `/design/`
- **MCPs**: Figma, Canvas Kit, Deployment Agent
- **Outputs**: Implementation code, design docs to `/design/`

### Slack Responder (500)
- **Always Active**: Auto-responds to files in `/inbox/`
- **MCPs**: Slack, Confluence, Jira/GHE
- **Outputs**: Drafted Slack messages

## Common Workflows

### Research → PRD → Execution
1. Drop research files in `/research/`
2. Say "analyze this research" → Market Intelligence activates
3. Say "create PRD from analysis" → PRD Specialist activates
4. Say "plan execution" → Execution Planner creates Jira tickets

### Figma → Implementation
1. Share Figma URL
2. Canvas Designer extracts design context
3. Maps to Canvas Kit components
4. Generates implementation code

### Slack Triage
1. Copy Slack message to `/inbox/message.txt`
2. Slack Responder auto-drafts reply
3. Review and send via Slack MCP

### Create Presentation
1. Say "create slides about [topic]"
2. Slide Generator structures deck
3. Outputs branded PowerPoint to ~/Downloads/

## File Locations

### Inputs
- `/research/` - Market research, competitive analysis
- `/inbox/` - Slack messages for triage
- `/docs/prds/` - PRD drafts and specifications

### Outputs
- `/research/` - Analysis reports
- `/docs/prds/` - Final PRDs, story maps
- `/design/` - Design documentation
- `~/Downloads/` - PowerPoint presentations
- `MISSION_LOG.md` - Mission state tracking
- `scratchpad.md` - Sequential thinking workspace

## Cursor local data (not in git)

Under `~/.cursor/projects/<project-id>/`, the IDE may create folders such as **`agent-tools/`** for ephemeral agent or shell output. That tree is **not** part of this repository. An empty `agent-tools` folder can be deleted locally; Cursor may recreate it. See the root [README.md](../../README.md) (Sharing with colleagues).

## MCP Quick Reference

| MCP | Server Name | Primary Use |
|-----|-------------|-------------|
| Figma | `plugin-figma-figma` | Design integration |
| Slack | `plugin-slack-slack` | Communication |
| Jira/GHE | `user-jira-ghe` | Tickets, repos |
| Confluence | `user-confluence-mcp` | Documentation |
| Deployment Agent | `user-deployment-agent` | Workday validation |
| Canvas Kit | `user-canvas-kit-mcp` | UI components |
| Slide Deck | `user-slide-deck-mcp` | Presentations |
| Tableau | `user-tableau-mcp` | Data viz |
| Sequential Thinking | `user-sequential-thinking` | Analysis |
| Six Hats | `user-six-hats-thinking` | Decisions |
| Lightdash | `user-lightdash-docs` | Metrics |

## Tips

- **Check status**: Say "what's the status" to see active missions
- **Sequential thinking**: Use `@sequential-thinking` or mention it for complex analysis
- **Mission tracking**: All work is logged in MISSION_LOG.md
- **Handoffs**: Agents automatically hand off to each other
- **Always-on**: Master Orchestrator and Slack Responder are always active

## Emergency Commands

- **"Reset MISSION_LOG"**: Clears all active missions
- **"Archive [mission]"**: Moves mission to completed
- **"Status report"**: Full summary of all active work
- **"Stop all agents"**: Pauses all specialist agents

---

**Version**: 1.0  
**Last Updated**: Tuesday Mar 17, 2026
