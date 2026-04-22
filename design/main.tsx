import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import { CanvasProvider } from '@workday/canvas-kit-react/common';
import { fonts } from '@workday/canvas-kit-react-fonts';
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
import { GccRecruiterDashboard } from './gcc-recruiter-dashboard';
import AadhaarAdobeSignV01 from './aadhaar-adobe-sign-v01';
import { GccCandidateGridSearch } from './gcc-candidate-grid-search';
import { RecruiterHomeV85 } from './recruiter-home-v85';
import { CandidateSmartViewV86 } from './candidate-smart-view-v86';
import { IndiaWhatsappCandidateMessagingV88 } from './india-whatsapp-candidate-messaging-v88';
import { GccInterviewSchedulingComplianceNudgesV90 } from './gcc-interview-scheduling-compliance-nudges-v90';
import { RecruiterHubGenUIV95 } from './recruiter-hub-genui-v95';
import { RecruiterHubConversationalV98 } from './recruiter-hub-conversational-v98';
import { RecruiterHubConversationalV99 } from './recruiter-hub-conversational-v99';
import { IndiaNativeWhatsappV91 } from './india-native-whatsapp-v91';
import { InterviewIntelligenceAgentV96 } from './interview-intelligence-agent-v96';
import AISystemOfRecordV97 from './ai-system-of-record-v97';
import UniversalProfilePrototype from './universal-profile-eudi-wallet-v1';
import { CanvasKitTest } from './components/CanvasKitTest';
import PMAgentDashboard from './pm-agent-dashboard';
import OffersDashboardV01 from './offers-dashboard-v01';
const AvgTimeToHireDashboard = React.lazy(() => import('./avg-time-to-hire-dashboard').then((m) => ({ default: m.AvgTimeToHireDashboard })));
const PositionsOpenVsFilledDashboard = React.lazy(() => import('./positions-open-vs-filled-dashboard').then((m) => ({ default: m.PositionsOpenVsFilledDashboard })));
const ValueRealizationMetrics = React.lazy(() => import('./value-realization-metrics').then((m) => ({ default: m.ValueRealizationMetrics })));
const RecruiterCapacityDashboard = React.lazy(() => import('./recruiter-capacity-dashboard').then((m) => ({ default: m.RecruiterCapacityDashboard })));
const AddDocumentsImpactDashboard = React.lazy(() => import('./add-documents-impact-dashboard').then((m) => ({ default: m.AddDocumentsImpactDashboard })));
const ViewDashboard = React.lazy(() => import('./view-dashboard').then((m) => ({ default: m.ViewDashboard })));
const RecruitingAgencyUserDashboard = React.lazy(() =>
  import('./recruiting-agency-user-dashboard').then((m) => ({ default: m.RecruitingAgencyUserDashboard }))
);
const InterviewMetricsDashboard = React.lazy(() => import('./interview-metrics-dashboard').then((m) => ({ default: m.InterviewMetricsDashboard })));
const BpDurationDashboard = React.lazy(() => import('./bp-duration-dashboard').then((m) => ({ default: m.BpDurationDashboard })));
const CustomerScorecardDashboard = React.lazy(() => import('./customer-scorecard-dashboard').then((m) => ({ default: m.CustomerScorecardDashboard })));
const RecruitingMetricTreePage = React.lazy(() => import('./recruiting-metric-tree').then((m) => ({ default: m.RecruitingMetricTreePage })));
import { SANA_PAGE_CANVAS } from './components';

