# Playwright — canonical 2-way email prototype

## Prerequisite

- Dev server on **`http://localhost:5199`** (`npm run dev` from this folder). Port is **fixed** (`strictPort: true` in `vite.config.ts`).

## Commands

| Script | Purpose |
|--------|---------|
| `npm run test:e2e` | Run [`e2e/2way-email-canonical.spec.ts`](e2e/2way-email-canonical.spec.ts) (starts Vite via `playwright.config.ts` if nothing is listening). |
| `npm run test:e2e:ui` | Interactive UI mode. |

Override base URL: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5199 npm run test:e2e`.

## Artifacts

HTML report and traces default to Playwright output dirs — see root `.gitignore` patterns for Playwright.

## Recommended fixes (when a test fails)

1. **Heading not found** — Verify hash parsing in `2-way-email-prototype.tsx` (`useEffect` + `parseTwoWayEmailPrototypeQuery`) matches params used in the spec.
2. **Flaky timeout** — Dock animation or hydration; consider `waitForURL` or increasing timeout for slow CI.
3. **Design vs test** — Tests assert **present** copy/chrome only; full Figma parity is manual / visual review.
