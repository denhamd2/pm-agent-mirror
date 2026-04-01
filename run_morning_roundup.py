import json
from datetime import datetime, timezone

json_path = 'docs/morning-roundup-data.json'
html_path = 'docs/pm-agent-morning-roundup.html'

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data['generated'] = datetime.now(timezone.utc).isoformat()
except FileNotFoundError:
    data = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "jiraResponses": [],
        "customerIssues": [],
        "competitorNews": []
    }
    print(f"Warning: {json_path} not found. Run /morning-roundup skill first to fetch live data.")

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
    news_count = len(data.get('competitorNews', []))
    jira_count = len(data.get('jiraResponses', []))
    cust_count = len(data.get('customerIssues', []))
    print(f"Morning Roundup embedded: {jira_count} jira items, {cust_count} customer issues, {news_count} competitor news")
else:
    print("Could not find script tags in HTML.")
