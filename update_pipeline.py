import re

with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'r') as f:
    content = f.read()

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
content = content.replace('Stops at:** Jira epic and stories created (Step 29)', 'Stops at:** Jira epic and stories created (Step 29)') # This was already 29 in the original text, but actually it should be 29. Wait, the original text said "Stops at:** Jira epic and stories created (Step 29)". Let's leave it.

# Replace table
table_old = """| 10 | **130** | Glob rule | PMF Deck Generation |
| 11 | - | Shell | Cleanup Old Artifacts |
| 12 | - | HITL | Select Research Recommendation |
| 13 | - | HITL | PM Framing Conversation |
| 14 | **200** | Glob rule | PRD Writing |
| 15 | **060** | Glob rule | Legal Compliance Review (PRD) |
| 16 | - | Internal | PRD Legal Revision |
| 17 | **080** | Glob rule | Red Team Review (PRD) |
| 18 | **315** | Glob rule | Design Brief Creation |
| 19 | **319** | Glob rule | Copy Review (Design Brief) |
| 20 | **318** | Glob rule | Design Peer Review |
| 22 | **320** | Glob rule | Prototype Development |
| 23 | **321** | Glob rule | Visual Review |
| 24 | **319** | Glob rule | Copy Review (Prototype) |
| 25 | **330** | Glob rule | Figma Capture |
| 26 | **410** | Glob rule | Epic Definition |
| 27 | **420** | Glob rule | Story Mapping |
| 29 | **080** | Glob rule | Red Team Review (Story Map) |
| 30 | **430** | Glob rule | Story Writing + Jira Creation |"""

table_new = """| 10 | **130** | Glob rule | PMF Deck Generation |
| 11 | - | HITL | Select Research Recommendation |
| 12 | - | HITL | PM Framing Conversation |
| 13 | **200** | Glob rule | PRD Writing |
| 14 | **060** | Glob rule | Legal Compliance Review (PRD) |
| 15 | - | Internal | PRD Legal Revision |
| 16 | **080** | Glob rule | Red Team Review (PRD) |
| 17 | **315** | Glob rule | Design Brief Creation |
| 18 | **319** | Glob rule | Copy Review (Design Brief) |
| 19 | **318** | Glob rule | Design Peer Review |
| 20 | **320** | Glob rule | Prototype Development |
| 21 | **321** | Glob rule | Visual Review |
| 22 | **319** | Glob rule | Copy Review (Prototype) |
| 23 | **330** | Glob rule | Figma Capture |
| 24 | **410** | Glob rule | Epic Definition |
| 25 | **420** | Glob rule | Story Mapping |
| 26 | - | HITL | Story Map Review |
| 27 | **080** | Glob rule | Red Team Review (Story Map) |
| 28 | **430** | Glob rule | Story Writing + Jira Creation |"""
content = content.replace(table_old, table_new)

content = content.replace('- **Step 11**: "Cleanup Old Artifacts"\n', '')
content = re.sub(r'- \*\*Step (\d+)\*\*', lambda m: f'- **Step {int(m.group(1))-1}**' if int(m.group(1)) > 11 else m.group(0), content)

content = content.replace('[N] of 29', '[N] of 28')
content = content.replace('Steps 12-13 (recommendation selection + PM framing) and Step 27 (story map review)', 'Steps 11-12 (recommendation selection + PM framing) and Step 26 (story map review)')

# Todo array
todo_old = """       { id: "[region-code]-e2e-step-10", content: "Generating PMF Roadmap Deck (Step 10)", status: "pending" },
       { id: "[region-code]-e2e-step-11", content: "Cleanup Old Artifacts (Step 11)", status: "pending" },
       { id: "[region-code]-e2e-step-12", content: "Select Research Recommendation (Step 12 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-13", content: "PM Framing Conversation (Step 13 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-14", content: "Writing Product Requirements Document (Step 14)", status: "pending" },
       { id: "[region-code]-e2e-step-15", content: "Legal Compliance Review of PRD (Step 15 - 060)", status: "pending" },
       { id: "[region-code]-e2e-step-16", content: "PRD Legal Revision (Step 16 - if needed)", status: "pending" },
       { id: "[region-code]-e2e-step-17", content: "Red Team Review of PRD (Step 17 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-18", content: "Creating Design Brief (Step 18)", status: "pending" },
       { id: "[region-code]-e2e-step-19", content: "Reviewing Design Brief Copy (Step 19)", status: "pending" },
       { id: "[region-code]-e2e-step-20", content: "Peer Reviewing Design Brief (Step 20)", status: "pending" },
       { id: "[region-code]-e2e-step-21", content: "Building Canvas Kit Prototype (Step 21)", status: "pending" },
       { id: "[region-code]-e2e-step-22", content: "Visual Review of Prototype (Step 22)", status: "pending" },
       { id: "[region-code]-e2e-step-23", content: "Spot-Checking Prototype Copy (Step 23)", status: "pending" },
       { id: "[region-code]-e2e-step-24", content: "Capturing Prototype to Figma (Step 24)", status: "pending" },
       { id: "[region-code]-e2e-step-25", content: "Defining Product Epic (Step 25 - 410)", status: "pending" },
       { id: "[region-code]-e2e-step-26", content: "Creating Story Map (Step 26 - 420)", status: "pending" },
       { id: "[region-code]-e2e-step-27", content: "Story Map Review (Step 27 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-28", content: "Red Team Review of Story Map (Step 28 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-29", content: "Creating Jira Epic and Stories (Step 29 - 430)", status: "pending" }"""

