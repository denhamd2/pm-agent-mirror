import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

/**
 * Build-time data governance guardrail for the public GHE Pages bundle.
 *
 * The localhost dashboard contains both UI-exploration prototypes (Canvas Kit
 * only, no data) and Pharos-derived data dashboards (5,971 named tenants, IUM
 * IDs, customer escalations). Only the catalogue page and the 13 safe
 * UI-exploration prototypes ship to GHE Pages.
 *
 * This plugin throws at module-resolve time if any forbidden source is
 * reachable from `main-public.tsx`. The list is hardcoded - it cannot be
 * weakened from config. Weakening or removing entries from this list requires
 * an explicit PM data-governance sign-off (see
 * `.cursor/rules/015-auto-commit-deploy.mdc`).
 *
 * Pattern matching is substring-based against the resolved source path. The
 * leading `/` keeps matches anchored to the design dir layout (e.g.
 * `/data-bp-durations` won't accidentally hit `data-bp-durations-shared`
 * because we list both substrings explicitly where ambiguity exists).
 */
const FORBIDDEN_SUBSTRINGS: readonly string[] = [
  '/data-add-documents-adoption-by-tenant',
  '/data-add-documents',
  '/data-avg-time-to-hire',
  '/data-bp-durations-by-segment',
  '/data-bp-durations',
  '/data-bp-shared',
  '/data-customer-scorecard',
  '/data-dashboard-tenant-filters',
  '/data-employment-agreement-durations',
  '/data-employment-agreement-steps',
  '/data-interview-filters',
  '/data-interview-metrics',
  '/data-offer-steps',
  '/data-offers-latest',
  '/data-positions',
  '/data-recruiter-capacity',
  '/data-recruiting-adoption',
  '/data-recruiting-agency-user-dashboard',
  '/data-recruiting-metric-tree',
  '/data-scorecard-recruiter-capacity',
  '/data-tree-tenant-series',
  '/data-value-realization-iums',
  '/data-view-dashboard',

  '/add-documents-impact-dashboard',
  '/avg-time-to-hire-dashboard',
  '/bp-duration-dashboard',
  '/customer-scorecard-dashboard',
  '/gcc-recruiter-dashboard',
  '/interview-metrics-dashboard',
  '/positions-open-vs-filled-dashboard',
  '/recruiter-capacity-dashboard',
  '/recruiting-adoption-dashboard',
  '/recruiting-agency-user-dashboard',
  '/view-dashboard',

  '/value-realization-metrics',
  '/recruiting-metric-tree',

  '/offers-dashboard-v01',
  '/offers-playground-v01',

  '/pm-agent-dashboard.tsx',
  '/pm-agent-dashboard-public.tsx',
  '/main.tsx',

  '/components/BottleneckFlowStrip',

  '/morning-roundup-data.json',
  '/saved-prototypes.json',
  '/stats-warehouse-data-sources.json',
  '/pm-agent-prototypes.html',
  '/pm-agent-morning-roundup.html',
];

const __filename = fileURLToPath(import.meta.url);
const designDir = path.dirname(__filename);
const repoRoot = path.resolve(designDir, '..');

function normalisePath(id: string): string {
  const stripped = id.replace(/\?.*$/, '').replace(/^\/?@fs/, '');
  return stripped.startsWith('/') ? stripped : path.resolve(designDir, stripped);
}

function matchForbidden(absPath: string): string | null {
  if (!absPath.startsWith(designDir) && !absPath.startsWith(repoRoot)) return null;
  if (absPath.includes('/node_modules/')) return null;
  for (const substr of FORBIDDEN_SUBSTRINGS) {
    if (absPath.includes(substr)) return substr;
  }
  return null;
}

export function forbiddenImportsPlugin(): Plugin {
  return {
    name: 'forbidden-imports-public-bundle',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source) return null;
      let candidate: string | null = null;
      if (source.startsWith('.') && importer) {
        candidate = path.resolve(path.dirname(importer.replace(/\?.*$/, '')), source);
      } else if (source.startsWith('/')) {
        candidate = source;
      } else if (path.isAbsolute(source)) {
        candidate = source;
      }
      if (!candidate) return null;
      const abs = normalisePath(candidate);
      const hit = matchForbidden(abs);
      if (hit) {
        const importerStr = importer ? ` from ${importer}` : '';
        throw new Error(
          `Forbidden import in public build: '${source}' matched '${hit}'${importerStr}. ` +
            `This module is not allowed in the GHE Pages bundle. See ` +
            `design/vite-plugin-forbidden-imports.ts for the data-governance allowlist.`
        );
      }
      return null;
    },
    load(id) {
      const abs = normalisePath(id);
      const hit = matchForbidden(abs);
      if (hit) {
        throw new Error(
          `Forbidden module loaded in public build: ${id} matched '${hit}'. ` +
            `Adjust the import chain so this file is not reachable from main-public.tsx.`
        );
      }
      return null;
    },
  };
}

export default forbiddenImportsPlugin;
