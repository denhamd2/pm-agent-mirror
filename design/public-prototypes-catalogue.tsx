import React from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_LINK_ACCENT,
} from './components/sanaShellTheme';
import { PUBLIC_PROTOTYPES, type PublicPrototype } from './public-catalogue';

/**
 * Public prototypes catalogue page rendered at the GHE Pages root.
 *
 * Renders only the metadata in `PUBLIC_PROTOTYPES`. No save/star button (no
 * localhost API on Pages). No PRD/brief/deck links (those point at local docs/
 * paths that don't exist on Pages). The full localhost dashboard remains the
 * canonical experience for everything else.
 */

function PrototypeCard({ prototype }: { prototype: PublicPrototype }) {
  /** Hash routes — static GHE Pages often returns a real 404 for `./slug` paths (no 404.html SPA fallback). */
  const href = `#${prototype.slug}`;
  return (
    <a
      href={href}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: '#FFFFFF',
        borderRadius: SANA_CARD_RADIUS_LG,
        boxShadow: SANA_CARD_SHADOW,
        padding: 20,
        border: '1px solid #E5E7EB',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 46, 102, 0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = SANA_CARD_SHADOW;
      }}
    >
      <Flex flexDirection="column" gap="xs" style={{ minHeight: 140 }}>
        <span
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 999,
            background: '#EEF2FF',
            color: SANA_LINK_ACCENT,
            marginBottom: 6,
          }}
        >
          {prototype.category}
        </span>
        <Heading size="small" style={{ margin: 0, lineHeight: 1.3 }}>
          {prototype.name}
        </Heading>
        <BodyText size="small" style={{ color: '#4B4B4B', marginTop: 4 }}>
          {prototype.description}
        </BodyText>
        <Box style={{ flex: 1 }} />
        <Subtext size="medium" style={{ color: SANA_LINK_ACCENT, fontWeight: 600 }}>
          Open prototype →
        </Subtext>
      </Flex>
    </a>
  );
}

export function PublicPrototypesCatalogue() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: SANA_PAGE_CANVAS,
        padding: '48px 32px 64px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Flex flexDirection="column" gap="xs" style={{ marginBottom: 32 }}>
          <Heading size="medium" style={{ margin: 0 }}>
            Workday Recruiting prototype catalogue
          </Heading>
          <BodyText size="medium" style={{ color: '#4B4B4B', maxWidth: 720 }}>
            UI exploration prototypes built with Canvas Kit. Data-backed
            dashboards (IUM metrics, customer scorecards, business-process
            durations) remain on the local dashboard only.
          </BodyText>
        </Flex>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {PUBLIC_PROTOTYPES.map((p) => (
            <PrototypeCard key={p.slug} prototype={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicPrototypesCatalogue;