function LoadingPlaceholder() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 16,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #e8e8e8',
        borderTop: '3px solid #0875e1',
        borderRadius: '50%',
        animation: 'pm-spin 0.8s linear infinite',
      }} />
      <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Loading dashboard</div>
      <div style={{ fontSize: 13, color: '#888', maxWidth: 280, textAlign: 'center' }}>
        Crunching a large dataset - this can take up to 30 seconds.
      </div>
      <style>{`@keyframes pm-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

/**
 * All recognised prototype slugs. Keep in sync with `vite.config.ts` `slugs` Set.
 * Order does not matter - lookup is Set-based.
 */
const PROTOTYPE_SLUGS = [
  'gcc-recruiter-dashboard',
  'aadhaar-adobe-sign-v01',
  'candidate-grid-v84',
  'recruiter-home-v85',
  'candidate-smart-view-v86',
  'india-whatsapp-candidate-messaging-v88',
  'gcc-interview-scheduling-v90',
  'recruiter-hub-genui-v95',
  'recruiter-hub-conversational-v98',
  'recruiter-hub-conversational-v99',
  'india-native-whatsapp-v91',
  'interview-intelligence-agent-v96',
  'ai-system-of-record-v97',
  'universal-profile-eudi-wallet-v1',
  'canvas-kit-test',
  'pm-agent-dashboard',
  'offers-dashboard-v01',
  'avg-time-to-hire',
  'add-documents-impact',
  'positions-open-vs-filled',
  'value-realization-metrics',
  'recruiter-capacity',
  'recruiting-metric-tree',
  'interview-metrics',
  'bp-durations',
  'view-dashboard',
  'recruiting-agency-user',
  'customer-scorecard',
] as const;

type PrototypeSlug = (typeof PROTOTYPE_SLUGS)[number];

const SLUG_SET: ReadonlySet<string> = new Set(PROTOTYPE_SLUGS);

/**
 * Resolve the active prototype from the current URL.
 *
 * Hash is checked **first** because dashboard inter-page navigation uses hash hrefs
 * (`#customer-scorecard`). On GitHub Pages the pathname stays fixed (served via 404.html
 * SPA fallback) while the hash changes, so pathname-first matching would ignore the
 * navigation and keep showing the previous page.
 */
function prototypeFromLocation(): PrototypeSlug {
  const h = window.location.hash.replace(/^#\/?/, '');
  const hashSlug = h.split('?')[0];
  if (hashSlug && SLUG_SET.has(hashSlug)) return hashSlug as PrototypeSlug;
  for (const slug of PROTOTYPE_SLUGS) {
    if (hashSlug.startsWith(slug)) return slug;
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  for (const slug of PROTOTYPE_SLUGS) {
    if (pathname.endsWith(slug)) return slug;
  }

  return 'recruiter-home-v85';
}

function AppRoot() {
  const [route, setRoute] = useState(prototypeFromLocation);
  useEffect(() => {
    const sync = () => setRoute(prototypeFromLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);
  if (route === 'canvas-kit-test') {
    return <CanvasKitTest />;
  }
  if (route === 'customer-scorecard') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><CustomerScorecardDashboard /></React.Suspense>;
  }
  if (route === 'bp-durations') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><BpDurationDashboard /></React.Suspense>;
  }
  if (route === 'interview-metrics') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><InterviewMetricsDashboard /></React.Suspense>;
  }
  if (route === 'recruiting-agency-user') {
    return (
      <React.Suspense fallback={<LoadingPlaceholder />}>
        <RecruitingAgencyUserDashboard />
      </React.Suspense>
    );
  }
  if (route === 'view-dashboard') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><ViewDashboard /></React.Suspense>;
  }
  if (route === 'value-realization-metrics') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><ValueRealizationMetrics /></React.Suspense>;
  }
  if (route === 'recruiter-capacity') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><RecruiterCapacityDashboard /></React.Suspense>;
  }
  if (route === 'recruiting-metric-tree') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><RecruitingMetricTreePage /></React.Suspense>;
  }
  if (route === 'add-documents-impact') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><AddDocumentsImpactDashboard /></React.Suspense>;
  }
  if (route === 'positions-open-vs-filled') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><PositionsOpenVsFilledDashboard /></React.Suspense>;
  }
  if (route === 'avg-time-to-hire') {
    return <React.Suspense fallback={<LoadingPlaceholder />}><AvgTimeToHireDashboard /></React.Suspense>;
  }
  if (route === 'pm-agent-dashboard') {
    return <PMAgentDashboard />;
  }
  if (route === 'offers-dashboard-v01') {
    return <OffersDashboardV01 />;
  }
  if (route === 'ai-system-of-record-v97') {
    return <AISystemOfRecordV97 />;
  }
  if (route === 'universal-profile-eudi-wallet-v1') {
    return <UniversalProfilePrototype />;
  }
  if (route === 'interview-intelligence-agent-v96') {
    return <InterviewIntelligenceAgentV96 />;
  }
  if (route === 'gcc-interview-scheduling-v90') {
    return <GccInterviewSchedulingComplianceNudgesV90 />;
  }
  if (route === 'recruiter-hub-genui-v95') {
    return <RecruiterHubGenUIV95 />;
  }
  if (route === 'recruiter-hub-conversational-v98') {
    return <RecruiterHubConversationalV98 />;
  }
  if (route === 'recruiter-hub-conversational-v99') {
    return <RecruiterHubConversationalV99 />;
  }
  if (route === 'india-native-whatsapp-v91') {
    return <IndiaNativeWhatsappV91 />;
  }
  if (route === 'india-whatsapp-candidate-messaging-v88') {
    return <IndiaWhatsappCandidateMessagingV88 />;
  }
  if (route === 'candidate-smart-view-v86') {
    return <CandidateSmartViewV86 />;
  }
  if (route === 'recruiter-home-v85') {
    return <RecruiterHomeV85 />;
  }
  if (route === 'candidate-grid-v84') {
    return <GccCandidateGridSearch />;
  }
  if (route === 'aadhaar-adobe-sign-v01') return <AadhaarAdobeSignV01 />;
  if (route === 'gcc-recruiter-dashboard') return <GccRecruiterDashboard />;
  return <RecruiterHomeV85 />;
}

