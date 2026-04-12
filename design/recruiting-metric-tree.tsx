import React, { useMemo, useRef, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW, SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import {
  TREE_META,
  TREE_NODES,
  TREE_EDGES,
  TREE_LEVELS,
  type MetricTreeConfidence,
  type MetricTreeNode,
} from './data-recruiting-metric-tree';

type ViewportState = {
  x: number;
  y: number;
  scale: number;
};

type DragState = {
  active: boolean;
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
};

const NODE_HEIGHT = 138;
const DEFAULT_NODE_WIDTH = 228;

const chartCardStyle: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
  border: `1px solid ${colors.soap300}`,
  backgroundColor: colors.frenchVanilla100,
};

const LEVEL_Y: Record<(typeof TREE_LEVELS)[number], number> = {
  'Business Value Outcomes': 28,
  'Product Value Outcomes': 280,
  'Adoption & Usage': 880,
};

const CONFIDENCE_STYLE: Record<
  MetricTreeConfidence,
  { bg: string; fg: string; stroke: string; dash?: string; badge: string }
> = {
  Measured: {
    bg: colors.greenApple100,
    fg: colors.greenApple700,
    stroke: colors.greenApple500,
    badge: 'Measured',
  },
  Directional: {
    bg: colors.blueberry100,
    fg: colors.blueberry600,
    stroke: colors.blueberry400,
    dash: '6 5',
    badge: 'Directional',
  },
  Future: {
    bg: colors.soap100,
    fg: colors.blackPepper400,
    stroke: colors.soap500,
    dash: '4 6',
    badge: 'Future',
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sparklinePoints(values: number[], width = 112, height = 28): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

function edgePath(from: MetricTreeNode, to: MetricTreeNode): string {
  const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
  const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
  const startX = from.x + fromWidth / 2;
  const endX = to.x + toWidth / 2;
  const startY = from.y < to.y ? from.y + NODE_HEIGHT : from.y;
  const endY = from.y < to.y ? to.y : to.y + NODE_HEIGHT;
  const midY = (startY + endY) / 2;
  return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
}

function formatLevelSummary(level: string): string {
  if (level === 'Business Value Outcomes') return 'North-star hiring results and business value';
  if (level === 'Product Value Outcomes') return 'Product and process outcomes that shape those results';
  return 'Adoption, usage, and demand signals upstream of the outcome layer';
}

function NodeCard({
  node,
  selected,
  onSelect,
}: {
  node: MetricTreeNode;
  selected: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const confidence = CONFIDENCE_STYLE[node.confidence];
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.width ?? DEFAULT_NODE_WIDTH,
        height: NODE_HEIGHT,
        borderRadius: 16,
        border: selected ? `2px solid ${colors.blueberry500}` : `1px solid ${colors.soap300}`,
        background: selected ? '#f7fbff' : colors.frenchVanilla100,
        boxShadow: selected ? '0 10px 26px rgba(0,112,210,0.18)' : '0 8px 22px rgba(0,0,0,0.08)',
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <Flex justifyContent="space-between" gap="s" alignItems="flex-start" style={{ marginBottom: 8 }}>
        <Box style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {node.shortTitle ?? node.level}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.25 }}>{node.title}</div>
        </Box>
        <span
          style={{
            flexShrink: 0,
            padding: '3px 8px',
            borderRadius: 999,
            background: confidence.bg,
            color: confidence.fg,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {confidence.badge}
        </span>
      </Flex>

      <div style={{ fontSize: 24, fontWeight: 700, color: colors.blackPepper600 }}>{node.value}</div>
      <div style={{ fontSize: 11, color: colors.blackPepper400, lineHeight: 1.35, marginTop: 4 }}>{node.valueContext}</div>

      <Flex justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <span
          style={{
            fontSize: 10,
            color: colors.blackPepper400,
            background: colors.soap100,
            borderRadius: 999,
            padding: '3px 7px',
          }}
        >
          {node.source}
        </span>
        <svg width="112" height="28" viewBox="0 0 112 28" aria-hidden="true">
          <polyline
            fill="none"
            stroke={confidence.stroke}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={sparklinePoints(node.trend)}
          />
        </svg>
      </Flex>
    </button>
  );
}

export const RecruitingMetricTreePage: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('avg-time-to-hire');
  const [view, setView] = useState<ViewportState>({ x: 55, y: 10, scale: 0.72 });
  const [drag, setDrag] = useState<DragState>({
    active: false,
    pointerX: 0,
    pointerY: 0,
    originX: 0,
    originY: 0,
  });

  const nodeMap = useMemo(() => new Map(TREE_NODES.map((node) => [node.id, node])), []);
  const selectedNode = nodeMap.get(selectedNodeId) ?? TREE_NODES[0];
  const confidenceCounts = useMemo(
    () => ({
      measured: TREE_NODES.filter((node) => node.confidence === 'Measured').length,
      directional: TREE_NODES.filter((node) => node.confidence === 'Directional').length,
      future: TREE_NODES.filter((node) => node.confidence === 'Future').length,
    }),
    []
  );
  const connectedEdges = useMemo(
    () => TREE_EDGES.filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id),
    [selectedNode.id]
  );
  const outboundNodes = useMemo(
    () =>
      connectedEdges
        .filter((edge) => edge.from === selectedNode.id)
        .map((edge) => ({ edge, node: nodeMap.get(edge.to) }))
        .filter((item): item is { edge: (typeof TREE_EDGES)[number]; node: MetricTreeNode } => item.node != null),
    [connectedEdges, nodeMap, selectedNode.id]
  );
  const inboundNodes = useMemo(
    () =>
      connectedEdges
        .filter((edge) => edge.to === selectedNode.id)
        .map((edge) => ({ edge, node: nodeMap.get(edge.from) }))
        .filter((item): item is { edge: (typeof TREE_EDGES)[number]; node: MetricTreeNode } => item.node != null),
    [connectedEdges, nodeMap, selectedNode.id]
  );

  const setViewForNode = (node: MetricTreeNode, scale = 0.96) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) {
      setView({ x: 40, y: 20, scale });
      return;
    }
    const nodeWidth = node.width ?? DEFAULT_NODE_WIDTH;
    setView({
      scale,
      x: rect.width / 2 - (node.x + nodeWidth / 2) * scale,
      y: rect.height / 3 - (node.y + NODE_HEIGHT / 2) * scale,
    });
  };

  const focusLevel = (level: (typeof TREE_LEVELS)[number]) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const nodes = TREE_NODES.filter((node) => node.level === level);
    if (!rect || nodes.length === 0) return;
    const left = Math.min(...nodes.map((node) => node.x));
    const right = Math.max(...nodes.map((node) => node.x + (node.width ?? DEFAULT_NODE_WIDTH)));
    const top = Math.min(...nodes.map((node) => node.y));
    const bottom = Math.max(...nodes.map((node) => node.y + NODE_HEIGHT));
    const scale = clamp(Math.min((rect.width - 80) / (right - left + 80), (rect.height - 120) / (bottom - top + 80)), 0.48, 1.12);
    setView({
      scale,
      x: 40 - left * scale,
      y: 70 - top * scale,
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const nextScale = clamp(view.scale * (event.deltaY < 0 ? 1.08 : 0.92), 0.48, 1.4);
    const worldX = (pointerX - view.x) / view.scale;
    const worldY = (pointerY - view.y) / view.scale;

    setView({
      scale: nextScale,
      x: pointerX - worldX * nextScale,
      y: pointerY - worldY * nextScale,
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDrag({
      active: true,
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: view.x,
      originY: view.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    setView((current) => ({
      ...current,
      x: drag.originX + (event.clientX - drag.pointerX),
      y: drag.originY + (event.clientY - drag.pointerY),
    }));
  };

  const stopDragging = () => {
    setDrag((current) => ({ ...current, active: false }));
  };

  return (
    <Box
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: SANA_PAGE_CANVAS,
      }}
    >
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          cursor: drag.active ? 'grabbing' : 'grab',
          backgroundColor: '#f8fafc',
          backgroundImage:
            'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: TREE_META.canvas.width,
            height: TREE_META.canvas.height,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            transformOrigin: 'top left',
          }}
        >
          <svg
            width={TREE_META.canvas.width}
            height={TREE_META.canvas.height}
            viewBox={`0 0 ${TREE_META.canvas.width} ${TREE_META.canvas.height}`}
            style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
          >
            {TREE_LEVELS.map((level) => (
              <g key={level}>
                <rect
                  x={32}
                  y={LEVEL_Y[level]}
                  width={260}
                  height={38}
                  rx={19}
                  fill="rgba(15,23,42,0.06)"
                  stroke="rgba(15,23,42,0.05)"
                />
                <text x={50} y={LEVEL_Y[level] + 16} fill={colors.blackPepper600} fontSize="12" fontWeight="700">
                  {level}
                </text>
                <text x={50} y={LEVEL_Y[level] + 29} fill={colors.blackPepper400} fontSize="10">
                  {formatLevelSummary(level)}
                </text>
              </g>
            ))}

            {TREE_EDGES.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const confidence = CONFIDENCE_STYLE[edge.confidence];
              const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
              const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
              const labelX = ((from.x + fromWidth / 2) + (to.x + toWidth / 2)) / 2;
              const labelY = ((from.y < to.y ? from.y + NODE_HEIGHT : from.y) + (from.y < to.y ? to.y : to.y + NODE_HEIGHT)) / 2 - 8;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={edgePath(from, to)}
                    fill="none"
                    stroke={confidence.stroke}
                    strokeWidth={2}
                    strokeDasharray={confidence.dash}
                    opacity={0.9}
                  />
                  <rect
                    x={labelX - 64}
                    y={labelY - 11}
                    width={128}
                    height={22}
                    rx={11}
                    fill="#ffffff"
                    opacity={0.94}
                  />
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor="middle"
                    fill={colors.blackPepper400}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {TREE_NODES.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              selected={selectedNode.id === node.id}
              onSelect={(nodeId) => setSelectedNodeId(nodeId)}
            />
          ))}
        </div>
      </div>

      <Card
        style={{
          ...chartCardStyle,
          position: 'absolute',
          left: 20,
          top: 20,
          width: 460,
          maxWidth: 'calc(100vw - 40px)',
          padding: 18,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Heading size="small" marginBottom="xxs">
          {TREE_META.title}
        </Heading>
        <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, marginBottom: 12 }}>
          {TREE_META.subtitle}
        </BodyText>
        <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 12 }}>
          Drag to pan. Use the mouse wheel or the zoom buttons to move around the tree. Click any node to inspect the definition and connected metrics.
        </BodyText>

        <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          <SecondaryButton onClick={() => setView({ x: 80, y: 30, scale: 0.72 })}>Reset view</SecondaryButton>
          <SecondaryButton onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale * 1.12, 0.48, 1.4) }))}>
            Zoom in
          </SecondaryButton>
          <SecondaryButton onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale * 0.9, 0.48, 1.4) }))}>
            Zoom out
          </SecondaryButton>
          <SecondaryButton onClick={() => setViewForNode(selectedNode)}>Focus selected</SecondaryButton>
        </Flex>

        <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          {TREE_LEVELS.map((level) => (
            <SecondaryButton key={level} onClick={() => focusLevel(level)} size="small">
              {level}
            </SecondaryButton>
          ))}
        </Flex>

        <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          <Box style={{ padding: '8px 12px', borderRadius: 12, background: '#f4f8ff', border: `1px solid ${colors.blueberry200}` }}>
            <div style={{ fontSize: 11, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nodes</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600 }}>{TREE_NODES.length}</div>
          </Box>
          <Box style={{ padding: '8px 12px', borderRadius: 12, background: '#f2fbf5', border: `1px solid ${colors.greenApple200}` }}>
            <div style={{ fontSize: 11, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Measured</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600 }}>{confidenceCounts.measured}</div>
          </Box>
          <Box style={{ padding: '8px 12px', borderRadius: 12, background: '#f5f8ff', border: `1px solid ${colors.blueberry200}` }}>
            <div style={{ fontSize: 11, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Directional</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600 }}>{confidenceCounts.directional}</div>
          </Box>
          <Box style={{ padding: '8px 12px', borderRadius: 12, background: '#f7f7f8', border: `1px solid ${colors.soap300}` }}>
            <div style={{ fontSize: 11, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Future</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.blackPepper600 }}>{confidenceCounts.future}</div>
          </Box>
        </Flex>

        <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
          <strong>Source note:</strong> {TREE_META.sourceSummary}
        </BodyText>
      </Card>

      <Card
        style={{
          ...chartCardStyle,
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 380,
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          padding: 18,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Heading size="small" marginBottom="xs">
          {selectedNode.title}
        </Heading>
        <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 12 }}>
          {selectedNode.level}
        </BodyText>

        <div style={{ fontSize: 30, fontWeight: 700, color: colors.blackPepper600 }}>{selectedNode.value}</div>
        <BodyText size="small" color={colors.blackPepper400} style={{ marginTop: 4, marginBottom: 12 }}>
          {selectedNode.valueContext}
        </BodyText>

        <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: 999,
              background: CONFIDENCE_STYLE[selectedNode.confidence].bg,
              color: CONFIDENCE_STYLE[selectedNode.confidence].fg,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {selectedNode.confidence}
          </span>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: 999,
              background: colors.soap100,
              color: colors.blackPepper500,
              fontSize: 11,
            }}
          >
            {selectedNode.source}
          </span>
        </Flex>

        <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6, marginBottom: 14 }}>
          {selectedNode.definition}
        </BodyText>

        {selectedNode.caveat ? (
          <Card padding="s" style={{ background: '#fff8eb', border: '1px solid #f1d199', marginBottom: 16 }}>
            <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.5 }}>
              <strong>Caveat:</strong> {selectedNode.caveat}
            </BodyText>
          </Card>
        ) : null}

        <Heading size="small" marginBottom="xs">
          Connected metrics
        </Heading>
        <Flex flexDirection="column" gap="s" style={{ marginBottom: 16 }}>
          {inboundNodes.length === 0 && outboundNodes.length === 0 ? (
            <BodyText size="small" color={colors.blackPepper400}>
              No connected metrics are configured for this node yet.
            </BodyText>
          ) : null}
          {inboundNodes.map(({ edge, node }) => (
            <button
              key={`in-${edge.from}-${edge.to}`}
              type="button"
              onClick={() => {
                setSelectedNodeId(node.id);
                setViewForNode(node, 0.92);
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 12,
                border: `1px solid ${colors.soap300}`,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, color: colors.blackPepper400, marginBottom: 3 }}>Drives this metric via {edge.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.blackPepper600 }}>{node.title}</div>
            </button>
          ))}
          {outboundNodes.map(({ edge, node }) => (
            <button
              key={`out-${edge.from}-${edge.to}`}
              type="button"
              onClick={() => {
                setSelectedNodeId(node.id);
                setViewForNode(node, 0.92);
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 12,
                border: `1px solid ${colors.soap300}`,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, color: colors.blackPepper400, marginBottom: 3 }}>Influences {node.title} via {edge.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.blackPepper600 }}>{node.title}</div>
            </button>
          ))}
        </Flex>

        <Heading size="small" marginBottom="xs">
          Link legend
        </Heading>
        <Flex flexDirection="column" gap="s">
          {(['Measured', 'Directional', 'Future'] as MetricTreeConfidence[]).map((confidence) => (
            <Flex key={confidence} gap="s" alignItems="center">
              <svg width="36" height="8" viewBox="0 0 36 8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="36"
                  y2="4"
                  stroke={CONFIDENCE_STYLE[confidence].stroke}
                  strokeWidth="2"
                  strokeDasharray={CONFIDENCE_STYLE[confidence].dash}
                />
              </svg>
              <BodyText size="small" color={colors.blackPepper500}>
                <strong>{confidence}:</strong>{' '}
                {confidence === 'Measured'
                  ? 'Repo-backed relationship.'
                  : confidence === 'Directional'
                    ? 'Strategically useful, but not a direct causal join.'
                    : 'Tracker intent or future instrumentation.'}
              </BodyText>
            </Flex>
          ))}
        </Flex>

        <Card padding="s" style={{ marginTop: 16, background: colors.soap100 }}>
          <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.6 }}>
            <strong>Tree caveat:</strong> {TREE_META.caveat}
          </BodyText>
        </Card>
      </Card>
    </Box>
  );
};
