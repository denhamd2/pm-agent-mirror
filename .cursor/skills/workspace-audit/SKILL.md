# Workspace Audit Skill

Generates interactive HTML dashboards (Agent Health Dashboard + Agent Flow) that visualize the PM agent workspace health, rule inventory, workflow structure, and architectural metrics.

## When to Use This Skill

Use when:
- User explicitly requests: `/workspace-audit` or "update the Agent Health Dashboard"
- 090 Improvement Advisor completes an audit and needs to render dashboards
- After implementing architectural improvements to visualize impact
- Periodically to check workspace health (monthly or after major refactors)

Trigger via: `/workspace-audit` command or when 090 references it during advisory workflows

## Target Audience

**Senior Workday PM (David)** - needs a high-level view of:
- Agent architecture health and scores
- Workflow structure and relationships
- Rule/skill/subagent inventory
- AlwaysApply token budget status
- Recent improvements and remaining issues

## Responsibilities

This skill handles the **"how to render"** while 090 handles the **"what to audit"**. Separation of concerns:

| Concern | Owner | What it does |
|---------|-------|--------------|
| **Discovery & analysis** | 090 rule | Reads rules, identifies patterns, evaluates architecture, recommends improvements |
| **Rendering & visualization** | `/workspace-audit` skill | Collects metrics, generates HTML dashboards, serves in browser |

## Workflow

### Step 1: Collect Workspace Metrics

Run these commands to gather data:

```bash
# Rule inventory
find .cursor/rules -name "*.mdc" -o -name "*.md" | while read f; do
  lines=$(wc -l < "$f")
  aa=$(head -8 "$f" | grep -q "^alwaysApply: true" && echo "ALWAYS" || echo "glob")
  echo "$lines $aa $f"
done | sort -rn

# Subagent count
ls -1 .cursor/agents/*.md | wc -l

# Skill count (workspace)
ls -1d .cursor/skills/*/SKILL.md | wc -l

# MCP count and tools
ls -1d /Users/david.denham/.cursor/projects/Users-david-denham-product-manager-agent/mcps/*/ | while read d; do
  name=$(basename "$d")
  tools=$(ls "$d/tools/" 2>/dev/null | wc -l)
  echo "$name: $tools tools"
done

# AlwaysApply budget
total=0
for f in .cursor/rules/*.mdc .cursor/rules/**/*.md; do
  head -8 "$f" 2>/dev/null | grep -q "^alwaysApply: true" && {
    lines=$(wc -l < "$f")
    total=$((total + lines))
    echo "  $f: $lines lines"
  }
done
echo "TOTAL: $total lines"

# Active missions
grep -c "| In Progress\|| Blocked" MISSION_LOG.md

# Design prototype count
ls -1 design/*.tsx 2>/dev/null | wc -l
```

Store results in variables for HTML generation.

### Step 2: Validate Latest Slide Spec (if exists)

```bash
# Find latest slides_spec_vN.json
latest_spec=$(ls -t docs/decks/specs/slides_spec_v*.json 2>/dev/null | head -1)

if [ -n "$latest_spec" ]; then
  echo "Found spec: $latest_spec"
  # Run validator (captures violations)
  python3 scripts/validate_slide_spec.py "$latest_spec" 2>&1 | tee /tmp/slide_validation.txt
else
  echo "No slide spec found to validate"
fi
```

Parse validation output for:
- Title violations count
- Density violations count  
- Language violations count
- Total slides
- Pass/fail verdict

### Step 3: Generate Agent Health Dashboard HTML

Update `docs/pm-agent-scorecard.html` with:
- Current metrics (rules, subagents, skills, MCPs, alwaysApply lines, total rule lines)
- Before/after comparison (if this is a post-improvement audit)
- Category scores (Rule Architecture, Subagent Design, Skill Reusability, MCP Integration, Deck Quality, Naming, E2E Pipeline, Hygiene)
- Chart.js visualizations:
  - Architecture health radar (before/after overlays)
  - AlwaysApply budget doughnut
  - Rule size distribution bar chart
  - Improvement impact bar chart
