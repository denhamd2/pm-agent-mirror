/**
 * Canonical UI smoke tests for `#2-way-email-prototype` hash presets.
 * Drive state via query params (same contract as Prototype Control / deep links).
 *
 * Recommended fixes if a test fails:
 * - Missing heading/copy → check `parseTwoWayEmailPrototypeQuery` / mail surface state in `2-way-email-prototype.tsx`.
 * - Timeout → increase timeout or fix dock/panel mount order; ensure `panel=1` when mail chrome should show.
 * - Decision bar → profile card “Move Forward” must toggle `decisionActionBarVisible`.
 */
import { expect, test } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5199';

function canonicalHash(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  return `${BASE}/#2-way-email-prototype?${qs}`;
}

test.describe('2-way-email canonical screens', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('two_way_email_onboarding_complete_v3', '1');
    });
  });

  test('shell — dock closed (no Conversational Email chrome)', async ({ page }) => {
    await page.goto(canonicalHash({ proto: '1', panel: '0' }));
    await expect(page.getByRole('heading', { name: 'Conversational Email' })).toHaveCount(0, {
      timeout: 15_000,
    });
  });

  test('list-first mail — Conversational Email + New', async ({ page }) => {
    await page.goto(
      canonicalHash({ proto: '1', panel: '1', surface: 'list', audience: 'all', dock: 'auto' }),
    );
    await expect(page.getByRole('heading', { name: 'Conversational Email' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: '+ New' })).toBeVisible();
  });

  test('split read — Reply / Forward', async ({ page }) => {
    await page.goto(
      canonicalHash({
        proto: '1',
        panel: '1',
        surface: 'split',
        thread: '1',
        audience: 'candidate',
        error: 'none',
      }),
    );
    await expect(page.getByRole('button', { name: 'Reply' })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Forward', exact: true })).toBeVisible();
  });

  test('compose wide — Compose Email title', async ({ page }) => {
    await page.goto(canonicalHash({ proto: '1', panel: '1', surface: 'compose', composePlace: 'begin' }));
    await expect(page.getByRole('heading', { name: 'Compose Email' })).toBeVisible({ timeout: 15_000 });
  });

  test('empty inbox — candidate tab empty copy', async ({ page }) => {
    await page.goto(canonicalHash({ proto: '1', panel: '1', surface: 'empty', audience: 'candidate' }));
    await expect(page.getByRole('heading', { name: 'No candidate messages in this view' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: '+ Compose Email' })).toBeVisible();
  });

  test('delivery error read — not-delivered banner copy', async ({ page }) => {
    await page.goto(
      canonicalHash({
        proto: '1',
        panel: '1',
        surface: 'split',
        thread: '4',
        error: 'generic',
        audience: 'candidate',
      }),
    );
    await expect(
      page.getByText(/could not be delivered successfully/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('decision bar — after Move Forward on profile', async ({ page }) => {
    await page.goto(canonicalHash({ proto: '1', panel: '0', surface: 'list', nav: 'summary' }));
    await page.getByRole('button', { name: 'Move Forward' }).first().click();
    await expect(page.getByRole('region', { name: 'Candidate decision actions' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: 'Decline' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move Forward' }).nth(1)).toBeVisible();
  });
});
