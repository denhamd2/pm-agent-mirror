import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import { CanvasProvider } from '@workday/canvas-kit-react/common';
import { fonts } from '@workday/canvas-kit-react-fonts';
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SANA_PAGE_CANVAS, SANA_LINK_ACCENT } from './components/sanaShellTheme';
import {
  PUBLIC_PROTOTYPES,
  PUBLIC_PROTOTYPE_SLUGS,
  type PublicPrototypeSlug,
} from './public-catalogue';
import { PublicPrototypesCatalogue } from './public-prototypes-catalogue';

/**
 * Public GHE Pages entry point.
 *
 * Routes:
 *   - `/` (relative to BASE_URL) → catalogue
 *   - `/<slug>` where slug ∈ PUBLIC_PROTOTYPE_SLUGS → lazy-loaded prototype
 *   - anything else → "this content is localhost-only" placeholder
 *
 * Localhost is the canonical full dashboard. This entry point only ships the 13
 * UI-exploration prototypes; data-backed dashboards (IUM metrics, customer
 * scorecards, BP durations, value realisation) remain on localhost only and
 * are not reachable from this bundle. The build-time guardrail in
 * `vite-plugin-forbidden-imports.ts` enforces that constraint.
 *
 * Each lazy import literal is statically analysable so Vite/Rollup can produce
 * one chunk per prototype and the public catalogue bundle stays small.
 */

type AnyComponent = React.ComponentType<any>;
type Loader = () => Promise<{ default: AnyComponent }>;

const PROTOTYPE_LOADERS: Record<PublicPrototypeSlug, Loader> = {
  'aadhaar-adobe-sign-v01': () => import('./aadhaar-adobe-sign-v01'),
  'candidate-grid-v84': () =>
    import('./gcc-candidate-grid-search').then((m) => ({ default: m.GccCandidateGridSearch })),
  'recruiter-home-v85': () =>
    import('./recruiter-home-v85').then((m) => ({ default: m.RecruiterHomeV85 })),
  'candidate-smart-view-v86': () =>
    import('./candidate-smart-view-v86').then((m) => ({ default: m.CandidateSmartViewV86 })),
  'india-whatsapp-candidate-messaging-v88': () =>
    import('./india-whatsapp-candidate-messaging-v88').then((m) => ({
      default: m.IndiaWhatsappCandidateMessagingV88,
    })),
  'gcc-interview-scheduling-v90': () =>
    import('./gcc-interview-scheduling-compliance-nudges-v90').then((m) => ({
      default: m.GccInterviewSchedulingComplianceNudgesV90,
    })),
  'india-native-whatsapp-v91': () =>
    import('./india-native-whatsapp-v91').then((m) => ({ default: m.IndiaNativeWhatsappV91 })),
  'recruiter-hub-genui-v95': () =>
    import('./recruiter-hub-genui-v95').then((m) => ({ default: m.RecruiterHubGenUIV95 })),
  'interview-intelligence-agent-v96': () =>
    import('./interview-intelligence-agent-v96').then((m) => ({
      default: m.InterviewIntelligenceAgentV96,
    })),
  'ai-system-of-record-v97': () => import('./ai-system-of-record-v97'),
  'recruiter-hub-conversational-v98': () =>
    import('./recruiter-hub-conversational-v98').then((m) => ({
      default: m.RecruiterHubConversationalV98,
    })),
  'recruiter-hub-conversational-v99': () =>
    import('./recruiter-hub-conversational-v99').then((m) => ({
      default: m.RecruiterHubConversationalV99,
    })),
  'universal-profile-eudi-wallet-v1': () => import('./universal-profile-eudi-wallet-v1'),
};

const LAZY_PROTOTYPES: Record<PublicPrototypeSlug, React.LazyExoticComponent<AnyComponent>> =
  Object.fromEntries(
    PUBLIC_PROTOTYPES.map((p) => [
      p.slug,
      React.lazy(PROTOTYPE_LOADERS[p.slug as PublicPrototypeSlug]),
    ])
  ) as Record<PublicPrototypeSlug, React.LazyExoticComponent<AnyComponent>>;

