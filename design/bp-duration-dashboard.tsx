import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SecondaryButton } from '@workday/canvas-kit-react/button';
import { colors } from '@workday/canvas-kit-react/tokens';
import { PageHeader, MetricCard, DashboardGlobalNav } from './components';
import { SANA_PAGE_CANVAS, SANA_CARD_RADIUS_LG, SANA_CARD_SHADOW } from './components/sanaShellTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { LABELS, REGION_OPTIONS, INDUSTRY_OPTIONS, type SubBpConfig } from './data-bp-shared';
import { TENANT_OPTIONS } from './data-bp-durations';
import {
  getSliceSubBpsAndHeadline,
  EMPTY_TENANT_FILTER,
  ALL_SUB_BP_KEYS,
  type TenantRegionIndustryFilter,
  type BpHeadlineEntry,
} from './data-bp-durations-by-segment';
import {
  OFFER_STEPS_SOURCE,
  offerDocumentStepMonthly,
  offerApprovalStepMonthly,
  DOCUMENT_STEP_TASKS,
  APPROVAL_STEP_TASKS,
  rankOfferBottlenecks,
  HAS_OFFER_APPROVAL_CHARTS,
  offerStepsLatestYm,
} from './data-offer-steps';
import {
  ADD_DOCUMENTS_SOURCE,
  hasAnyAddDocumentsContent,
  addDocumentsMetricCards,
  addDocumentsMonthly,
  addDocumentsTopTenants,
  tenantAdoptionPct,
} from './data-add-documents';
import {
  EMPLOYMENT_AGREEMENT_STEPS_SOURCE,
  EA_DOCUMENT_STEP_TASKS,
  EA_INTEGRATION_STEP_TASKS,
  EA_APPROVAL_STEP_TASKS,
  employmentAgreementStepMonthly,
  eaStepsLatestYm,
  rankEmploymentAgreementBottlenecks,
  HAS_EA_APPROVAL_CHARTS,
} from './data-employment-agreement-steps';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartCard: React.CSSProperties = {
  borderRadius: SANA_CARD_RADIUS_LG,
  boxShadow: SANA_CARD_SHADOW,
  padding: 20,
};

const BASE_LINE_OPTS: any = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 14, font: { family: 'Roboto', size: 12 } } },
    tooltip: { backgroundColor: '#0b1f42', titleFont: { family: 'Roboto' }, bodyFont: { family: 'Roboto' }, cornerRadius: 8, padding: 10 },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Roboto', size: 11 }, color: colors.blackPepper400 } },
    y: { grid: { color: colors.soap200 }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: colors.blackPepper400 } },
  },
};

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

const BP_COLORS = [
  colors.blueberry400,
  '#F5A623',
  colors.cantaloupe400 || '#FF6B35',
  '#2E7D32',
  '#7CB342',
  '#BF360C',
  '#AD1457',
  '#795548',
];

const STATUS_COLORS = {
  completed: '#2E7D32',
  inProgress: colors.blueberry400,
  cancelled: '#BF360C',
  other: colors.blackPepper300,
};

const InsightBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    padding="m"
    marginTop="m"
    style={{
      backgroundColor: colors.blueberry50 || '#EDF5FF',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: 1.6,
      color: colors.blackPepper600,
    }}
  >
    {children}
  </Box>
);

const filterLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: colors.blackPepper400,
  fontWeight: 600,
  marginBottom: 2,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
};

function bpColorIndex(subBps: SubBpConfig[], key: string): number {
  const i = subBps.findIndex(b => b.key === key);
  return i >= 0 ? i % BP_COLORS.length : 0;
}

export type BpTypeFilter = 'offer-ea' | 'offer' | 'ea';

const BP_TYPE_OPTIONS: { value: BpTypeFilter; label: string }[] = [
  { value: 'offer-ea', label: 'Offer + EA' },
  { value: 'offer', label: 'Offer only' },
  { value: 'ea', label: 'EA only' },
];

export function filterSubBpsByType(subBps: SubBpConfig[], bpType: BpTypeFilter): SubBpConfig[] {
  if (bpType === 'offer') return subBps.filter(bp => bp.key === 'offer');
  if (bpType === 'ea') return subBps.filter(bp => bp.key === 'employment_agreement');
  return subBps.filter(bp => bp.key === 'offer' || bp.key === 'employment_agreement');
}

