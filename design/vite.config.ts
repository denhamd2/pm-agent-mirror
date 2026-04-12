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
      'gcc-recruiter-dashboard',
      'aadhaar-adobe-sign-v01',
      'candidate-grid-v84',
      'candidate-smart-view-v86',
      'recruiter-home-v85',
      'india-whatsapp-candidate-messaging-v88',
      'gcc-interview-scheduling-v90',
      'recruiter-hub-genui-v95',
      'india-native-whatsapp-v91',
      'interview-intelligence-agent-v96',
      'ai-system-of-record-v97',
      'canvas-kit-test',
      'pm-agent-dashboard',
      'avg-time-to-hire',
      'avg-time-to-fill',
      'positions-open-vs-filled',
      'value-realization-metrics',
      'recruiter-capacity',
      'recruiting-metric-tree',
      'add-documents-impact',
      'recruiting-adoption',
      'interview-metrics',
      'bp-durations',
      'view-dashboard',
      'customer-scorecard',
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
  base: process.env.VITE_BASE_PATH ? normaliseBase(process.env.VITE_BASE_PATH) : './',
  plugins: [prototypeSpaSlugFallback(), react(), openChromeAndCursorBrowser()],
  root: '.',
  server: {
    port: 5199,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('data-bp-durations.ts') && !id.includes('by-segment')) return 'data-bp-durations';
          if (id.includes('data-employment-agreement-durations.ts')) return 'data-ea-durations';
          if (id.includes('data-customer-scorecard.ts')) return 'data-customer-scorecard';
        },
      },
    },
  },
});