type Route =
  | { kind: 'catalogue' }
  | { kind: 'prototype'; slug: PublicPrototypeSlug }
  | { kind: 'unknown'; raw: string };

function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/' || base === './') {
    return pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  }
  const normBase = base.endsWith('/') ? base : `${base}/`;
  if (pathname.startsWith(normBase)) {
    return pathname.slice(normBase.length).replace(/\/+$/, '');
  }
  if (pathname === normBase.replace(/\/$/, '')) return '';
  return pathname.replace(/^\/+/, '').replace(/\/+$/, '');
}

function routeFromLocation(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (hash) {
    if (PUBLIC_PROTOTYPE_SLUGS.has(hash)) return { kind: 'prototype', slug: hash as PublicPrototypeSlug };
    return { kind: 'unknown', raw: hash };
  }
  const rel = stripBase(window.location.pathname);
  if (!rel) return { kind: 'catalogue' };
  const lastSeg = rel.split('/').filter(Boolean).pop() || '';
  if (PUBLIC_PROTOTYPE_SLUGS.has(lastSeg)) {
    return { kind: 'prototype', slug: lastSeg as PublicPrototypeSlug };
  }
  return { kind: 'unknown', raw: lastSeg };
}

function LoadingPlaceholder() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 16,
        background: SANA_PAGE_CANVAS,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid #e8e8e8',
          borderTop: `3px solid ${SANA_LINK_ACCENT}`,
          borderRadius: '50%',
          animation: 'pm-public-spin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: 14, color: '#4B4B4B' }}>Loading prototype</div>
      <style>{`@keyframes pm-public-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function LocalhostOnlyPlaceholder({ raw }: { raw: string }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return (
    <div
      style={{
        minHeight: '100vh',
        background: SANA_PAGE_CANVAS,
        padding: '64px 32px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Heading size="medium" style={{ marginTop: 0 }}>
          Not available here
        </Heading>
        <BodyText size="medium" style={{ color: '#4B4B4B' }}>
          {raw ? (
            <>
              <code>{raw}</code> isn't part of the public prototype catalogue.
            </>
          ) : (
            <>This route isn't part of the public prototype catalogue.</>
          )}{' '}
          Data-backed dashboards (IUM metrics, customer scorecards,
          business-process durations, value realisation) and the full PM Agent
          dashboard remain on the local development environment only.
        </BodyText>
        <p style={{ marginTop: 24 }}>
          <a
            href={baseUrl}
            style={{ color: SANA_LINK_ACCENT, fontWeight: 600, textDecoration: 'none' }}
          >
            ← Back to catalogue
          </a>
        </p>
      </div>
    </div>
  );
}

function AppRoot() {
  const [route, setRoute] = useState<Route>(routeFromLocation);
  useEffect(() => {
    const sync = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  if (route.kind === 'catalogue') {
    return <PublicPrototypesCatalogue />;
  }
  if (route.kind === 'prototype') {
    const Lazy = LAZY_PROTOTYPES[route.slug];
    return (
      <Suspense fallback={<LoadingPlaceholder />}>
        <Lazy />
      </Suspense>
    );
  }
  return <LocalhostOnlyPlaceholder raw={route.raw} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CanvasProvider>
      <Global
        styles={css(
          ...fonts,
          {
            body: {
              fontFamily: '"Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif',
              margin: 0,
              padding: 0,
              backgroundColor: SANA_PAGE_CANVAS,
              color: '#333333',
              WebkitFontSmoothing: 'antialiased' as const,
            },
            'input::placeholder': {
              color: '#6E6E6E',
              opacity: 1,
            },
          }
        )}
      />
      <AppRoot />
    </CanvasProvider>
  </React.StrictMode>
);
