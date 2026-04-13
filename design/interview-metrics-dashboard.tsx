import React, { useState, useMemo } from 'react';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  QUERY_META,
  LABELS,
  toChartValues,
  HEADLINE_KPIS,
  JOB_APPLICATIONS_MONTHLY,
  INTERVIEW_ROUNDS_MONTHLY,
  INTERVIEW_SESSIONS_MONTHLY,
  COMPETENCY_SESSIONS_MONTHLY,
  QUESTIONNAIRE_SESSIONS_MONTHLY,
  RATERS_RATINGS_MONTHLY,
  AVG_TIME_IN_INTERVIEW_BP,
  SCHEDULE_INTERVIEW_TIME,
  SCHEDULE_INTERVIEW_TEAM_TIME,
  SCHEDULE_CANDIDATE_EVENT_TIME,
  FEEDBACK_SUBMISSION_TIME,
  MISST_MONTHLY,
  TIME_TO_FIRST_MISST,
  TIME_TO_FIRST_MISST_MONTHLY,
  TIME_TO_FIRST_INTERVIEW,
  CAPACITY_MONTHLY,
} from './data-interview-metrics';
import {
  FEATURE_FILTERS,
  FEATURE_IMPACT,
  COMPANY_SIZES,
  SIZE_DATA,
  REGIONS,
  REGION_DATA,
  SUPER_INDUSTRIES,
  INDUSTRY_DATA,
  type FeatureKey,
  type FilteredMonthly,
  type SegmentMonthly,
} from './data-interview-filters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

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

type TabId = 'volumes' | 'raters' | 'time' | 'misst' | 'capacity' | 'feature-impact';

const TABS: { id: TabId; label: string }[] = [
  { id: 'volumes', label: 'Interview Volumes' },
  { id: 'raters', label: 'Raters & Ratings' },
  { id: 'time', label: 'Interview Time' },
  { id: 'misst', label: 'MISST Metrics' },
  { id: 'capacity', label: 'Capacity & Load' },
  { id: 'feature-impact', label: 'Feature Impact' },
];

interface FilterState {
  feature: FeatureKey | '';
  featureState: 'all' | 'enabled' | 'disabled';
  companySize: string;
  region: string;
  superIndustry: string;
  startMonth: string;
  endMonth: string;
}

const DEFAULT_FILTERS: FilterState = {
  feature: '',
  featureState: 'all',
  companySize: '',
  region: '',
  superIndustry: '',
  startMonth: LABELS[0],
  endMonth: LABELS[LABELS.length - 1],
};

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: `1px solid ${colors.soap400}`,
  fontSize: 13,
  fontFamily: 'Roboto, sans-serif',
  backgroundColor: '#fff',
  minWidth: 140,
  color: colors.blackPepper500,
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: colors.blackPepper400,
  fontWeight: 600,
  marginBottom: 2,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
};