todo_new = """       { id: "[region-code]-e2e-step-10", content: "Generating PMF Roadmap Deck (Step 10)", status: "pending" },
       { id: "[region-code]-e2e-step-11", content: "Select Research Recommendation (Step 11 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-12", content: "PM Framing Conversation (Step 12 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-13", content: "Writing Product Requirements Document (Step 13)", status: "pending" },
       { id: "[region-code]-e2e-step-14", content: "Legal Compliance Review of PRD (Step 14 - 060)", status: "pending" },
       { id: "[region-code]-e2e-step-15", content: "PRD Legal Revision (Step 15 - if needed)", status: "pending" },
       { id: "[region-code]-e2e-step-16", content: "Red Team Review of PRD (Step 16 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-17", content: "Creating Design Brief (Step 17)", status: "pending" },
       { id: "[region-code]-e2e-step-18", content: "Reviewing Design Brief Copy (Step 18)", status: "pending" },
       { id: "[region-code]-e2e-step-19", content: "Peer Reviewing Design Brief (Step 19)", status: "pending" },
       { id: "[region-code]-e2e-step-20", content: "Building Canvas Kit Prototype (Step 20)", status: "pending" },
       { id: "[region-code]-e2e-step-21", content: "Visual Review of Prototype (Step 21)", status: "pending" },
       { id: "[region-code]-e2e-step-22", content: "Spot-Checking Prototype Copy (Step 22)", status: "pending" },
       { id: "[region-code]-e2e-step-23", content: "Capturing Prototype to Figma (Step 23)", status: "pending" },
       { id: "[region-code]-e2e-step-24", content: "Defining Product Epic (Step 24 - 410)", status: "pending" },
       { id: "[region-code]-e2e-step-25", content: "Creating Story Map (Step 25 - 420)", status: "pending" },
       { id: "[region-code]-e2e-step-26", content: "Story Map Review (Step 26 - HITL)", status: "pending" },
       { id: "[region-code]-e2e-step-27", content: "Red Team Review of Story Map (Step 27 - 080)", status: "pending" },
       { id: "[region-code]-e2e-step-28", content: "Creating Jira Epic and Stories (Step 28 - 430)", status: "pending" }"""
content = content.replace(todo_old, todo_new)

# Remove steps 8, 9, 10 for cleanup
cleanup_old = """8. **Update todo**: Mark Step 10 as completed, Step 11 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-10", status: "completed" }, { id: "[region-code]-e2e-step-11", status: "in_progress" }] })`
9. **Cleanup old artifacts**: Run Shell command from repo root: `python3 scripts/cleanup-old-artifacts.py --keep 3` (retains 3 most recent slide specs, PRDs, prototypes, story maps; deletes older versions; logs to terminal). Non-blocking, fast execution (~1 second).
10. **Update todo**: Mark Step 11 as completed, Step 12 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-11", status: "completed" }, { id: "[region-code]-e2e-step-12", status: "in_progress" }] })`"""

cleanup_new = """8. **Update todo**: Mark Step 10 as completed, Step 11 as in_progress: `TodoWrite({ merge: true, todos: [{ id: "[region-code]-e2e-step-10", status: "completed" }, { id: "[region-code]-e2e-step-11", status: "in_progress" }] })`"""
content = content.replace(cleanup_old, cleanup_new)

# Renumber the numbered list items and steps in the text
# This is a bit tricky, let's just do a series of replaces for the specific text
for i in range(12, 31):
    content = content.replace(f'Step {i}', f'Step {i-1}')
    content = content.replace(f'step {i}', f'step {i-1}')
    content = content.replace(f'e2e-step-{i}', f'e2e-step-{i-1}')

# Fix the numbered list
# The list goes from 11 to 68. We removed 9 and 10.
# Let's just rewrite the list numbers using regex.
lines = content.split('\n')
new_lines = []
for line in lines:
    m = re.match(r'^(\d+)\. (.*)', line)
    if m:
        num = int(m.group(1))
        if num >= 11:
            line = f"{num-2}. {m.group(2)}"
    new_lines.append(line)
content = '\n'.join(new_lines)

# Fix MISSION_LOG format
content = content.replace('**Cleanup (Step 10):** Retained 3 most recent (slide specs, PRDs, prototypes, story maps); deleted [N] old files | ', '')
content = content.replace('→ **Cleanup** ', '')

with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'w') as f:
    f.write(content)
