(function() {
  var el = document.getElementById('nav-links');
  if (!el) return;
  try {
    var links = JSON.parse(el.textContent);
    
    var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Fix paths to work in both local (/docs/) and GH Pages (root)
    var fixPath = function(path) {
      if (!path) return '#';
      if (path.startsWith('http')) return path;
      if (isLocal) {
        if (path.startsWith('../')) return path;
        return '../' + path;
      } else {
        if (path.startsWith('../')) return path.substring(3);
        return path;
      }
    };

    // Handle prototype link dynamically based on environment
    var protoHref = '#';
    if (links.prototype && links.prototype.title) {
      var route = links.prototype.title; // e.g. 'candidate-smart-view-v86'
      if (isLocal) {
        protoHref = 'http://localhost:5173/#/' + route;
      } else {
        protoHref = 'preview/latest/#/' + route;
      }
    }

    var map = {
      'proto-link': { href: protoHref, title: links.prototype ? links.prototype.title : 'Detecting...' },
      'deck-link': links.deck ? { href: fixPath(links.deck.href), title: links.deck.title } : null,
      'prd-link': links.prd ? { href: fixPath(links.prd.href), title: links.prd.title } : null,
      'brief-link': links.brief ? { href: fixPath(links.brief.href), title: links.brief.title } : null,
      'epic-link': links.epic ? { href: fixPath(links.epic.href), title: links.epic.title } : null
    };

    Object.keys(map).forEach(function(id) {
      var a = document.getElementById(id);
      if (!a || !map[id]) return;
      a.href = map[id].href;
      a.title = map[id].title;
      // Remove detecting opacity if it was set
      a.style.opacity = '1';
    });
  } catch (e) {
    console.error("Error parsing nav links:", e);
    ['proto-link','deck-link','prd-link','brief-link','epic-link'].forEach(function(id) {
      var a = document.getElementById(id);
      if (a) { a.style.opacity = '0.5'; a.title = 'Run /morning-roundup to generate links'; }
    });
  }
  
  // DEBUG: Print resolved links
  setTimeout(() => {
    console.warn("DEBUG LINKS:");
    ['proto-link','deck-link','prd-link','brief-link','epic-link'].forEach(function(id) {
      var a = document.getElementById(id);
      console.warn(id + " -> " + (a ? a.href : 'null'));
    });
  }, 1000);
})();