function FilterPanel({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const hasActiveFilter = filters.feature !== '' || filters.companySize !== '' || filters.region !== '' || filters.superIndustry !== '';
  return (
    <Card style={{ ...chartCard, marginTop: 16, padding: 16, border: hasActiveFilter ? `2px solid ${colors.blueberry400}` : undefined }}>
      <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: 12 }}>
        <Heading size="small" style={{ margin: 0, fontSize: 14 }}>Filters</Heading>
        {hasActiveFilter && (
          <SecondaryButton
            size="small"
            onClick={() => onChange(DEFAULT_FILTERS)}
            style={{ fontSize: 12, borderRadius: 16, padding: '2px 12px' }}
          >
            Clear all
          </SecondaryButton>
        )}
      </Flex>
      <Flex gap="m" flexWrap="wrap">
        <Box>
          <div style={filterLabelStyle}>Feature Usage</div>
          <Flex gap="xs" alignItems="center">
            <select
              value={filters.feature}
              onChange={e => onChange({ ...filters, feature: e.target.value as FeatureKey | '' })}
              style={selectStyle}
            >
              <option value="">All features</option>
              {FEATURE_FILTERS.map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
            {filters.feature && (
              <select
                value={filters.featureState}
                onChange={e => onChange({ ...filters, featureState: e.target.value as 'all' | 'enabled' | 'disabled' })}
                style={{ ...selectStyle, minWidth: 100 }}
              >
                <option value="all">Compare</option>
                <option value="enabled">Enabled only</option>
                <option value="disabled">Disabled only</option>
              </select>
            )}
          </Flex>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Company Size</div>
          <select
            value={filters.companySize}
            onChange={e => onChange({ ...filters, companySize: e.target.value })}
            style={selectStyle}
          >
            <option value="">All sizes</option>
            {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Region</div>
          <select
            value={filters.region}
            onChange={e => onChange({ ...filters, region: e.target.value })}
            style={selectStyle}
          >
            <option value="">All regions</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Super Industry</div>
          <select
            value={filters.superIndustry}
            onChange={e => onChange({ ...filters, superIndustry: e.target.value })}
            style={selectStyle}
          >
            <option value="">All industries</option>
            {SUPER_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Box>
        <Box>
          <div style={filterLabelStyle}>Time Range</div>
          <Flex gap="xs" alignItems="center">
            <select
              value={filters.startMonth}
              onChange={e => onChange({ ...filters, startMonth: e.target.value })}
              style={{ ...selectStyle, minWidth: 110 }}
            >
              {LABELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span style={{ color: colors.blackPepper400, fontSize: 12 }}>to</span>
            <select
              value={filters.endMonth}
              onChange={e => onChange({ ...filters, endMonth: e.target.value })}
              style={{ ...selectStyle, minWidth: 110 }}
            >
              {LABELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Flex>
        </Box>
      </Flex>
      {hasActiveFilter && (
        <Box style={{ marginTop: 8, fontSize: 12, color: colors.blueberry400, fontStyle: 'italic' }}>
          {filters.feature && <>Showing data for tenants with <strong>{FEATURE_FILTERS.find(f => f.key === filters.feature)?.label}</strong> {filters.featureState === 'all' ? '(enabled vs disabled)' : filters.featureState}. </>}
          {filters.companySize && <>Size: <strong>{filters.companySize}</strong>. </>}
          {filters.region && <>Region: <strong>{filters.region}</strong>. </>}
          {filters.superIndustry && <>Industry: <strong>{filters.superIndustry}</strong>. </>}
          {(filters.startMonth !== LABELS[0] || filters.endMonth !== LABELS[LABELS.length - 1]) && <>Range: {filters.startMonth} to {filters.endMonth}. </>}
        </Box>
      )}
    </Card>
  );
}

function getFilteredLabels(filters: FilterState): string[] {
  const startIdx = LABELS.indexOf(filters.startMonth);
  const endIdx = LABELS.indexOf(filters.endMonth);
  return LABELS.slice(Math.max(0, startIdx), endIdx + 1);
}

function getSegmentData(filters: FilterState): SegmentMonthly[] | null {
  if (filters.companySize) return SIZE_DATA.filter(d => d.segment === filters.companySize);
  if (filters.region) return REGION_DATA.filter(d => d.segment === filters.region);
  if (filters.superIndustry) return INDUSTRY_DATA.filter(d => d.segment === filters.superIndustry);
  return null;
}

function getFeatureData(filters: FilterState): { enabled: FilteredMonthly[]; disabled: FilteredMonthly[] } | null {
  if (!filters.feature) return null;
  return FEATURE_IMPACT[filters.feature];
}

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

const MiniKpi: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <Box style={{ textAlign: 'center', minWidth: 140, flex: 1 }}>
    <BodyText size="small" style={{ color: colors.blackPepper400, marginBottom: 2 }}>{label}</BodyText>
    <Heading size="small" style={{ margin: 0 }}>{value}</Heading>
    {sub && <BodyText size="small" style={{ color: colors.licorice200, marginTop: 2 }}>{sub}</BodyText>}
  </Box>
);

// ─── Volume Tab ───

function VolumesTab() {
  const volumeChartData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      { label: 'Job Applications', data: toChartValues(JOB_APPLICATIONS_MONTHLY, d => d.value), borderColor: colors.blueberry500, backgroundColor: colors.blueberry500, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'Interview Rounds', data: toChartValues(INTERVIEW_ROUNDS_MONTHLY, d => d.value), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'Interview Sessions', data: toChartValues(INTERVIEW_SESSIONS_MONTHLY, d => d.value), borderColor: colors.cantaloupe400, backgroundColor: colors.cantaloupe400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
    ],
  }), []);

  const volumeOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Monthly interview volume', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${fmtK(ctx.parsed.y)}` } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => fmtK(v) } },
    },
  }), []);

  const sessionChartData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      { label: 'With Questionnaire', data: toChartValues(QUESTIONNAIRE_SESSIONS_MONTHLY, d => d.value), borderColor: '#0d9488', backgroundColor: '#0d9488', tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'With Competency', data: toChartValues(COMPETENCY_SESSIONS_MONTHLY, d => d.value), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
    ],
  }), []);

  const sessionOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Interview sessions with enrichment', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${fmtK(ctx.parsed.y)}` } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => fmtK(v) } },
    },
  }), []);

  const totalAppl = JOB_APPLICATIONS_MONTHLY.reduce((s, d) => s + d.value, 0);
  const totalRounds = INTERVIEW_ROUNDS_MONTHLY.reduce((s, d) => s + d.value, 0);
  const totalSessions = INTERVIEW_SESSIONS_MONTHLY.reduce((s, d) => s + d.value, 0);
  const totalCompetency = COMPETENCY_SESSIONS_MONTHLY.reduce((s, d) => s + d.value, 0);
  const totalQuestionnaire = QUESTIONNAIRE_SESSIONS_MONTHLY.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 16 }}>
        <MiniKpi label="Total Job Applications" value={fmtK(totalAppl)} sub={`${fmtK(HEADLINE_KPIS.jobApplications.tenants)} tenants`} />
        <MiniKpi label="Total Interview Rounds" value={fmtK(totalRounds)} sub={`${fmtK(HEADLINE_KPIS.interviewRounds.tenants)} tenants`} />
        <MiniKpi label="Total Sessions" value={fmtK(totalSessions)} sub={`${fmtK(HEADLINE_KPIS.interviewSessions.tenants)} tenants`} />
        <MiniKpi label="With Competency" value={fmtK(totalCompetency)} sub={`${COMPETENCY_SESSIONS_MONTHLY.slice(-1)[0]?.tenants} tenants`} />
        <MiniKpi label="With Questionnaire" value={fmtK(totalQuestionnaire)} sub={`${QUESTIONNAIRE_SESSIONS_MONTHLY.slice(-1)[0]?.tenants} tenants`} />
      </Flex>
      <Card style={chartCard}>
        <div style={{ height: 360 }}>
          <Line data={volumeChartData} options={volumeOpts} />
        </div>
        <InsightBox>
          <strong>Insight:</strong> All three volume metrics now have full 12-month coverage. Job applications peaked at 3.08M in Oct 2025
          before a seasonal dip to 2.33M in Dec, recovering to 3.04M in Mar 2026. Interview sessions show a similar pattern with
          a strong recovery to 1.71M in Mar 2026 (+71% from Dec low). Tenant count grew steadily from 3,514 to 3,995 (+14%).
        </InsightBox>
      </Card>
      <Card style={{ ...chartCard, marginTop: 16 }}>
        <div style={{ height: 300 }}>
          <Line data={sessionChartData} options={sessionOpts} />
        </div>
        <InsightBox>
          <strong>Insight:</strong> Questionnaire usage is ~7x higher than competency (avg ~540k vs ~80k sessions/month),
          but competency adoption grew 19% in tenants (376 to 446) over 12 months. Questionnaire tenants grew from 1,147 to
          1,418 (+24%). Both show strong upward trajectories in Q1 2026, with competency reaching 122k sessions in Mar 2026.
        </InsightBox>
      </Card>
    </>
  );
}