/** Global tenant / region / industry slice (precedence: tenant > region > industry > all). */
function TenantRegionIndustryFilterCard({
  filters,
  onChange,
  bpType,
  onBpTypeChange,
}: {
  filters: TenantRegionIndustryFilter;
  onChange: (f: TenantRegionIndustryFilter) => void;
  bpType: BpTypeFilter;
  onBpTypeChange: (bt: BpTypeFilter) => void;
}) {
  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 8,
    border: `1px solid ${colors.soap400}`,
    fontSize: 13,
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: '#fff',
    minWidth: 160,
    maxWidth: 280,
    color: colors.blackPepper500,
  };
  const active = Boolean(filters.tenant || filters.region || filters.industry || bpType !== 'offer-ea');
  return (
    <Card style={{ ...chartCard, marginTop: 16, padding: 16, border: active ? `2px solid ${colors.blueberry400}` : undefined }}>
      <Flex justifyContent="flex-end" alignItems="center" style={{ marginBottom: 12 }}>
        {active && (
          <SecondaryButton
            size="small"
            onClick={() => { onChange({ ...EMPTY_TENANT_FILTER }); onBpTypeChange('offer-ea'); }}
            style={{ fontSize: 12, borderRadius: 16, padding: '2px 12px' }}
          >
            Clear filters
          </SecondaryButton>
        )}
      </Flex>
      <Flex gap="m" flexWrap="wrap" alignItems="flex-end">
        <Box>
          <div style={filterLabelStyle}>BP Type</div>
          <select
            value={bpType}
            onChange={e => onBpTypeChange(e.target.value as BpTypeFilter)}
            style={selectStyle}
          >
            {BP_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Tenant</div>
          <select
            value={filters.tenant}
            onChange={e => onChange({ tenant: e.target.value, region: '', industry: '' })}
            style={{ ...selectStyle, minWidth: 200, maxWidth: 320 }}
          >
            <option value="">All tenants</option>
            {TENANT_OPTIONS.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Region</div>
          <select
            value={filters.region}
            disabled={Boolean(filters.tenant)}
            onChange={e => onChange({ tenant: '', region: e.target.value, industry: '' })}
            style={{ ...selectStyle, opacity: filters.tenant ? 0.5 : 1 }}
          >
            <option value="">All regions</option>
            {REGION_OPTIONS.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Industry</div>
          <select
            value={filters.industry}
            disabled={Boolean(filters.tenant)}
            onChange={e => onChange({ tenant: '', region: '', industry: e.target.value })}
            style={{ ...selectStyle, opacity: filters.tenant ? 0.5 : 1 }}
          >
            <option value="">All industries</option>
            {INDUSTRY_OPTIONS.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Box>
      </Flex>
    </Card>
  );
}

/** Offer-only: validated step volumes, durations, approvals, bottleneck (Pharos task stats). */
function OfferDocumentStepsBottleneckSection({ showSliceNote }: { showSliceNote: boolean }) {
  const labels = [...LABELS];
  const volumeByStep = {
    labels,
    datasets: DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => offerDocumentStepMonthly[task]?.find(p => p.ym === ym)?.volume ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '22',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const avgHoursByStep = {
    labels,
    datasets: DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => offerDocumentStepMonthly[task]?.find(p => p.ym === ym)?.avgHours ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '11',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const p90ByStep = {
    labels,
    datasets: DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => offerDocumentStepMonthly[task]?.find(p => p.ym === ym)?.p90Hours ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '11',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const tenantAdoption = {
    labels,
    datasets: DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => offerDocumentStepMonthly[task]?.find(p => p.ym === ym)?.tenants ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '22',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
      fill: true,
    })),
  };
  const volOpts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer document steps — monthly volume (PROD)',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Events', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );
  const hrsOpts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer document steps — average step duration (hours)',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Hours', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );
  const p90Opts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer document steps — P90 duration (hours)',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Hours', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );
  const tenantOpts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer document steps — active tenants per month',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Tenants', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );

  const latestYm = offerStepsLatestYm();
  const ranked = useMemo(() => rankOfferBottlenecks(latestYm), [latestYm]);
  const bottleneckBar = useMemo(
    () => ({
      labels: ranked.map(r => r.taskName),
      datasets: [
        {
          label: 'Bottleneck score (avg hours × log10(1 + volume))',
          data: ranked.map(r => r.score),
          backgroundColor: ranked.map(r => (r.group === 'approval' ? '#AD145799' : colors.blueberry400 + '99')),
          borderColor: ranked.map(r => (r.group === 'approval' ? '#AD1457' : colors.blueberry400)),
          borderWidth: 1,
        },
      ],
    }),
    [ranked]
  );
  const hBarOpts: any = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0b1f42', titleFont: { family: 'Roboto' }, bodyFont: { family: 'Roboto' }, cornerRadius: 8, padding: 10 },
    },
    scales: {
      x: { grid: { color: colors.soap200 }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 } } },
      y: { grid: { display: false }, ticks: { font: { family: 'Roboto', size: 10 } } },
    },
  };

  const approvalVolume = HAS_OFFER_APPROVAL_CHARTS
    ? {
        labels,
        datasets: APPROVAL_STEP_TASKS.map((task, i) => ({
          label: task,
          data: labels.map(ym => offerApprovalStepMonthly[task]?.find(p => p.ym === ym)?.volume ?? null),
          borderColor: BP_COLORS[(i + 5) % BP_COLORS.length],
          backgroundColor: BP_COLORS[(i + 5) % BP_COLORS.length] + '22',
          tension: 0.25,
          pointRadius: 2,
          borderWidth: 2,
        })),
      }
    : null;
  const approvalHours = HAS_OFFER_APPROVAL_CHARTS
    ? {
        labels,
        datasets: APPROVAL_STEP_TASKS.map((task, i) => ({
          label: task,
          data: labels.map(ym => offerApprovalStepMonthly[task]?.find(p => p.ym === ym)?.avgHours ?? null),
          borderColor: BP_COLORS[(i + 5) % BP_COLORS.length],
          backgroundColor: BP_COLORS[(i + 5) % BP_COLORS.length] + '11',
          tension: 0.25,
          pointRadius: 2,
          borderWidth: 2,
        })),
      }
    : null;
  const apprVolOpts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer approvals — monthly volume (locked task names)',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Events', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );
  const apprHrsOpts = useMemo(
    () => ({
      ...BASE_LINE_OPTS,
      plugins: {
        ...BASE_LINE_OPTS.plugins,
        title: {
          display: true,
          text: 'Offer approvals — average duration (hours)',
          font: { family: 'Roboto', size: 14, weight: '600' as const },
          color: colors.blackPepper600,
          padding: { bottom: 12 },
        },
      },
      scales: {
        ...BASE_LINE_OPTS.scales,
        y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Hours', font: { family: 'Roboto', size: 12 } } },
      },
    }),
    []
  );

  return (
    <Box marginTop="l">
      <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginBottom: 8 }}>
        Offer steps (task-level)
      </Heading>
      <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 12, maxWidth: 900, lineHeight: 1.6 }}>
        Exact <code>task_name</code> filters on <code>{OFFER_STEPS_SOURCE.table}</code>, {OFFER_STEPS_SOURCE.environment}, {OFFER_STEPS_SOURCE.monthRange}.{' '}
        {OFFER_STEPS_SOURCE.partitionFilter}; {OFFER_STEPS_SOURCE.creationTimeFilter}. Manage Attachments rows exist but average duration is not populated in this extract (nulls).
      </BodyText>
      {showSliceNote && (
        <InsightBox>
          <strong>Note:</strong> You have a tenant, region, or industry slice selected above. Those filters apply to sub-BP rollups from{' '}
          <code>bp_event_stats</code>. This Offer step section stays on the global Offer task series so numbers stay comparable month to month.
        </InsightBox>
      )}
      <Flex gap="m" style={{ flexWrap: 'wrap', marginTop: 12 }}>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 320 }}>
            <Line data={volumeByStep} options={volOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 320 }}>
            <Line data={avgHoursByStep} options={hrsOpts} />
          </div>
        </Card>
      </Flex>
      <Flex gap="m" style={{ flexWrap: 'wrap', marginTop: 16 }}>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={p90ByStep} options={p90Opts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={tenantAdoption} options={tenantOpts} />
          </div>
        </Card>
      </Flex>
      {HAS_OFFER_APPROVAL_CHARTS && approvalVolume && approvalHours && (
        <>
          <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginTop: 24, marginBottom: 8 }}>
            Offer approvals
          </Heading>
          <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 12, maxWidth: 800 }}>
            Stable PROD names with material volume: <code>Bulk Approve</code> and <code>Approve Business Process (Web Service)</code>. Web Service approval shows very few distinct tenants; interpret coverage carefully.
          </BodyText>
          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
              <div style={{ height: 280 }}>
                <Line data={approvalVolume} options={apprVolOpts} />
              </div>
            </Card>
            <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
              <div style={{ height: 280 }}>
                <Line data={approvalHours} options={apprHrsOpts} />
              </div>
            </Card>
          </Flex>
        </>
      )}
      <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginTop: 24, marginBottom: 8 }}>
        Bottleneck analyser ({latestYm})
      </Heading>
      <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 12, maxWidth: 900 }}>
        Ranks validated steps by <code>avg_hours × log10(1 + volume)</code> using the latest dashboard month. This highlights where heavy volume meets long waits; it does not prove causality across steps.
      </BodyText>
      <Flex gap="m" style={{ flexWrap: 'wrap' }} alignItems="stretch">
        <Card style={{ ...chartCard, flex: '1 1 520px', minWidth: 400 }}>
          <div style={{ height: Math.max(260, ranked.length * 36) }}>
            <Bar data={bottleneckBar} options={hBarOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 400px', minWidth: 320, fontSize: 13 }}>
          <Heading size="small" style={{ fontSize: 13, marginBottom: 8 }}>
            Ranked table
          </Heading>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: colors.blackPepper400, fontSize: 11 }}>
                <th style={{ padding: '4px 6px' }}>#</th>
                <th style={{ padding: '4px 6px' }}>Step</th>
                <th style={{ padding: '4px 6px' }}>Volume</th>
                <th style={{ padding: '4px 6px' }}>Avg h</th>
                <th style={{ padding: '4px 6px' }}>Tenants</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r, idx) => (
                <tr key={r.taskName} style={{ borderTop: `1px solid ${colors.soap200}` }}>
                  <td style={{ padding: '6px' }}>{idx + 1}</td>
                  <td style={{ padding: '6px' }}>{r.taskName}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.volume.toLocaleString()}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.avgHours != null ? r.avgHours.toFixed(2) : '—'}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.tenants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Flex>
      {ranked.slice(0, 3).map(r => (
        <InsightBox key={r.taskName}>
          <strong>{r.taskName}</strong> ({r.group}) — score {r.score.toFixed(1)}.{' '}
          {r.dominantFactor === 'duration' && 'Duration-led: high average hours with solid volume.'}
          {r.dominantFactor === 'volume' && 'Volume-led: dominates event counts; check avg hours alongside.'}
          {r.dominantFactor === 'low_tenant_coverage' && 'Low tenant coverage relative to volume; may be concentrated in a handful of tenants.'}
        </InsightBox>
      ))}
    </Box>
  );
}

