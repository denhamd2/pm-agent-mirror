import type { Plugin } from 'vite';

/**
 * Hard-bound guardrail for the public GHE Pages build.
 *
 * Fails the build at module-resolve time if any of the listed forbidden
 * source paths is reached from `main-public.tsx`. Catches Pharos data
 * files, customer-attributable JSON, and any internal-only dashboard
 * surface that must never ship to GHE Pages.
 *
 * The forbidden list is intentionally hardcoded in this file (not
 * configurable from the Vite config) so the guardrail cannot be
 * silently weakened by a config edit. To add a previously-forbidden
 * file to the public bundle, this source must be edited - a conscious
 * code change with a meaningful diff.
 *
 * Matching uses substring rather than absolute paths so the guardrail
 * also catches transitive imports through `node_modules`-style
 * resolution and aliased paths.
 */
const FORBIDDEN_SUBSTRINGS: readonly string[] = [
  '/data-value-realization-iums',
  '/data-customer-scorecard',
  '/data-bp-durations',
  '/data-bp-durations-by-segment',
  '/data-bp-shared',
  '/data-avg-time-to-hire',
  '/data-recruiting-adoption',
  '/data-recruiter-capacity',
  '/data-tree-tenant-series',
  '/data-add-documents-adoption-by-tenant',
  '/data-add-documents',
  '/data-dashboard-tenant-filters',
  '/data-recruiting-metric-tree',
  '/data-interview-metrics',
  '/data-interview-filters',
  '/data-offers-latest',
  '/data-offer-steps',
  '/data-employment-agreement-durations',
  '/data-employment-agreement-steps',
  '/data-positions',
  '/data-recruiting-agency-user-dashboard',
  '/data-view-dashboard',
  '/data-scorecard-recruiter-capacity',

  '/value-realization-metrics',
  '/customer-scorecard-dashboard',
  '/bp-duration-dashboard',
  '/avg-time-to-hire-dashboard',
  '/recruiter-capacity-dashboard',
  '/recruiting-metric-tree',
  '/recruiting-adoption-dashboard',
  '/add-documents-impact-dashboard',
  '/interview-metrics-dashboard',
  '/recruiting-agency-user-dashboard',
  '/view-dashboard',
  '/offers-dashboard-v01',
  '/offers-playground-v01',
  '/positions-open-vs-filled-dashboard',

  '/morning-roundup-data.json',
  '/saved-prototypes.json',
  '/stats-warehouse-data-sources.json',
  '/pm-agent-prototypes.html',
  '/pm-agent-morning-roundup',
];

function isForbidden(resolvedPath: string): string | null {
  const normalised = resolvedPath.replace(/\\/g, '/');
  for (const needle of FORBIDDEN_SUBSTRINGS) {
    if (normalised.includes(needle)) return needle;
  }
  if (/\/pm-agent-dashboard\.tsx?(\b|$)/.test(normalised)) {
    return '/pm-agent-dashboard.tsx';
  }
  return null;
}

export function forbiddenImportsPlugin(): Plugin {
  return {
    name: 'forbidden-imports-public-build',
    enforce: 'pre',
    resolveId(source, importer) {
      const candidate = source.replace(/\\/g, '/');
      const match = isForbidden(candidate);
      if (match) {
        const from = importer ? ` from ${importer}` : '';
        throw new Error(
          `Forbidden import in public build: '${source}' matched '${match}'${from}. ` +
            `This file is localhost-only and must never ship to GHE Pages. ` +
            `If you genuinely need to publish it, edit design/vite-plugin-forbidden-imports.ts.`
        );
      }
      return null;
    },
    load(id) {
      const match = isForbidden(id);
      if (match) {
        throw new Error(
          `Forbidden module loaded in public build: '${id}' matched '${match}'. ` +
            `This file is localhost-only and must never ship to GHE Pages.`
        );
      }
      return null;
    },
  };
}
