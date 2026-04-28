import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import { CanvasProvider } from '@workday/canvas-kit-react/common';
import { fonts } from '@workday/canvas-kit-react-fonts';
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
import PMAgentDashboardPublic from './pm-agent-dashboard-public';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';

/**
 * Public GHE Pages entry point. Renders only the PM Agent dashboard with
 * Design System and Agent Flow tabs. Any other route shows a placeholder
 * indicating that the content is localhost-only.
 *
 * Build-time isolation is enforced by `vite-plugin-forbidden-imports.ts`
 * registered in `vite.config.public.ts`. Any forbidden import that becomes
 * reachable from this entry will fail the build at module-resolve time.
 */

type PublicRoute = 'pm-agent-dashboard' | 'localhost-only';

function routeFromLocation(): PublicRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (!hash || hash === 'pm-agent-dashboard') return 'pm-agent-dashboard';

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (!lastSegment || lastSegment === 'pm-agent-dashboard') return 'pm-agent-dashboard';

  return 'localhost-only';
}

function LocalhostOnlyPlaceholder() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: SANA_PAGE_CANVAS,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          background: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          padding: 32,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1f1f1f', marginBottom: 8 }}>
          This content is localhost-only
        </div>
        <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 16 }}>
          Customer-attributable dashboards, Pharos-derived metrics, and internal roundups are not
          published to GHE Pages. Run the full dashboard locally with <code style={{ background: '#f4f4f5', padding: '1px 4px', borderRadius: 4 }}>npm run dev</code> in the <code style={{ background: '#f4f4f5', padding: '1px 4px', borderRadius: 4 }}>design/</code> folder.
        </div>
        <a
          href="#pm-agent-dashboard?tab=design-system"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: 8,
            background: '#0875e1',
            color: '#ffffff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Open the public preview
        </a>
      </div>
    </div>
  );
}

function AppRoot() {
  const [route, setRoute] = useState<PublicRoute>(routeFromLocation);

  useEffect(() => {
    const sync = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  if (route === 'pm-agent-dashboard') {
    return <PMAgentDashboardPublic />;
  }
  return <LocalhostOnlyPlaceholder />;
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found in public.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <CanvasProvider>
      <Global
        styles={css`
          ${fonts}
          html, body {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
            background: ${SANA_PAGE_CANVAS};
          }
          * {
            box-sizing: border-box;
          }
        `}
      />
      <AppRoot />
    </CanvasProvider>
  </React.StrictMode>
);
