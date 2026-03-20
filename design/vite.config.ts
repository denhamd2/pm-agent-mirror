import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Set by CI (e.g. GitHub Actions) so assets load under /repo/preview/<slug>/ on GitHub Pages. */
function normaliseBase(raw: string | undefined): string {
  const b = (raw ?? '/').trim() || '/';
  if (b === '/') return '/';
  return b.endsWith('/') ? b : `${b}/`;
}

export default defineConfig({
  base: normaliseBase(process.env.VITE_BASE_PATH),
  plugins: [react()],
  root: '.',
  server: {
    // Fixed port for Figma MCP capture URLs (hash links must match actual dev server).
    port: 5199,
    strictPort: true,
  },
});
