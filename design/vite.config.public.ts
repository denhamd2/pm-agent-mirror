import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { forbiddenImportsPlugin } from './vite-plugin-forbidden-imports';

/**
 * Public GHE Pages build.
 *
 * Builds a stripped-down dashboard with only the Design System and Agent
 * Flow tabs. The forbidden-imports plugin enforces build-time isolation
 * so any Pharos-derived data file or customer-attributable surface that
 * accidentally becomes reachable from `main-public.tsx` will fail the
 * build at module-resolve time.
 *
 * Output: `design/dashboard-public-dist/`. Never overlaps with the
 * localhost build (`design/dist/`). Localhost continues to use
 * `vite.config.ts` and is unaffected by anything here.
 */

function normaliseBase(raw: string | undefined): string {
  const b = (raw ?? '/').trim() || '/';
  if (b === '/') return '/';
  return b.endsWith('/') ? b : `${b}/`;
}

const PUBLIC_OUT_DIR = 'dashboard-public-dist';

/** Copy index.html -> 404.html so GHE Pages serves the SPA on unknown routes. */
function spaFallback404Public(): Plugin {
  return {
    name: 'spa-fallback-404-public',
    apply: 'build',
    closeBundle() {
      try {
        const outDir = path.resolve(__dirname, PUBLIC_OUT_DIR);
        copyFileSync(path.join(outDir, 'public.html'), path.join(outDir, 'index.html'));
        copyFileSync(path.join(outDir, 'public.html'), path.join(outDir, '404.html'));
      } catch {
        /* empty - dev server has no dist yet */
      }
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH ? normaliseBase(process.env.VITE_BASE_PATH) : './',
  plugins: [forbiddenImportsPlugin(), react(), spaFallback404Public()],
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
    outDir: PUBLIC_OUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'public.html'),
    },
  },
});
