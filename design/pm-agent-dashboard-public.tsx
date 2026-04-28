import React, { useEffect, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PageHeader } from './components/PageHeader';
import { DesignSystemTab } from './components/DesignSystemTab';
import { AgentFlowTab } from './components/AgentFlowTab';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';

type PublicTab = 'design-system' | 'agent-flow';

const TAB_LABELS: Record<PublicTab, string> = {
  'design-system': 'Design System',
  'agent-flow': 'Agent Flow',
};

const TAB_SUBTITLES: Record<PublicTab, string> = {
  'design-system':
    'Sana Style design tokens, Canvas Kit components, and shared UI patterns used across Workday Recruiting prototypes.',
  'agent-flow':
    'How the PM Agent orchestrates specialist subagents, MCPs, and skills across the four modular workflows.',
};

const PUBLIC_TABS: readonly PublicTab[] = ['design-system', 'agent-flow'];

function getTabFromHash(): PublicTab {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const tabMatch = raw.match(/tab=([^&]+)/);
  const candidate = tabMatch ? decodeURIComponent(tabMatch[1]) : '';
  if ((PUBLIC_TABS as readonly string[]).includes(candidate)) {
    return candidate as PublicTab;
  }
  return 'design-system';
}

function topNavLinkStyle(active: boolean): React.CSSProperties {
  return {
    textDecoration: 'none',
    color: active ? colors.blueberry600 : colors.blackPepper500,
    fontSize: 14,
    fontWeight: active ? 700 : 600,
    padding: '10px 2px',
    borderBottom: active ? `2px solid ${colors.blueberry500}` : '2px solid transparent',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  };
}

const PMAgentDashboardPublic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PublicTab>(getTabFromHash);

  useEffect(() => {
    const newHash = `#pm-agent-dashboard?tab=${activeTab}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState({}, '', newHash);
    }
  }, [activeTab]);

  useEffect(() => {
    const onHashChange = () => {
      const next = getTabFromHash();
      setActiveTab((current) => (current === next ? current : next));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <Box style={{ borderBottom: `1px solid ${colors.soap300}`, background: '#ffffff' }}>
        <Box style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px' }}>
          <Flex justifyContent="space-between" alignItems="center" gap="l" style={{ flexWrap: 'wrap', marginBottom: 10 }}>
            <Box style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.1 }}>
                PM Agent Dashboard
              </div>
              <div style={{ fontSize: 12, color: colors.blackPepper400, marginTop: 2 }}>
                Public preview - {TAB_LABELS[activeTab]}
              </div>
            </Box>
            <Box>
              <BodyText size="small" color={colors.licorice300} style={{ fontStyle: 'italic' }}>
                Data-heavy dashboards are localhost-only.
              </BodyText>
            </Box>
          </Flex>
          <Flex gap="m" style={{ overflowX: 'auto', paddingBottom: 4, alignItems: 'center' }}>
            {PUBLIC_TABS.map((tab) => (
              <a
                key={tab}
                href={`#pm-agent-dashboard?tab=${tab}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveTab(tab);
                }}
                style={topNavLinkStyle(activeTab === tab)}
              >
                {TAB_LABELS[tab]}
              </a>
            ))}
          </Flex>
        </Box>
      </Box>

      <Box style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <PageHeader title={TAB_LABELS[activeTab]} subtitle={TAB_SUBTITLES[activeTab]} />

        <Box>
          {activeTab === 'design-system' && <DesignSystemTab />}
          {activeTab === 'agent-flow' && <AgentFlowTab />}
        </Box>

        <Box marginTop="xl" style={{ borderTop: `1px solid ${colors.soap300}`, paddingTop: 16 }}>
          <Flex justifyContent="space-between" alignItems="center" gap="m" style={{ flexWrap: 'wrap' }}>
            <BodyText size="small" color={colors.licorice300}>
              Public preview build. Customer data, Pharos metrics, and internal roundups live on the localhost dashboard only.
            </BodyText>
            <Heading size="small" color={colors.licorice400} style={{ margin: 0, fontSize: 12 }}>
              Workday Recruiting / PM Agent
            </Heading>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default PMAgentDashboardPublic;