// ─── Raters Tab ───

function RatersTab() {
  const chartData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      { label: 'Unique Raters', data: toChartValues(RATERS_RATINGS_MONTHLY, d => d.raters), borderColor: colors.blueberry500, backgroundColor: colors.blueberry200 + '55', fill: true, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'Total Ratings', data: toChartValues(RATERS_RATINGS_MONTHLY, d => d.ratings), borderColor: colors.cantaloupe400, backgroundColor: colors.cantaloupe400, tension: 0.25, pointRadius: 3, borderWidth: 2, yAxisID: 'y1' },
    ],
  }), []);

  const opts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Interview raters and ratings', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${fmtK(ctx.parsed.y)}` } },
    },
    scales: {
      x: BASE_LINE_OPTS.scales.x,
      y: { ...BASE_LINE_OPTS.scales.y, position: 'left' as const, title: { display: true, text: 'Raters', font: { family: 'Roboto' } }, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => fmtK(v) } },
      y1: { ...BASE_LINE_OPTS.scales.y, position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'Ratings', font: { family: 'Roboto' } }, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => fmtK(v) } },
    },
  }), []);

  const totalRaters = RATERS_RATINGS_MONTHLY.reduce((s, d) => s + d.raters, 0);
  const totalRatings = RATERS_RATINGS_MONTHLY.reduce((s, d) => s + d.ratings, 0);
  const avgPerTenantLoad = CAPACITY_MONTHLY.reduce((s, d) => s + d.ratingsPerRater, 0) / CAPACITY_MONTHLY.length;

  return (
    <>
      <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 16 }}>
        <MiniKpi label="Total Raters (cumulative)" value={fmtK(totalRaters)} sub={`${RATERS_RATINGS_MONTHLY.slice(-1)[0]?.tenants.toLocaleString()} tenants`} />
        <MiniKpi label="Total Ratings" value={fmtK(totalRatings)} sub="Rate Interview + Give Interview Feedback" />
        <MiniKpi label="Avg Ratings / Rater" value={avgPerTenantLoad.toFixed(2)} sub="Per-tenant monthly avg" />
      </Flex>
      <Card style={chartCard}>
        <div style={{ height: 380 }}>
          <Line data={chartData} options={opts} />
        </div>
        <InsightBox>
          <strong>Insight:</strong> The rater pool ranges from 109k to 127k unique interviewers per month across ~2,100-2,340
          tenants. Both raters and ratings show a seasonal dip in Nov-Dec 2025 (holiday period) before recovering in Q1 2026.
          The per-tenant average of ~{avgPerTenantLoad.toFixed(1)} ratings per interviewer per month indicates moderate, well-distributed
          workload. Tenant adoption grew 12% (2,093 to 2,339) over the period.
        </InsightBox>
      </Card>
    </>
  );
}

// ─── Time Tab ───

