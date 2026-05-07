import re

with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'r') as f:
    content = f.read()

# Replace text
content = content.replace('Steps 1-12 (Strategy → PESTEL → SWOT → CI/108/105 in parallel → 106 sequential → PMF Analysis → Deck → Cleanup)', 'Steps 1-11 (Strategy → PESTEL → SWOT → CI/108/105 in parallel → 106 sequential → PMF Analysis → Deck)')
content = content.replace('Stops at:** PMF roadmap deck generation (Step 11) and cleanup (Step 12)', 'Stops at:** PMF roadmap deck generation (Step 10)')
content = content.replace('Steps 13-18 (HITL Select → PM Framing → PRD → Legal Review → Red Team)', 'Steps 12-17 (HITL Select → PM Framing → PRD → Legal Review → Red Team)')
content = content.replace('executes Steps 12-13 (HITL + PM Framing) → then Steps 14-17', 'executes Steps 11-12 (HITL + PM Framing) → then Steps 13-16')
content = content.replace('skip Steps 12-13 → execute Steps 14-17 directly', 'skip Steps 11-12 → execute Steps 13-16 directly')
content = content.replace('Stops at:** Red Team reviewed PRD (Step 17)', 'Stops at:** Red Team reviewed PRD (Step 16)')
content = content.replace('Steps 19-25 (Design Brief → Copy Review → Peer Review → Prototype → Visual Review → Copy Spot-Check → Figma)', 'Steps 18-24 (Design Brief → Copy Review → Peer Review → Prototype → Visual Review → Copy Spot-Check → Figma)')
content = content.replace('Uses PRD path from Step 15', 'Uses PRD path from Step 14')
content = content.replace('Stops at:** Figma capture complete (Step 25)', 'Stops at:** Figma capture complete (Step 24)')
content = content.replace('Steps 26-30 (Epic → Story Map → Review → Red Team → Jira)', 'Steps 25-29 (Epic → Story Map → Review → Red Team → Jira)')
content = content.replace('Steps 1-30 (all workflows)', 'Steps 1-29 (all workflows)')
content = content.replace('Stops at:** Jira epic and stories created (Step 29)', 'Stops at:** Jira epic and stories created (Step 29)')
content = content.replace('[N] of 29', '[N] of 28')
content = content.replace('Steps 12-13 (recommendation selection + PM framing) and Step 27 (story map review)', 'Steps 11-12 (recommendation selection + PM framing) and Step 26 (story map review)')

# Remove table row
content = re.sub(r'\| 11 \| - \| Shell \| Cleanup Old Artifacts \|\n', '', content)

# Renumber table rows 12-30 -> 11-29
def renumber_table_row(match):
    num = int(match.group(1))
    if num >= 12:
        return f"| {num-1} |"
    return match.group(0)
content = re.sub(r'\| (\d+) \|', renumber_table_row, content)

# Remove step 11 from list
content = re.sub(r'- \*\*Step 11\*\*: "Cleanup Old Artifacts"\n', '', content)

# Renumber step list 12-29 -> 11-28
def renumber_step_list(match):
    num = int(match.group(1))
    if num >= 12:
        return f"- **Step {num-1}**"
    return match.group(0)
content = re.sub(r'- \*\*Step (\d+)\*\*', renumber_step_list, content)

# Remove todo item
content = re.sub(r'       \{ id: "\[region-code\]-e2e-step-11", content: "Cleanup Old Artifacts \(Step 11\)", status: "pending" \},\n', '', content)

# Renumber todo items
def renumber_todo(match):
    num = int(match.group(1))
    if num >= 12:
        return f"e2e-step-{num-1}\", content: \"{match.group(2)} (Step {num-1}"
    return match.group(0)
content = re.sub(r'e2e-step-(\d+)", content: "([^"]+) \(Step \d+', renumber_todo, content)

# Remove cleanup commands
cleanup_block = """8. **Update todo**: Mark Step 10 as completed, Step 11 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-10", status: "completed" }, { id: "[region-code]-e2e-step-11", status: "in_progress" }] })`
9. **Cleanup old artifacts**: Run Shell command from repo root: `python3 scripts/cleanup-old-artifacts.py --keep 3` (retains 3 most recent slide specs, PRDs, prototypes, story maps; deletes older versions; logs to terminal). Non-blocking, fast execution (~1 second).
10. **Update todo**: Mark Step 11 as completed, Step 12 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-11", status: "completed" }, { id: "[region-code]-e2e-step-12", status: "in_progress" }] })`"""
content = content.replace(cleanup_block, '')

# Renumber numbered list items
# The list has items like "11. HUMAN-IN-THE-LOOP..."
# We need to renumber them.
# Let's just do it manually for the specific lines.
for i in range(12, 70):
    content = content.replace(f"Step {i}", f"Step {i-1}")
    content = content.replace(f"step {i}", f"step {i-1}")

# Fix MISSION_LOG
content = content.replace('→ **Cleanup** ', '')
content = re.sub(r' \| \*\*Cleanup \(Step 11\):\*\* Retained 3 most recent \(slide specs, PRDs, prototypes, story maps\); deleted \[N\] old files', '', content)

with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'w') as f:
    f.write(content)
