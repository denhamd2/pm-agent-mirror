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
import { IndiaNativeWhatsappV91 } from './india-native-whatsapp-v91';
import { InterviewIntelligenceAgentV96 } from './interview-intelligence-agent-v96';
import AISystemOfRecordV97 from './ai-system-of-record-v97';
import { CanvasKitTest } from './components/CanvasKitTest';
import PMAgentDashboard from './pm-agent-dashboard';
import { AvgTimeToHireDashboard } from './avg-time-to-hire-dashboard';
import { AvgTimeToFillDashboard } from './avg-time-to-fill-dashboard';
import { PositionsOpenVsFilledDashboard } from './positions-open-vs-filled-dashboard';
import { ValueRealizationMetrics } from './value-realization-metrics';
import { AddDocumentsImpactDashboard } from './add-documents-impact-dashboard';
import { ViewDashboard } from './view-dashboard';
import { RecruitingAdoptionDashboard } from './recruiting-adoption-dashboard';
import { InterviewMetricsDashboard } from './interview-metrics-dashboard';
import { BpDurationDashboard } from './bp-duration-dashboard';
const CustomerScorecardDashboard = React.lazy(() => import('./customer-scorecard-dashboard').then((m) => ({ default: m.CustomerScorecardDashboard })));
import { SANA_PAGE_CANVAS } from './components';

