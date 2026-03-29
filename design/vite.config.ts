import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Set by CI (e.g. GitHub Actions) so assets load under /repo/preview/<slug>/ on GitHub Pages. */
function normaliseBase(raw: string | undefined): string {
  const b = (raw ?? '/').trim() || '/';
  if (b === '/') return '/';
  return b.endsWith('/') ? b : `${b}/`;
}

/**
 * Prototype entry files live at `design/<slug>.tsx`. Vite resolves `GET /<slug>` to that module, so the browser
 * document becomes raw transformed JS instead of `index.html`. Rewrite those bare slugs to `/` so the SPA boots;
 * `main.tsx` still reads `location.pathname` and picks the right screen.
 *
 * **Keep `slugs` in sync** with pathname routes in `main.tsx` `prototypeFromLocation()` — every new slug needs
 * an entry here or deep links show a blank page.
 */
function prototypeSpaSlugFallback(): Plugin {
  const slugs = new Set([
    'france-whatsapp-omnichannel-engagement-v75',
    'gcc-recruiter-dashboard',
    'gcc-unified-candidate-review-v57',
    'gcc-nationalisation-local-compliance-reporting-v61',
    'gcc-nationalisation-local-compliance-reporting-v62',
  ]);
  return {
    name: 'prototype-spa-slug-fallback',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url;
        if (!raw) return next();
        const [pathOnly, ...rest] = raw.split('?');
        const query = rest.length ? `?${rest.join('?')}` : '';
        const base = server.config.base.replace(/\/$/, '');
        let pathname = pathOnly;
        if (base && pathOnly.startsWith(base)) {
          pathname = pathOnly.slice(base.length) || '/';
        }
        const trimmed = (pathname.replace(/\/+$/, '') || '/').replace(/^\//, '');
        const lastSeg = trimmed.split('/').filter(Boolean).pop() ?? '';
        const looksLikeFile = pathOnly.includes('.') && !pathOnly.endsWith('/');
        if (!looksLikeFile && lastSeg && slugs.has(lastSeg)) {
          req.url = `${base ? `${base}/` : '/'}${query}`;
        }
        next();
      });
    },
  };
}

/** After dev server listens, open localhost in Chrome + Cursor Simple Browser (skip with VITE_NO_OPEN_BROWSERS=1). */
function openChromeAndCursorBrowser(): Plugin {
  let done = false;
  return {
    name: 'open-chrome-and-cursor-browser',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        if (process.env.VITE_NO_OPEN_BROWSERS === '1') return;
        if (done) return;
        done = true;
        const port = server.config.server.port ?? 5199;
        // Check for prototype slug in environment variable
        const prototypeSlug = process.env.VITE_PROTOTYPE_SLUG || '';
        const url = prototypeSlug 
          ? `http://localhost:${port}/${prototypeSlug}`
          : `http://localhost:${port}/`;
        const script = path.join(repoRoot, 'scripts', 'open-url-chrome-and-cursor-browser.sh');
        spawn('bash', [script, url], {
          detached: true,
          stdio: 'ignore',
          cwd: repoRoot,
        }).unref();
      });
    },
  };
}

export default defineConfig({
  base: normaliseBase(process.env.VITE_BASE_PATH),
  plugins: [prototypeSpaSlugFallback(), react(), openChromeAndCursorBrowser()],
  root: '.',
  server: {
    // Fixed port for Figma MCP capture URLs (hash links must match actual dev server).
    port: 5199,
    strictPort: true,
  },
});