function TimeTab() {
  const bpTimeData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Avg days in Interview BP',
      data: toChartValues(AVG_TIME_IN_INTERVIEW_BP, d => d.avgValue),
      borderColor: colors.blueberry500,
      backgroundColor: colors.blueberry200 + '55',
      fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2,
    }],
  }), []);

  const bpTimeOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Avg. overall time a job application is in Interview BP (days)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(1)} days` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}d` } } },
  }), []);

  const scheduleData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      { label: 'Schedule Interview (avg hours)', data: toChartValues(SCHEDULE_INTERVIEW_TIME, d => d.avgValue), borderColor: '#7c3aed', backgroundColor: '#7c3aed', tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'Schedule Interview Team (avg hours)', data: toChartValues(SCHEDULE_INTERVIEW_TEAM_TIME, d => d.avgValue), borderColor: colors.blueberry500, backgroundColor: colors.blueberry500, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: 'Schedule Candidate Event (avg hours)', data: toChartValues(SCHEDULE_CANDIDATE_EVENT_TIME, d => d.avgValue), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
    ],
  }), []);

  const scheduleOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Avg. time on schedule interview related tasks (hours)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}h` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}h` } } },
  }), []);

  const feedbackData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Avg feedback time (hours)',
      data: toChartValues(FEEDBACK_SUBMISSION_TIME, d => d.avgValue),
      borderColor: colors.cinnamon400,
      backgroundColor: colors.cinnamon400 + '33',
      fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2,
    }],
  }), []);

  const feedbackOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Avg. time submitting interview feedback (hours)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(1)} hours` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}h` } } },
  }), []);

  const avgBpDays = AVG_TIME_IN_INTERVIEW_BP.slice(0, 9).reduce((s, d) => s + d.avgValue, 0) / 9;
  const avgScheduleInterview = SCHEDULE_INTERVIEW_TIME.reduce((s, d) => s + d.avgValue, 0) / SCHEDULE_INTERVIEW_TIME.length;
  const avgScheduleTeam = SCHEDULE_INTERVIEW_TEAM_TIME.reduce((s, d) => s + d.avgValue, 0) / SCHEDULE_INTERVIEW_TEAM_TIME.length;
  const avgFeedback = FEEDBACK_SUBMISSION_TIME.reduce((s, d) => s + d.avgValue, 0) / FEEDBACK_SUBMISSION_TIME.length;

  return (
    <>
      <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 16 }}>
        <MiniKpi label="Avg time in Interview BP" value={`${avgBpDays.toFixed(1)} days`} sub={`${AVG_TIME_IN_INTERVIEW_BP.slice(-1)[0]?.tenants.toLocaleString()} tenants • Apr-Dec avg`} />
        <MiniKpi label="Avg Schedule Interview" value={`${avgScheduleInterview.toFixed(1)}h`} sub={`${SCHEDULE_INTERVIEW_TIME.slice(-1)[0]?.tenants.toLocaleString()} tenants`} />
        <MiniKpi label="Avg Schedule Interview Team" value={`${avgScheduleTeam.toFixed(1)}h`} sub={`${SCHEDULE_INTERVIEW_TEAM_TIME.slice(-1)[0]?.tenants.toLocaleString()} tenants`} />
        <MiniKpi label="Avg Feedback Submission" value={`${avgFeedback.toFixed(1)}h`} sub={`${FEEDBACK_SUBMISSION_TIME.slice(-1)[0]?.tenants.toLocaleString()} tenants`} />
      </Flex>
      <Card style={chartCard}>
        <div style={{ height: 300 }}>
          <Line data={bpTimeData} options={bpTimeOpts} />
        </div>
        <InsightBox>
          <strong>Note:</strong> The declining trend in Jan-Mar 2026 reflects right-censoring bias - more recent months include BPs that started
          recently and completed quickly, while longer-running BPs haven't finished yet. The Apr-Dec 2025 range (16.9-19.4 days) is more
          reliable as a baseline, averaging {avgBpDays.toFixed(1)} days.
        </InsightBox>
      </Card>
      <Flex gap="s" style={{ marginTop: 16 }}>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 300 }}>
            <Line data={scheduleData} options={scheduleOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 300 }}>
            <Line data={feedbackData} options={feedbackOpts} />
          </div>
        </Card>
      </Flex>
      <InsightBox>
        <strong>Insight:</strong> Schedule Interview Team averages ~{avgScheduleTeam.toFixed(0)}h ({(avgScheduleTeam / 24).toFixed(1)} days) while
        Schedule Interview (3-page calendar) averages ~{avgScheduleInterview.toFixed(0)}h ({(avgScheduleInterview / 24).toFixed(1)} days).
        Feedback submission takes ~{avgFeedback.toFixed(0)}h ({(avgFeedback / 24).toFixed(1)} days), making it the single largest time consumer
        in the interview BP. Schedule Candidate Event is significantly faster (~13h) but serves only ~50 tenants.
        Schedule Interview Team spiked to 89h in Oct 2025 before returning to normal.
      </InsightBox>
    </>
  );
}

