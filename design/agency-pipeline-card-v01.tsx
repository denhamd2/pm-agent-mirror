import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import { TertiaryButton } from '@workday/canvas-kit-react/button';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  arrowRightIcon,
  exclamationTriangleIcon,
  clockIcon,
} from '@workday/canvas-system-icons-web';
import {
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  SANA_LINK_ACCENT,
} from './components';

type Stage = {
  id: string;
  name: string;
  count: number;
  avgDays: number;
  trend: 'up' | 'down' | 'flat';
  needsAttention?: number;
};

type AttentionItem = {
  id: string;
  candidate: string;
  reqTitle: string;
  stage: string;
  daysInStage: number;
};

const STAGES: Stage[] = [
  { id: 'submitted', name: 'Submitted', count: 14, avgDays: 2, trend: 'flat' },
  { id: 'screen', name: 'Screen', count: 9, avgDays: 4, trend: 'down' },
  { id: 'hm-review', name: 'HM review', count: 6, avgDays: 7, trend: 'up', needsAttention: 2 },
  { id: 'interview', name: 'Interview', count: 4, avgDays: 9, trend: 'flat' },
  { id: 'offer', name: 'Offer', count: 2, avgDays: 5, trend: 'flat' },
  { id: 'hire', name: 'Hired', count: 1, avgDays: 0, trend: 'up' },
];

const ATTENTION: AttentionItem[] = [
  {
    id: 'a1',
    candidate: 'Layla Osman',
    reqTitle: 'Senior Software Engineer (REQ-2026-001)',
    stage: 'HM review',
    daysInStage: 11,
  },
  {
    id: 'a2',
    candidate: 'Omar Khouri',
    reqTitle: 'Product Designer (REQ-2026-014)',
    stage: 'HM review',
    daysInStage: 8,
  },
  {
    id: 'a3',
    candidate: 'Aisha Patel',
    reqTitle: 'Data Analyst (REQ-2026-027)',
    stage: 'Screen',
    daysInStage: 6,
  },
];

function StageTile({ stage }: { stage: Stage }) {
  const overdue = stage.avgDays >= 7;
  return (
    <Box
      role="button"
      tabIndex={0}
      style={{
        backgroundColor: colors.frenchVanilla100,
        border: `1px solid ${colors.soap300}`,
        borderRadius: 12,
        padding: 14,
        cursor: 'pointer',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
        minWidth: 0,
        minHeight: 132,
      }}
    >
      <Flex flexDirection="column" gap="xxs">
        <Subtext
          size="medium"
          style={{ color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {stage.name}
        </Subtext>
        <Flex alignItems="baseline" gap="xxs">
          <Heading size="medium" style={{ color: colors.blackPepper500, marginTop: 2 }}>
            {stage.count}
          </Heading>
          <Subtext size="small" style={{ color: colors.blackPepper300 }}>
            candidates
          </Subtext>
        </Flex>
        <Flex alignItems="center" gap="xxs" style={{ marginTop: 6 }}>
          <SystemIcon
            icon={clockIcon}
            size={14}
            color={overdue ? colors.cinnamon500 : colors.blackPepper300}
          />
          <Subtext
            size="small"
            style={{ color: overdue ? colors.cinnamon500 : colors.blackPepper400 }}
          >
            {stage.avgDays === 0 ? '—' : `${stage.avgDays}d avg in stage`}
          </Subtext>
        </Flex>
        {stage.needsAttention ? (
          <Box style={{ marginTop: 8 }}>
            <StatusIndicator
              type={StatusIndicator.Type.Orange}
              emphasis={StatusIndicator.Emphasis.Low}
              label={`${stage.needsAttention} need attention`}
            >
            </StatusIndicator>
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
}

function AttentionRow({ item }: { item: AttentionItem }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      style={{
        padding: '10px 0',
        borderBottom: `1px solid ${colors.soap200}`,
      }}
    >
      <Flex alignItems="center" gap="s" style={{ minWidth: 0, flex: 1 }}>
        <SystemIcon icon={exclamationTriangleIcon} size={16} color={colors.cinnamon500} />
        <Box style={{ minWidth: 0 }}>
          <BodyText size="medium" style={{ color: colors.blackPepper500, fontWeight: 600 }}>
            {item.candidate}
          </BodyText>
          <Subtext size="small" style={{ color: colors.blackPepper300 }}>
            {item.reqTitle} · {item.stage} · {item.daysInStage} days
          </Subtext>
        </Box>
      </Flex>
      <TertiaryButton
        icon={arrowRightIcon}
        iconPosition="end"
        style={{ color: SANA_LINK_ACCENT, flexShrink: 0 }}
      >
        Follow up
      </TertiaryButton>
    </Flex>
  );
}

export function AgencyPipelineCardV01() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        backgroundColor: SANA_PAGE_CANVAS,
        padding: '24px 16px',
        fontFamily: '"Roboto", sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/*
        Capture root: this is the sole element captured for Maestro.
        Width/height match the canonical card aspect for ModulR layouts.
      */}
      <Box
        id="figma-capture-root"
        style={{
          width: 580,
          margin: '0 auto',
          backgroundColor: colors.frenchVanilla100,
          border: `1px solid ${colors.soap300}`,
          borderRadius: SANA_CARD_RADIUS_LG,
          padding: 20,
          boxShadow: '0 2px 6px rgba(15, 46, 102, 0.06)',
        }}
      >
        <Flex justifyContent="space-between" alignItems="flex-start" style={{ marginBottom: 4 }}>
          <Box>
            <Heading size="small" style={{ color: colors.blackPepper500, margin: 0 }}>
              My active pipeline
            </Heading>
            <BodyText size="medium" style={{ color: colors.blackPepper400, marginTop: 2 }}>
              Candidates I've submitted to customer requisitions, by stage
            </BodyText>
          </Box>
          <TertiaryButton
            icon={arrowRightIcon}
            iconPosition="end"
            style={{ color: SANA_LINK_ACCENT }}
          >
            View all candidates
          </TertiaryButton>
        </Flex>

        <div
          aria-label="Pipeline stages"
          style={{
            marginTop: 20,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 12,
          }}
        >
          {STAGES.map((s) => (
            <StageTile key={s.id} stage={s} />
          ))}
        </div>

        <Box
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${colors.soap300}`,
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" style={{ marginBottom: 6 }}>
            <Heading size="small" style={{ color: colors.blackPepper500, margin: 0, fontSize: 16 }}>
              Needs attention
            </Heading>
            <Subtext size="small" style={{ color: colors.blackPepper300 }}>
              3 candidates stuck more than 5 days
            </Subtext>
          </Flex>
          {ATTENTION.map((item) => (
            <AttentionRow key={item.id} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default AgencyPipelineCardV01;
