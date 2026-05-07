import React, { useRef, useState } from 'react';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Switch } from '@workday/canvas-kit-react/switch';
import { checkCircleIcon, pinIcon, userIcon } from '@workday/canvas-system-icons-web';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  SsaShell,
  SsaStarterSuggestions,
  SparkleMark,
  SanaCommComposer,
  SsaAgentTurn,
  SsaUserPromptPill,
  SANA_SECONDARY_TAB_INACTIVE_FG,
  SANA_COMM_PANEL_SURFACE,
  FormTextInput,
  FormDateInput,
  FormRadioGroup,
  AlertBanner,
} from './components';

type Mode = 'cold-start' | 'in-task';
type ScenarioId = 'overlap-backfill' | 'transfer-position';

type OverlapStepId = 'position-confirmation' | 'details' | 'approve-open' | 'opened';
type TransferStepId = 'select-worker' | 'effective-date' | 'details' | 'review' | 'submitted';
type StepId = OverlapStepId | TransferStepId;

type TransferWorker = { id: string; name: string; subtitle: string };
type ReqCustomField = { id: string; label: string; value: string; required: boolean; source: string };
type ScreeningQuestion = { id: string; text: string; recommended: boolean; included: boolean; reason: string };
type InterviewQuestion = { id: string; prompt: string; skill: string };
type PostingPack = {
  publicTitle: string;
  locations: string[];
  payTransparency: string;
  seoKeywords: string[];
  linkedInSnippet: string;
};

type ChatMsg = {
  id: string;
  role: 'agent' | 'user';
  timestamp: string;
  text: string;
  sources?: string[];
  showSteps?: boolean;
  stepLines?: string[];
  /** Cold-start hero greeting: plain copy only (no feedback chrome). */
  hideFeedback?: boolean;
};

interface CjrState {
  scenario: ScenarioId;
  currentStep: StepId;
  positionId: string;
  positionTitle: string;
  orgName: string;
  incumbent: string;
  workerType: string;
  overlapEnabled: boolean;
  overlapReason: string;
  targetHireDate: string;
  targetRecruitingDate: string;
  payrollSafeRecommendation: string;
  locationFrom: string;
  locationTo: string;
  jdSummary: string;
  compensationBand: string;
  baseSalary: string;
  bonusPct: string;
  compPackagePills: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  topPerformerSkills: string[];
  skillsRecommendedBanner: string;
  jdTone: string;
  jdEditSummary: string;
  templateName: string;
  templateRationale: string;
  customFields: ReqCustomField[];
  screeningQuestions: ScreeningQuestion[];
  interviewQuestions: InterviewQuestion[];
  scorecardRubrics: string[];
  postingPack: PostingPack;
  payGradeUpgradeNote: string;
  benefitsResetSummary: string;
  transferWorkers: TransferWorker[];
  selectedWorkerId: string | null;
  transactionId: string | null;
}

const now = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

let idCounter = 0;
const nextId = () => `cjr-${++idCounter}`;

const COLD_START_SUGGESTIONS: string[][] = [
  [
    'Open a backfill requisition with overlap for Alex Chen in Portland.',
    'Transfer Maria Hernandez from Guadalajara to Mexico City.',
    'Summarise our leave policy for new starters in the UK.',
  ],
  [
    'Create a Senior Analyst job requisition with incumbent overlap enabled.',
    'Start a transfer position workflow for a worker changing location.',
    'What integrations are available for background checks?',
  ],
];

const IN_TASK_SUGGESTIONS: string[][] = [
  [
    'Turn off overlap — incumbent exits before we post.',
    'Set target hire date to 16 June 2026.',
    'Make the job description more inclusive.',
  ],
  [
    'Show the screening questions for this requisition.',
    'Generate the interview kit and scorecard.',
    'Preview the LinkedIn-ready posting pack.',
  ],
];

const overlapStepOrder: OverlapStepId[] = ['position-confirmation', 'details', 'approve-open', 'opened'];
const transferStepOrder: TransferStepId[] = ['select-worker', 'effective-date', 'details', 'review', 'submitted'];

const overlapStepLabel: Record<OverlapStepId, string> = {
  'position-confirmation': 'Position Confirmation',
  details: 'Details',
  'approve-open': 'Approve & Open Req',
  opened: 'Opened',
};

const transferStepLabel: Record<TransferStepId, string> = {
  'select-worker': 'Select Worker',
  'effective-date': 'Effective Date',
  details: 'Details',
  review: 'Review & Submit',
  submitted: 'Transaction Submitted',
};

const OVERLAP_JD_BASELINE = [
  'The Senior Analyst will lead data governance and reporting initiatives across enterprise IT systems. This role is responsible for designing and maintaining Tableau dashboards that track KPIs for 12 cross-functional teams, writing complex SQL queries for ad-hoc analysis, and ensuring all data handling processes comply with Oregon state privacy regulations and internal data privacy policies.',
  'Key responsibilities include managing the quarterly data audit cycle, partnering with Legal and Compliance on CCPA and state-level privacy requirements, coordinating with the PMO on cross-departmental project timelines, and mentoring two junior analysts.',
  'Requirements: 4+ years of experience in data analytics or business intelligence; advanced proficiency in Tableau and SQL; demonstrated knowledge of data privacy frameworks (GDPR, CCPA, or equivalent); PMP or equivalent project management certification preferred.',
].join('\n\n');

/** Post–"more interesting / professional" refinement — tone aligned to `ov-7200.png`. */
const OVERLAP_JD_REFINED = [
  "The Senior Analyst role is your opportunity to own how enterprise IT turns raw data into trusted insight. You'll lead data governance and reporting initiatives across our systems — designing and maintaining Tableau dashboards that track KPIs for 12 cross-functional teams, writing complex SQL for high-stakes ad-hoc analysis, and partnering across the org so every byte of data is handled with integrity and every insight lands with impact.",
  "As a mentor to two junior analysts, you'll shape the next generation of data talent while you run the quarterly data audit cycle, partner with Legal and Compliance on CCPA and Oregon privacy requirements, coordinate with the PMO on cross-departmental timelines, and keep executive stakeholders aligned on KPI definitions and delivery.",
  "What we're looking for: 4+ years in data analytics or business intelligence; advanced Tableau and SQL; hands-on knowledge of privacy frameworks (GDPR, CCPA, or equivalent); PMP or equivalent certification is a plus. If you thrive where analytics, policy, and clear storytelling meet, we'd like to talk.",
].join('\n\n');

const OVERLAP_JD_INCLUSIVE = [
  "Join Enterprise IT as a Senior Analyst and help teams turn complex data into clear, trusted decisions. In this role, you'll build Tableau dashboards, write SQL for high-impact analysis, and partner with Legal, Compliance, and PMO teams so data governance is practical, inclusive, and easy for stakeholders to use.",
  'You will lead quarterly data audits, mentor two junior analysts, and help 12 cross-functional teams align on KPI definitions, reporting quality, and privacy-safe practices.',
  'We encourage candidates with adjacent experience to apply. Useful experience includes business intelligence, data analytics, privacy or compliance operations, project coordination, and clear stakeholder communication. Tableau and SQL experience are important; privacy framework experience and PMP certification are helpful but not required on day one.',
].join('\n\n');

const OVERLAP_JD_CONCISE = [
  'The Senior Analyst leads enterprise IT data governance and reporting for 12 cross-functional teams. The role owns Tableau dashboards, SQL analysis, quarterly data audits, and privacy-safe reporting practices in partnership with Legal, Compliance, and the PMO.',
  'Required experience: 4+ years in data analytics or business intelligence, advanced Tableau and SQL, and strong stakeholder communication. Privacy framework knowledge and PMP certification are preferred.',
].join('\n\n');

