import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    // Fixed port for Figma MCP capture URLs (hash links must match actual dev server).
    port: 5199,
    strictPort: true,
  },
});