const FIGMA_CAPTURE_SCRIPT_SRC =
  'https://mcp.figma.com/mcp/html-to-design/capture.js';

/** Hash keys read by Figma `capture.js` `Sr()` — remove before loading the script so `Kt()` does not auto-start `Cn()`. */
const FIGMA_HASH_PARAM_KEYS = [
  'figmacapture',
  'figmaendpoint',
  'figmadelay',
  'figmaselector',
  'figmalogpayload',
  'figmalogverbose',
] as const;

type FigmaCaptureParams = {
  captureId: string;
  endpoint: string;
  delayMs: number;
  selector: string;
};

function parseFigmaCaptureHash(): FigmaCaptureParams | null {
  const h = window.location.hash;
  if (!h || h.length < 2) return null;
  const q = h.startsWith('#') ? h.slice(1) : h;
  const params = new URLSearchParams(q);
  const captureId = params.get('figmacapture');
  const endpoint = params.get('figmaendpoint');
  if (!captureId || !endpoint) return null;
  const delayRaw = params.get('figmadelay');
  /** Default 6s: Canvas Kit fonts (workdaycdn) + layout need headroom (passed into `captureForDesign` as `delayMs`). */
  const delayMs = Math.min(Math.max(Number(delayRaw) || 6000, 800), 30000);
  const selector = params.get('figmaselector') || '#figma-capture-root';
  return { captureId, endpoint, delayMs, selector };
}

/**
 * Remove Figma capture params from the URL while preserving other hash keys (e.g. `country=` deep links).
 * Must run before `capture.js` executes so its boot `Kt({...})` does not see `#figmacapture` and start a second flow.
 */
function stripFigmaCaptureParamsFromUrl(): void {
  const h = window.location.hash;
  if (!h || h.length < 2) return;
  const raw = h.startsWith('#') ? h.slice(1) : h;
  const params = new URLSearchParams(raw);
  let changed = false;
  for (const key of FIGMA_HASH_PARAM_KEYS) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }
  if (!changed) return;
  const next = params.toString();
  const url = new URL(window.location.href);
  url.hash = next ? `#${next}` : '';
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

/**
 * Parsed once at module load (before React StrictMode / effects). Hash is stripped immediately so `capture.js`
 * never auto-captures from the URL — we submit exactly once via `captureForDesign`.
 */
let pendingFigmaCaptureBootstrap: FigmaCaptureParams | null = null;
const bootstrapCfg = parseFigmaCaptureHash();
if (bootstrapCfg) {
  pendingFigmaCaptureBootstrap = bootstrapCfg;
  stripFigmaCaptureParamsFromUrl();
}

let figmaScriptLoadPromise: Promise<void> | null = null;

function ensureFigmaCaptureScript(): Promise<void> {
  if (figmaScriptLoadPromise) return figmaScriptLoadPromise;
  figmaScriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${FIGMA_CAPTURE_SCRIPT_SRC}"]`
    );
    if (existing) {
      if ((window as unknown as { figma?: unknown }).figma) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Figma capture.js load error')), {
        once: true,
      });
      return;
    }
    const el = document.createElement('script');
    el.src = FIGMA_CAPTURE_SCRIPT_SRC;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('Figma capture.js load error'));
    document.body.appendChild(el);
  });
  return figmaScriptLoadPromise;
}