const OVERLAP_SEED: CjrState = {
  scenario: 'overlap-backfill',
  currentStep: 'position-confirmation',
  positionId: 'ID-9921',
  positionTitle: 'Senior Analyst',
  orgName: '61100 IT Services',
  incumbent: 'Alex Chen',
  workerType: 'Employee',
  overlapEnabled: true,
  overlapReason: 'Incumbent remains in-seat through 30 Jun 2026. Overlap allows immediate posting.',
  targetHireDate: '2026-06-01',
  targetRecruitingDate: '2026-05-18',
  payrollSafeRecommendation: 'Recommended payroll-safe date: 1 June 2026.',
  locationFrom: 'Portland',
  locationTo: 'Portland',
  jdSummary: OVERLAP_JD_BASELINE,
  compensationBand: 'P4 · Technology',
  baseSalary: 'USD 118,000',
  bonusPct: '12%',
  compPackagePills: ['Annual bonus eligible', 'Restricted stock', 'Flexible allowance'],
  requiredSkills: [
    'Data Privacy Compliance',
    'Tableau',
    'SQL',
    'Business Intelligence Reporting',
  ],
  preferredSkills: ['Project Management', 'Stakeholder Communication', 'Advanced Excel'],
  topPerformerSkills: ['Process Improvement'],
  skillsRecommendedBanner: '10 skills are recommended for optimal candidate matching.',
  jdTone: 'Professional',
  jdEditSummary: 'Admin template applied; AI has not changed the generated description yet.',
  templateName: 'Backfill · Professional Individual Contributor',
  templateRationale:
    'Selected because the position is an employee backfill with incumbent overlap, P4 compensation, and technology job family defaults.',
  customFields: [
    {
      id: 'cf-business-justification',
      label: 'Business justification',
      value: 'Backfill for in-seat incumbent Alex Chen; overlap requested to preserve reporting continuity.',
      required: true,
      source: 'Position catalogue',
    },
    {
      id: 'cf-data-access',
      label: 'Data access profile',
      value: 'Enterprise IT reporting datasets · privacy-reviewed dashboards',
      required: true,
      source: 'Security template',
    },
    {
      id: 'cf-posting-owner',
      label: 'Posting owner',
      value: 'Hiring Manager · Priya Shah',
      required: false,
      source: 'Supervisory org',
    },
  ],
  screeningQuestions: [
    {
      id: 'sq-tableau',
      text: 'Describe a Tableau dashboard you built for senior stakeholders and how you measured adoption.',
      recommended: true,
      included: true,
      reason: 'Maps to required Tableau and stakeholder communication skills.',
    },
    {
      id: 'sq-privacy',
      text: 'Which privacy or data governance frameworks have you used in analytics work?',
      recommended: true,
      included: true,
      reason: 'Required because the role handles regulated reporting data.',
    },
    {
      id: 'sq-pmo',
      text: 'Are you comfortable coordinating quarterly reporting timelines across multiple teams?',
      recommended: false,
      included: true,
      reason: 'Useful signal for project management readiness.',
    },
  ],
  interviewQuestions: [
    {
      id: 'iq-governance',
      prompt: 'Tell us about a time you improved data quality without slowing teams down.',
      skill: 'Data Privacy Compliance',
    },
    {
      id: 'iq-tableau',
      prompt: 'Walk through how you would redesign an executive Tableau dashboard with conflicting stakeholder needs.',
      skill: 'Tableau',
    },
    {
      id: 'iq-mentoring',
      prompt: 'How have you coached a junior analyst through a complex SQL or reporting issue?',
      skill: 'Stakeholder Communication',
    },
  ],
  scorecardRubrics: [
    'Data governance judgment',
    'Dashboard storytelling',
    'SQL problem solving',
    'Cross-functional influence',
  ],
  postingPack: {
    publicTitle: 'Senior Analyst, Enterprise IT Data Governance',
    locations: ['Portland, OR', 'Hybrid'],
    payTransparency: 'USD 112,000-128,000 base plus 12% target bonus; confirm tenant posting policy before publishing.',
    seoKeywords: ['Tableau', 'SQL', 'Data Governance', 'Business Intelligence', 'Privacy Compliance'],
    linkedInSnippet:
      'Req pending · Senior Analyst role for Enterprise IT data governance in Portland. Hybrid role focused on Tableau, SQL, privacy-safe reporting, and cross-functional KPI alignment.',
  },
  payGradeUpgradeNote: 'Pay grade may increase one band on transfer to Mexico City. Payroll will confirm after submission.',
  benefitsResetSummary:
    'Benefits reset: enrolment windows restart for Mexico medical and savings plans. Worker receives a handover checklist.',
  transferWorkers: [],
  selectedWorkerId: null,
  transactionId: null,
};

const TRANSFER_SEED: CjrState = {
  ...OVERLAP_SEED,
  scenario: 'transfer-position',
  currentStep: 'select-worker',
  positionId: 'ID-5441',
  positionTitle: 'Operations Manager',
  orgName: 'Global Operations',
  incumbent: 'Maria Hernandez',
  workerType: 'Employee',
  overlapEnabled: false,
  overlapReason: 'Not applicable for transfer flow.',
  targetHireDate: '2026-06-16',
  targetRecruitingDate: '2026-05-30',
  payrollSafeRecommendation: 'Auto-corrected to payroll-safe date: 16 June 2026.',
  locationFrom: 'Guadalajara',
  locationTo: 'Mexico City',
  jdSummary: [
    'Lead end-to-end operations for the Mexico City regional hub: workforce planning, service-level agreements with outsourced vendors, and quarterly compliance attestations for SOX-relevant processes.',
    'Partner with Finance and HR on headcount, overtime, and local labour law changes; run the site operations rhythm (stand-ups, incident reviews, capacity planning) and escalate systemic risks to the VP of Global Operations.',
    'Drive continuous improvement on cost-to-serve and employee experience metrics; standardise playbooks from Guadalajara for the Mexico City launch while respecting collective agreement and statutory differences.',
    'Requirements: 8+ years in operations or supply-chain-adjacent roles with people management experience; fluent Spanish and professional English; proven vendor governance; experience with multi-site payroll and benefits transitions preferred.',
  ].join('\n\n'),
  compensationBand: 'M3 · Operations',
  baseSalary: 'MXN 1,850,000',
  bonusPct: '15%',
  compPackagePills: ['Relocation allowance', 'Local bonus plan', 'Executive medical'],
  requiredSkills: ['Operations management', 'Vendor governance'],
  preferredSkills: ['Spanish · professional', 'Workforce analytics'],
  topPerformerSkills: ['Cross-border payroll'],
  skillsRecommendedBanner: 'Skills aligned to destination organisation standards.',
  payGradeUpgradeNote: 'Upgrade to M3-Band applied for Mexico City location. Compensation team notified.',
  benefitsResetSummary:
    'Benefits reset applies: new medical plan year, retirement match rules, and dependent enrolment deadlines.',
  transferWorkers: [
    { id: 'w-mh', name: 'Maria Hernandez', subtitle: 'Operations Manager · Guadalajara' },
    { id: 'w-mg', name: 'Maria Garcia', subtitle: 'Operations Lead · Monterrey' },
  ],
  selectedWorkerId: null,
  transactionId: null,
};