/** Employment Agreement BP: same step-level chart pattern as Offer (document, integration, approval, bottleneck). */
function EmploymentAgreementStepsSection({ showSliceNote }: { showSliceNote: boolean }) {
  const labels = [...LABELS];
  const docVolume = {
    labels,
    datasets: EA_DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.volume ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '22',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const docHours = {
    labels,
    datasets: EA_DOCUMENT_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.avgHours ?? null),
      borderColor: BP_COLORS[i % BP_COLORS.length],
      backgroundColor: BP_COLORS[i % BP_COLORS.length] + '11',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const intVolume = {
    labels,
    datasets: EA_INTEGRATION_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.volume ?? null),
      borderColor: BP_COLORS[(i + 3) % BP_COLORS.length],
      backgroundColor: BP_COLORS[(i + 3) % BP_COLORS.length] + '22',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const intHours = {
    labels,
    datasets: EA_INTEGRATION_STEP_TASKS.map((task, i) => ({
      label: task,
      data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.avgHours ?? null),
      borderColor: BP_COLORS[(i + 3) % BP_COLORS.length],
      backgroundColor: BP_COLORS[(i + 3) % BP_COLORS.length] + '11',
      tension: 0.25,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };
  const volOpts = (title: string) => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: title, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Events', font: { family: 'Roboto', size: 12 } } },
    },
  });
  const hrsOpts = (title: string) => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: title, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Hours', font: { family: 'Roboto', size: 12 } } },
    },
  });
  const latestYm = eaStepsLatestYm();
  const ranked = useMemo(() => rankEmploymentAgreementBottlenecks(latestYm), [latestYm]);
  const bottleneckBar = useMemo(
    () => ({
      labels: ranked.map(r => r.taskName),
      datasets: [
        {
          label: 'Bottleneck score (avg hours × log10(1 + volume))',
          data: ranked.map(r => r.score),
          backgroundColor: ranked.map(r =>
            r.group === 'approval' ? '#AD145799' : r.group === 'integration' ? '#2E7D3299' : colors.blueberry400 + '99'
          ),
          borderColor: ranked.map(r => (r.group === 'approval' ? '#AD1457' : r.group === 'integration' ? '#2E7D32' : colors.blueberry400)),
          borderWidth: 1,
        },
      ],
    }),
    [ranked]
  );
  const hBarOptsEa: any = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0b1f42', titleFont: { family: 'Roboto' }, bodyFont: { family: 'Roboto' }, cornerRadius: 8, padding: 10 },
    },
    scales: {
      x: { grid: { color: colors.soap200 }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 } } },
      y: { grid: { display: false }, ticks: { font: { family: 'Roboto', size: 10 } } },
    },
  };
  const approvalVolume = HAS_EA_APPROVAL_CHARTS
    ? {
        labels,
        datasets: EA_APPROVAL_STEP_TASKS.map((task, i) => ({
          label: task,
          data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.volume ?? null),
          borderColor: BP_COLORS[(i + 5) % BP_COLORS.length],
          backgroundColor: BP_COLORS[(i + 5) % BP_COLORS.length] + '22',
          tension: 0.25,
          pointRadius: 2,
          borderWidth: 2,
        })),
      }
    : null;
  const approvalHours = HAS_EA_APPROVAL_CHARTS
    ? {
        labels,
        datasets: EA_APPROVAL_STEP_TASKS.map((task, i) => ({
          label: task,
          data: labels.map(ym => employmentAgreementStepMonthly[task]?.find(p => p.ym === ym)?.avgHours ?? null),
          borderColor: BP_COLORS[(i + 5) % BP_COLORS.length],
          backgroundColor: BP_COLORS[(i + 5) % BP_COLORS.length] + '11',
          tension: 0.25,
          pointRadius: 2,
          borderWidth: 2,
        })),
      }
    : null;

  return (
    <Box marginTop="l">
      <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginBottom: 8 }}>
        Employment Agreement steps (task-level)
      </Heading>
      <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 12, maxWidth: 900, lineHeight: 1.6 }}>
        BP type <code>{EMPLOYMENT_AGREEMENT_STEPS_SOURCE.bpTypeId}</code> on <code>{EMPLOYMENT_AGREEMENT_STEPS_SOURCE.table}</code> ({EMPLOYMENT_AGREEMENT_STEPS_SOURCE.environment}), {EMPLOYMENT_AGREEMENT_STEPS_SOURCE.monthRange}. Some tasks report volume without average duration in this extract (null hours).
      </BodyText>
      {showSliceNote && (
        <InsightBox>
          <strong>Note:</strong> Slice filters apply to <code>bp_event_stats</code> rollups above. This step section uses the global task series (same month axis as Offer) so trends stay comparable.
        </InsightBox>
      )}
      <Flex gap="m" style={{ flexWrap: 'wrap', marginTop: 12 }}>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 320 }}>
            <Line data={docVolume} options={volOpts('EA document steps — monthly volume')} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 320 }}>
            <Line data={docHours} options={hrsOpts('EA document steps — average duration (hours)')} />
          </div>
        </Card>
      </Flex>
      <Flex gap="m" style={{ flexWrap: 'wrap', marginTop: 16 }}>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={intVolume} options={volOpts('EA integration / questionnaire — monthly volume')} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={intHours} options={hrsOpts('EA integration / questionnaire — average duration (hours)')} />
          </div>
        </Card>
      </Flex>
      {HAS_EA_APPROVAL_CHARTS && approvalVolume && approvalHours && (
        <>
          <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginTop: 24, marginBottom: 8 }}>
            EA approvals
          </Heading>
          <Flex gap="m" style={{ flexWrap: 'wrap' }}>
            <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
              <div style={{ height: 280 }}>
                <Line data={approvalVolume} options={volOpts('EA approvals — monthly volume')} />
              </div>
            </Card>
            <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
              <div style={{ height: 280 }}>
                <Line data={approvalHours} options={hrsOpts('EA approvals — average duration (hours)')} />
              </div>
            </Card>
          </Flex>
        </>
      )}
      <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginTop: 24, marginBottom: 8 }}>
        Bottleneck analyser ({latestYm})
      </Heading>
      <Flex gap="m" style={{ flexWrap: 'wrap' }} alignItems="stretch">
        <Card style={{ ...chartCard, flex: '1 1 520px', minWidth: 400 }}>
          <div style={{ height: Math.max(260, ranked.length * 36) }}>
            <Bar data={bottleneckBar} options={hBarOptsEa} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 400px', minWidth: 320, fontSize: 13 }}>
          <Heading size="small" style={{ fontSize: 13, marginBottom: 8 }}>
            Ranked table
          </Heading>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: colors.blackPepper400, fontSize: 11 }}>
                <th style={{ padding: '4px 6px' }}>#</th>
                <th style={{ padding: '4px 6px' }}>Step</th>
                <th style={{ padding: '4px 6px' }}>Volume</th>
                <th style={{ padding: '4px 6px' }}>Avg h</th>
                <th style={{ padding: '4px 6px' }}>Tenants</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r, idx) => (
                <tr key={r.taskName} style={{ borderTop: `1px solid ${colors.soap200}` }}>
                  <td style={{ padding: '6px' }}>{idx + 1}</td>
                  <td style={{ padding: '6px' }}>{r.taskName}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.volume.toLocaleString()}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.avgHours != null ? r.avgHours.toFixed(2) : '—'}</td>
                  <td style={{ padding: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{r.tenants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Flex>
      {ranked.slice(0, 3).map(r => (
        <InsightBox key={r.taskName}>
          <strong>{r.taskName}</strong> ({r.group}) — score {r.score.toFixed(1)}.{' '}
          {r.dominantFactor === 'duration' && 'Duration-led: high average hours with solid volume.'}
          {r.dominantFactor === 'volume' && 'Volume-led: dominates event counts; check avg hours alongside.'}
          {r.dominantFactor === 'low_tenant_coverage' && 'Low tenant coverage relative to volume; may be concentrated in a handful of tenants.'}
        </InsightBox>
      ))}
    </Box>
  );
}

function OfferAddDocumentsBottomSection() {
  if (!hasAnyAddDocumentsContent()) return null;

  const monthRange = (startYm: string, endYm: string) => {
    const result: string[] = [];
    let [year, month] = startYm.split('-').map(Number);
    const [endYear, endMonth] = endYm.split('-').map(Number);
    while (year < endYear || (year === endYear && month <= endMonth)) {
      result.push(`${year}-${String(month).padStart(2, '0')}`);
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    return result;
  };

  const paddedLabels = monthRange(ADD_DOCUMENTS_SOURCE.metricAvailableSince, ADD_DOCUMENTS_SOURCE.latestMonth);
  const monthlyByYm = new Map(addDocumentsMonthly.map(point => [point.ym, point]));
  const paddedMonthly = paddedLabels.map(ym => {
    const point = monthlyByYm.get(ym);
    return point ?? {
      ym,
      configuredBpDefinitions: 0,
      configuredTenants: 0,
      refsWithoutDocs: 0,
      refsWithoutDocsTenants: 0,
      refsWithDocs: 0,
      refsWithDocsTenants: 0,
      docsCreated: 0,
      docsCreatedTenants: 0,
      adoptionRatePct: 0,
      avgDocsPerReference: 0,
    };
  });

  const tenantAdoptionData = {
    labels: paddedLabels,
    datasets: [
      {
        label: 'Tenants configured',
        data: paddedMonthly.map(p => p.configuredTenants),
        borderColor: colors.blueberry400,
        backgroundColor: colors.blueberry400 + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Tenants using Add Documents',
        data: paddedMonthly.map(p => p.refsWithDocsTenants),
        borderColor: '#2E7D32',
        backgroundColor: '#2E7D3222',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const adoptionRateData = {
    labels: paddedLabels,
    datasets: [
      {
        label: 'Tenant adoption rate',
        data: paddedMonthly.map(p => tenantAdoptionPct(p)),
        borderColor: colors.blueberry400,
        backgroundColor: colors.blueberry400 + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const referenceMixData = {
    labels: paddedLabels,
    datasets: [
      {
        label: 'References with Add Documents',
        data: paddedMonthly.map(p => p.refsWithDocs),
        borderColor: '#2E7D32',
        backgroundColor: '#2E7D3299',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'References with no Add Documents',
        data: paddedMonthly.map(p => p.refsWithoutDocs),
        borderColor: '#BF360C',
        backgroundColor: '#BF360C99',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const volumeData = {
    labels: paddedLabels,
    datasets: [
      {
        label: 'Add Documents created',
        data: paddedMonthly.map(p => p.docsCreated),
        borderColor: '#795548',
        backgroundColor: '#79554822',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const topTenantsBarData = {
    labels: addDocumentsTopTenants.map(t => t.tenantLabel),
    datasets: [
      {
        label: 'Documents created',
        data: addDocumentsTopTenants.map(t => t.docsCreated),
        backgroundColor: addDocumentsTopTenants.map((_, i) => BP_COLORS[i % BP_COLORS.length] + '99'),
        borderColor: addDocumentsTopTenants.map((_, i) => BP_COLORS[i % BP_COLORS.length]),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const lineOpts = (title: string, yTitle: string) => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: title, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: {
        ...BASE_LINE_OPTS.scales.y,
        title: { display: true, text: yTitle, font: { family: 'Roboto', size: 12 } },
      },
    },
  });

  const percentLineOpts = {
    ...lineOpts('Add Documents adoption rate since launch', 'Rate (%)'),
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: {
        ...BASE_LINE_OPTS.scales.y,
        title: { display: true, text: 'Rate (%)', font: { family: 'Roboto', size: 12 } },
        min: 0,
        max: 100,
      },
    },
  };

  const stackedBarOpts = {
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Add Documents references mix over time', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      x: { ...BASE_LINE_OPTS.scales.x, stacked: true },
      y: {
        ...BASE_LINE_OPTS.scales.y,
        stacked: true,
        title: { display: true, text: 'References', font: { family: 'Roboto', size: 12 } },
        ticks: {
          ...BASE_LINE_OPTS.scales.y.ticks,
          callback: (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
      },
    },
  };

  const hBarOpts = {
    ...BASE_LINE_OPTS,
    indexAxis: 'y' as const,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Top 10 customers using Add Documents (last 365 days)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
      legend: { display: false },
    },
    scales: {
      x: {
        ...BASE_LINE_OPTS.scales.y,
        title: { display: true, text: 'Documents created', font: { family: 'Roboto', size: 12 } },
        ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: colors.blackPepper400 },
        grid: { color: colors.soap200 },
      },
      y: {
        ...BASE_LINE_OPTS.scales.x,
        ticks: { font: { family: 'Roboto', size: 11 }, color: colors.blackPepper400 },
        grid: { display: false },
      },
    },
  };

  return (
    <Box marginTop="xxl" paddingTop="l" style={{ borderTop: `1px solid ${colors.soap300}` }}>
      <Heading size="small" style={{ fontSize: 16, fontWeight: 600, color: colors.blackPepper600, marginBottom: 8 }}>
        Add documents
      </Heading>
      <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 16, maxWidth: 720, lineHeight: 1.6 }}>
        Real Add Documents metrics from <code style={{ fontSize: 12, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>{ADD_DOCUMENTS_SOURCE.table}</code>. The metric family exists from {ADD_DOCUMENTS_SOURCE.metricAvailableSince}, with first positive observations in {ADD_DOCUMENTS_SOURCE.firstPositiveMonth}.
      </BodyText>
      {addDocumentsMetricCards.length > 0 && (
        <Flex gap="s" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
          {addDocumentsMetricCards.map((c, i) => (
            <MetricCard
              key={i}
              label={c.label}
              value={c.value}
              helperText={c.helperText}
              changeIndicator={c.changeIndicator}
              tooltip={c.tooltip}
            />
          ))}
        </Flex>
      )}
      <Flex gap="m" style={{ flexWrap: 'wrap' }}>
        {addDocumentsMonthly.length > 0 && (
          <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
            <div style={{ height: 320 }}>
              <Line data={tenantAdoptionData} options={lineOpts('Add Documents adoption since launch', 'Tenants')} />
            </div>
          </Card>
        )}
        {addDocumentsMonthly.length > 0 && (
          <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
            <div style={{ height: 320 }}>
              <Line data={adoptionRateData} options={percentLineOpts} />
            </div>
          </Card>
        )}
      </Flex>
      <Flex gap="m" style={{ flexWrap: 'wrap', marginTop: 16 }}>
        {addDocumentsMonthly.length > 0 && (
          <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
            <div style={{ height: 320 }}>
              <Bar data={referenceMixData} options={stackedBarOpts} />
            </div>
          </Card>
        )}
        {addDocumentsMonthly.length > 0 && (
          <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
            <div style={{ height: 320 }}>
              <Line data={volumeData} options={lineOpts('Add Documents created over time', 'Documents')} />
            </div>
          </Card>
        )}
      </Flex>
      {addDocumentsTopTenants.length > 0 && (
        <Card style={{ ...chartCard, marginTop: 16, maxWidth: 720 }}>
          <div style={{ height: Math.max(280, addDocumentsTopTenants.length * 36) }}>
            <Bar data={topTenantsBarData} options={hBarOpts} />
          </div>
        </Card>
      )}
      <InsightBox>
        <strong>Source notes:</strong> IUM metrics <code>1757</code>, <code>1758</code>, <code>1759</code>, and <code>1760</code> from {ADD_DOCUMENTS_SOURCE.table}. Trend charts pad missing months with zeros from {ADD_DOCUMENTS_SOURCE.metricAvailableSince} until the first positive month to show the full launch-to-date timeline. Top-customer ranking uses the last 365 days of metric <code>1760</code>.
      </InsightBox>
    </Box>
  );
}

/** Offer and Employment Agreement: participation and throughput from the same bp_event_stats rollups as sub-BP cards. */
function OfferBpOperationalCharts({ bp }: { bp: SubBpConfig }) {
  if (bp.key !== 'offer' && bp.key !== 'employment_agreement') return null;
  const bpShort = bp.key === 'offer' ? 'Offer' : 'Employment Agreement';

  const tenantsData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: `Tenants with ${bpShort} activity`,
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.tenants ?? null),
        borderColor: colors.blueberry400,
        backgroundColor: colors.blueberry400 + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [bp]);

  const ratesData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: 'Completion %',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completionPct ?? null),
        borderColor: STATUS_COLORS.completed,
        backgroundColor: STATUS_COLORS.completed + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Cancellation %',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.cancellationPct ?? null),
        borderColor: STATUS_COLORS.cancelled,
        backgroundColor: STATUS_COLORS.cancelled + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  }), [bp]);

  const throughputData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: `Total ${bpShort} events`,
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.total ?? null),
        borderColor: '#795548',
        backgroundColor: '#79554822',
        tension: 0.25,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [bp]);

  const tenantsOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bpShort} — active tenants per month`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Tenants', font: { family: 'Roboto', size: 12 } } },
    },
  }), [bp.key]);

  const ratesOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bpShort} — completion vs cancellation rate`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } }, min: 0, max: 100 },
    },
  }), [bp.key]);

  const throughputOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bpShort} — total events per month`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: {
        ...BASE_LINE_OPTS.scales.y,
        title: { display: true, text: 'Events', font: { family: 'Roboto', size: 12 } },
        ticks: {
          ...BASE_LINE_OPTS.scales.y.ticks,
          callback: (v: number | string) => {
            const n = typeof v === 'number' ? v : Number(v);
            if (Number.isNaN(n)) return v;
            return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n;
          },
        },
      },
    },
  }), [bp.key]);

  return (
    <>
      <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginTop: 20, marginBottom: 12 }}>
        {bpShort} volume and participation
      </Heading>
      <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 12, maxWidth: 800 }}>
        Same source as sub-BP duration cards: <code style={{ fontSize: 12, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>dw.swh.bp_event_stats</code> (PROD). Employment Agreement uses <code style={{ fontSize: 12, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>data-employment-agreement-durations.ts</code>; other sub-BPs use <code style={{ fontSize: 12, backgroundColor: colors.soap100, padding: '2px 6px', borderRadius: 4 }}>data-bp-durations.ts</code>.
      </BodyText>
      <Flex gap="m" style={{ flexWrap: 'wrap' }}>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={tenantsData} options={tenantsOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={ratesData} options={ratesOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 300 }}>
            <Line data={throughputData} options={throughputOpts} />
          </div>
        </Card>
      </Flex>
    </>
  );
}

type ViewMode = 'overview' | 'detail' | 'quality';

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab({ subBps }: { subBps: SubBpConfig[] }) {
  const completedDurationData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps.map((bp, i) => ({
      label: bp.label,
      data: LABELS.map(m => {
        const d = bp.data.find(x => x.ym === m);
        return d?.completed.avgDays ?? null;
      }),
      borderColor: BP_COLORS[i],
      backgroundColor: BP_COLORS[i] + '22',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  }), [subBps]);

  const completedDurationOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Avg Duration - Completed Events (Days)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Days', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  const medianDurationData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps.map((bp, i) => ({
      label: bp.label,
      data: LABELS.map(m => {
        const d = bp.data.find(x => x.ym === m);
        return d?.completed.medianDays ?? null;
      }),
      borderColor: BP_COLORS[i],
      backgroundColor: BP_COLORS[i] + '22',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  }), [subBps]);

  const medianDurationOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Median Duration - Completed Events (Days)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Days', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  const completionRateData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps.map((bp, i) => ({
      label: bp.label,
      data: LABELS.map(m => {
        const d = bp.data.find(x => x.ym === m);
        return d?.completionPct ?? null;
      }),
      borderColor: BP_COLORS[i],
      backgroundColor: BP_COLORS[i] + '22',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  }), [subBps]);

  const completionRateOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Completion Rate (%)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } }, min: 0, max: 100 },
    },
  }), []);

  const latestBarData = useMemo(() => {
    const latestMonth = LABELS[LABELS.length - 1];
    return {
      labels: subBps.map(bp => bp.label),
      datasets: [
        {
          label: 'Avg (Completed)',
          data: subBps.map(bp => bp.data.find(x => x.ym === latestMonth)?.completed.avgDays ?? 0),
          backgroundColor: BP_COLORS.map(c => c + '99'),
          borderColor: BP_COLORS,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Median (Completed)',
          data: subBps.map(bp => bp.data.find(x => x.ym === latestMonth)?.completed.medianDays ?? 0),
          backgroundColor: BP_COLORS.map(c => c + '44'),
          borderColor: BP_COLORS,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [subBps]);

  const latestBarOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `Completed Duration Comparison (${LABELS[LABELS.length - 1]})`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Days', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  return (
    <>
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={completedDurationData} options={completedDurationOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={medianDurationData} options={medianDurationOpts} />
          </div>
        </Card>
      </Flex>
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Bar data={latestBarData} options={latestBarOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={completionRateData} options={completionRateOpts} />
          </div>
        </Card>
      </Flex>
      <InsightBox>
        <strong>Data source:</strong> <code>dw.swh.bp_event_stats</code> - event-level pre-aggregated table.
        Durations shown are for <strong>successfully completed</strong> events only (excluding in-progress and cancelled),
        giving a true measure of cycle time. Completion rate = events reaching "Successfully Completed" status /
        total events (including in-progress and cancelled).
      </InsightBox>
    </>
  );
}

// ─── Detail Tab ──────────────────────────────────────────────────────────────

function DetailTab({
  bp,
  headlineEntry,
  showSliceNote,
}: {
  bp: SubBpConfig;
  headlineEntry: BpHeadlineEntry | undefined;
  showSliceNote: boolean;
}) {
  const durationByStatusData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: 'Completed',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completed.avgDays ?? null),
        borderColor: STATUS_COLORS.completed,
        backgroundColor: STATUS_COLORS.completed + '22',
        tension: 0.3,
        pointRadius: 4,
        borderWidth: 2.5,
        fill: true,
      },
      {
        label: 'In Progress',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.inProgress.avgDays ?? null),
        borderColor: STATUS_COLORS.inProgress,
        backgroundColor: STATUS_COLORS.inProgress + '11',
        borderDash: [6, 3],
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Cancelled',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.cancelled.avgDays ?? null),
        borderColor: STATUS_COLORS.cancelled,
        backgroundColor: STATUS_COLORS.cancelled + '11',
        borderDash: [3, 3],
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 1.5,
      },
    ],
  }), [bp]);

  const durationOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bp.label} - Avg Duration by Status (Days)`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Days', font: { family: 'Roboto', size: 12 } } },
    },
  }), [bp]);

  const statusStackData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: 'Completed',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completed.events ?? 0),
        backgroundColor: STATUS_COLORS.completed + '99',
        borderColor: STATUS_COLORS.completed,
        borderWidth: 1,
      },
      {
        label: 'In Progress',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.inProgress.events ?? 0),
        backgroundColor: STATUS_COLORS.inProgress + '99',
        borderColor: STATUS_COLORS.inProgress,
        borderWidth: 1,
      },
      {
        label: 'Cancelled',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.cancelled.events ?? 0),
        backgroundColor: STATUS_COLORS.cancelled + '99',
        borderColor: STATUS_COLORS.cancelled,
        borderWidth: 1,
      },
    ],
  }), [bp]);

  const stackOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bp.label} - Volume by Status`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      x: { ...BASE_LINE_OPTS.scales.x, stacked: true },
      y: {
        ...BASE_LINE_OPTS.scales.y,
        stacked: true,
        title: { display: true, text: 'Events', font: { family: 'Roboto', size: 12 } },
        ticks: {
          ...BASE_LINE_OPTS.scales.y.ticks,
          callback: (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
      },
    },
  }), [bp]);

  const latestMonth = bp.data[bp.data.length - 1];
  const donutData = useMemo(() => {
    if (!latestMonth) return null;
    return {
      labels: ['Completed', 'In Progress', 'Cancelled', 'Other'],
      datasets: [{
        data: [latestMonth.completed.events, latestMonth.inProgress.events, latestMonth.cancelled.events, latestMonth.other.events],
        backgroundColor: [STATUS_COLORS.completed + '99', STATUS_COLORS.inProgress + '99', STATUS_COLORS.cancelled + '99', STATUS_COLORS.other + '99'],
        borderColor: [STATUS_COLORS.completed, STATUS_COLORS.inProgress, STATUS_COLORS.cancelled, STATUS_COLORS.other],
        borderWidth: 1,
      }],
    };
  }, [latestMonth]);

  const stepsData = useMemo(() => ({
    labels: [...LABELS],
    datasets: [
      {
        label: 'Completed',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completed.avgSteps ?? null),
        borderColor: STATUS_COLORS.completed,
        backgroundColor: STATUS_COLORS.completed + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'In Progress',
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.inProgress.avgSteps ?? null),
        borderColor: STATUS_COLORS.inProgress,
        backgroundColor: STATUS_COLORS.inProgress + '11',
        borderDash: [6, 3],
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  }), [bp]);

  const stepsOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: `${bp.label} - Avg Steps Completed`, font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: 'Steps', font: { family: 'Roboto', size: 12 } } },
    },
  }), [bp]);

  const h = headlineEntry;

  return (
    <>
      <Flex gap="s" style={{ marginTop: 16 }} flexWrap="wrap">
        <MetricCard
          label="Completed Avg Duration"
          value={h?.avgDaysCompleted != null ? `${h.avgDaysCompleted} d` : 'N/A'}
          helperText={h?.medianDaysCompleted != null ? `Median: ${h.medianDaysCompleted} d` : ''}
          changeIndicator={{ text: '12-month avg (completed only)', sentiment: 'neutral' }}
          tooltip="Event-weighted average of completed-event duration in days for this sub-BP across months in the chart window (bp_event_stats). Not job-application-chained Offer+EA time from the TA tracker PDF."
        />
        <MetricCard
          label="Completion Rate"
          value={`${h?.completionPct ?? 0}%`}
          helperText={`${fmtK(h?.totalEvents ?? 0)} total events`}
          changeIndicator={{ text: `Cancellation: ${h?.cancellationPct ?? 0}%`, sentiment: (h?.cancellationPct ?? 0) > 30 ? 'negative' : 'neutral' }}
          tooltip="Completed events divided by all status buckets (completed + in progress + cancelled + other) for the sub-BP in the aggregate."
        />
        <MetricCard
          label="Peak Tenants"
          value={(h?.maxTenants ?? 0).toLocaleString()}
          helperText="Max active tenants in any month"
          changeIndicator={{ text: `${LABELS[0]} - ${LABELS[LABELS.length - 1]}`, sentiment: 'neutral' }}
          tooltip="Maximum tenant count reporting this sub-BP in any single month of the series (slice-specific)."
        />
      </Flex>
      <Box marginTop="m">
        <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginBottom: 8 }}>
          What this sub-BP measures
        </Heading>
        <BodyText size="small" style={{ color: colors.blackPepper400, margin: 0, maxWidth: 800, lineHeight: 1.6 }}>
          {bp.description}
        </BodyText>
      </Box>
      <OfferBpOperationalCharts bp={bp} />
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 340 }}>
            <Line data={durationByStatusData} options={durationOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 340 }}>
            <Bar data={statusStackData} options={stackOpts} />
          </div>
        </Card>
      </Flex>
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 340 }}>
            <Line data={stepsData} options={stepsOpts} />
          </div>
        </Card>
        {donutData && (
          <Card style={{ ...chartCard, flex: '0 1 340px', minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Heading size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600, marginBottom: 8 }}>
              Status Distribution ({LABELS[LABELS.length - 1]})
            </Heading>
            <div style={{ height: 260, width: 260 }}>
              <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Roboto', size: 11 }, padding: 8, usePointStyle: true } } } }} />
            </div>
          </Card>
        )}
      </Flex>
      {bp.key === 'offer' && (
        <>
          <OfferDocumentStepsBottleneckSection showSliceNote={showSliceNote} />
          <OfferAddDocumentsBottomSection />
        </>
      )}
      {bp.key === 'employment_agreement' && (
        <>
          <EmploymentAgreementStepsSection showSliceNote={showSliceNote} />
          <OfferAddDocumentsBottomSection />
        </>
      )}
    </>
  );
}

// ─── Quality Tab ─────────────────────────────────────────────────────────────

function QualityTab({ subBps }: { subBps: SubBpConfig[] }) {
  const reassignedData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps.map((bp, i) => ({
      label: bp.label,
      data: LABELS.map(m => {
        const d = bp.data.find(x => x.ym === m);
        return d?.completed.pctReassigned ?? 0;
      }),
      borderColor: BP_COLORS[i],
      backgroundColor: BP_COLORS[i] + '22',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  }), [subBps]);

  const reassignedOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: '% of Completed Events with Reassignment', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  const sentBackData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps
      .filter(bp => {
        return bp.data.some(d => d.completed.pctSentBack > 0);
      })
      .map(bp => ({
        label: bp.label,
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completed.pctSentBack ?? 0),
        borderColor: BP_COLORS[bpColorIndex(subBps, bp.key)],
        backgroundColor: BP_COLORS[bpColorIndex(subBps, bp.key)] + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      })),
  }), [subBps]);

  const sentBackOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: '% of Completed Events Sent Back (Rework)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  const correctedData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps
      .filter(bp => {
        return bp.data.some(d => d.completed.pctCorrected > 0);
      })
      .map(bp => ({
        label: bp.label,
        data: LABELS.map(m => bp.data.find(x => x.ym === m)?.completed.pctCorrected ?? 0),
        borderColor: BP_COLORS[bpColorIndex(subBps, bp.key)],
        backgroundColor: BP_COLORS[bpColorIndex(subBps, bp.key)] + '22',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      })),
  }), [subBps]);

  const correctedOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: '% of Completed Events Corrected', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  const cancellationData = useMemo(() => ({
    labels: [...LABELS],
    datasets: subBps.map((bp, i) => ({
      label: bp.label,
      data: LABELS.map(m => bp.data.find(x => x.ym === m)?.cancellationPct ?? 0),
      borderColor: BP_COLORS[i],
      backgroundColor: BP_COLORS[i] + '22',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  }), [subBps]);

  const cancellationOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Cancellation Rate (%)', font: { family: 'Roboto', size: 14, weight: '600' as const }, color: colors.blackPepper600, padding: { bottom: 12 } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, title: { display: true, text: '%', font: { family: 'Roboto', size: 12 } } },
    },
  }), []);

  return (
    <>
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={reassignedData} options={reassignedOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={cancellationData} options={cancellationOpts} />
          </div>
        </Card>
      </Flex>
      <Flex gap="m" style={{ marginTop: 16 }} flexWrap="wrap">
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={sentBackData} options={sentBackOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: '1 1 600px', minWidth: 500 }}>
          <div style={{ height: 360 }}>
            <Line data={correctedData} options={correctedOpts} />
          </div>
        </Card>
      </Flex>
      <InsightBox>
        <strong>Process quality metrics</strong> from <code>bp_event_stats</code>:
        <strong> Reassigned</strong> = work item reassigned to a different person.
        <strong> Sent back</strong> = work returned for rework (appears on BPs with approval/feedback steps like Interview, Offer, Background Check).
        <strong> Corrected</strong> = event corrected after initial completion. High correction rates may indicate data quality issues or process misconfiguration.
      </InsightBox>
    </>
  );
}

function initialViewFromUrl(): ViewMode {
  const v = getBpDurationsParams().get('view');
  if (v === 'overview' || v === 'detail' || v === 'quality') return v;
  return 'overview';
}

function initialBpFromUrl(): string {
  const bp = getBpDurationsParams().get('bp');
  if (bp && ALL_SUB_BP_KEYS.includes(bp)) return bp;
  return ALL_SUB_BP_KEYS[0] ?? '';
}

function initialSliceFromUrl(): TenantRegionIndustryFilter {
  const q = getBpDurationsParams();
  return {
    tenant: q.get('tenant') || '',
    region: q.get('region') || '',
    industry: q.get('industry') || '',
  };
}

function initialBpTypeFromUrl(): BpTypeFilter {
  const v = getBpDurationsParams().get('bpType');
  if (v === 'offer' || v === 'ea' || v === 'offer-ea') return v;
  return 'offer-ea';
}

function getBpDurationsParams(): URLSearchParams {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('bp-durations')) {
    const qIdx = h.indexOf('?');
    if (qIdx >= 0) {
      return new URLSearchParams(h.slice(qIdx + 1));
    }
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

function syncBpDurationsUrl(view: ViewMode, bp: string, slice: TenantRegionIndustryFilter, bpType: BpTypeFilter) {
  const q = new URLSearchParams();
  q.set('view', view);
  q.set('bp', bp);
  if (bpType !== 'offer-ea') q.set('bpType', bpType);
  if (slice.tenant) q.set('tenant', slice.tenant);
  if (slice.region) q.set('region', slice.region);
  if (slice.industry) q.set('industry', slice.industry);
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h.startsWith('bp-durations')) {
    const hash = q.toString() ? `#bp-durations?${q.toString()}` : '#bp-durations';
    if (window.location.hash !== hash) {
      window.history.replaceState({}, '', hash);
    }
    return;
  }
  const path = window.location.pathname || '/';
  window.history.replaceState({}, '', `${path}?${q.toString()}`);
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export const BpDurationDashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewFromUrl);
  const [selectedBp, setSelectedBp] = useState<string>(initialBpFromUrl);
  const [sliceFilter, setSliceFilter] = useState<TenantRegionIndustryFilter>(initialSliceFromUrl);
  const [bpType, setBpType] = useState<BpTypeFilter>(initialBpTypeFromUrl);

  const { subBps: allSubBps, headline, isGlobal } = useMemo(() => getSliceSubBpsAndHeadline(sliceFilter), [sliceFilter]);
  const subBps = useMemo(() => filterSubBpsByType(allSubBps, bpType), [allSubBps, bpType]);

  const activeBp = subBps.find(bp => bp.key === selectedBp) || subBps[0];

  useEffect(() => {
    syncBpDurationsUrl(viewMode, selectedBp, sliceFilter, bpType);
  }, [viewMode, selectedBp, sliceFilter, bpType]);

  useEffect(() => {
    const onPop = () => {
      setViewMode(initialViewFromUrl());
      setSelectedBp(initialBpFromUrl());
      setSliceFilter(initialSliceFromUrl());
      setBpType(initialBpTypeFromUrl());
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 8,
    border: `1px solid ${colors.soap400}`,
    fontSize: 13,
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: '#fff',
    minWidth: 200,
    color: colors.blackPepper500,
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="bp-durations" />
      <Box padding="l" flex={1}>
        <Box style={{ maxWidth: 1280, margin: '0 auto' }}>
          <PageHeader
            title="Job App Durations"
            subtitle="Duration, completion rate, and process quality for job application stage business processes (Offer, Employment Agreement)."
          />

          <Flex gap="s" style={{ marginBottom: 14, flexWrap: 'wrap' }} alignItems="center">
            <span style={{ fontSize: 12, color: colors.blackPepper400, fontWeight: 600 }}>Related:</span>
            <a href="#interview-metrics" style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>Interview Process</a>
            <span style={{ color: colors.soap400 }}>|</span>
            <a href="#view-dashboard" style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>Offer Duration Benchmark</a>
          </Flex>

          <TenantRegionIndustryFilterCard filters={sliceFilter} onChange={setSliceFilter} bpType={bpType} onBpTypeChange={setBpType} />

          {viewMode === 'overview' && (
            <Flex gap="s" style={{ marginTop: 16 }} flexWrap="wrap">
              {subBps.map(bp => {
                const h = headline[bp.key];
                return (
                  <MetricCard
                    key={bp.key}
                    label={bp.label}
                    value={h?.avgDaysCompleted != null ? `${h.avgDaysCompleted} d` : 'N/A'}
                    helperText={`Median: ${h?.medianDaysCompleted ?? 'N/A'} d | ${h?.completionPct ?? 0}% complete`}
                    changeIndicator={{ text: `${fmtK(h?.totalEvents ?? 0)} events | ${h?.maxTenants?.toLocaleString() ?? 0} tenants`, sentiment: 'neutral' }}
                    tooltip={
                      bp.key === 'employment_agreement'
                        ? 'Propose Compensation Offer/Employment Agreement: mean completed-event duration from bp_event_stats. Not the TA tracker “Time in Offer/EA” (first EA start through final completed EA on one job application).'
                        : `Mean completed-event duration in days for ${bp.label} from monthly bp_event_stats aggregates for this slice.`
                    }
                  />
                );
              })}
            </Flex>
          )}

          <Flex gap="xs" style={{ marginTop: 20, flexWrap: 'wrap' }} alignItems="center">
            {(['overview', 'detail', 'quality'] as ViewMode[]).map(mode => {
              const label = mode === 'overview' ? 'Overview (All BPs)' : mode === 'detail' ? 'Single BP Detail' : 'Process Quality';
              return (
                <SecondaryButton
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    backgroundColor: viewMode === mode ? colors.blueberry400 : undefined,
                    color: viewMode === mode ? '#fff' : undefined,
                    borderColor: viewMode === mode ? colors.blueberry400 : undefined,
                    fontWeight: viewMode === mode ? 600 : 400,
                    borderRadius: 20,
                    fontSize: 13,
                  }}
                >
                  {label}
                </SecondaryButton>
              );
            })}
            {viewMode === 'detail' && (
              <select
                value={activeBp?.key ?? selectedBp}
                onChange={e => setSelectedBp(e.target.value)}
                style={selectStyle}
              >
                {subBps.map(bp => (
                  <option key={bp.key} value={bp.key}>{bp.label}</option>
                ))}
              </select>
            )}
          </Flex>

          <Box style={{ marginTop: 8 }}>
            {viewMode === 'overview' && <OverviewTab subBps={subBps} />}
            {viewMode === 'detail' && activeBp && (
              <DetailTab
                bp={activeBp}
                headlineEntry={headline[activeBp.key]}
                showSliceNote={!isGlobal}
              />
            )}
            {viewMode === 'quality' && <QualityTab subBps={subBps} />}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
