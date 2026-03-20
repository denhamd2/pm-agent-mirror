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
        const url = `http://localhost:${port}/`;
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
  plugins: [react(), openChromeAndCursorBrowser()],
  root: '.',
  server: {
    // Fixed port for Figma MCP capture URLs (hash links must match actual dev server).
    port: 5199,
    strictPort: true,
  },
});
