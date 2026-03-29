import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import { CanvasProvider } from '@workday/canvas-kit-react/common';
import { fonts } from '@workday/canvas-kit-react-fonts';
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
import FranceWhatsappOmnichannelEngagementV75 from './france-whatsapp-omnichannel-engagement-v75';
import { GccRecruiterDashboard } from './gcc-recruiter-dashboard';
import { GccUnifiedCandidateReviewV57 } from './gcc-unified-candidate-review-v57';
import GccNationalisationLocalComplianceReportingV61 from './gcc-nationalisation-local-compliance-reporting-v61';
import GccNationalisationLocalComplianceReportingV62 from './gcc-nationalisation-local-compliance-reporting-v62';
import { SANA_PAGE_CANVAS } from './components';

/** Prototype slugs backed by `design/*.tsx` modules in this branch (see `vite.config.ts` `slugs` Set). */
function prototypeFromLocation():
  | 'france-whatsapp-omnichannel-engagement-v75'
  | 'gcc-recruiter-dashboard'
  | 'gcc-unified-candidate-review-v57'
  | 'gcc-nationalisation-local-compliance-reporting-v61'
  | 'gcc-nationalisation-local-compliance-reporting-v62' {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.endsWith('france-whatsapp-omnichannel-engagement-v75')) {
    return 'france-whatsapp-omnichannel-engagement-v75';
  }
  if (path.endsWith('gcc-nationalisation-local-compliance-reporting-v62')) {
    return 'gcc-nationalisation-local-compliance-reporting-v62';
  }
  if (path.endsWith('gcc-nationalisation-local-compliance-reporting-v61')) {
    return 'gcc-nationalisation-local-compliance-reporting-v61';
  }
  if (path.endsWith('gcc-unified-candidate-review-v57')) return 'gcc-unified-candidate-review-v57';
  if (path.endsWith('gcc-recruiter-dashboard')) return 'gcc-recruiter-dashboard';
  const h = window.location.hash.replace(/^#\/?/, '');
  if (
    h === 'france-whatsapp-omnichannel-engagement-v75' ||
    h.startsWith('france-whatsapp-omnichannel-engagement-v75')
  ) {
    return 'france-whatsapp-omnichannel-engagement-v75';
  }
  if (
    h === 'gcc-nationalisation-local-compliance-reporting-v62' ||
    h.startsWith('gcc-nationalisation-local-compliance-reporting-v62')
  ) {
    return 'gcc-nationalisation-local-compliance-reporting-v62';
  }
  if (
    h === 'gcc-nationalisation-local-compliance-reporting-v61' ||
    h.startsWith('gcc-nationalisation-local-compliance-reporting-v61')
  ) {
    return 'gcc-nationalisation-local-compliance-reporting-v61';
  }
  if (h === 'gcc-unified-candidate-review-v57' || h.startsWith('gcc-unified-candidate-review-v57')) {
    return 'gcc-unified-candidate-review-v57';
  }
  if (h === 'gcc-recruiter-dashboard' || h.startsWith('gcc-recruiter-dashboard')) {
    return 'gcc-recruiter-dashboard';
  }
  return 'france-whatsapp-omnichannel-engagement-v75';
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
  if (route === 'france-whatsapp-omnichannel-engagement-v75') {
    return <FranceWhatsappOmnichannelEngagementV75 />;
  }
  if (route === 'gcc-nationalisation-local-compliance-reporting-v62') {
    return <GccNationalisationLocalComplianceReportingV62 />;
  }
  if (route === 'gcc-nationalisation-local-compliance-reporting-v61') {
    return <GccNationalisationLocalComplianceReportingV61 />;
  }
  if (route === 'gcc-unified-candidate-review-v57') return <GccUnifiedCandidateReviewV57 />;
  if (route === 'gcc-recruiter-dashboard') return <GccRecruiterDashboard />;
  return <FranceWhatsappOmnichannelEngagementV75 />;
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