// ─── MISST Tab ───

function MisstTab() {
  const misstTimeData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Avg MISST time per JR (seconds)',
      data: toChartValues(MISST_MONTHLY, d => d.avgSecondsPerReq),
      borderColor: colors.blueberry500,
      backgroundColor: colors.blueberry200 + '55',
      fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2,
    }],
  }), []);

  const misstTimeOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Avg total MISST time per job requisition (seconds)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(1)}s` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}s` } } },
  }), []);

  const sessionsData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'MISST sessions per req',
      data: toChartValues(MISST_MONTHLY, d => d.sessionsPerReq),
      backgroundColor: colors.greenApple400,
      borderRadius: 4,
      barThickness: 28,
    }],
  }), []);

  const sessionsOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Avg number of MISST sessions per job requisition', font: { family: 'Roboto', size: 14, weight: '600' as const } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, min: 0, max: 4 } },
  }), []);

  const avgSeconds = MISST_MONTHLY.reduce((s, d) => s + d.avgSecondsPerReq, 0) / MISST_MONTHLY.length;
  const avgSessions = MISST_MONTHLY.reduce((s, d) => s + d.sessionsPerReq, 0) / MISST_MONTHLY.length;

  const firstMisstData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'JR to First MISST (days)',
      data: toChartValues(TIME_TO_FIRST_MISST_MONTHLY, d => d.avgValue),
      borderColor: colors.cinnamon400,
      backgroundColor: colors.cinnamon400 + '33',
      fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2,
      spanGaps: false,
    }],
  }), []);

  const firstMisstOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Time from JR initiation to first MISST submission (days)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(1)} days` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => `${v}d` } } },
  }), []);

  return (
    <>
      <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 16 }}>
        <MiniKpi label="Avg MISST Time / JR" value={`${avgSeconds.toFixed(0)}s`} sub={`${MISST_MONTHLY.slice(-1)[0]?.tenants.toLocaleString()} tenants`} />
        <MiniKpi label="Avg Sessions / Req" value={avgSessions.toFixed(2)} sub={`${fmtK(MISST_MONTHLY.reduce((s, d) => s + d.nReqs, 0))} reqs total`} />
        <MiniKpi label="JR to First MISST" value={`${TIME_TO_FIRST_MISST.avgDays} days`} sub={`${TIME_TO_FIRST_MISST.tenants.toLocaleString()} tenants (snapshot)`} />
        <MiniKpi label="Time to First Interview" value={`${TIME_TO_FIRST_INTERVIEW.avgDays} days`} sub={`${TIME_TO_FIRST_INTERVIEW.tenants.toLocaleString()} tenants`} />
      </Flex>
      <Flex gap="s">
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 300 }}>
            <Line data={misstTimeData} options={misstTimeOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 300 }}>
            <Bar data={sessionsData} options={sessionsOpts} />
          </div>
        </Card>
      </Flex>
      <Card style={{ ...chartCard, marginTop: 16 }}>
        <div style={{ height: 300 }}>
          <Line data={firstMisstData} options={firstMisstOpts} />
        </div>
        <InsightBox>
          <strong>Note:</strong> JR to First MISST data is from a snapshot table (Apr-Jul 2025 only). The declining trend reflects
          right-censoring bias. The Apr-Jun range (15-19 days) is more reliable as a baseline.
          Source: <code>job_req_status_daily</code>, {TIME_TO_FIRST_MISST.nReqs.toLocaleString()} JRs across {TIME_TO_FIRST_MISST.tenants.toLocaleString()} tenants.
        </InsightBox>
      </Card>
      <InsightBox>
        <strong>Insight:</strong> MISST time per JR averaged {avgSeconds.toFixed(0)}s across 12 months, declining from 205s in Apr 2025
        to a steady ~170-183s through the middle of the period, with Mar 2026 dropping to 135s (possible right-censoring on incomplete
        scheduling events). Sessions per JR declined from 2.35 to ~2.0, suggesting schedulers are becoming more efficient.
        The average time from JR initiation to first MISST is {TIME_TO_FIRST_MISST.avgDays} days, while the average time to
        first interview is {TIME_TO_FIRST_INTERVIEW.avgDays} days - a gap of ~{(TIME_TO_FIRST_INTERVIEW.avgDays - TIME_TO_FIRST_MISST.avgDays).toFixed(0)} days
        between scheduling setup and the actual interview.
      </InsightBox>
    </>
  );
}

// ─── Capacity Tab ───

function CapacityTab() {
  const schedulerData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      { label: 'Schedule Interview Team', data: toChartValues(CAPACITY_MONTHLY, d => d.schedulersSIT), borderColor: colors.blueberry500, backgroundColor: colors.blueberry200 + '55', fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2 },
      { label: 'Schedule Candidate Event', data: toChartValues(CAPACITY_MONTHLY, d => d.schedulersSCE), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
    ],
  }), []);

  const schedulerOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: 'Interview scheduling coordinator capacity by type', font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${fmtK(ctx.parsed.y)}` } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => fmtK(v) } } },
  }), []);

  const loadData = useMemo(() => ({
    labels: LABELS,
    datasets: [{
      label: 'Ratings per interviewer (per-tenant avg)',
      data: toChartValues(CAPACITY_MONTHLY, d => d.ratingsPerRater),
      backgroundColor: colors.cantaloupe400,
      borderRadius: 4,
      barThickness: 28,
    }],
  }), []);

  const loadOpts = useMemo(() => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      legend: { display: false },
      title: { display: true, text: 'Avg interview ratings per interviewer (per-tenant average)', font: { family: 'Roboto', size: 14, weight: '600' as const } },
    },
    scales: { ...BASE_LINE_OPTS.scales, y: { ...BASE_LINE_OPTS.scales.y, min: 0, max: 6 } },
  }), []);

  const avgSIT = Math.round(CAPACITY_MONTHLY.reduce((s, d) => s + d.schedulersSIT, 0) / CAPACITY_MONTHLY.length);
  const avgSCE = Math.round(CAPACITY_MONTHLY.reduce((s, d) => s + d.schedulersSCE, 0) / CAPACITY_MONTHLY.length);
  const avgLoad = CAPACITY_MONTHLY.reduce((s, d) => s + d.ratingsPerRater, 0) / CAPACITY_MONTHLY.length;

  return (
    <>
      <Flex gap="s" flexWrap="wrap" style={{ marginBottom: 16 }}>
        <MiniKpi label="Avg Monthly Schedulers (SIT)" value={fmtK(avgSIT)} sub={`${CAPACITY_MONTHLY.slice(-1)[0]?.schedulerTenantsSIT} tenants`} />
        <MiniKpi label="Avg Monthly Schedulers (SCE)" value={fmtK(avgSCE)} sub={`${CAPACITY_MONTHLY.slice(-1)[0]?.schedulerTenantsSCE} tenants`} />
        <MiniKpi label="Avg Ratings / Interviewer" value={avgLoad.toFixed(2)} sub="Per-tenant monthly avg" />
        <MiniKpi label="Peak Monthly Schedulers" value={fmtK(Math.max(...CAPACITY_MONTHLY.map(d => d.schedulersSIT + d.schedulersSCE)))} sub="Sep 2025" />
      </Flex>
      <Flex gap="s">
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 320 }}>
            <Line data={schedulerData} options={schedulerOpts} />
          </div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 320 }}>
            <Bar data={loadData} options={loadOpts} />
          </div>
        </Card>
      </Flex>
      <InsightBox>
        <strong>Insight:</strong> Schedule Interview Team capacity peaked at 25.6k coordinators in Sep 2025 before a seasonal dip
        to 18.9k in Dec, recovering to 22.3k in Mar 2026. SCE serves ~1k schedulers across ~50 tenants. The per-tenant average
        interviewer load of ~{avgLoad.toFixed(1)} ratings per month indicates moderate, well-distributed workload. SIT scheduler
        tenants held steady at ~530-556 while SCE grew slightly to 56 tenants.
      </InsightBox>
    </>
  );
}