function parseIntent(input: string): { startScenario?: ScenarioId; outOfScope?: boolean } {
  const text = input.toLowerCase();
  if (
    text.includes('backfill') ||
    text.includes('overlap') ||
    text.includes('open a requisition') ||
    text.includes('open a req') ||
    text.includes('job requisition') ||
    (text.includes('alex') && text.includes('portland'))
  ) {
    return { startScenario: 'overlap-backfill' };
  }
  if (
    text.includes('move maria') ||
    text.includes('location move') ||
    text.includes('transfer position') ||
    text.includes('transfer maria') ||
    (text.includes('guadalajara') && text.includes('mexico city')) ||
    (text.includes('transfer') && text.includes('worker'))
  ) {
    return { startScenario: 'transfer-position' };
  }
  return { outOfScope: true };
}

function HeaderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid ${colors.soap300}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Heading size="small" style={{ margin: 0 }}>
        {title}
      </Heading>
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
        {subtitle}
      </BodyText>
    </Box>
  );
}

function StepChipsOverlap({
  current,
  completed,
  onSelect,
}: {
  current: OverlapStepId;
  completed: Set<string>;
  onSelect: (step: OverlapStepId) => void;
}) {
  return (
    <Flex as="nav" aria-label="Create requisition steps" gap="xs" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
      {overlapStepOrder.map((id) => {
        const active = current === id;
        const done = completed.has(id) || id === 'opened';
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '6px 12px',
              backgroundColor: active ? '#0C1024' : done ? '#E8F8EE' : '#EDF7EF',
              color: active ? '#FFFFFF' : '#0E4230',
              fontWeight: active ? 700 : 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {overlapStepLabel[id]}
          </button>
        );
      })}
    </Flex>
  );
}

function StepChipsTransfer({
  current,
  completed,
  onSelect,
}: {
  current: TransferStepId;
  completed: Set<string>;
  onSelect: (step: TransferStepId) => void;
}) {
  return (
    <Flex as="nav" aria-label="Transfer position steps" gap="xs" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
      {transferStepOrder.map((id) => {
        const active = current === id;
        const done = completed.has(id) || id === 'submitted';
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '6px 12px',
              backgroundColor: active ? '#0C1024' : done ? '#E8F8EE' : '#EEF3FB',
              color: active ? '#FFFFFF' : '#0E4230',
              fontWeight: active ? 700 : 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {transferStepLabel[id]}
          </button>
        );
      })}
    </Flex>
  );
}

function SkillChipRow({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: 'required' | 'preferred' | 'top';
}) {
  const bg =
    variant === 'required' ? '#E8F4FC' : variant === 'preferred' ? '#F3F6FB' : '#F5F0FA';
  const border = variant === 'required' ? '#7EB8E0' : variant === 'preferred' ? colors.soap400 : '#C4B5E0';
  return (
    <Box style={{ marginTop: 10 }}>
      <BodyText size="small" style={{ fontWeight: 700, marginBottom: 6 }}>
        {label}
      </BodyText>
      <Flex gap="xs" style={{ flexWrap: 'wrap' }}>
        {items.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: '#0C1024',
            }}
          >
            {s}
          </span>
        ))}
      </Flex>
    </Box>
  );
}

function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'purple';
}) {
  const palette = {
    neutral: { bg: '#F3F6FB', border: colors.soap300, fg: '#0C1024' },
    blue: { bg: '#E8F4FC', border: '#7EB8E0', fg: colors.blueberry500 },
    green: { bg: '#E8F8EE', border: colors.greenApple400, fg: '#0E4230' },
    amber: { bg: '#FFF4D6', border: '#E6B94F', fg: '#5C3D00' },
    purple: { bg: '#F5F0FA', border: '#C4B5E0', fg: '#4B2E73' },
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
      }}
    >
      {children}
    </span>
  );
}

function AgenticCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14, backgroundColor: '#FFFFFF' }}>
      {eyebrow && (
        <BodyText
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{ marginBottom: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {eyebrow}
        </BodyText>
      )}
      <Heading size="small" style={{ margin: 0 }}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

function ImpactSummary({ state }: { state: CjrState }) {
  const impacts = [
    { label: 'Compensation', value: `${state.compensationBand} · ${state.baseSalary} · ${state.bonusPct}` },
    { label: 'Payroll-safe timing', value: state.payrollSafeRecommendation },
    { label: 'Overlap', value: state.overlapEnabled ? state.overlapReason : 'Overlap disabled by user.' },
    { label: 'Benefits / side effects', value: state.benefitsResetSummary },
  ];
  return (
    <AgenticCard title="Impact before commit" eyebrow="AI trust check">
      <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 8 }}>
        I checked compensation, timing, overlap, and downstream side effects before opening the req.
      </BodyText>
      <Box style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {impacts.map((impact) => (
          <Box key={impact.label} style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10 }}>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11 }}>
              {impact.label}
            </BodyText>
            <BodyText size="small" style={{ marginTop: 3, fontWeight: 600 }}>
              {impact.value}
            </BodyText>
          </Box>
        ))}
      </Box>
    </AgenticCard>
  );
}

