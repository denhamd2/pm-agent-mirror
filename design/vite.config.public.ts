import { copyFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { forbiddenImportsPlugin } from './vite-plugin-forbidden-imports';
import { PUBLIC_PROTOTYPES } from './public-catalogue';

const __filename = fileURLToPath(import.meta.url);
const designDir = path.dirname(__filename);

function normaliseBase(raw: string | undefined): string {
  const b = (raw ?? '/').trim() || '/';
  if (b === '/') return '/';
  return b.endsWith('/') ? b : `${b}/`;
}

/**
 * Rewrite `/<slug>` requests to `/public.html` during dev/preview so the SPA
 * boots and the in-app router (`main-public.tsx`) picks the right prototype.
 * Only the 13 public slugs are recognised here; anything else passes through
 * to Vite's default 404 handler.
 */
function prototypeSpaSlugFallbackPublic(): Plugin {
  const slugs = new Set(PUBLIC_PROTOTYPES.map((p) => p.slug));
  return {
    name: 'prototype-spa-slug-fallback-public',
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
          req.url = `${base ? `${base}/` : '/'}public.html${query}`;
        } else if (!looksLikeFile && (pathname === '/' || pathname === '')) {
          req.url = `${base ? `${base}/` : '/'}public.html${query}`;
        }
        next();
      });
    },
    configurePreviewServer(server) {
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
          req.url = `${base ? `${base}/` : '/'}index.html${query}`;
        }
        next();
      });
    },
  };
}

/**
 * After build, `public.html` is the only HTML emitted. Rename it to
 * `index.html` so GHE Pages serves it as the directory default, then copy that
 * to `404.html` so SPA deep links (`/<slug>`) hit the same bundle.
 */
function spaFallback404Public(): Plugin {
  return {
    name: 'spa-fallback-404-public',
    closeBundle() {
      const outDir = path.resolve(designDir, 'dashboard-public-dist');
      try {
        renameSync(path.join(outDir, 'public.html'), path.join(outDir, 'index.html'));
      } catch {
        /* may already be index.html if rebuild */
      }
      try {
        copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'));
      } catch {
        /* dev server — no dist yet */
      }
      writeFileSync(path.join(outDir, '.nojekyll'), '');
      /** PM sanity check on GHE Pages: open …/mail-stub-version.txt — should mention Alex Rivera, not Priya Nair. */
      writeFileSync(
        path.join(outDir, 'mail-stub-version.txt'),
        '2-way-email agency senders: Alex Rivera (BrightPath) only. Deep links: bare #slug → defaults; ?thread=… in hash is honoured. If you still see Priya Nair, clear cache for this host.\n',
        'utf8',
      );
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH ? normaliseBase(process.env.VITE_BASE_PATH) : './',
  /** Read in `2-way-email-prototype.tsx` — always show floating prototype controls on this bundle only. */
  define: {
    'import.meta.env.VITE_PUBLIC_PROTOTYPE_CATALOGUE': JSON.stringify('1'),
  },
  plugins: [
    forbiddenImportsPlugin(),
    react(),
    prototypeSpaSlugFallbackPublic(),
    spaFallback404Public(),
  ],
  root: '.',
  server: {
    port: 5198,
    strictPort: true,
  },
  preview: {
    port: 5198,
    strictPort: true,
  },
  build: {
    outDir: 'dashboard-public-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(designDir, 'public.html'),
    },
  },
});
