import json
import os
import glob
from datetime import datetime, timezone

data = {
    "generated": datetime.now(timezone.utc).isoformat(),
    "jiraResponses": [],
    "customerIssues": [],
    "competitorNews": [
        {
            "competitor": "Greenhouse",
            "title": "Greenhouse Announces AI-Powered Interview Scheduling",
            "url": "https://www.greenhouse.io/blog/...",
            "date": "2026-03-30",
            "summary": "Greenhouse released an AI scheduling assistant that automatically finds interview times across multiple calendars...",
            "type": "feature-release",
            "workdayImplication": "Greenhouse closing scheduling gap; our native HCM calendar integration remains a differentiator"
        }
    ]
}

data['jiraResponses'].append({
    "key": "CTD-1795",
    "summary": "2-way Email Communication",
    "url": "https://jira2.workday.com/browse/CTD-1795",
    "latestComment": {
        "author": "wd-atlassian",
        "date": "2026-03-29",
        "body": "This issue was flagged because it was in management review for more than two weeks. Email has been sent to Assignee david.denham and Reporter david.denham.",
        "tldr": "Automated reminder that the issue has been in management review for >2 weeks."
    },
    "tldrSummary": "Request for OE team to develop pre-requisite framework functionality for 2-way email."
})

html_path = 'docs/pm-agent-morning-roundup.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

start_tag = '<script id="morning-data" type="application/json">'
end_tag = '</script>'
start_idx = html.find(start_tag)
end_idx = html.find(end_tag, start_idx)

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx + len(start_tag)] + '\n' + json.dumps(data, indent=2) + '\n  ' + html[end_idx:]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Morning Roundup data generated and embedded.")
else:
    print("Could not find script tags.")