- Active findings and remaining issues
- Rule inventory table

**Grade calculation logic:**

| Category | Criteria | Grade |
|----------|----------|-------|
| **Overall** | Weighted average of all categories | A- to D |
| **Rule Architecture** | AlwaysApply < 700 lines (A), glob-scoping used, no orphans | B+ to A |
| **Subagent Design** | Clean naming, thin wrappers where appropriate, dual-mode | A |
| **Skill Reusability** | No duplication, DRY methods, invocable standalone + E2E | A |
| **MCP Integration** | All MCPs connected and used; blocks: -10pts per errored MCP | B- to A |
| **Deck Quality** | Validator enforced, low violation rate | C to A |
| **Hygiene** | No orphans, mission log clean, stale missions archived | A- to A |

### Step 4: Generate Agent Flow HTML

Update `docs/pm-agent-architecture.html` with:
- Structured workflow lane layout (4 lanes: WF1-WF4)
- Orchestrator header
- Support agents row (090, 100, 500, 060, 080)
- Skills row at bottom
- MCPs column on right
- Step numbers on each node
- Interactive tooltips and detail panel
- Filter buttons (All, Workflows Only, Skills & MCPs)

### Step 5: Generate manifest.json for Dynamic Navigation

Before serving, generate `docs/manifest.json` so the shared dashboard navigation can dynamically link to the latest artefacts:

```bash
python3 -c "
import json, glob, os, shutil

root = os.getcwd()
manifest = {}

# Latest deck: scan ~/Downloads for *_Roadmap_v*.pptx, copy newest to docs/downloads/
deck_pattern = os.path.expanduser('~/Downloads/*_Roadmap_v*.pptx')
decks = sorted([d for d in glob.glob(deck_pattern) if not os.path.basename(d).startswith('~')], key=os.path.getmtime, reverse=True)
if decks:
    os.makedirs('docs/downloads', exist_ok=True)
    newest = decks[0]
    dest = os.path.join('docs/downloads', os.path.basename(newest))
    shutil.copy2(newest, dest)
    manifest['latestDeck'] = {'filename': os.path.basename(newest), 'path': 'docs/downloads/' + os.path.basename(newest)}

# Latest PRD: scan docs/prds/*.md (exclude *-red-team*.md)
prds = [f for f in sorted(glob.glob('docs/prds/*.md'), key=os.path.getmtime, reverse=True) if 'red-team' not in os.path.basename(f)]
if prds:
    manifest['latestPrd'] = {'filename': os.path.basename(prds[0]), 'path': prds[0]}

# Latest Design Brief: scan design/*-design-brief*.md
briefs = sorted(glob.glob('design/*-design-brief*.md'), key=os.path.getmtime, reverse=True)
if briefs:
    manifest['latestDesignBrief'] = {'filename': os.path.basename(briefs[0]), 'path': briefs[0]}

# Latest Epic: scan docs/epics/*.md (exclude README.md)
epics = [f for f in sorted(glob.glob('docs/epics/*.md'), key=os.path.getmtime, reverse=True) if os.path.basename(f).lower() != 'readme.md']
if epics:
    manifest['latestEpic'] = {'filename': os.path.basename(epics[0]), 'path': epics[0]}

with open('docs/manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2)
print('Generated docs/manifest.json:', json.dumps(manifest, indent=2))
"
```

### Step 6: Serve and Open in Browser

```bash
# Kill existing server on port 8765
pgrep -f "dashboard-server.py\|http.server 8765" | xargs kill 2>/dev/null

# Start custom dashboard server (static files + save-prototype API)
# Serves from WORKSPACE ROOT so the markdown viewer can access design/ and docs/
python3 scripts/dashboard-server.py &

# Wait for server to start
sleep 1

# Open in Cursor browser via MCP
# browser_navigate to http://localhost:8765/docs/pm-agent-morning-roundup.html
```