type FigmaCaptureForDesignOpts = {
  captureId: string;
  endpoint: string;
  selector?: string;
  delayMs?: number;
  verbose?: boolean;
};

/** Blocks calling `captureForDesign` twice with the same id in one session (hashchange retries). */
let lastSubmittedCaptureId: string | null = null;

const SELECTOR_WAIT_MS = 30000;
const SELECTOR_POLL_MS = 100;

/**
 * Mirrors Figma capture.js `Tr()` — wait until the capture node exists and has layout.
 * We do **not** return early without calling `captureForDesign`: skipping that call meant Figma never
 * ran `le()` / `q()` (spinner + “Sent to Figma” toolbar), so it looked like “no alert at all”.
 */
async function waitForCaptureSelectorLayout(selector: string): Promise<void> {
  const deadline = Date.now() + SELECTOR_WAIT_MS;
  while (Date.now() < deadline) {
    const el = document.querySelector(selector);
    const rect = el?.getBoundingClientRect();
    if (el && rect && rect.width >= 8 && rect.height >= 8) return;
    await new Promise((r) => setTimeout(r, SELECTOR_POLL_MS));
  }
  console.warn(
    '[figma capture] Selector still has no usable layout after',
    SELECTOR_WAIT_MS,
    'ms — continuing anyway so Figma can show its own capturing UI or error.',
    selector
  );
}

/**
 * Single capture path: `capture.js` is loaded with hash already stripped, so `Kt()` is a no-op.
 * We call `window.figma.captureForDesign` once with `delayMs` (Figma `Cn` internal wait).
 */
async function runSingleFigmaCapture(cfg: FigmaCaptureParams): Promise<void> {
  const w = window as unknown as {
    figma?: { captureForDesign: (opts: FigmaCaptureForDesignOpts) => Promise<unknown> };
  };
  if (!w.figma?.captureForDesign) return;
  if (lastSubmittedCaptureId === cfg.captureId) return;
  lastSubmittedCaptureId = cfg.captureId;

  try {
    await document.fonts.ready;
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await waitForCaptureSelectorLayout(cfg.selector);

    console.info('[figma capture] starting captureForDesign', cfg.captureId, cfg.selector);

    const result = w.figma.captureForDesign({
      captureId: cfg.captureId,
      endpoint: cfg.endpoint,
      selector: cfg.selector,
      delayMs: cfg.delayMs,
    });
    if (result != null && typeof (result as Promise<unknown>).then === 'function') {
      await result;
    }
  } catch (e) {
    console.error('[figma capture]', e);
    lastSubmittedCaptureId = null;
  }
}

/**
 * Loads `capture.js` (for `window.figma.captureForDesign`). Hash-based capture is handled only here after
 * stripping figma params from the URL so the script does not also run `Kt()` → `Cn()` from the hash.
 */
function FigmaCaptureScriptLoader() {
  useEffect(() => {
    let cancelled = false;
    let hashRaf1 = 0;
    let hashRaf2 = 0;

    void ensureFigmaCaptureScript()
      .then(() => {
        if (cancelled) return;
        const cfg = pendingFigmaCaptureBootstrap;
        pendingFigmaCaptureBootstrap = null;
        if (cfg) void runSingleFigmaCapture(cfg);
      })
      .catch((err) => console.error('[figma capture script]', err));

    const onHashChange = () => {
      const cfg = parseFigmaCaptureHash();
      if (!cfg) return;
      stripFigmaCaptureParamsFromUrl();
      cancelAnimationFrame(hashRaf1);
      cancelAnimationFrame(hashRaf2);
      void ensureFigmaCaptureScript()
        .then(() => {
          if (cancelled) return;
          hashRaf1 = requestAnimationFrame(() => {
            hashRaf2 = requestAnimationFrame(() => {
              if (cancelled) return;
              void runSingleFigmaCapture(cfg);
            });
          });
        })
        .catch((err) => console.error('[figma capture script]', err));
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      cancelled = true;
      cancelAnimationFrame(hashRaf1);
      cancelAnimationFrame(hashRaf2);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CanvasProvider>
      <FigmaCaptureScriptLoader />
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
      <div
        id="figma-capture-root"
        style={{
          minHeight: '100vh',
          minWidth: '1280px',
          boxSizing: 'border-box',
          backgroundColor: SANA_PAGE_CANVAS,
        }}
      >
        <AppRoot />
      </div>
    </CanvasProvider>
  </React.StrictMode>
);