// ─── Feature Impact Tab ───

function FeatureImpactTab({ filters }: { filters: FilterState }) {
  const selectedFeature = filters.feature || 'interview_bp';
  const featureLabel = FEATURE_FILTERS.find(f => f.key === selectedFeature)?.label || selectedFeature;
  const data = FEATURE_IMPACT[selectedFeature as FeatureKey];
  const labels = getFilteredLabels(filters);

  const filterByRange = (arr: FilteredMonthly[]) => arr.filter(d => labels.includes(d.ym));
  const enabled = filterByRange(data.enabled);
  const disabled = filterByRange(data.disabled);

  const volumeData = useMemo(() => ({
    labels,
    datasets: [
      { label: `${featureLabel}: Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.jobApps ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: `${featureLabel}: Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.jobApps ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400, tension: 0.25, pointRadius: 3, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled, featureLabel]);

  const roundsData = useMemo(() => ({
    labels,
    datasets: [
      { label: `Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.rounds ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: `Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.rounds ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400, tension: 0.25, pointRadius: 3, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled]);

  const bpTimeData = useMemo(() => ({
    labels,
    datasets: [
      { label: `Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.avgBpDays ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple200 + '44', fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2 },
      { label: `Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.avgBpDays ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400 + '22', fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled]);

  const ratersData = useMemo(() => ({
    labels,
    datasets: [
      { label: `Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.raters ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: `Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.raters ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400, tension: 0.25, pointRadius: 3, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled]);

  const scheduleData = useMemo(() => ({
    labels,
    datasets: [
      { label: `Sched. Interview - Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.siAvgHours ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: `Sched. Interview - Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.siAvgHours ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400, tension: 0.25, pointRadius: 3, borderWidth: 2, borderDash: [5, 3] },
      { label: `Sched. Team - Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.sitAvgHours ?? null), borderColor: colors.blueberry400, backgroundColor: colors.blueberry400, tension: 0.25, pointRadius: 3, borderWidth: 2 },
      { label: `Sched. Team - Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.sitAvgHours ?? null), borderColor: colors.blueberry200, backgroundColor: colors.blueberry200, tension: 0.25, pointRadius: 3, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled]);

  const misstData = useMemo(() => ({
    labels,
    datasets: [
      { label: `Enabled`, data: labels.map(ym => enabled.find(d => d.ym === ym)?.misstAvgSecs ?? null), borderColor: colors.greenApple400, backgroundColor: colors.greenApple200 + '44', fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2 },
      { label: `Disabled`, data: labels.map(ym => disabled.find(d => d.ym === ym)?.misstAvgSecs ?? null), borderColor: colors.cinnamon400, backgroundColor: colors.cinnamon400 + '22', fill: true, tension: 0.25, pointRadius: 4, borderWidth: 2, borderDash: [5, 3] },
    ],
  }), [labels, enabled, disabled]);

  const chartOpts = (title: string, unit: string) => ({
    ...BASE_LINE_OPTS,
    plugins: {
      ...BASE_LINE_OPTS.plugins,
      title: { display: true, text: title, font: { family: 'Roboto', size: 14, weight: '600' as const } },
      tooltip: { ...BASE_LINE_OPTS.plugins.tooltip, callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${unit === 'k' ? fmtK(ctx.parsed.y) : ctx.parsed.y?.toFixed(1) + (unit || '')}` } },
    },
    scales: {
      ...BASE_LINE_OPTS.scales,
      y: { ...BASE_LINE_OPTS.scales.y, ticks: { ...BASE_LINE_OPTS.scales.y.ticks, callback: (v: number) => unit === 'k' ? fmtK(v) : `${v}${unit}` } },
    },
  });

  const enabledTenants = enabled.length > 0 ? enabled[enabled.length - 1].tenants : 0;
  const disabledTenants = disabled.length > 0 ? disabled[disabled.length - 1].tenants : 0;
  const enabledAvgBp = enabled.slice(0, 9).reduce((s, d) => s + (d.avgBpDays ?? 0), 0) / Math.min(9, enabled.length);
  const disabledAvgBp = disabled.slice(0, 9).reduce((s, d) => s + (d.avgBpDays ?? 0), 0) / Math.min(9, disabled.length);

  return (
    <>
      <Card style={{ ...chartCard, marginBottom: 16, backgroundColor: colors.blueberry50 || '#EDF5FF' }}>
        <Heading size="small" style={{ margin: '0 0 8px 0' }}>Feature Impact: {featureLabel}</Heading>
        <Flex gap="l" flexWrap="wrap">
          <Box style={{ flex: 1, minWidth: 200 }}>
            <BodyText size="small" style={{ color: colors.greenApple400, fontWeight: 600 }}>Enabled</BodyText>
            <BodyText size="small">{enabledTenants.toLocaleString()} tenants</BodyText>
          </Box>
          <Box style={{ flex: 1, minWidth: 200 }}>
            <BodyText size="small" style={{ color: colors.cinnamon400, fontWeight: 600 }}>Disabled</BodyText>
            <BodyText size="small">{disabledTenants.toLocaleString()} tenants</BodyText>
          </Box>
          <Box style={{ flex: 1, minWidth: 200 }}>
            <BodyText size="small" style={{ fontWeight: 600 }}>Avg BP Time (Apr-Dec)</BodyText>
            <BodyText size="small">
              Enabled: {enabledAvgBp.toFixed(1)}d | Disabled: {disabledAvgBp.toFixed(1)}d
              {enabledAvgBp < disabledAvgBp
                ? ` (${((1 - enabledAvgBp / disabledAvgBp) * 100).toFixed(0)}% faster)`
                : enabledAvgBp > disabledAvgBp
                ? ` (${((enabledAvgBp / disabledAvgBp - 1) * 100).toFixed(0)}% slower)`
                : ''}
            </BodyText>
          </Box>
        </Flex>
        <BodyText size="small" style={{ marginTop: 8, fontSize: 11, color: colors.blackPepper300 }}>
          Select a feature from the filter panel above. Green (solid) = tenants with feature enabled. Red (dashed) = disabled.
        </BodyText>
      </Card>

      <Flex gap="s" style={{ marginBottom: 16 }}>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={volumeData} options={chartOpts('Job Applications', 'k')} /></div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={roundsData} options={chartOpts('Interview Rounds', 'k')} /></div>
        </Card>
      </Flex>
      <Flex gap="s" style={{ marginBottom: 16 }}>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={bpTimeData} options={chartOpts('Avg Time in Interview BP (days)', 'd')} /></div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={ratersData} options={chartOpts('Unique Raters', 'k')} /></div>
        </Card>
      </Flex>
      <Flex gap="s" style={{ marginBottom: 16 }}>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={scheduleData} options={chartOpts('Avg Schedule Task Time (hours)', 'h')} /></div>
        </Card>
        <Card style={{ ...chartCard, flex: 1 }}>
          <div style={{ height: 280 }}><Line data={misstData} options={chartOpts('Avg MISST Time per JR (seconds)', 's')} /></div>
        </Card>
      </Flex>
      <InsightBox>
        <strong>How to read this view:</strong> Select a feature from the Filters panel above. Solid green lines show
        tenants that have the feature enabled; dashed red lines show tenants without. The comparison reveals the impact of
        feature adoption on interview volumes, processing time, and rater engagement. Note: segment filters (company size,
        region, industry) apply to the main tabs and are independent of the feature comparison.
      </InsightBox>
    </>
  );
}

// ─── Main Dashboard ───

export const InterviewMetricsDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('volumes');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  return (
    <Flex flexDirection="column" minHeight="100vh" style={{ backgroundColor: SANA_PAGE_CANVAS }}>
      <DashboardGlobalNav activeMetricsSlug="interview-metrics" />
      <Box padding="l" flex={1}>
      <div style={{ marginBottom: 8 }}>
        <a href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/bp-durations`} style={{ fontSize: 12, color: colors.blueberry500, textDecoration: 'none', fontWeight: 600 }}>&larr; Job App Stage Durations</a>
      </div>
      <PageHeader title={QUERY_META.title} subtitle={QUERY_META.subtitle} />

      <Flex gap="s" style={{ marginTop: 24 }} flexWrap="wrap">
        <MetricCard
          label="Job Applications"
          value={fmtK(HEADLINE_KPIS.jobApplications.total)}
          helperText={`${HEADLINE_KPIS.jobApplications.tenants.toLocaleString()} tenants`}
          changeIndicator={{ text: '12 months (Apr 2025 - Mar 2026)', sentiment: 'neutral' }}
          tooltip="Rolling sum of job application volume across the 12-month window; tenants = those with activity in the series."
        />
        <MetricCard
          label="Interview Rounds"
          value={fmtK(HEADLINE_KPIS.interviewRounds.total)}
          helperText={`${HEADLINE_KPIS.interviewRounds.tenants.toLocaleString()} tenants`}
          changeIndicator={{ text: '12 months (Apr 2025 - Mar 2026)', sentiment: 'neutral' }}
          tooltip="Total interview rounds recorded over the window (Pharos recruiting analytics export)."
        />
        <MetricCard
          label="Interview Sessions"
          value={fmtK(HEADLINE_KPIS.interviewSessions.total)}
          helperText={`${HEADLINE_KPIS.interviewSessions.tenants.toLocaleString()} tenants`}
          changeIndicator={{ text: '12 months (Apr 2025 - Mar 2026)', sentiment: 'neutral' }}
          tooltip="Total interview sessions (scheduled/completed style counts from the interview fact pipeline)."
        />
        <MetricCard
          label="Avg Time in Interview BP"
          value={`${HEADLINE_KPIS.avgTimeInBP.avg.toFixed(1)} days`}
          helperText={`${HEADLINE_KPIS.avgTimeInBP.tenants.toLocaleString()} tenants`}
          changeIndicator={{ text: 'Apr-Dec avg (excl. right-censored)', sentiment: 'neutral' }}
          tooltip="Mean time in Interview BP from completed-path averages in the bundled series (see Time tab notes). Differs from TA tracker job-app chained Offer/EA duration."
        />
      </Flex>

      <FilterPanel filters={filters} onChange={setFilters} />

      <Flex gap="xs" style={{ marginTop: 16 }} flexWrap="wrap">
        {TABS.map(tab => (
          <SecondaryButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? colors.blueberry400 : undefined,
              color: activeTab === tab.id ? '#fff' : undefined,
              borderColor: activeTab === tab.id ? colors.blueberry400 : undefined,
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderRadius: 20,
              fontSize: 13,
            }}
          >
            {tab.label}
          </SecondaryButton>
        ))}
      </Flex>

      <Box style={{ marginTop: 24 }}>
        {activeTab === 'volumes' && <VolumesTab />}
        {activeTab === 'raters' && <RatersTab />}
        {activeTab === 'time' && <TimeTab />}
        {activeTab === 'misst' && <MisstTab />}
        {activeTab === 'capacity' && <CapacityTab />}
        {activeTab === 'feature-impact' && <FeatureImpactTab filters={filters} />}
      </Box>

      <BodyText
        size="small"
        style={{ color: colors.licorice200, marginTop: 16, fontStyle: 'italic', lineHeight: 1.6 }}
      >
        Source: {QUERY_META.source} | Date range: {QUERY_META.dateRange} |
        Queried: {QUERY_META.queryDate} |
        Task duration outliers exceeding 1 year are excluded from time calculations.
        <br />
        {QUERY_META.note}
      </BodyText>
      </Box>
    </Flex>
  );
};

export default InterviewMetricsDashboard;