function EnableOverlapCard({
  state,
  onToggle,
}: {
  state: CjrState;
  onToggle: (next: boolean) => void;
}) {
  return (
    <Box
      style={{
        backgroundColor: '#E8F4FC',
        border: `1px solid ${colors.soap300}`,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" gap="m">
        <Box style={{ flex: 1 }}>
          <Heading size="small" style={{ margin: 0 }}>
            Enable Overlap
          </Heading>
          <BodyText size="small" style={{ marginTop: 8 }}>
            {state.overlapEnabled
              ? `${state.overlapReason}`
              : 'Overlap is off. Turn on if the incumbent remains in-seat through transition.'}
          </BodyText>
        </Box>
        <Switch
          id="overlap-switch"
          checked={state.overlapEnabled}
          onChange={(e) => onToggle((e.target as HTMLInputElement).checked)}
        />
      </Flex>
    </Box>
  );
}

function SuccessPaneOverlap({ state }: { state: CjrState }) {
  return (
    <Box
      style={{
        backgroundColor: '#F9FAFB',
        border: `1px solid ${colors.soap300}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <Flex flexDirection="column" alignItems="center" gap="s">
        <SystemIcon icon={checkCircleIcon} size={48} color={colors.greenApple600} />
        <Heading size="medium" style={{ margin: 0, textAlign: 'center' }}>
          Requisition opened
        </Heading>
        <BodyText size="small" style={{ textAlign: 'center' }}>
          Posted requisition <strong>{state.transactionId ?? 'WD-REQ-XXXXXX'}</strong> for{' '}
          <strong>{state.positionTitle}</strong>.
        </BodyText>
        <BodyText size="small" style={{ textAlign: 'center' }}>
          Overlap <strong>{state.overlapEnabled ? 'enabled' : 'disabled'}</strong> · Target hire{' '}
          <strong>{new Date(state.targetHireDate).toLocaleDateString('en-GB')}</strong>
        </BodyText>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ textAlign: 'center' }}>
          Continue in chat to schedule screening or adjust the posting.
        </BodyText>
        <Box style={{ width: '100%', marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14 }}>
          <BodyText size="small" style={{ fontWeight: 700 }}>
            Posting pack ready
          </BodyText>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
            {state.postingPack.publicTitle} · {state.postingPack.locations.join(' · ')}
          </BodyText>
          <BodyText size="small" style={{ marginTop: 8 }}>
            {state.postingPack.linkedInSnippet.replace('Req pending', state.transactionId ?? 'Req posted')}
          </BodyText>
        </Box>
      </Flex>
    </Box>
  );
}

function TransferSubmittedPane({ state }: { state: CjrState }) {
  const txn = state.transactionId ?? 'CJ-PENDING';
  return (
    <Box
      style={{
        backgroundColor: '#F9FAFB',
        border: `1px solid ${colors.soap300}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <Flex flexDirection="column" alignItems="center" gap="s">
        <SystemIcon icon={checkCircleIcon} size={48} color={colors.greenApple600} />
        <Heading size="medium" style={{ margin: 0, textAlign: 'center' }}>
          Transaction submitted
        </Heading>
        <BodyText size="small" style={{ textAlign: 'center' }}>
          Transfer reference <strong>{txn}</strong> for <strong>{state.incumbent}</strong>.
        </BodyText>
        <AlertBanner type="warning" message={`Benefits reset: ${state.benefitsResetSummary}`} />
      </Flex>
    </Box>
  );
}

const coldStartGreetingText = [
  "Hi, I'm Self-Service Agent!",
  'I can help answer general policy questions and help get things done.',
  'Explore suggestions below or ask me anything.',
].join('\n');

export default function CreateJrSsaV01() {
  const [mode, setMode] = useState<Mode>('cold-start');
  const [state, setState] = useState<CjrState>(OVERLAP_SEED);
  const [composer, setComposer] = useState('');
  const [suggestionSet, setSuggestionSet] = useState(0);
  const [taskSuggestionSet, setTaskSuggestionSet] = useState(0);
  const [detailsPanel, setDetailsPanel] = useState<'overview' | 'template' | 'skills' | 'interview'>('overview');
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const threadRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: nextId(),
      role: 'agent',
      timestamp: now(),
      text: coldStartGreetingText,
      hideFeedback: true,
    },
  ]);

  const scrollThread = () => {
    setTimeout(() => {
      threadRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const pushAgent = (partial: Omit<ChatMsg, 'id' | 'role' | 'timestamp'> & { role?: never }) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'agent', timestamp: now(), ...partial },
    ]);
    scrollThread();
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', timestamp: now(), text }]);
    scrollThread();
  };

  const pushPair = (
    userText: string,
    agent: Omit<ChatMsg, 'id' | 'role' | 'timestamp'>,
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', timestamp: now(), text: userText },
      { id: nextId(), role: 'agent', timestamp: now(), ...agent },
    ]);
    scrollThread();
  };

  const enterScenario = (scenario: ScenarioId, userText: string) => {
    const next = scenario === 'overlap-backfill' ? OVERLAP_SEED : TRANSFER_SEED;
    setState(next);
    setMode('in-task');
    setCompleted(new Set());
    setTaskSuggestionSet(0);
    setDetailsPanel('overview');
    if (scenario === 'overlap-backfill') {
      pushPair(userText, {
        text: [
          `Sure — I'll help you open a backfill requisition for ${next.incumbent}.`,
          `I've pre-filled position, organisation, compensation, and overlap defaults because the incumbent is still in-seat.`,
          `Review Position Confirmation on the right, then continue to Details and Approve & Open Req.`,
        ].join('\n'),
        sources: ['Position catalogue', 'Incumbent record', 'Comp benchmark'],
      });
    } else {
      pushPair(userText, {
        text: [
          `Sure — I'll start the transfer position workflow for ${next.incumbent} (${next.locationFrom} → ${next.locationTo}).`,
          `Select the correct worker if multiple names match, confirm a payroll-safe effective date, then review impacts.`,
        ].join('\n'),
        sources: ['Worker directory', 'Payroll calendar', 'Location policy'],
      });
    }
  };

  const applyJdRewrite = (tone: 'Executive' | 'Inclusive' | 'Concise') => {
    const nextDraft =
      tone === 'Executive' ? OVERLAP_JD_REFINED : tone === 'Inclusive' ? OVERLAP_JD_INCLUSIVE : OVERLAP_JD_CONCISE;
    const summary =
      tone === 'Executive'
        ? 'Proposed stronger opening, more active language, and clearer role impact.'
        : tone === 'Inclusive'
          ? 'Proposed more inclusive requirements, adjacent-experience language, and less credential-heavy copy.'
          : 'Proposed a shorter version for external postings while preserving must-have skills.';

    setState((prev) => ({
      ...prev,
      jdSummary: nextDraft,
      jdTone: tone,
      jdEditSummary: summary,
    }));
    pushAgent({
      text: [
        `I updated the job description in a ${tone.toLowerCase()} tone.`,
        'The Details panel now shows the exact edit summary and remains editable before approval.',
      ].join('\n'),
      showSteps: true,
      stepLines: [summary, 'Kept required skills and compliance-sensitive requirements visible.', 'No posting or approval was submitted.'],
      sources: ['Job profile template', 'Inclusive language guidance'],
    });
  };

  const toggleScreeningQuestion = (questionId: string) => {
    setState((prev) => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.map((q) =>
        q.id === questionId ? { ...q, included: !q.included } : q,
      ),
    }));
  };

  const refreshInterviewKit = () => {
    setState((prev) => ({
      ...prev,
      interviewQuestions: [
        {
          id: 'iq-privacy-scenario',
          prompt: 'A dashboard owner asks you to expose candidate-adjacent worker data. How do you assess privacy risk?',
          skill: 'Data Privacy Compliance',
        },
        {
          id: 'iq-sql-quality',
          prompt: 'How would you validate a SQL metric that Legal and Finance interpret differently?',
          skill: 'SQL',
        },
        {
          id: 'iq-influence',
          prompt: 'Tell us about a time you got cross-functional partners to adopt a new reporting standard.',
          skill: 'Stakeholder Communication',
        },
      ],
      scorecardRubrics: [
        'Privacy-safe judgment',
        'Analytical rigor',
        'Executive communication',
        'Change adoption',
      ],
    }));
    pushAgent({
      text: 'I refreshed the interview kit from the current JD and selected skills. Review the new questions in Details before saving them to the req.',
      sources: ['Current JD', 'Required skills', 'Top performer skills'],
    });
  };

  const previewPostingPack = () => {
    setState((prev) => ({ ...prev, currentStep: 'approve-open' }));
    pushAgent({
      text: 'I prepared a LinkedIn-ready posting pack with req context, public title, pay-transparency note, and SEO keywords. It is preview-only until you approve and open the req.',
      sources: ['Posting template', 'Location policy', 'SEO assistant'],
    });
  };

  const submit = (raw: string) => {
    const userText = raw.trim();
    if (!userText || sending) return;

    if (mode === 'cold-start') {
      const intent = parseIntent(userText);
      if (intent.startScenario) {
        enterScenario(intent.startScenario, userText);
      } else {
        pushPair(userText, {
          text: [
            'This prototype is scoped to Create Job Req (overlap backfill) and Transfer Position.',
            'Try “Open a backfill requisition with overlap for Alex Chen in Portland.” or a transfer prompt to open the task canvas.',
          ].join('\n'),
        });
      }
      setComposer('');
      return;
    }

    pushUser(userText);
    const text = userText.toLowerCase();

    if (state.scenario === 'transfer-position') {
      if (
        text.includes('first maria') ||
        text.includes('hernandez') ||
        text.includes('operations manager') ||
        text.includes('guadalajara')
      ) {
        setState((prev) => ({ ...prev, selectedWorkerId: 'w-mh', incumbent: 'Maria Hernandez' }));
        pushAgent({
          text: 'Selected Maria Hernandez (Operations Manager · Guadalajara). Continue to Effective Date on the right.',
          sources: ['Worker match'],
        });
      } else if (text.includes('second maria') || text.includes('garcia') || text.includes('monterrey')) {
        setState((prev) => ({ ...prev, selectedWorkerId: 'w-mg', incumbent: 'Maria Garcia' }));
        pushAgent({
          text: 'Selected Maria Garcia (Operations Lead · Monterrey). Continue to Effective Date on the right.',
          sources: ['Worker match'],
        });
      } else if (text.includes('june 16') || text.includes('16 june')) {
        setState((prev) => ({
          ...prev,
          targetHireDate: '2026-06-16',
          targetRecruitingDate: '2026-06-02',
          payrollSafeRecommendation: 'Auto-corrected to payroll-safe date: 16 June 2026.',
        }));
        pushAgent({
          text: 'Updated effective hire context to 16 June 2026 with payroll-safe recruiting dates. The canvas reflects the amber auto-correct banner.',
          sources: ['Payroll calendar'],
        });
      } else if (text.includes('benefits')) {
        pushAgent({
          text: `Noted. Benefits reset stays in scope: ${state.benefitsResetSummary}`,
          sources: ['Benefits policy'],
        });
      } else {
        pushAgent({
          text: 'I can help disambiguate workers, adjust the June effective date, or explain benefits reset in this transfer flow.',
        });
      }
      setComposer('');
      return;
    }

    if (text.includes('june 16') || text.includes('16 june')) {
      setState((prev) => ({
        ...prev,
        targetHireDate: '2026-06-16',
        targetRecruitingDate: '2026-06-02',
        payrollSafeRecommendation: 'Payroll-safe dates aligned to 16 June 2026 hire and 2 June 2026 recruiting start.',
      }));
      pushAgent({
        text: 'Done. Target hire date is 16 June 2026 and recruiting date 2 June 2026. Detail cards on the right are updated.',
        sources: ['Payroll calendar'],
      });
    } else if (text.includes('turn off overlap')) {
      setState((prev) => ({ ...prev, overlapEnabled: false }));
      pushAgent({
        text: 'Overlap is now off. Posting may be delayed until the incumbent exits. The Enable Overlap switch reflects the change.',
      });
    } else if (text.includes('turn on overlap')) {
      setState((prev) => ({ ...prev, overlapEnabled: true }));
      pushAgent({
        text: 'Overlap is on again. Rationale remains visible on the canvas for audit traceability.',
      });
    } else if (text.includes('inclusive')) {
      applyJdRewrite('Inclusive');
    } else if (text.includes('concise') || text.includes('shorter')) {
      applyJdRewrite('Concise');
    } else if (text.includes('interesting') || text.includes('executive') || text.includes('professional')) {
      applyJdRewrite('Executive');
    } else if (text.includes('screening') || text.includes('questionnaire') || text.includes('template')) {
      setState((prev) => ({ ...prev, currentStep: 'details' }));
      pushAgent({
        text: 'I opened Template & screening in Details. I selected the backfill template, prefilled required custom fields, and proposed per-req screening questions you can include or remove.',
        sources: ['Req template', 'Job profile', 'Screening policy'],
      });
    } else if (text.includes('interview') || text.includes('scorecard')) {
      refreshInterviewKit();
    } else if (text.includes('linkedin') || text.includes('posting pack') || text.includes('seo')) {
      previewPostingPack();
    } else if (text.includes('impact') || text.includes('compensation') || text.includes('approval')) {
      setState((prev) => ({ ...prev, currentStep: 'approve-open' }));
      pushAgent({
        text: 'I moved to the approval preview. The canvas now shows compensation, payroll-safe timing, overlap, benefits side effects, and the posting pack before the irreversible open action.',
        sources: ['Comp benchmark', 'Payroll calendar', 'Benefits policy'],
      });
    } else {
      pushAgent({
        text: 'I can adjust overlap, payroll-safe dates, job description tone, screening questions, interview kits, or the LinkedIn-ready posting pack — changes write through to the canvas on the right.',
      });
    }
    setComposer('');
  };

  const advanceOverlap = () => {
    const idx = overlapStepOrder.indexOf(state.currentStep as OverlapStepId);
    if (idx === -1 || idx >= overlapStepOrder.length - 1) return;
    setCompleted((prev) => new Set(prev).add(state.currentStep));
    setState((prev) => ({ ...prev, currentStep: overlapStepOrder[idx + 1] }));
  };

  const advanceTransfer = () => {
    const step = state.currentStep as TransferStepId;
    if (step === 'select-worker' && !state.selectedWorkerId) return;
    const idx = transferStepOrder.indexOf(step);
    if (idx === -1 || idx >= transferStepOrder.length - 1) return;
    setCompleted((prev) => new Set(prev).add(state.currentStep));
    setState((prev) => ({ ...prev, currentStep: transferStepOrder[idx + 1] }));
  };

  const advance = () => {
    if (state.scenario === 'overlap-backfill') advanceOverlap();
    else advanceTransfer();
  };

  const goBackOverlap = () => {
    const idx = overlapStepOrder.indexOf(state.currentStep as OverlapStepId);
    if (idx <= 0) return;
    setState((prev) => ({ ...prev, currentStep: overlapStepOrder[idx - 1] }));
  };

  const goBackTransfer = () => {
    const idx = transferStepOrder.indexOf(state.currentStep as TransferStepId);
    if (idx <= 0) return;
    setState((prev) => ({ ...prev, currentStep: transferStepOrder[idx - 1] }));
  };

  const goBack = () => {
    if (state.scenario === 'overlap-backfill') goBackOverlap();
    else goBackTransfer();
  };

  const openReq = () => {
    setSending(true);
    setTimeout(() => {
      const transactionId = `WD-REQ-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setState((prev) => ({
        ...prev,
        currentStep: 'opened',
        transactionId,
      }));
      setCompleted(new Set(overlapStepOrder));
      pushAgent({
        text: [
          `Requisition approved and opened. Posted ID ${transactionId}.`,
          `Overlap is ${state.overlapEnabled ? 'active' : 'inactive'}; target hire remains ${new Date(state.targetHireDate).toLocaleDateString('en-GB')}.`,
          `Use chat to line up screening or tweak the posting copy.`,
        ].join('\n'),
        sources: ['Requisition service'],
      });
      setSending(false);
    }, 800);
  };

  const submitTransfer = () => {
    setSending(true);
    setTimeout(() => {
      const transactionId = `CJ-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      setState((prev) => ({
        ...prev,
        currentStep: 'submitted',
        transactionId,
      }));
      setCompleted(new Set(transferStepOrder));
      pushAgent({
        text: [
          `Transfer submitted. Transaction ${transactionId} is in progress for ${state.incumbent}.`,
          `Benefits reset: ${state.benefitsResetSummary}`,
        ].join('\n'),
        sources: ['Core HR', 'Payroll'],
      });
      setSending(false);
    }, 800);
  };

  const reset = () => {
    setMode('cold-start');
    setState(OVERLAP_SEED);
    setCompleted(new Set());
    setComposer('');
    setSuggestionSet(0);
    setTaskSuggestionSet(0);
    setDetailsPanel('overview');
    setMessages([
      {
        id: nextId(),
        role: 'agent',
        timestamp: now(),
        text: coldStartGreetingText,
        hideFeedback: true,
      },
    ]);
  };

  const transferStep = state.currentStep as TransferStepId;
  const overlapStep = state.currentStep as OverlapStepId;

  const coldStart = (
    <>
      <Box ref={threadRef} style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {messages.map((m, idx) => (
          <React.Fragment key={m.id}>
            {idx === 0 ? (
              <Box>
                <Flex alignItems="center" gap="xs" marginBottom="xs">
                  <SparkleMark size={20} />
                </Flex>
                {m.role === 'agent' && (
                  <SsaAgentTurn
                    text={m.text}
                    sources={m.sources}
                    showSteps={m.showSteps}
                    stepLines={m.stepLines}
                    hideFeedback={m.hideFeedback}
                  />
                )}
                {messages.length === 1 && (
                  <SsaStarterSuggestions
                    setIndex={suggestionSet}
                    suggestionSets={COLD_START_SUGGESTIONS}
                    onPick={(txt) => submit(txt)}
                    onRotate={() => setSuggestionSet((n) => n + 1)}
                    variant="cold-start"
                  />
                )}
              </Box>
            ) : m.role === 'agent' ? (
              <SsaAgentTurn
                text={m.text}
                sources={m.sources}
                showSteps={m.showSteps}
                stepLines={m.stepLines}
                hideFeedback={m.hideFeedback}
              />
            ) : (
              <SsaUserPromptPill text={m.text} />
            )}
          </React.Fragment>
        ))}
      </Box>
      <Box style={{ padding: '16px 0 20px' }}>
        <SanaCommComposer
          value={composer}
          onChange={setComposer}
          onSend={() => submit(composer)}
          placeholder="Ask me anything."
          sendDisabled={!composer.trim() || sending}
        />
        <Flex justifyContent="center" marginTop="xs">
          <TertiaryButton size="small">+ Sources</TertiaryButton>
        </Flex>
        <BodyText
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{ marginTop: 10, fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>
    </>
  );

  const terminalOverlap = state.scenario === 'overlap-backfill' && state.currentStep === 'opened';
  const terminalTransfer = state.scenario === 'transfer-position' && state.currentStep === 'submitted';

  const chatPane = (
    <>
      <Box
        ref={threadRef}
        padding="m"
        style={{ flex: 1, overflowY: 'auto', backgroundColor: SANA_COMM_PANEL_SURFACE }}
      >
        {messages.map((m) =>
          m.role === 'agent' ? (
            <SsaAgentTurn
              key={m.id}
              text={m.text}
              sources={m.sources}
              showSteps={m.showSteps}
              stepLines={m.stepLines}
              hideFeedback={m.hideFeedback}
            />
          ) : (
            <SsaUserPromptPill key={m.id} text={m.text} />
          ),
        )}
        {mode === 'in-task' && !terminalOverlap && !terminalTransfer && (
          <Box marginTop="s" style={{ maxWidth: 400 }}>
            <SsaStarterSuggestions
              setIndex={taskSuggestionSet}
              suggestionSets={IN_TASK_SUGGESTIONS}
              onPick={(txt) => submit(txt)}
              onRotate={() => setTaskSuggestionSet((n) => n + 1)}
              variant="in-task"
            />
          </Box>
        )}
      </Box>
      <Box
        padding="m"
        style={{
          borderTop: `1px solid ${colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
      >
        <SanaCommComposer
          value={composer}
          onChange={setComposer}
          onSend={() => submit(composer)}
          placeholder="What would you like to do?"
          sendDisabled={!composer.trim() || sending || terminalOverlap || terminalTransfer}
        />
        <Flex justifyContent="center" marginTop="xs">
          <TertiaryButton size="small">+ Sources</TertiaryButton>
        </Flex>
        <BodyText
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{ marginTop: 10, fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>
    </>
  );

  const canvasOverlapPosition = (
    <Flex flexDirection="column" gap="s">
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14 }}>
        <Flex alignItems="center" gap="xs" marginBottom="xs">
          <SystemIcon icon={pinIcon} size={20} color={colors.blueberry400} aria-label="" />
          <Heading size="small" style={{ margin: 0 }}>
            Position Confirmation
          </Heading>
        </Flex>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          Position ID
        </BodyText>
        <BodyText size="small">
          {state.positionId} · {state.positionTitle}
        </BodyText>
        <BodyText size="small" style={{ marginTop: 10, fontWeight: 700 }}>
          Worker type
        </BodyText>
        <Flex gap="xs" marginTop="xxs" style={{ flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: '#0C1024',
              color: '#fff',
            }}
          >
            {state.workerType}
          </span>
          <span
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: '#F3F6FB',
              border: `1px solid ${colors.soap300}`,
            }}
          >
            Incumbent: {state.incumbent}
          </span>
        </Flex>
        <BodyText size="small" style={{ marginTop: 10, fontWeight: 700 }}>
          Organization
        </BodyText>
        <BodyText size="small">{state.orgName}</BodyText>
        <BodyText size="small" style={{ marginTop: 10, fontWeight: 700 }}>
          Compensation
        </BodyText>
        <Box
          style={{
            marginTop: 6,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          <Box style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10 }}>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>
              Band
            </BodyText>
            <BodyText size="small" style={{ fontWeight: 600 }}>
              {state.compensationBand}
            </BodyText>
          </Box>
          <Box style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10 }}>
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>
              Base / Bonus
            </BodyText>
            <BodyText size="small" style={{ fontWeight: 600 }}>
              {state.baseSalary} · {state.bonusPct}
            </BodyText>
          </Box>
        </Box>
        <Flex gap="xs" marginTop="xs" style={{ flexWrap: 'wrap' }}>
          {state.compPackagePills.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 6,
                backgroundColor: '#EEF3FB',
                border: `1px solid ${colors.soap300}`,
              }}
            >
              {p}
            </span>
          ))}
        </Flex>
      </Box>
      <EnableOverlapCard
        state={state}
        onToggle={(next) => setState((prev) => ({ ...prev, overlapEnabled: next }))}
      />
      <PrimaryButton onClick={advanceOverlap} style={{ width: '100%' }}>
        Confirm Position
      </PrimaryButton>
    </Flex>
  );

  const canvasOverlapDetails = (
    <Flex flexDirection="column" gap="s">
      <AgenticCard title="Job description" eyebrow="Generated from admin template">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap="xxs" style={{ flexWrap: 'wrap' }}>
            <StatusPill tone="blue">{state.jdTone}</StatusPill>
            <StatusPill tone="green">Human review required</StatusPill>
          </Flex>
          <TertiaryButton size="small" onClick={() => applyJdRewrite('Executive')}>
            Regenerate
          </TertiaryButton>
        </Flex>
        <AlertBanner type="warning" message={state.jdEditSummary} />
        <Flex gap="xs" marginTop="xs" style={{ flexWrap: 'wrap' }}>
          <SecondaryButton size="small" onClick={() => applyJdRewrite('Executive')}>
            Executive tone
          </SecondaryButton>
          <SecondaryButton size="small" onClick={() => applyJdRewrite('Inclusive')}>
            Inclusive language
          </SecondaryButton>
          <SecondaryButton size="small" onClick={() => applyJdRewrite('Concise')}>
            Shorter posting
          </SecondaryButton>
        </Flex>
        <BodyText size="small" style={{ marginTop: 10, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {state.jdSummary}
        </BodyText>
      </AgenticCard>
      <AgenticCard title="Template & screening" eyebrow="Req velocity">
        <BodyText size="small" style={{ marginTop: 8, fontWeight: 700 }}>
          {state.templateName}
        </BodyText>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
          {state.templateRationale}
        </BodyText>
        <Box style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {state.customFields.map((field) => (
            <Box key={field.id} style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10 }}>
              <Flex justifyContent="space-between" gap="s" alignItems="center" style={{ marginBottom: 6 }}>
                <BodyText size="small" style={{ fontWeight: 700 }}>
                  {field.label}
                </BodyText>
                <StatusPill tone={field.required ? 'amber' : 'neutral'}>{field.required ? 'Required' : 'Optional'}</StatusPill>
              </Flex>
              <FormTextInput
                id={field.id}
                label={`${field.label} value`}
                value={field.value}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    customFields: prev.customFields.map((f) => (f.id === field.id ? { ...f, value } : f)),
                  }))
                }
              />
              <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4, fontSize: 11 }}>
                Source: {field.source}
              </BodyText>
            </Box>
          ))}
        </Box>
        <Heading size="small" style={{ margin: '14px 0 0', fontSize: 14 }}>
          Application questions
        </Heading>
        <Box style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          {state.screeningQuestions.map((question) => (
            <Box key={question.id} style={{ border: `1px solid ${colors.soap300}`, borderRadius: 10, padding: 10 }}>
              <Flex justifyContent="space-between" gap="s" alignItems="flex-start">
                <Box>
                  <BodyText size="small" style={{ fontWeight: 700 }}>
                    {question.text}
                  </BodyText>
                  <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
                    {question.reason}
                  </BodyText>
                </Box>
                <TertiaryButton size="small" onClick={() => toggleScreeningQuestion(question.id)}>
                  {question.included ? 'Remove' : 'Include'}
                </TertiaryButton>
              </Flex>
              <Flex gap="xxs" marginTop="xs" style={{ flexWrap: 'wrap' }}>
                <StatusPill tone={question.recommended ? 'green' : 'neutral'}>
                  {question.recommended ? 'Recommended' : 'Optional'}
                </StatusPill>
                <StatusPill tone={question.included ? 'blue' : 'neutral'}>
                  {question.included ? 'Included' : 'Not included'}
                </StatusPill>
              </Flex>
            </Box>
          ))}
        </Box>
      </AgenticCard>
      <AlertBanner type="warning" message={state.skillsRecommendedBanner} />
      <SkillChipRow label="Required" items={state.requiredSkills} variant="required" />
      <SkillChipRow label="Preferred" items={state.preferredSkills} variant="preferred" />
      <SkillChipRow label="Suggested by top performers" items={state.topPerformerSkills} variant="top" />
      <AgenticCard title="Interview & scorecard kit" eyebrow="Downstream setup">
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 8 }}>
          Drafted from the current JD and skills so the req opens with a consistent evaluation plan.
        </BodyText>
        <Box style={{ marginTop: 10, display: 'grid', gap: 8 }}>
          {state.interviewQuestions.map((question) => (
            <Box key={question.id} style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10 }}>
              <StatusPill tone="purple">{question.skill}</StatusPill>
              <BodyText size="small" style={{ marginTop: 6 }}>
                {question.prompt}
              </BodyText>
            </Box>
          ))}
        </Box>
        <Flex gap="xs" marginTop="s" style={{ flexWrap: 'wrap' }}>
          {state.scorecardRubrics.map((rubric) => (
            <StatusPill key={rubric} tone="green">
              {rubric}
            </StatusPill>
          ))}
        </Flex>
        <SecondaryButton size="small" onClick={refreshInterviewKit} style={{ marginTop: 12 }}>
          Refresh kit from JD
        </SecondaryButton>
      </AgenticCard>
      <PrimaryButton onClick={advanceOverlap}>Confirm & Continue</PrimaryButton>
    </Flex>
  );

  const canvasOverlapApprove = (
    <Flex flexDirection="column" gap="s">
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14 }}>
        <Heading size="small" style={{ margin: 0 }}>
          Position details
        </Heading>
        <Box as="dl" style={{ margin: '12px 0 0', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 12px' }}>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} as="dt" style={{ margin: 0 }}>
            Title
          </BodyText>
          <BodyText size="small" as="dd" style={{ margin: 0 }}>
            {state.positionTitle}
          </BodyText>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} as="dt" style={{ margin: 0 }}>
            ID / Org
          </BodyText>
          <BodyText size="small" as="dd" style={{ margin: 0 }}>
            {state.positionId} · {state.orgName}
          </BodyText>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} as="dt" style={{ margin: 0 }}>
            Overlap
          </BodyText>
          <BodyText size="small" as="dd" style={{ margin: 0 }}>
            {state.overlapEnabled ? 'Enabled' : 'Disabled'}
          </BodyText>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} as="dt" style={{ margin: 0 }}>
            Hire / Recruit
          </BodyText>
          <BodyText size="small" as="dd" style={{ margin: 0 }}>
            {new Date(state.targetHireDate).toLocaleDateString('en-GB')} ·{' '}
            {new Date(state.targetRecruitingDate).toLocaleDateString('en-GB')}
          </BodyText>
        </Box>
      </Box>
      <ImpactSummary state={state} />
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14 }}>
        <Heading size="small" style={{ margin: 0 }}>
          Selected skills & screening
        </Heading>
        <Flex gap="xs" marginTop="s" style={{ flexWrap: 'wrap' }}>
          {[...state.requiredSkills, ...state.preferredSkills, ...state.topPerformerSkills].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                backgroundColor: '#E8F8EE',
                border: `1px solid ${colors.greenApple400}`,
              }}
            >
              {s}
            </span>
          ))}
        </Flex>
        <Box style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {state.screeningQuestions
            .filter((question) => question.included)
            .map((question) => (
              <Box key={question.id} style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10 }}>
                <BodyText size="small" style={{ fontWeight: 700 }}>
                  {question.text}
                </BodyText>
                <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
                  {question.reason}
                </BodyText>
              </Box>
            ))}
        </Box>
      </Box>
      <AgenticCard title="External posting pack" eyebrow="Preview only">
        <Flex gap="xxs" marginTop="xs" style={{ flexWrap: 'wrap' }}>
          <StatusPill tone="blue">LinkedIn-ready</StatusPill>
          <StatusPill tone="amber">Confirm policy before publish</StatusPill>
        </Flex>
        <BodyText size="small" style={{ marginTop: 10, fontWeight: 700 }}>
          {state.postingPack.publicTitle}
        </BodyText>
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 4 }}>
          {state.postingPack.locations.join(' · ')}
        </BodyText>
        <Box style={{ marginTop: 10, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10 }}>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ fontSize: 11 }}>
            Pay transparency note
          </BodyText>
          <BodyText size="small" style={{ marginTop: 4 }}>
            {state.postingPack.payTransparency}
          </BodyText>
        </Box>
        <BodyText size="small" style={{ marginTop: 10 }}>
          {state.transactionId ?? 'Req ID will populate after approval'} · {state.postingPack.linkedInSnippet}
        </BodyText>
        <Flex gap="xs" marginTop="s" style={{ flexWrap: 'wrap' }}>
          {state.postingPack.seoKeywords.map((keyword) => (
            <StatusPill key={keyword} tone="purple">
              {keyword}
            </StatusPill>
          ))}
        </Flex>
      </AgenticCard>
      <AgenticCard title="Interview kit to save with req" eyebrow="Evaluation consistency">
        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 8 }}>
          These draft questions and rubrics stay attached to the req after opening; interviewers can still edit them later.
        </BodyText>
        <Box style={{ marginTop: 10, display: 'grid', gap: 8 }}>
          {state.interviewQuestions.map((question) => (
            <BodyText key={question.id} size="small">
              <strong>{question.skill}:</strong> {question.prompt}
            </BodyText>
          ))}
        </Box>
      </AgenticCard>
      <Flex gap="s">
        <PrimaryButton onClick={openReq} disabled={sending}>
          {sending ? 'Opening…' : 'Approve & Open Req'}
        </PrimaryButton>
        <SecondaryButton onClick={goBack}>Cancel</SecondaryButton>
      </Flex>
    </Flex>
  );

  const canvasTransferWorker = (
    <Flex flexDirection="column" gap="s">
      <Flex alignItems="center" gap="s">
        <Avatar size={Avatar.Size.m} as="div" />
        <Box>
          <Heading size="small" style={{ margin: 0 }}>
            Select Worker
          </Heading>
          <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>
            Multiple matches for “Maria” — pick the correct record.
          </BodyText>
        </Box>
      </Flex>
      <FormRadioGroup
        id="transfer-worker"
        name="transferWorker"
        label="Worker"
        value={state.selectedWorkerId ?? ''}
        onChange={(id) =>
          setState((prev) => {
            const w = prev.transferWorkers.find((t) => t.id === id);
            return {
              ...prev,
              selectedWorkerId: id,
              incumbent: w?.name ?? prev.incumbent,
            };
          })
        }
        options={state.transferWorkers.map((w) => ({
          value: w.id,
          label: `${w.name} — ${w.subtitle}`,
        }))}
      />
      <PrimaryButton onClick={advanceTransfer} disabled={!state.selectedWorkerId}>
        Continue
      </PrimaryButton>
    </Flex>
  );

  const canvasTransferDate = (
    <Flex flexDirection="column" gap="s">
      <Heading size="small" style={{ margin: 0 }}>
        Effective Date
      </Heading>
      <AlertBanner
        type="warning"
        message="Payroll auto-correct: proposed date adjusted to the next payroll-safe cycle boundary."
      />
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14, backgroundColor: '#FFFBF0' }}>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          PAYROLL SAFE
        </BodyText>
        <BodyText size="small" style={{ marginTop: 6 }}>
          {state.payrollSafeRecommendation}
        </BodyText>
      </Box>
      <FormDateInput
        id="transfer-effective"
        label="Effective date"
        value={state.targetHireDate}
        onChange={(value) => setState((prev) => ({ ...prev, targetHireDate: value }))}
      />
      <PrimaryButton onClick={advanceTransfer}>Confirm Effective Date</PrimaryButton>
    </Flex>
  );

  const canvasTransferDetails = (
    <Flex flexDirection="column" gap="s">
      <Heading size="small" style={{ margin: 0 }}>
        Transfer details
      </Heading>
      <AlertBanner type="warning" message={state.payGradeUpgradeNote} />
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14 }}>
        <BodyText size="small" style={{ fontWeight: 700 }}>
          Role summary
        </BodyText>
        <BodyText size="small" style={{ marginTop: 8, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {state.jdSummary}
        </BodyText>
        <Box marginTop="m">
          <FormTextInput
            id="transfer-loc-note"
            label="Location notes (optional)"
            value={`${state.locationFrom} → ${state.locationTo}`}
            onChange={() => undefined}
          />
        </Box>
      </Box>
      <PrimaryButton onClick={advanceTransfer}>Confirm & Continue</PrimaryButton>
    </Flex>
  );

  const canvasTransferReview = (
    <Flex flexDirection="column" gap="s">
      <Heading size="small" style={{ margin: 0 }}>
        Review &amp; Submit
      </Heading>
      <Box style={{ border: `1px solid ${colors.soap300}`, borderRadius: 12, padding: 14 }}>
        <BodyText as="div" size="small" style={{ lineHeight: 1.8 }}>
          Worker: <strong>{state.incumbent}</strong>
          <br />
          Effective: <strong>{new Date(state.targetHireDate).toLocaleDateString('en-GB')}</strong>
          <br />
          From / To:{' '}
          <strong>
            {state.locationFrom} → {state.locationTo}
          </strong>
          <br />
          Pay grade: <strong>{state.payGradeUpgradeNote}</strong>
        </BodyText>
      </Box>
      <AlertBanner type="warning" message={`Benefits: ${state.benefitsResetSummary}`} />
      <Flex gap="s">
        <PrimaryButton onClick={submitTransfer} disabled={sending}>
          {sending ? 'Submitting…' : 'Submit transfer'}
        </PrimaryButton>
        <SecondaryButton onClick={goBack}>Back</SecondaryButton>
      </Flex>
    </Flex>
  );

  const canvasPane = (
    <>
      {state.scenario === 'overlap-backfill' ? (
        <>
          <HeaderCard
            title={`Backfill · ${state.locationTo} overlap`}
            subtitle={`${state.positionTitle} · ${state.positionId} · ${state.orgName}`}
          />
          <StepChipsOverlap
            current={overlapStep}
            completed={completed}
            onSelect={(id) => setState((prev) => ({ ...prev, currentStep: id }))}
          />
          {overlapStep === 'position-confirmation' && canvasOverlapPosition}
          {overlapStep === 'details' && canvasOverlapDetails}
          {overlapStep === 'approve-open' && canvasOverlapApprove}
          {overlapStep === 'opened' && <SuccessPaneOverlap state={state} />}
          {overlapStep !== 'opened' && overlapStep !== 'approve-open' && (
            <Flex gap="s" marginTop="m">
              {overlapStep !== 'position-confirmation' && <SecondaryButton onClick={goBack}>Back</SecondaryButton>}
            </Flex>
          )}
          {overlapStep === 'opened' && (
            <Flex gap="s" marginTop="m">
              <PrimaryButton onClick={reset}>Send another</PrimaryButton>
            </Flex>
          )}
        </>
      ) : (
        <>
          <HeaderCard
            title={`Transfer Position · ${state.incumbent}`}
            subtitle={`${state.positionTitle} · ${state.positionId} · ${state.orgName}`}
          />
          <Flex alignItems="center" gap="xs" marginBottom="xs">
            <SystemIcon icon={userIcon} size={24} color={colors.blueberry400} aria-hidden />
            <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG}>
              Manager-guided workflow
            </BodyText>
          </Flex>
          <StepChipsTransfer
            current={transferStep}
            completed={completed}
            onSelect={(id) => setState((prev) => ({ ...prev, currentStep: id }))}
          />
          {transferStep === 'select-worker' && canvasTransferWorker}
          {transferStep === 'effective-date' && canvasTransferDate}
          {transferStep === 'details' && canvasTransferDetails}
          {transferStep === 'review' && canvasTransferReview}
          {transferStep === 'submitted' && <TransferSubmittedPane state={state} />}
          {transferStep !== 'select-worker' && transferStep !== 'submitted' && transferStep !== 'review' && (
            <Flex marginTop="m">
              <SecondaryButton onClick={goBack}>Back</SecondaryButton>
            </Flex>
          )}
          {transferStep === 'submitted' && (
            <Flex gap="s" marginTop="m">
              <PrimaryButton onClick={reset}>Send another</PrimaryButton>
            </Flex>
          )}
        </>
      )}
      <BodyText
        size="small"
        color={SANA_SECONDARY_TAB_INACTIVE_FG}
        style={{ marginTop: 24, fontStyle: 'italic', fontSize: 11 }}
      >
        Mock prototype: Innovation Summit Create Job Req + Transfer Position SSA patterns. No live worker or
        requisition data is modified.
      </BodyText>
    </>
  );

  return (
    <SsaShell
      mode={mode}
      tenantLabel="acme-prod"
      agentName="Self-Service Agent"
      coldStart={coldStart}
      chat={chatPane}
      canvas={canvasPane}
      onClose={reset}
    />
  );
}