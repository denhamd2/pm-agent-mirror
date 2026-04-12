/**
 * Horizontal "bottleneck analyser" strip: one row of segments whose width is proportional * to median completed days per recruiting sub-BP stage (from bp_event_stats aggregates).
 */

import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { colors } from '@workday/canvas-kit-react/tokens';
import { infoIcon } from '@workday/canvas-system-icons-web';
import type { SubBpConfig } from '../data-bp-durations';
import { LABELS } from '../data-bp-durations';

const SEGMENT_COLORS = [
  colors.blueberry400,
  '#F5A623',
  colors.cantaloupe500,
  '#2E7D32',
  '#7CB342',
  '#BF360C',
  '#AD1457',
  '#795548',
  '#5C6BC0',
  '#00838F',
];

export type BottleneckStage = {
  key: string;
  label: string;
  days: number;
  method: 'median' | 'average';
  isPlaceholder?: boolean;
  note?: string;
};

export function stagesFromSubBpsLatestMonth(subBps: SubBpConfig[]): BottleneckStage[] {
  const ym = LABELS[LABELS.length - 1];
  const out: BottleneckStage[] = [];
  for (const bp of subBps) {
    const month = bp.data.find((d) => d.ym === ym) ?? bp.data[bp.data.length - 1];
    const method = month?.completed?.medianDays != null ? 'median' : 'average';
    const raw = method === 'median' ? month?.completed?.medianDays : month?.completed?.avgDays;
    const days = typeof raw === 'number' && !Number.isNaN(raw) ? Math.max(0, raw) : 0;
    if (days > 0) {
      out.push({ key: bp.key, label: bp.label, days, method });
    }
  }
  return out;
}

export interface BottleneckFlowStripProps {
  title: string;
  /** Brief hover text for what the strip measures (low-contrast info icon). */
  titleHelp?: string;
  subtitle?: string;
  stages: BottleneckStage[];
  /** e.g. "Completed events · median days · 2026-02" */
  footnote?: string;
}

export const BottleneckFlowStrip: React.FC<BottleneckFlowStripProps> = ({
  title,
  titleHelp,
  subtitle,
  stages,
  footnote,
}) => {
  const measuredStages = stages.filter((stage) => !stage.isPlaceholder && stage.days > 0);
  const placeholderStages = stages.filter((stage) => stage.isPlaceholder || stage.days <= 0);
  const total = measuredStages.reduce((s, x) => s + x.days, 0);

  if (measuredStages.length === 0 || total <= 0) {
    return (
      <Box style={{ marginTop: 16 }}>
        <Flex alignItems="center" gap="xxs" marginBottom="xs">
          <Heading as="h3" size="small" marginY="zero">
            {title}
          </Heading>
          {titleHelp ? (
            <span title={titleHelp} style={{ display: 'inline-flex', cursor: 'help' }}>
              <SystemIcon icon={infoIcon} size={14} color={colors.soap500} />
            </span>
          ) : null}
        </Flex>
        {subtitle ? (
          <BodyText size="small" style={{ color: colors.blackPepper500, marginBottom: 's' }}>
            {subtitle}
          </BodyText>
        ) : null}
        <BodyText size="small" style={{ color: colors.blackPepper500 }}>
          No completed-stage timing available for this view (check tenant has sub-BP data in Pharos).
        </BodyText>
        {placeholderStages.length > 0 ? (
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, fontSize: 13, color: colors.blackPepper600, lineHeight: 1.6 }}>
            {placeholderStages.map((stage) => (
              <li key={stage.key}>
                <span style={{ fontWeight: 600 }}>{stage.label}</span>
                {' · '}
                {stage.note ?? 'Stage exists in flow, but no duration snapshot is currently materialised.'}
              </li>
            ))}
          </ul>
        ) : null}
      </Box>
    );
  }

  return (
    <Box style={{ marginTop: 16 }}>
      <Flex alignItems="center" gap="xxs" marginBottom="xs">
        <Heading as="h3" size="small" marginY="zero">
          {title}
        </Heading>
        {titleHelp ? (
          <span title={titleHelp} style={{ display: 'inline-flex', cursor: 'help' }}>
            <SystemIcon icon={infoIcon} size={14} color={colors.soap500} />
          </span>
        ) : null}
      </Flex>
      {subtitle ? (
        <BodyText size="small" style={{ color: colors.blackPepper500, marginBottom: 'm' }}>
          {subtitle}
        </BodyText>
      ) : null}

      <div
        role="img"
        aria-label={`Job application flow stages by relative duration, total ${total.toFixed(1)} days across median-first stage timings`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          minHeight: 44,
          borderRadius: 8,
          overflow: 'hidden',
          border: `1px solid ${colors.soap300}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {measuredStages.map((st, i) => {
          const pct = (st.days / total) * 100;
          const bg = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
          return (
            <div
              key={st.key}
              title={`${st.label}: ${st.days.toFixed(1)} ${st.method} days (${pct.toFixed(1)}% of pipeline)`}
              style={{
                flex: `${st.days} 1 0`,
                minWidth: Math.max(8, pct),
                backgroundColor: bg,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 4px',
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.25,
                wordBreak: 'break-word',
              }}
            >
              {pct >= 8 ? `${st.label} · ${st.days.toFixed(1)}d ${st.method === 'average' ? 'avg' : 'med'}` : `${st.days.toFixed(0)}d`}
            </div>
          );
        })}
      </div>

      <ul style={{ margin: '12px 0 0', paddingLeft: 18, fontSize: 13, color: colors.blackPepper600, lineHeight: 1.6 }}>
        {measuredStages.map((st, i) => (
          <li key={st.key}>
            <span style={{ fontWeight: 600, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}>{st.label}</span>
            {' · '}
            {st.days.toFixed(1)} {st.method} days completed ({((st.days / total) * 100).toFixed(1)}% of total)
          </li>
        ))}
        {placeholderStages.map((st) => (
          <li key={st.key}>
            <span style={{ fontWeight: 600, color: colors.blackPepper400 }}>{st.label}</span>
            {' · '}
            {st.note ?? 'Stage exists in the recruiting flow, but no duration snapshot is currently materialised.'}
          </li>
        ))}
      </ul>

      {footnote ? (
        <BodyText size="small" style={{ color: colors.blackPepper400, marginTop: 'xs' }}>
          {footnote}
        </BodyText>
      ) : null}
    </Box>
  );
};
