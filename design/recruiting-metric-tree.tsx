import React, { useMemo, useRef, useState } from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { BodyText, Heading } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SANA_PAGE_CANVAS } from './components/sanaShellTheme';
import {
  TREE_META,
  TREE_NODES,
  TREE_EDGES,
  TREE_LEVELS,
  type MetricTreeConfidence,
  type MetricTreeNode,
} from './data-recruiting-metric-tree';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip);

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
const RAIL_WIDTH = 360;

const LEVEL_Y: Record<(typeof TREE_LEVELS)[number], number> = {
  'Business Value Outcome': 44,
  'Product Value Drivers': 312,
  'Operational Drivers': 662,
};

const CONFIDENCE_STYLE: Record<
  MetricTreeConfidence,
  { bg: string; fg: string; stroke: string; dash?: string; badge: string }
> = {
  Measured: {
    bg: colors.greenApple100,
    fg: colors.greenApple700,
    stroke: colors.greenApple500,
    dash: '6 5',
    badge: 'Measured',
  },
  Directional: {
    bg: colors.blueberry100,
    fg: colors.blueberry600,
    stroke: colors.blueberry400,
    dash: '6 5',
    badge: 'Directional',
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function alignSeries(a: number[], b: number[]): [number[], number[]] {
  const length = Math.min(a.length, b.length);
  return [a.slice(-length), b.slice(-length)];
}

function pearsonCorrelation(a: number[], b: number[]): number | null {
  const [seriesA, seriesB] = alignSeries(a, b);
  if (seriesA.length < 3) return null;
  const meanA = seriesA.reduce((sum, value) => sum + value, 0) / seriesA.length;
  const meanB = seriesB.reduce((sum, value) => sum + value, 0) / seriesB.length;
  const centeredA = seriesA.map((value) => value - meanA);
  const centeredB = seriesB.map((value) => value - meanB);
  const numerator = centeredA.reduce((sum, value, index) => sum + value * centeredB[index], 0);
  const varianceA = centeredA.reduce((sum, value) => sum + value * value, 0);
  const varianceB = centeredB.reduce((sum, value) => sum + value * value, 0);
  const denominator = Math.sqrt(varianceA * varianceB);
  if (!Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function correlationStrength(correlation: number | null): 'Strong' | 'Moderate' | 'Weak' {
  if (correlation == null) return 'Weak';
  const magnitude = Math.abs(correlation);
  if (magnitude >= 0.75) return 'Strong';
  if (magnitude >= 0.45) return 'Moderate';
  return 'Weak';
}

function formatLevelSummary(level: string): string {
  if (level === 'Business Value Outcome') return 'North-star business result';
  if (level === 'Product Value Drivers') return 'Measured product outcomes PMs can influence';
  return 'Lower-level behaviours that speed up or slow down the layer above';
}

function chartData(values: number[], stroke: string, fill: string) {
  return {
    labels: values.map((_, index) => `P${index + 1}`),
    datasets: [
      {
        data: values,
        borderColor: stroke,
        backgroundColor: fill,
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };
}

const miniChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { line: { capBezierPoints: true } },
};

const railChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { display: false, grid: { display: false } },
    y: { display: true, grid: { color: 'rgba(15,23,42,0.08)' }, ticks: { color: colors.blackPepper400, maxTicksLimit: 4 } },
  },
};

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
      onClick={(event) => {
        event.stopPropagation();
        onSelect(node.id);
      }}
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
          <div style={{ fontSize: 10, color: colors.blackPepper400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {node.level}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.blackPepper600, lineHeight: 1.25 }}>{node.title}</div>
          {node.shortTitle ? (
            <div style={{ fontSize: 10, color: colors.blackPepper400, lineHeight: 1.35, marginTop: 2 }}>
              {node.shortTitle}
            </div>
          ) : null}
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
            fontSize: 9,
            color: colors.blackPepper400,
            background: colors.soap100,
            borderRadius: 999,
            padding: '3px 7px',
          }}
        >
          {node.source}
        </span>
        <div style={{ width: 96, height: 24 }}>
          <Line
            data={chartData(node.trend, confidence.stroke, `${confidence.stroke}22`)}
            options={miniChartOptions}
          />
        </div>
      </Flex>
    </button>
  );
}

