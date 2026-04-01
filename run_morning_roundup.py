import json
import glob
import os
import re
import shutil
from datetime import datetime, timezone

json_path = 'docs/morning-roundup-data.json'

dashboard_pages = [
    'docs/pm-agent-morning-roundup.html',
    'docs/pm-agent-scorecard.html',
    'docs/pm-agent-architecture.html',
    'docs/pm-agent-design-system.html',
    'docs/pm-agent-viewer.html',
]

def embed_json_block(html, tag_id, data_dict):
    """Replace the content of a <script id="..." type="application/json"> tag."""
    start_tag = f'<script id="{tag_id}" type="application/json">'
    end_tag = '</script>'
    start_idx = html.find(start_tag)
    if start_idx == -1:
        return html
    end_idx = html.find(end_tag, start_idx + len(start_tag))
    if end_idx == -1:
        return html
    return html[:start_idx + len(start_tag)] + '\n' + json.dumps(data_dict, indent=2) + '\n' + html[end_idx:]


def build_nav_links():
    """Scan workspace for latest artefacts and build nav-links JSON."""
    nav = {}

    # Latest prototype route from design/main.tsx
    try:
        with open('design/main.tsx', 'r', encoding='utf-8') as f:
            main_tsx = f.read()
        routes = re.findall(r"'([\w-]+-v\d+)'", main_tsx)
        seen = set()
        versions = []
        for r in routes:
            if r in seen:
                continue
            seen.add(r)
            m = re.search(r'-v(\d+)$', r)
            if m:
                versions.append((int(m.group(1)), r))
        if versions:
            versions.sort(key=lambda x: x[0], reverse=True)
            latest_route = versions[0][1]
            nav['prototype'] = {'href': f'http://localhost:5173/#/{latest_route}', 'title': latest_route}
    except FileNotFoundError:
        pass

    # Latest deck
    deck_pattern = os.path.expanduser('~/Downloads/*_Roadmap_v*.pptx')
    decks = sorted(
        [d for d in glob.glob(deck_pattern) if not os.path.basename(d).startswith('~')],
        key=os.path.getmtime, reverse=True
    )
    if decks:
        os.makedirs('docs/downloads', exist_ok=True)
        newest = decks[0]
        dest = os.path.join('docs/downloads', os.path.basename(newest))
        shutil.copy2(newest, dest)
        nav['deck'] = {'href': 'docs/downloads/' + os.path.basename(newest), 'title': os.path.basename(newest)}

    # Latest PRD
    prds = [f for f in sorted(glob.glob('docs/prds/*.md'), key=os.path.getmtime, reverse=True) if 'red-team' not in os.path.basename(f)]
    if prds:
        nav['prd'] = {'href': 'docs/pm-agent-viewer.html?file=' + prds[0], 'title': os.path.basename(prds[0])}

    # Latest Design Brief
    briefs = sorted(glob.glob('design/*-design-brief*.md'), key=os.path.getmtime, reverse=True)
    if briefs:
        nav['brief'] = {'href': 'docs/pm-agent-viewer.html?file=' + briefs[0], 'title': os.path.basename(briefs[0])}

    # Latest Epic
    epics = [f for f in sorted(glob.glob('docs/epics/*.md'), key=os.path.getmtime, reverse=True) if os.path.basename(f).lower() != 'readme.md']
    if epics:
        nav['epic'] = {'href': 'docs/pm-agent-viewer.html?file=' + epics[0], 'title': os.path.basename(epics[0])}

    return nav


# Load morning data
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

# Build nav links
nav_links = build_nav_links()
print(f"Nav links resolved: {list(nav_links.keys())}")

# Embed into all dashboard pages
for page_path in dashboard_pages:
    if not os.path.exists(page_path):
        print(f"  Skipping {page_path} (not found)")
        continue

    with open(page_path, 'r', encoding='utf-8') as f:
        html = f.read()

    html = embed_json_block(html, 'nav-links', nav_links)

    if page_path == 'docs/pm-agent-morning-roundup.html':
        html = embed_json_block(html, 'morning-data', data)

    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  Updated {page_path}")

news_count = len(data.get('competitorNews', []))
jira_count = len(data.get('jiraResponses', []))
cust_count = len(data.get('customerIssues', []))
print(f"\nMorning Roundup embedded: {jira_count} jira items, {cust_count} customer issues, {news_count} competitor news")
print(f"Nav links embedded in {len(dashboard_pages)} pages")
