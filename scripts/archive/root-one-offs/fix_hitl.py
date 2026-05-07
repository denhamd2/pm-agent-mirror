with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'r') as f:
    content = f.read()

old_hitl = """11. HUMAN-IN-THE-LOOP: Parse **@pmf-analyst** output for the E2E Handoff table. Present the recommendations to the PM. Call AskQuestion with: Title "Which [REGION] research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with [REGION] compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc.). **STOP and wait for user response. Do NOT proceed to step 13 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.**"""

new_hitl = """11. HUMAN-IN-THE-LOOP: Parse **@pmf-analyst** output for the E2E Handoff table. Present the **top 5** recommendations to the PM. Call AskQuestion with: Title "Which [REGION] research recommendation would you like to take through PRD, prototype, copy review, and Figma?"; Options derived from the table (one per recommendation, e.g. "1. Interview Scheduling - Integrate Paradox with [REGION] compliance", "2. Reporting & Dashboards - Improve recruiter dashboards", etc. - **limit to the top 5 recommendations only**). **STOP and wait for user response. Do NOT proceed to step 12 until the user has explicitly selected an option. Do NOT default or assume—the pipeline is blocked until the user responds.**"""

content = content.replace(old_hitl, new_hitl)

# Fix the other step 13 typo
content = content.replace('Do NOT proceed to step 13 until the user has explicitly selected an option.', 'Do NOT proceed to step 12 until the user has explicitly selected an option.')

with open('/Users/david.denham/product-manager-agent/.cursor/rules/001-e2e-pipeline-reference.md', 'w') as f:
    f.write(content)
