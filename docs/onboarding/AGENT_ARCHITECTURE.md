# Agent Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MASTER ORCHESTRATOR (000)                          │
│                                                                         │
│  • Reads MISSION_LOG.md for state                                      │
│  • Routes work to specialized agents                                   │
│  • Maintains mission state and handoffs                                │
│  • Always Active                                                       │
└────────────┬────────────────────────────────────────────────────┬──────┘
             │                                                    │
             │ Coordinates                                        │ Updates
             ▼                                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MISSION_LOG.md                                  │
│  • Active Missions                                                      │
│  • Decision Log                                                         │
│  • Handoff Queue                                                        │
│  • Status: Ready for Mission ✅                                         │
└─────────────────────────────────────────────────────────────────────────┘

             │
             │ Routes to:
             │
    ┌────────┴────────┬─────────┬─────────┬─────────┬─────────┐
    ▼                 ▼         ▼         ▼         ▼         ▼
┌─────────┐   ┌──────────┐ ┌─────┐  ┌─────────┐ ┌────────┐ ┌────────┐
│ Market  │   │  Slide   │ │ PRD │  │Execution│ │Canvas  │ │ Slack  │
│ Intel   │   │Generator │ │Spec │  │Planner  │ │Designer│ │Respond │
│  (100)  │   │  (110)   │ │(200)│  │  (300)  │ │ (400)  │ │ (500)  │
└────┬────┘   └────┬─────┘ └──┬──┘  └────┬────┘ └───┬────┘ └───┬────┘
     │             │           │          │          │          │
     │             │           │          │          │          │ Always
     │             │           │          │          │          │ Active
     │             │           │          │          │          │ on /inbox/
     │             │           │          │          │          │
     ▼             ▼           ▼          ▼          ▼          ▼

┌─────────┐   ┌──────────┐ ┌─────┐  ┌─────────┐ ┌────────┐ ┌────────┐
│/research│   │~/Download│ │/docs│  │  Jira   │ │/design/│ │Drafted │
│ reports │   │   .pptx  │ │/prds│  │ +GitHub │ │  docs  │ │messages│
└─────────┘   └──────────┘ └─────┘  └─────────┘ └────────┘ └────────┘


═══════════════════════════════════════════════════════════════════════════
                            MCP INTEGRATION LAYER
═══════════════════════════════════════════════════════════════════════════

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Notion    │  │    Figma     │  │    Slack     │  │   Jira/GHE   │
│              │  │              │  │              │  │              │
│ Search, KB,  │  │ get_design_  │  │ Send, React, │  │ Create epics,│
│ Tasks, Docs  │  │ context, Code│  │ Search msgs  │  │ stories, PRs │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Confluence  │  │  Deployment  │  │  Canvas Kit  │  │  Slide Deck  │
│              │  │    Agent     │  │              │  │              │
│ Create pages,│  │ Workday std  │  │ UI component │  │ Branded pptx │
│ Search docs  │  │ validation   │  │   library    │  │  generation  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Tableau    │  │  Sequential  │  │   Six Hats   │  │  Lightdash   │
│              │  │   Thinking   │  │              │  │              │
│  Data viz,   │  │ Multi-step   │  │ Decision     │  │ Metrics &    │
│  Dashboards  │  │  analysis    │  │ frameworks   │  │  Analytics   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘


═══════════════════════════════════════════════════════════════════════════
                           TYPICAL WORKFLOWS
═══════════════════════════════════════════════════════════════════════════

1. Research → Requirements → Execution
   ─────────────────────────────────────
   /research/file.md  →  Market Intel (100)  →  Six-Hats analysis
                          ↓
                     PRD Specialist (200)  →  Confluence + /docs/prds/
                          ↓
                     Execution Planner (300)  →  Jira epics/stories

2. Design → Implementation
   ────────────────────────
   Figma URL  →  Canvas Designer (400)  →  get_design_context
                      ↓
                 Canvas Kit mapping  →  Implementation code
                      ↓
                 Code Connect  →  /design/ docs

3. Presentation Generation
   ────────────────────────
   "Create slides"  →  Slide Generator (110)  →  parse_template
                           ↓
                      slides_spec.json  →  create_presentation
                           ↓
                      ~/Downloads/deck.pptx

4. Slack Triage (Auto)
   ───────────────────
   /inbox/message.txt  →  Slack Responder (500)  →  Auto-activates
                              ↓
                         Search Notion/Confluence/Jira
                              ↓
                         Draft contextual reply


═══════════════════════════════════════════════════════════════════════════
                         HANDOFF PATTERNS
═══════════════════════════════════════════════════════════════════════════

Market Intel (100)  ──→  PRD Specialist (200)
                    ──→  Slide Generator (110)

PRD Specialist (200)  ──→  Execution Planner (300)
                      ──→  Slide Generator (110)

Execution Planner (300)  ──→  Canvas Designer (400)
                         ──→  Slide Generator (110)

Canvas Designer (400)  ──→  Execution Planner (300)

All agents  ──→  Master Orchestrator (000)  ──→  MISSION_LOG.md


═══════════════════════════════════════════════════════════════════════════
                           KEY FILES
═══════════════════════════════════════════════════════════════════════════

MISSION_LOG.md            - Mission state, decisions, handoffs
scratchpad.md             - Sequential thinking workspace
README.md                 - Capabilities overview
QUICK_REFERENCE.md        - Trigger commands
INITIALIZATION_SUMMARY.md - This document
AGENT_ARCHITECTURE.md     - Visual architecture (this file)

.cursor/rules/
├── 000-master-orchestrator.mdc   (4.9KB)
├── 100-market-intelligence.mdc   (5.5KB)
├── 110-slide-generator.mdc       (9.2KB)
├── 200-prd-specialist.mdc        (11KB)
├── 300-execution-planner.mdc     (10KB)
├── 400-canvas-designer.mdc       (10KB)
└── 500-slack-responder.mdc       (8.3KB)


═══════════════════════════════════════════════════════════════════════════
                         STATUS: 🚀 OPERATIONAL
═══════════════════════════════════════════════════════════════════════════
```
