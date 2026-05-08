import { defineConfig, devices } from '@playwright/test';

/**
 * Canonical 2-way email prototype E2E — requires Vite on port **5199** (`strictPort` in `vite.config.ts`).
 * Starts dev server automatically unless one is already listening (`reuseExistingServer`).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5199',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'VITE_NO_OPEN_BROWSERS=1 npm run dev',
    cwd: '.',
    url: 'http://localhost:5199',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
