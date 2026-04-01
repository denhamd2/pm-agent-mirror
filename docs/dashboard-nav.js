(function() {
  // 1. Latest Prototype - fetch main.tsx
  const protoLink = document.getElementById('proto-link');
  if (protoLink) {
    // Try fetching from local design folder first (works on gh-pages and locally if served from root)
    fetch('../design/main.tsx')
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.text();
      })
      .then(src => {
        const matches = [...src.matchAll(/['"]([a-z0-9-]+-v(\d+))['"]/g)];
        if (matches.length === 0) throw new Error('No versioned routes found');
        matches.sort((a, b) => parseInt(b[2], 10) - parseInt(a[2], 10));
        const latest = matches[0][1];
        
        // If we are on localhost, link to dev server. Otherwise, we can't easily link to the dynamic preview folder.
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          protoLink.href = 'http://localhost:5173/#/' + latest;
        } else {
          // On GitHub Pages, link to the source file as a fallback, or just leave it pointing to localhost
          protoLink.href = 'http://localhost:5173/#/' + latest;
        }
        protoLink.title = latest + ' (Requires local dev server)';
      })
      .catch((err) => {
        protoLink.href = 'http://localhost:5173/';
        protoLink.title = 'Dev server may not be running';
        protoLink.style.opacity = '0.5';
      });
  }

  // 2-5. Manifest-driven links (deck, PRD, design brief, epic)
  fetch('manifest.json')
    .then(r => r.json())
    .then(m => {
      // Latest Deck
      const deckLink = document.getElementById('deck-link');
      if (deckLink && m.latestDeck) {
        deckLink.href = '../' + m.latestDeck.path;
        deckLink.title = m.latestDeck.filename;
      } else if (deckLink) {
        deckLink.style.opacity = '0.5';
        deckLink.title = 'No deck found';
      }

      // Latest PRD
      const prdLink = document.getElementById('prd-link');
      if (prdLink && m.latestPrd) {
        prdLink.href = 'pm-agent-viewer.html?file=' + encodeURIComponent(m.latestPrd.path);
        prdLink.title = m.latestPrd.filename;
      } else if (prdLink) {
        prdLink.style.opacity = '0.5';
        prdLink.title = 'No PRD found';
      }

      // Latest Design Brief
      const briefLink = document.getElementById('brief-link');
      if (briefLink && m.latestDesignBrief) {
        briefLink.href = 'pm-agent-viewer.html?file=' + encodeURIComponent(m.latestDesignBrief.path);
        briefLink.title = m.latestDesignBrief.filename;
      } else if (briefLink) {
        briefLink.style.opacity = '0.5';
        briefLink.title = 'No design brief found';
      }

      // Latest Epic
      const epicLink = document.getElementById('epic-link');
      if (epicLink && m.latestEpic) {
        epicLink.href = 'pm-agent-viewer.html?file=' + encodeURIComponent(m.latestEpic.path);
        epicLink.title = m.latestEpic.filename;
      } else if (epicLink) {
        epicLink.style.opacity = '0.5';
        epicLink.title = 'No epic found';
      }
    })
    .catch(() => {
      ['deck-link', 'prd-link', 'brief-link', 'epic-link'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.opacity = '0.5';
          el.title = 'Run /workspace-audit to generate manifest';
        }
      });
    });
})();
