/**
 * Regenerates PNG snapshots under `design/visual-parity-evidence/` for manual overlay against
 * `design/reference-screens/2way-email-refs/`. Run when intentionally refreshing parity captures:
 *
 *   PLAYWRIGHT_BASE_URL=http://localhost:5199 npx playwright test e2e/2way-email-visual-parity.spec.ts
 */
import path from 'path';
import { fileURLToPath } from 'url';

import { expect, test } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE_DIR = path.join(__dirname, '..', 'visual-parity-evidence');

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5199';

function hash(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  return `${BASE}/#2-way-email-prototype?${qs}`;
}

test.describe('2-way-email visual parity captures', () => {
  test.beforeAll(async () => {
    const fs = await import('node:fs/promises');
    await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('two_way_email_onboarding_complete_v3', '1');
    });
  });

  test('capture mail dock — list + sort row', async ({ page }) => {
    await page.goto(
      hash({
        proto: '1',
        panel: '1',
        surface: 'list',
        audience: 'all',
        dock: 'narrow',
        mailSort: 'oldest',
      }),
    );
    await expect(page.getByRole('heading', { name: 'Conversational Email' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole('button', { name: /Sort by (Oldest|Newest) on Top/ }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-mail-list-filter-row.png'),
      fullPage: true,
    });
  });

  test('capture mail dock — split read', async ({ page }) => {
    await page.goto(
      hash({
        proto: '1',
        panel: '1',
        surface: 'split',
        thread: '1',
        audience: 'candidate',
        error: 'none',
        mailSort: 'oldest',
      }),
    );
    await expect(page.getByRole('button', { name: 'Reply' })).toBeVisible({ timeout: 15_000 });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-mail-split-reading.png'),
      fullPage: true,
    });
  });

  test('capture compose wide', async ({ page }) => {
    await page.goto(
      hash({
        proto: '1',
        panel: '1',
        surface: 'compose',
        composePlace: 'template',
        dock: 'wide',
      }),
    );
    await expect(page.getByRole('heading', { name: 'Compose Email' })).toBeVisible({ timeout: 15_000 });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-compose.png'),
      fullPage: true,
    });
  });

  test('capture empty inbox', async ({ page }) => {
    await page.goto(
      hash({
        proto: '1',
        panel: '1',
        surface: 'empty',
        audience: 'all',
      }),
    );
    await expect(page.getByRole('button', { name: '+ Compose Email' })).toBeVisible({ timeout: 15_000 });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '04-empty-inbox.png'),
      fullPage: true,
    });
  });
});