export const RecruitingMetricTreePage: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragMovedRef = useRef(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [view, setView] = useState<ViewportState>({ x: 48, y: 18, scale: 0.74 });
  const [drag, setDrag] = useState<DragState>({
    active: false,
    pointerX: 0,
    pointerY: 0,
    originX: 0,
    originY: 0,
  });

  const nodeMap = useMemo(() => new Map(TREE_NODES.map((node) => [node.id, node])), []);
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null;
  const edgeInsights = useMemo(
    () =>
      TREE_EDGES.map((edge) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        const correlation = !from || !to ? null : pearsonCorrelation(from.trend, to.trend);
        const strength = correlationStrength(correlation);
        return {
          ...edge,
          correlation,
          strength,
        };
      }),
    [nodeMap]
  );
  const connectedEdges = useMemo(
    () =>
      selectedNodeId
        ? edgeInsights.filter((edge) => edge.from === selectedNodeId || edge.to === selectedNodeId)
        : [],
    [edgeInsights, selectedNodeId]
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
    dragMovedRef.current = false;
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
    if (Math.abs(event.clientX - drag.pointerX) > 2 || Math.abs(event.clientY - drag.pointerY) > 2) {
      dragMovedRef.current = true;
    }
    setView((current) => ({
      ...current,
      x: drag.originX + (event.clientX - drag.pointerX),
      y: drag.originY + (event.clientY - drag.pointerY),
    }));
  };

  const stopDragging = () => {
    setDrag((current) => ({ ...current, active: false }));
  };

  const canvasWidth = selectedNode ? `calc(100vw - ${RAIL_WIDTH}px)` : '100vw';

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
        onClick={() => {
          if (!dragMovedRef.current) setSelectedNodeId(null);
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: canvasWidth,
          overflow: 'hidden',
          cursor: drag.active ? 'grabbing' : 'grab',
          backgroundColor: SANA_PAGE_CANVAS,
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
              const insight = edgeInsights.find((item) => item.from === edge.from && item.to === edge.to);
              const strength = insight?.strength ?? 'Weak';
              const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
              const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
              const labelX = ((from.x + fromWidth / 2) + (to.x + toWidth / 2)) / 2;
              const labelY = ((from.y < to.y ? from.y + NODE_HEIGHT : from.y) + (from.y < to.y ? to.y : to.y + NODE_HEIGHT)) / 2 - 10;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <title>
                    {edge.label}
                    {insight?.correlation != null ? ` · correlation ${insight.correlation.toFixed(2)}` : ''}
                  </title>
                  <path
                    d={edgePath(from, to)}
                    fill="none"
                    stroke={confidence.stroke}
                    strokeWidth={2}
                    strokeDasharray={confidence.dash}
                    opacity={0.9}
                    markerEnd={`url(#arrow-${edge.confidence})`}
                  />
                  <rect
                    x={labelX - 78}
                    y={labelY - 13}
                    width={156}
                    height={30}
                    rx={12}
                    fill="#ffffff"
                    opacity={0.94}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fill={colors.blackPepper500}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {edge.label}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + 11}
                    textAnchor="middle"
                    fill={colors.blackPepper400}
                    fontSize="9"
                    fontWeight="600"
                  >
                    {strength}
                  </text>
                </g>
              );
            })}
            <defs>
              {(['Measured', 'Directional'] as MetricTreeConfidence[]).map((confidence) => (
                <marker
                  key={confidence}
                  id={`arrow-${confidence}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIDENCE_STYLE[confidence].stroke} />
                </marker>
              ))}
            </defs>
          </svg>

          {TREE_NODES.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              onSelect={(nodeId) => {
                setSelectedNodeId(nodeId);
                const nextNode = nodeMap.get(nodeId);
                if (nextNode) setViewForNode(nextNode, 0.9);
              }}
            />
          ))}
        </div>
      </div>
      <Flex
        gap="s"
        style={{
          position: 'absolute',
          top: 16,
          right: selectedNode ? RAIL_WIDTH + 16 : 16,
          padding: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          border: `1px solid ${colors.soap300}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <SecondaryButton size="small" onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale * 0.9, 0.48, 1.4) }))}>
          -
        </SecondaryButton>
        <SecondaryButton size="small" onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale * 1.12, 0.48, 1.4) }))}>
          +
        </SecondaryButton>
        <SecondaryButton size="small" onClick={() => setView({ x: 48, y: 18, scale: 0.74 })}>
          Reset
        </SecondaryButton>
      </Flex>

      <Box
        onClick={(event) => event.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: RAIL_WIDTH,
          height: '100%',
          background: 'rgba(255,255,255,0.98)',
          borderLeft: `1px solid ${colors.soap300}`,
          boxShadow: '-10px 0 24px rgba(15,23,42,0.08)',
          transform: selectedNode ? 'translateX(0)' : `translateX(${RAIL_WIDTH}px)`,
          transition: 'transform 180ms ease',
          overflowY: 'auto',
          pointerEvents: selectedNode ? 'auto' : 'none',
          padding: 20,
        }}
      >
        {selectedNode ? (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" gap="s" style={{ marginBottom: 12 }}>
              <Box>
                <Heading size="small" marginBottom="xxs">
                  {selectedNode.title}
                </Heading>
                <BodyText size="small" color={colors.blackPepper400}>
                  {selectedNode.level}
                </BodyText>
              </Box>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: colors.blackPepper500,
                  fontSize: 20,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
                aria-label="Close details"
              >
                ×
              </button>
            </Flex>

            <div style={{ fontSize: 30, fontWeight: 700, color: colors.blackPepper600, marginBottom: 4 }}>
              {selectedNode.value}
            </div>
            <BodyText size="small" color={colors.blackPepper400} style={{ marginBottom: 12 }}>
              {selectedNode.valueContext}
            </BodyText>

            <div style={{ height: 180, marginBottom: 16 }}>
              <Line
                data={chartData(
                  selectedNode.trend,
                  CONFIDENCE_STYLE[selectedNode.confidence].stroke,
                  `${CONFIDENCE_STYLE[selectedNode.confidence].stroke}22`
                )}
                options={railChartOptions}
              />
            </div>

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
              <Box
                style={{
                  borderRadius: 12,
                  padding: 12,
                  background: '#fff8eb',
                  border: '1px solid #f1d199',
                  marginBottom: 16,
                }}
              >
                <BodyText size="small" color={colors.blackPepper500} style={{ lineHeight: 1.5 }}>
                  <strong>Caveat:</strong> {selectedNode.caveat}
                </BodyText>
              </Box>
            ) : null}

            <Heading size="small" marginBottom="xs">
              Connected driver relationships
            </Heading>
            <Flex flexDirection="column" gap="s">
              {connectedEdges.map((edge) => {
                const peerId = edge.from === selectedNode.id ? edge.to : edge.from;
                const peerNode = nodeMap.get(peerId);
                if (!peerNode) return null;
                return (
                  <Box
                    key={`${edge.from}-${edge.to}`}
                    style={{
                      borderRadius: 12,
                      padding: 12,
                      border: `1px solid ${colors.soap300}`,
                      background: '#fff',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.blackPepper600, marginBottom: 4 }}>
                      {peerNode.title}
                    </div>
                    <div style={{ fontSize: 12, color: colors.blackPepper500, marginBottom: 4 }}>
                      {edge.label} · {edge.strength}
                      {edge.correlation != null ? ` (${edge.correlation.toFixed(2)})` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: colors.blackPepper400 }}>
                      Based on aligned recent trend points for the connected metrics.
                    </div>
                  </Box>
                );
              })}
            </Flex>
          </>
        ) : null}
      </Box>
    </Box>
  );
};
