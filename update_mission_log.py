import re

with open('/Users/david.denham/product-manager-agent/MISSION_LOG.md', 'r') as f:
    content = f.read()

old_line = '| INDIA-PMF-004 | In Progress | Step 1 - Strategy Context; Driver: New market entry; Focus: high volume and Know Your Candidate |'
new_line = '| INDIA-PMF-004 | Complete | PMF Research done; Deck: `~/Downloads/India_Recruiting_PMF_Roadmap_v86.pptx` (68 slides); PMF: `research/India/thematic-analysis/2026-04-01-India-PMF-Analysis-INDIA-PMF-004.md`; CI: `research/competitive/in/in-competitive-scan-2026-04-01-INDIA-PMF-004.md` |'

content = content.replace(old_line, new_line)

with open('/Users/david.denham/product-manager-agent/MISSION_LOG.md', 'w') as f:
    f.write(content)
