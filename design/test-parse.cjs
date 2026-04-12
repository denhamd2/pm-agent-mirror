const fs = require('fs');
const html = fs.readFileSync('docs/pm-agent-prototypes.html', 'utf8');
const match = html.match(/<script id="prototypes-data" type="application\/json">([\s\S]*?)<\/script>/);
if (match) {
  console.log(JSON.parse(match[1]));
}