/** Prototype slugs backed by `design/*.tsx` modules in this branch (see `vite.config.ts` `slugs` Set). */
function prototypeFromLocation():
  | 'gcc-recruiter-dashboard'
  | 'aadhaar-adobe-sign-v01'
  | 'candidate-grid-v84'
  | 'recruiter-home-v85'
  | 'candidate-smart-view-v86'
  | 'india-whatsapp-candidate-messaging-v88'
  | 'gcc-interview-scheduling-v90'
  | 'recruiter-hub-genui-v95'
  | 'india-native-whatsapp-v91'
  | 'interview-intelligence-agent-v96'
  | 'ai-system-of-record-v97'
  | 'canvas-kit-test'
  | 'pm-agent-dashboard'
  | 'avg-time-to-hire'
  | 'avg-time-to-fill'
  | 'add-documents-impact'
  | 'positions-open-vs-filled'
  | 'value-realization-metrics'
  | 'recruiting-adoption'
  | 'interview-metrics'
  | 'bp-durations'
  | 'view-dashboard'
  | 'customer-scorecard' {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.endsWith('customer-scorecard')) {
    return 'customer-scorecard';
  }
  if (path.endsWith('bp-durations')) {
    return 'bp-durations';
  }
  if (path.endsWith('interview-metrics')) {
    return 'interview-metrics';
  }
  if (path.endsWith('recruiting-adoption')) {
    return 'recruiting-adoption';
  }
  if (path.endsWith('view-dashboard')) {
    return 'view-dashboard';
  }
  if (path.endsWith('value-realization-metrics')) {
    return 'value-realization-metrics';
  }
  if (path.endsWith('add-documents-impact')) {
    return 'add-documents-impact';
  }
  if (path.endsWith('positions-open-vs-filled')) {
    return 'positions-open-vs-filled';
  }
  if (path.endsWith('avg-time-to-fill')) {
    return 'avg-time-to-fill';
  }
  if (path.endsWith('avg-time-to-hire')) {
    return 'avg-time-to-hire';
  }
  if (path.endsWith('pm-agent-dashboard')) {
    return 'pm-agent-dashboard';
  }
  if (path.endsWith('canvas-kit-test')) {
    return 'canvas-kit-test';
  }
  if (path.endsWith('ai-system-of-record-v97')) {
    return 'ai-system-of-record-v97';
  }
  if (path.endsWith('interview-intelligence-agent-v96')) {
    return 'interview-intelligence-agent-v96';
  }
  if (path.endsWith('india-native-whatsapp-v91')) {
    return 'india-native-whatsapp-v91';
  }
  if (path.endsWith('recruiter-hub-genui-v95')) {
    return 'recruiter-hub-genui-v95';
  }
  if (path.endsWith('gcc-interview-scheduling-v90')) {
    return 'gcc-interview-scheduling-v90';
  }
  if (path.endsWith('india-whatsapp-candidate-messaging-v88')) {
    return 'india-whatsapp-candidate-messaging-v88';
  }
  if (path.endsWith('candidate-smart-view-v86')) {
    return 'candidate-smart-view-v86';
  }
  if (path.endsWith('recruiter-home-v85')) {
    return 'recruiter-home-v85';
  }
  if (path.endsWith('candidate-grid-v84')) {
    return 'candidate-grid-v84';
  }
  if (path.endsWith('aadhaar-adobe-sign-v01')) return 'aadhaar-adobe-sign-v01';
  if (path.endsWith('gcc-recruiter-dashboard')) return 'gcc-recruiter-dashboard';
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h === 'aadhaar-adobe-sign-v01' || h.startsWith('aadhaar-adobe-sign-v01')) {
    return 'aadhaar-adobe-sign-v01';
  }
  if (h === 'gcc-recruiter-dashboard' || h.startsWith('gcc-recruiter-dashboard')) {
    return 'gcc-recruiter-dashboard';
  }
  if (h === 'candidate-grid-v84' || h.startsWith('candidate-grid-v84')) {
    return 'candidate-grid-v84';
  }
  if (h === 'recruiter-home-v85' || h.startsWith('recruiter-home-v85')) {
    return 'recruiter-home-v85';
  }
  if (h === 'candidate-smart-view-v86' || h.startsWith('candidate-smart-view-v86')) {
    return 'candidate-smart-view-v86';
  }
  if (h === 'india-whatsapp-candidate-messaging-v88' || h.startsWith('india-whatsapp-candidate-messaging-v88')) {
    return 'india-whatsapp-candidate-messaging-v88';
  }
  if (h === 'gcc-interview-scheduling-v90' || h.startsWith('gcc-interview-scheduling-v90')) {
    return 'gcc-interview-scheduling-v90';
  }
  if (h === 'recruiter-hub-genui-v95' || h.startsWith('recruiter-hub-genui-v95')) {
    return 'recruiter-hub-genui-v95';
  }
  if (h === 'india-native-whatsapp-v91' || h.startsWith('india-native-whatsapp-v91')) {
    return 'india-native-whatsapp-v91';
  }
  if (h === 'interview-intelligence-agent-v96' || h.startsWith('interview-intelligence-agent-v96')) {
    return 'interview-intelligence-agent-v96';
  }
  if (h === 'ai-system-of-record-v97' || h.startsWith('ai-system-of-record-v97')) {
    return 'ai-system-of-record-v97';
  }
  if (h === 'canvas-kit-test' || h.startsWith('canvas-kit-test')) {
    return 'canvas-kit-test';
  }
  if (h === 'pm-agent-dashboard' || h.startsWith('pm-agent-dashboard')) {
    return 'pm-agent-dashboard';
  }
  if (h === 'avg-time-to-hire' || h.startsWith('avg-time-to-hire')) {
    return 'avg-time-to-hire';
  }
  if (h === 'avg-time-to-fill' || h.startsWith('avg-time-to-fill')) {
    return 'avg-time-to-fill';
  }
  if (h === 'positions-open-vs-filled' || h.startsWith('positions-open-vs-filled')) {
    return 'positions-open-vs-filled';
  }
  if (h === 'value-realization-metrics' || h.startsWith('value-realization-metrics')) {
    return 'value-realization-metrics';
  }
  if (h === 'add-documents-impact' || h.startsWith('add-documents-impact')) {
    return 'add-documents-impact';
  }
  if (h === 'recruiting-adoption' || h.startsWith('recruiting-adoption')) {
    return 'recruiting-adoption';
  }
  if (h === 'bp-durations' || h.startsWith('bp-durations')) {
    return 'bp-durations';
  }
  if (h === 'interview-metrics' || h.startsWith('interview-metrics')) {
    return 'interview-metrics';
  }
  if (h === 'view-dashboard' || h.startsWith('view-dashboard')) {
    return 'view-dashboard';
  }
  if (h === 'customer-scorecard' || h.startsWith('customer-scorecard')) {
    return 'customer-scorecard';
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
    return (
      <React.Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading scorecard...</div>}>
        <CustomerScorecardDashboard />
      </React.Suspense>
    );
  }
  if (route === 'recruiting-adoption') {
    return <RecruitingAdoptionDashboard />;
  }
  if (route === 'bp-durations') {
    return <BpDurationDashboard />;
  }
  if (route === 'interview-metrics') {
    return <InterviewMetricsDashboard />;
  }
  if (route === 'view-dashboard') {
    return <ViewDashboard />;
  }
  if (route === 'value-realization-metrics') {
    return <ValueRealizationMetrics />;
  }
  if (route === 'add-documents-impact') {
    return <AddDocumentsImpactDashboard />;
  }
  if (route === 'positions-open-vs-filled') {
    return <PositionsOpenVsFilledDashboard />;
  }
  if (route === 'avg-time-to-fill') {
    return <AvgTimeToFillDashboard />;
  }
  if (route === 'avg-time-to-hire') {
    return <AvgTimeToHireDashboard />;
  }
  if (route === 'pm-agent-dashboard') {
    return <PMAgentDashboard />;
  }
  if (route === 'ai-system-of-record-v97') {
    return <AISystemOfRecordV97 />;
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