Return the URLs to the user:
- Agent Health Dashboard: `http://localhost:8765/docs/pm-agent-scorecard.html`
- Morning Roundup: `http://localhost:8765/docs/pm-agent-morning-roundup.html` (landing page)
- Agent Flow: `http://localhost:8765/docs/pm-agent-architecture.html`
- Design System Components: `http://localhost:8765/docs/pm-agent-design-system.html`

## Output Format

After skill completes, provide this summary:

```markdown
## PM Agent Dashboard Updated

**Agent Health Dashboard**: http://localhost:8765/docs/pm-agent-scorecard.html
**Morning Roundup** (landing page): http://localhost:8765/docs/pm-agent-morning-roundup.html
- Overall Grade: [A- to D]
- AlwaysApply Budget: [X lines / 500 target]
- Active Missions: [N]
- Key Findings: [brief summary]

**Agent Flow**: http://localhost:8765/docs/pm-agent-architecture.html
- 4 workflow lanes (WF1-WF4) with step numbers
- [N] rules, [N] subagents, [N] skills, [N] MCPs visualised

**Design System Components**: http://localhost:8765/docs/pm-agent-design-system.html
- Component showcase with Sana Shell theme tokens

**Dynamic Links** (via manifest.json):
- Latest Deck: [filename or "not found"]
- Latest PRD: [filename or "not found"]
- Latest Design Brief: [filename or "not found"]
- Latest Epic: [filename or "not found"]

**Recent Changes** (if any):
- [Change 1 with impact]
- [Change 2 with impact]
```

## Integration with 090

When 090 completes an architectural audit and has specific findings/recommendations:

1. **090 discovers and analyzes** (reads rules, identifies patterns, evaluates against best practices)
2. **090 generates findings** (creates the list of issues, recommendations, prioritizations)
3. **090 invokes `/workspace-audit`** with a note: "Update dashboards with these findings: [brief list]"
4. **Skill updates HTML files** with 090's findings baked into the Critical Findings and Recommendations sections
5. **Skill serves and opens** the dashboards

**Handoff pattern**: 090 provides findings as structured data (JSON or markdown), skill renders them in HTML.

## File Locations

- **Morning Roundup**: `docs/pm-agent-morning-roundup.html` (landing page)
- **Agent Health Dashboard**: `docs/pm-agent-scorecard.html`
- **Agent Flow**: `docs/pm-agent-architecture.html`
- **Design System Components**: `docs/pm-agent-design-system.html`
- **Markdown Viewer**: `docs/pm-agent-viewer.html` (reusable, takes `?file=` param)
- **Dashboard Nav**: `docs/dashboard-nav.js` (shared navigation + dynamic link resolution)
- **Manifest**: `docs/manifest.json` (generated, gitignored)
- **Deck Downloads**: `docs/downloads/` (generated, gitignored)
- **Validator**: `scripts/validate_slide_spec.py`
- **Server**: `scripts/dashboard-server.py` on port 8765, serves from **workspace root** (not just `docs/`) with save-prototype API

## Quality Standards

### Always
- Collect fresh metrics (never cache)
- Run validator against latest spec if one exists
- Update both dashboards (Agent Health Dashboard + Agent Flow)
- Serve and open in browser
- Return URLs to user
- Keep HTML clean, accessible, responsive
- Use Workday color palette (ink, water, pencil, etc.)
- Include Chart.js visualizations for key metrics

### Never
- Make architectural recommendations (that's 090's job)
- Perform discovery or analysis (that's 090's job)
- Modify rule files or architecture (only render current state)
- Assume cached metrics are current
- Skip validation if a spec file exists

## Success Criteria

Skill succeeds when:
- Both the Agent Health Dashboard and Agent Flow HTML files are generated/updated with current metrics
- Dashboards open in Cursor browser
- URLs returned to user
- Metrics are accurate and up-to-date
- Visualizations render correctly

---

**Remember**: This skill is a **rendering engine**, not an advisor. It transforms workspace data into visual dashboards. Strategic advice, architectural evaluation, and improvement recommendations remain with 090.
