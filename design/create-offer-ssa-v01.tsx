/**
 * Self-Service Agent — Create Offer flow (prototype v01)
 *
 * Design Brief: design/create-offer-ssa-design-brief.md
 * Mode: standalone via @ux-designer (you-decide path) → 320 prototype build → inline 319 + 318 review pass.
 *
 * Route: /create-offer-ssa-v01  (slug declared in main.tsx PROTOTYPE_SLUGS + vite.config.ts slugs Set)
 *
 * Pattern: Split-pane Agent + Task — SSA title strip on top, chat left (520px), structured offer task right.
 * Mirrors SSA Create Job Req demos (design/references/ssa-create-req-flow-best-practices.md;
 * frames-overlap/ov-1800.png + ov-2700.png + ov-9900.png).
 *
 * Mocked candidate / req / approvers: Sarah Chen (Senior PM, Dublin) on requisition JR-12345.
 * Conversational engine: keyword-driven intent parser (no LLM); NL write-through to right pane.
 *
 * 319 (copy review) applied: sentence case throughout, "req" → "requisition", "Step N" → "step N",
 * AI 3-part fallback, candidate-facing AI disclosure stub on letter, AI disclosure now neutral
 * italic line (no yellow Banner — see 320 + 015 rule update).
 *
 * 318 (peer review) applied: stepper switched from tablist (false promise) to <nav>+<ol>+aria-current,
 * "review" dot on stepper pills when chat mutates a non-current step (closes the trust gap),
 * textarea aria-label added.
 *
 * TODO[060]: candidate-facing AI disclosure on the offer letter (currently a stub line) needs 060 legal sign-off.
 *           Also: first-time-use AI consent flow if tenant policy requires opt-in.
 * TODO[PM-confirm]: 4 inferred assumptions await PM confirmation — see brief §Context Inquiry Notes (you-decide mode):
 *   1) entry surface scope (global SSA / candidate-deep-link / both?) + HM-as-primary in scope?
 *   2) primary breakpoint target (document loop / comp validation / approval visibility / all)
 *   3) contracted KPI (default: median doc-cycle compression)
 *   4) executive language preferences / prior failed attempts / roadmap dependencies
 * TODO[Canvas Kit MCP]: errored at brief time — re-run get-canvas-kit-tokens to tighten icon / token picks.
 * TODO[reuse]: when a 2nd SSA prototype lands, extract `SsaTitleStrip` and `Stepper` into design/components/.
 * TODO[unhappy paths]: 9 scenarios from the brief (out-of-band comp, JP 2-step, DE works council, payroll-safe
 *   correction, comp partner OOO, candidate decline, signature timeout, multi-currency, tenant disable AI) —
 *   3 are currently in the prototype (out-of-band comp, JP, DE). The remaining 6 are stubbed in TODOs
 *   awaiting a follow-up build pass.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
} from '@workday/canvas-kit-react/button';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import {
  StatusIndicator,
  StatusIndicatorType,
  StatusIndicatorEmphasis,
} from '@workday/canvas-kit-react/status-indicator';
import { colors } from '@workday/canvas-kit-react/tokens';
import {
  checkCircleIcon,
  mailIcon,
  documentIcon,
  lockIcon,
  rotateIcon,
  editIcon,
  userIcon,
  xIcon,
  locationIcon,
  infoIcon,
  dollarIcon,
  calendarIcon,
  globeIcon,
  pinIcon,
} from '@workday/canvas-system-icons-web';
import { Switch } from '@workday/canvas-kit-react/switch';
import {
  SANA_CARD_RADIUS_LG,
  SANA_CARD_SHADOW,
  SANA_LINK_ACCENT,
  SANA_COMM_PANEL_SURFACE,
  SANA_TAB_PILL_RADIUS,
  SANA_SECONDARY_TAB_ACTIVE_BG,
  SANA_SECONDARY_TAB_ACTIVE_FG,
  SANA_SECONDARY_TAB_INACTIVE_FG,
  SanaCommComposer,
  AlertBanner,
  CollapsibleSection,
  FormSelect,
  FormTextInput,
  RichTextEditor,
  SsaShell,
  SsaAgentTurn,
  SsaStarterSuggestions,
  SsaUserPromptPill,
  SparkleMark,
  TeamsApprovalCard,
  WorkdayWMark,
} from './components';

/* ----------------------------------------------------------------------- *\
 * Visual tokens specific to this SSA-style "display-by-default" treatment.
 * Aligned to design/references/ssa-create-req-videos/frames-overlap/
 * REFERENCE-position-confirmation-with-overlap-toggle.png.
\* ----------------------------------------------------------------------- */

const SSA_RIGHT_PANE_BG = '#FFFFFF';
const SSA_DISPLAY_CARD_BG = colors.soap100; // pale grey card on white
const SSA_DISPLAY_CARD_BORDER = colors.soap300;
const SSA_DISPLAY_CARD_RADIUS = 14;
const SSA_MICRO_LABEL_COLOR = colors.blackPepper400;
const SSA_RATIONALE_COLOR = colors.blueberry500;

/* ----------------------------------------------------------------------- *\
 * Types
\* ----------------------------------------------------------------------- */

type StepId =
  | 'candidate-and-req'
  | 'compensation'
  | 'country-and-approvers'
  | 'offer-document'
  | 'review-and-send';

interface Step {
  id: StepId;
  shortLabel: string;
  longLabel: string;
}

interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  body: React.ReactNode;
  text?: string;
  timestamp: string;
}

type Country = 'IE' | 'JP' | 'DE' | 'IN' | 'US' | 'GB';
type CounterOfferProfile = 'conservative' | 'balanced' | 'competitive';
type ModelConfidence = 'Low' | 'Medium' | 'High';

interface OfferState {
  candidate: { name: string; email: string };
  req: { id: string; title: string; level: string; location: string; country: Country };
  hiringManager: string;
  workLocation: string;
  country: Country;
  startDate: string;
  startDatePayrollSafe: boolean;
  currency: string;
  base: number;
  bonusTargetPct: number;
  equityUnits: number;
  signOn: number;
  band: { min: number; max: number; name: string };
  letterTemplate: string;
  approvers: Approver[];
  twoStepCountry: boolean;
  worksCouncilRequired: boolean;
  aadhaarESign: boolean;
  draftedLetter: string | null;
  /* Idea 1a — Overlap-aware confirmation (Step 1) */
  overlapEnabled: boolean;
  overlapIncumbent: { name: string; leaveDate: string } | null;
  overlapPositionControl: { used: number; cap: number; costCentre: string } | null;
  /* Idea 1b — Live approval map (Step 3 + Step 5). This is the richer version of
   *  the legacy `approvers` list. We keep `approvers` in sync for back-compat with
   *  the existing chat-intent mutations; rendering reads from `approvalMap`. */
  approvalMap: ApproverMapEntry[];
  /* Idea 2 — Document QA deck (Step 4) */
  docQaChecks: QaCheck[];
  /* Idea 3 — DE Collective-Agreement card (Step 3, DE only) */
  collectiveAgreement: CollectiveAgreement | null;
  /* Idea 4 — Approver Packet Preview (Step 5) */
  includeAiApproverSummary: boolean;
  aiSummaryTone: 'default' | 'shorter' | 'formal' | 'plain';
  approverPacketSections: PacketSection[];
  /* Regulated-tenant demo flag — flips the AI-summary switch to disabled + helper text. */
  tenantAllowsAiApproverSummary: boolean;
  /* Counter-offer modelling / market-rate assist (proposal implementation). */
  selectedCounterOfferProfile: CounterOfferProfile;
}

type OfferLetterContext = Pick<
  OfferState,
  | 'candidate'
  | 'req'
  | 'hiringManager'
  | 'workLocation'
  | 'startDate'
  | 'currency'
  | 'base'
  | 'bonusTargetPct'
  | 'equityUnits'
  | 'signOn'
  | 'letterTemplate'
>;

interface Approver {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  required: boolean;
}

interface ApproverMapEntry {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'overdue';
  required: boolean;
  heldSinceLabel?: string;
  oooUntil?: string;
  delegate?: { name: string; role: string };
}

interface QaCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  evidenceLabel?: string;
}

interface CollectiveAgreement {
  id: string;
  wageGroup: string;
  agreementName: string;
  worksCouncilLabel: string;
  acknowledged: boolean;
}

interface PacketSection {
  id: string;
  title: string;
  body: string;
  citations: Citation[];
  /** When true, content is redacted for approvers without comp-data permission. */
  compRestricted?: boolean;
}

interface Citation {
  id: string;
  label: string;
  tooltip: string;
}

interface CounterOfferScenario {
  profile: CounterOfferProfile;
  label: string;
  base: number;
  bonusTargetPct: number;
  equityUnits: number;
  signOn: number;
  confidence: ModelConfidence;
  marketAnchor: string;
  approvalImpact: string;
  rationale: string[];
}

interface DynamicFieldHealth {
  label: string;
  value: string;
  status: 'resolved' | 'missing';
  source: string;
}

interface ApprovalCondition {
  label: string;
  status: 'triggered' | 'skipped';
  reason: string;
}

/* ----------------------------------------------------------------------- *\
 * Constants — stepper + mocked seed data
\* ----------------------------------------------------------------------- */

const STEPS: Step[] = [
  { id: 'candidate-and-req', shortLabel: '1. Candidate', longLabel: 'Candidate & requisition' },
  { id: 'compensation', shortLabel: '2. Compensation', longLabel: 'Compensation' },
  { id: 'country-and-approvers', shortLabel: '3. Country & approvers', longLabel: 'Country & approvers' },
  { id: 'offer-document', shortLabel: '4. Offer document', longLabel: 'Offer document' },
  { id: 'review-and-send', shortLabel: '5. Review & send', longLabel: 'Review & send' },
];

const DYNAMIC_FIELD_STYLE = [
  'display:inline-flex',
  'align-items:center',
  'padding:0 5px',
  'border-radius:6px',
  'background:#E8F4FC',
  'border:1px solid #7EB8E0',
  'color:#0B1F42',
  'font-weight:700',
].join(';');

function dynamicField(label: string, value: string): string {
  return `<span data-crf="${label}" title="Dynamic field: ${label}" style="${DYNAMIC_FIELD_STYLE}">${value}</span>`;
}

const REQUIRED_DYNAMIC_FIELDS = [
  'Candidate name',
  'Job title',
  'Hiring manager',
  'Work location',
  'Admin template',
  'Start date',
  'Base salary',
  'Bonus target',
  'Equity units',
  'Sign-on bonus',
];

const SEED_APPROVAL_MAP: ApproverMapEntry[] = [
  {
    id: 'a1',
    name: 'Aoife Murphy',
    role: 'Hiring manager',
    status: 'in_progress',
    required: true,
    heldSinceLabel: '2 days ago',
    oooUntil: '2026-05-08',
    delegate: { name: 'Ciara Flaherty', role: 'Engineering Director' },
  },
  {
    id: 'a2',
    name: 'Diane O’Connor',
    role: 'Talent Acquisition Director',
    status: 'pending',
    required: true,
  },
  {
    id: 'a3',
    name: 'Conor Byrne',
    role: 'HRBP',
    status: 'pending',
    required: false,
  },
];

const SEED_QA_CHECKS: QaCheck[] = [
  {
    id: 'qa-band',
    label: 'Base salary vs pay band',
    status: 'pass',
    message: 'Passes — €95,000 is inside the Senior PM IE — Band 4 range (€88k–€112k).',
    evidenceLabel: 'Pay band',
  },
  {
    id: 'qa-currency',
    label: 'Currency matches work location',
    status: 'pass',
    message: 'Passes — EUR matches Dublin, Ireland.',
    evidenceLabel: 'Work location',
  },
  {
    id: 'qa-payroll',
    label: 'Start date is payroll-safe',
    status: 'warn',
    message: 'Worth a look — start date is payroll-safe, but 1 June 2026 falls on an Irish public holiday.',
    evidenceLabel: 'Payroll calendar',
  },
  {
    id: 'qa-template',
    label: 'Letter template is tenant-approved',
    status: 'pass',
    message: 'Passes — Ireland — Permanent Salaried v3 is the current approved template.',
    evidenceLabel: 'Tenant template registry',
  },
  {
    id: 'qa-classification',
    label: 'Job classification matches worksheet',
    status: 'pass',
    message: 'Passes — letter classification "Permanent, salaried" matches the structured worksheet.',
    evidenceLabel: 'Offer worksheet',
  },
  {
    id: 'qa-prose',
    label: 'Letter prose matches structured data',
    status: 'pass',
    message: 'Passes — base salary, start date, and reporting line in the letter match the worksheet.',
    evidenceLabel: 'Worksheet vs letter diff',
  },
];

const SEED_PACKET_SECTIONS: PacketSection[] = [
  {
    id: 'pk-comp',
    title: 'Compensation and pay-band summary',
    body:
      'Base €95,000 (within Senior PM IE — Band 4). Bonus target 15% of base. Equity 1,200 RSUs over 4 years. Sign-on €5,000. Year-1 cash €114,250.',
    compRestricted: true,
    citations: [
      { id: 'c-band', label: 'Pay band', tooltip: 'Source: Senior PM IE — Band 4 (tenant pay-band registry). Opens in a new tab.' },
      { id: 'c-worksheet', label: 'Offer worksheet', tooltip: 'Source: hrrecruiting/offerWorksheet for Sarah Chen / JR-12345.' },
    ],
  },
  {
    id: 'pk-role',
    title: 'Role, reporting line, and start date',
    body:
      'Senior Product Manager (P4) reporting to Aoife Murphy. Dublin, Ireland. Proposed start date: 1 June 2026 (payroll-safe).',
    citations: [
      { id: 'c-req', label: 'Requisition JR-12345', tooltip: 'Source: requisition detail. Opens in a new tab.' },
      { id: 'c-scorecard', label: 'Scorecard', tooltip: 'Source: interview scorecard summary for Sarah Chen.' },
    ],
  },
  {
    id: 'pk-country',
    title: 'Country requirements',
    body: 'Ireland — permanent salaried flow. No works-council review. No two-step compliance. No Aadhaar.',
    citations: [
      { id: 'c-country', label: 'Country overlay', tooltip: 'Source: Workday Ireland permanent-salaried offer requirements.' },
    ],
  },
  {
    id: 'pk-doc',
    title: 'Document version and QA result',
    body: 'Letter template Ireland — Permanent Salaried v3. QA: 5 of 6 checks passed, 1 worth a look, 0 blocking.',
    citations: [
      { id: 'c-qa', label: 'QA deck', tooltip: 'Source: quality-check results for this offer draft.' },
    ],
  },
];

const SEED_OFFER: OfferState = {
  candidate: { name: 'Sarah Chen', email: 'sarah.chen@example.com' },
  req: {
    id: 'JR-12345',
    title: 'Senior Product Manager',
    level: 'P4',
    location: 'Dublin, Ireland',
    country: 'IE',
  },
  hiringManager: 'Aoife Murphy',
  workLocation: 'Dublin, Ireland',
  country: 'IE',
  startDate: '2026-06-01',
  startDatePayrollSafe: true,
  currency: 'EUR',
  base: 95000,
  bonusTargetPct: 15,
  equityUnits: 1200,
  signOn: 5000,
  band: { min: 88000, max: 112000, name: 'Senior PM IE — Band 4' },
  letterTemplate: 'Ireland — Permanent Salaried v3',
  approvers: [
    { id: 'a1', name: 'Aoife Murphy', role: 'Hiring manager', status: 'pending', required: true },
    { id: 'a2', name: 'Diane O’Connor', role: 'Talent Acquisition Director', status: 'pending', required: true },
  ],
  twoStepCountry: false,
  worksCouncilRequired: false,
  aadhaarESign: false,
  draftedLetter: SAMPLE_LETTER_BODY({
    candidate: { name: 'Sarah Chen', email: 'sarah.chen@example.com' },
    req: {
      id: 'JR-12345',
      title: 'Senior Product Manager',
      level: 'P4',
      location: 'Dublin, Ireland',
      country: 'IE',
    },
    hiringManager: 'Aoife Murphy',
    workLocation: 'Dublin, Ireland',
    startDate: '2026-06-01',
    currency: 'EUR',
    base: 95000,
    bonusTargetPct: 15,
    equityUnits: 1200,
    signOn: 5000,
    letterTemplate: 'Ireland — Permanent Salaried v3',
  }),
  /* Idea 1a */
  overlapEnabled: false,
  overlapIncumbent: { name: 'Liam Walsh', leaveDate: '2026-06-30' },
  overlapPositionControl: { used: 41, cap: 40, costCentre: 'Product Engineering — Dublin' },
  /* Idea 1b */
  approvalMap: SEED_APPROVAL_MAP,
  /* Idea 2 */
  docQaChecks: SEED_QA_CHECKS,
  /* Idea 3 — null by default; populated on country switch to DE. */
  collectiveAgreement: null,
  /* Idea 4 — off by default to model the regulated-tenant case. */
  includeAiApproverSummary: false,
  aiSummaryTone: 'default',
  approverPacketSections: SEED_PACKET_SECTIONS,
  tenantAllowsAiApproverSummary: true,
  selectedCounterOfferProfile: 'balanced',
};

/* Idea 3 — seed populated on country switch to DE (see processUserIntent). */
const DE_COLLECTIVE_AGREEMENT: CollectiveAgreement = {
  id: 'CA-2024-DE-14',
  wageGroup: 'E14 (Senior Professional)',
  agreementName: 'Metall NRW 2024 (CA-2024-DE-14)',
  worksCouncilLabel: 'Required — approx. 5 business days',
  acknowledged: false,
};

const COUNTRY_LABELS: Record<Country, string> = {
  IE: 'Ireland',
  JP: 'Japan',
  DE: 'Germany',
  IN: 'India',
  US: 'United States',
  GB: 'United Kingdom',
};

const CURRENCY_BY_COUNTRY: Record<Country, string> = {
  IE: 'EUR',
  JP: 'JPY',
  DE: 'EUR',
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
};

const TEMPLATE_BY_COUNTRY: Record<Country, string> = {
  IE: 'Ireland — Permanent Salaried v3',
  JP: 'Japan — Two-step Permanent v2',
  DE: 'Germany — Works-council Permanent v2',
  IN: 'India — Permanent + Aadhaar v3',
  US: 'United States — Permanent At-will v4',
  GB: 'United Kingdom — Permanent Salaried v3',
};

function SAMPLE_LETTER_BODY(offer: OfferLetterContext): string {
  return [
    `<p>Dear ${dynamicField('Candidate name', offer.candidate.name)},</p>`,
    `<p>Congratulations on your offer to join Workday as ${dynamicField('Job title', offer.req.title)}. We are excited about the experience you would bring to the team, and ${dynamicField('Hiring manager', offer.hiringManager)} is looking forward to welcoming you in ${dynamicField('Work location', offer.workLocation)}.</p>`,
    `<p>This letter was generated from the admin-configured template ${dynamicField('Admin template', offer.letterTemplate)} and personalised with your offer worksheet details. The role is ${dynamicField('Job title', offer.req.title)} (${dynamicField('Job level', offer.req.level)}), reporting to ${dynamicField('Hiring manager', offer.hiringManager)}, with a proposed start date of ${dynamicField('Start date', formatHumanDate(offer.startDate))}.</p>`,
    '<p>Your total compensation package:</p>',
    '<ul>',
    `<li>Base salary: ${dynamicField('Base salary', formatMoney(offer.base, offer.currency))}</li>`,
    `<li>Annual bonus target: ${dynamicField('Bonus target', `${offer.bonusTargetPct}%`)}</li>`,
    `<li>Equity (RSUs): ${dynamicField('Equity units', `${offer.equityUnits.toLocaleString()} units`)}, vesting over four years</li>`,
    `<li>Sign-on bonus: ${dynamicField('Sign-on bonus', formatMoney(offer.signOn, offer.currency))}</li>`,
    '</ul>',
    '<p>This offer is contingent on a satisfactory background check and your acceptance below. The legal and contingency clauses in this letter come from the approved admin template and have not been rewritten by the agent.</p>',
    '<p>We look forward to welcoming you to the team.</p>',
    `<p>${dynamicField('Hiring manager', offer.hiringManager)}<br>Hiring Manager</p>`,
    '<p><em>[TODO 060] Candidate-facing AI disclosure: "This letter was drafted with Workday AI and reviewed by your Workday recruiter before sending."</em></p>',
  ].join('');
}

/* ----------------------------------------------------------------------- *\
 * Helpers
\* ----------------------------------------------------------------------- */

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function formatHumanDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function nowTimestamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function toTitleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ');
}

function nextChatId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function bandStatus(base: number, band: OfferState['band']): { withinBand: boolean; deltaPct: number } {
  const withinBand = base >= band.min && base <= band.max;
  const mid = (band.min + band.max) / 2;
  const deltaPct = Math.round(((base - mid) / mid) * 100);
  return { withinBand, deltaPct };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function applyCompensationPackage(
  prev: OfferState,
  pkg: Pick<OfferState, 'base' | 'bonusTargetPct' | 'equityUnits' | 'signOn' | 'currency'>
): OfferState {
  const bs = bandStatus(pkg.base, prev.band);
  const hasCompApprover = prev.approvers.some((a) => a.id === 'a-comp');
  const hasCompMap = prev.approvalMap.some((a) => a.id === 'a-comp');

  const nextApprovers: Approver[] = bs.withinBand
    ? prev.approvers.filter((a) => a.id !== 'a-comp')
    : hasCompApprover
      ? prev.approvers
      : [
          ...prev.approvers,
          {
            id: 'a-comp',
            name: 'Mateo Rivera (Comp Partner)',
            role: 'Compensation review (out-of-band)',
            status: 'pending',
            required: true,
          },
        ];

  const nextApprovalMap: ApproverMapEntry[] = bs.withinBand
    ? prev.approvalMap.filter((a) => a.id !== 'a-comp')
    : hasCompMap
      ? prev.approvalMap
      : [
          ...prev.approvalMap,
          {
            id: 'a-comp',
            name: 'Mateo Rivera',
            role: 'Comp Partner',
            status: 'pending',
            required: true,
          },
        ];

  const nextOffer = {
    ...prev,
    ...pkg,
    approvers: nextApprovers,
    approvalMap: nextApprovalMap,
  };
  return {
    ...nextOffer,
    draftedLetter: SAMPLE_LETTER_BODY(nextOffer),
  };
}

function buildCounterOfferScenarios(offer: OfferState): CounterOfferScenario[] {
  const mid = Math.round((offer.band.min + offer.band.max) / 2);
  const peerLow = Math.round(mid * 0.96);
  const peerHigh = Math.round(mid * 1.08);

  const conservativeBase = clamp(Math.round(mid * 0.98), offer.band.min, offer.band.max);
  const balancedBase = clamp(Math.round(mid * 1.01), offer.band.min, offer.band.max);
  const competitiveBase = Math.round(offer.band.max * 1.03);

  return [
    {
      profile: 'conservative',
      label: 'Conservative',
      base: conservativeBase,
      bonusTargetPct: 12,
      equityUnits: 1100,
      signOn: 3000,
      confidence: 'High',
      marketAnchor: `Internal accepted range (${offer.req.level}, ${offer.workLocation}): ${formatMoney(peerLow, offer.currency)}–${formatMoney(peerHigh, offer.currency)}.`,
      approvalImpact: 'Likely standard chain (Hiring Manager + TA Director).',
      rationale: [
        'Anchors below current midpoint while staying inside pay band.',
        'Minimises approval complexity and comp-partner escalation risk.',
      ],
    },
    {
      profile: 'balanced',
      label: 'Balanced',
      base: balancedBase,
      bonusTargetPct: 15,
      equityUnits: 1300,
      signOn: 5000,
      confidence: 'Medium',
      marketAnchor: `Internal peers: 3 accepted offers in this band cluster around ${formatMoney(mid, offer.currency)}.`,
      approvalImpact: 'Likely standard chain; comp partner only if other fields move out of guardrails.',
      rationale: [
        'Targets the upper-middle of internal accepted outcomes.',
        'Balances acceptance competitiveness with policy-safe posture.',
      ],
    },
    {
      profile: 'competitive',
      label: 'Competitive',
      base: competitiveBase,
      bonusTargetPct: 18,
      equityUnits: 1600,
      signOn: 8000,
      confidence: 'Low',
      marketAnchor: 'External market benchmark feed is not connected in this prototype (phase-2 dependency).',
      approvalImpact: 'Comp Partner approval likely required (base may exceed pay band).',
      rationale: [
        'Optimises for competitiveness in hard-to-close negotiations.',
        'Higher spend profile and likely longer approval cycle.',
      ],
    },
  ];
}

function selectedCounterOfferScenario(offer: OfferState): CounterOfferScenario {
  const scenarios = buildCounterOfferScenarios(offer);
  return (
    scenarios.find((s) => s.profile === offer.selectedCounterOfferProfile) ??
    scenarios.find((s) => s.profile === 'balanced') ??
    scenarios[0]
  );
}

function payrollSafeAdjust(iso: string): { iso: string; adjusted: boolean } {
  // Demo rule: if requested start day is on a weekend, bump to the following Monday.
  const d = new Date(iso);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() + 1);
  else if (day === 6) d.setDate(d.getDate() + 2);
  const adjusted = d.toISOString().slice(0, 10) !== iso;
  return { iso: d.toISOString().slice(0, 10), adjusted };
}

/* ----------------------------------------------------------------------- *\
 * Conversational engine (keyword-driven for prototype)
\* ----------------------------------------------------------------------- */

type AgentReply = {
  body: React.ReactNode;
  mutate?: (prev: OfferState) => OfferState;
  /** Steps the user should re-review after this turn — surfaces a "review" dot on each step pill. */
  affectsSteps?: StepId[];
  /** When true, the SSA shell transitions from cold-start (chat-only centred) to in-task (split pane). */
  enterTaskMode?: boolean;
};

function processUserIntent(input: string, offer: OfferState, mode: 'cold-start' | 'in-task' = 'in-task'): AgentReply {
  const text = input.trim().toLowerCase();

  /* --------------------------------------------------------------------- *
   * Cold-start routing — only fires while the SSA is on the generic home.
   * The "create offer" intent is the one that flips mode → in-task and
   * materialises the right-hand canvas. Anything else echoes a friendly
   * out-of-scope reply so the prototype advertises SSA breadth without
   * pretending to answer it.
   * --------------------------------------------------------------------- */
  if (mode === 'cold-start') {
    // Create-offer intent → open the canvas.
    const createOffer =
      /\b(create|draft|start|make|new|open)\b[^.]*\b(offer|offer\s+letter)\b/.test(text) ||
      /\boffer\s+(letter\s+)?for\b/.test(text) ||
      /\bfor\s+jr-\d+/i.test(text) ||
      /\bcreate\s+an\s+offer\s+for\s+a\s+candidate\b/.test(text);

    if (createOffer) {
      return {
        enterTaskMode: true,
        body: (
          <Box>
            <BodyText size="small">
              Sure — I’ll help you create an offer for <strong>{SEED_OFFER.candidate.name}</strong> on requisition{' '}
              <strong>{SEED_OFFER.req.id}</strong> ({SEED_OFFER.req.title}, {SEED_OFFER.req.location}).
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              I’ve pre-filled compensation, country, and approvers from the requisition and your tenant configuration.
              Tell me what to change in plain English (e.g. "switch country to Germany", "increase base by 8%",
              "change start date to June 16th"), or work through the steps on the right.
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Step 2 includes a counter-offer model with market-rate guidance (advisory only).
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Nothing is sent until you confirm on step 5.
            </BodyText>
          </Box>
        ),
      };
    }

    // Out-of-scope in cold-start — everything except the offer intent.
    return {
      body: (
        <Box>
          <BodyText size="small">
            This prototype is scoped to the offer flow, so I can’t help with that one yet.
          </BodyText>
          <BodyText size="small" style={{ marginTop: 6 }}>
            Try <strong>"Create an offer for a candidate"</strong> to see how the Self-Service Agent opens a task canvas
            on the right.
          </BodyText>
        </Box>
      ),
    };
  }

  // Country switch
  const countryMatch = text.match(/\b(ireland|japan|germany|india|united states|us|usa|uk|united kingdom|britain)\b/);
  if (text.includes('switch') && countryMatch) {
    const map: Record<string, Country> = {
      ireland: 'IE',
      japan: 'JP',
      germany: 'DE',
      india: 'IN',
      'united states': 'US',
      us: 'US',
      usa: 'US',
      uk: 'GB',
      'united kingdom': 'GB',
      britain: 'GB',
    };
    const newCountry = map[countryMatch[1]] || offer.country;
    return {
      body: (
        <Box>
          <BodyText size="small">
            Switched country to <strong>{COUNTRY_LABELS[newCountry]}</strong>. I’ve updated:
          </BodyText>
          <ul style={{ margin: '6px 0 0 18px', paddingLeft: 0, fontSize: 13, color: colors.blackPepper600, lineHeight: 1.5 }}>
            <li>Currency → <strong>{CURRENCY_BY_COUNTRY[newCountry]}</strong></li>
            <li>Letter template → <strong>{TEMPLATE_BY_COUNTRY[newCountry]}</strong></li>
            {newCountry === 'JP' && <li><strong>Two-step offer flow</strong> required (Japan labour-law).</li>}
            {newCountry === 'DE' && <li><strong>Works council</strong> review required (Germany).</li>}
            {newCountry === 'IN' && <li><strong>Aadhaar / Adobe Sign</strong> e-signature required (India).</li>}
          </ul>
          <BodyText size="small" style={{ marginTop: 8 }}>
            Country &amp; approvers and Offer document steps now reflect this. Review them when ready.
          </BodyText>
        </Box>
      ),
      mutate: (prev) => {
        const countryApprover: ApproverMapEntry | null =
          newCountry === 'JP'
            ? { id: 'a-country', name: 'Yuki Tanaka', role: 'Local HR · Two-step compliance', status: 'pending', required: true }
            : newCountry === 'DE'
              ? { id: 'a-country', name: 'Klaus Bauer', role: 'Works council liaison', status: 'pending', required: true }
              : null;
        const nextMap: ApproverMapEntry[] = countryApprover
          ? [...prev.approvalMap.filter((a) => a.id !== 'a-country'), countryApprover]
          : prev.approvalMap.filter((a) => a.id !== 'a-country');
        const nextApprovers: Approver[] =
          newCountry === 'JP' || newCountry === 'DE'
            ? [
                ...prev.approvers.filter((a) => a.id !== 'a-country'),
                {
                  id: 'a-country',
                  name: newCountry === 'JP' ? 'Yuki Tanaka (Local HR)' : 'Klaus Bauer (Works council liaison)',
                  role: newCountry === 'JP' ? 'Two-step compliance' : 'Works council',
                  status: 'pending',
                  required: true,
                },
              ]
            : prev.approvers.filter((a) => a.id !== 'a-country');
        const nextOffer = {
          ...prev,
          country: newCountry,
          workLocation: `${COUNTRY_LABELS[newCountry]} office`,
          currency: CURRENCY_BY_COUNTRY[newCountry],
          letterTemplate: TEMPLATE_BY_COUNTRY[newCountry],
          twoStepCountry: newCountry === 'JP',
          worksCouncilRequired: newCountry === 'DE',
          aadhaarESign: newCountry === 'IN',
          approvers: nextApprovers,
          approvalMap: nextMap,
          collectiveAgreement: newCountry === 'DE' ? { ...DE_COLLECTIVE_AGREEMENT } : null,
        };
        return {
          ...nextOffer,
          draftedLetter: SAMPLE_LETTER_BODY(nextOffer),
        };
      },
      affectsSteps: ['compensation', 'country-and-approvers', 'offer-document'],
    };
  }

  // Increase / decrease base
  const baseMatch = text.match(/\b(?:base|salary)\b.*?(\d{2,7})|(?:increase|raise)\b.*?(\d{1,3})\s*%|(?:reduce|drop|cut)\b.*?(\d{1,3})\s*%/);
  if ((text.includes('increase') || text.includes('raise') || text.includes('change') || text.includes('set') || text.includes('cut') || text.includes('reduce')) && baseMatch) {
    const explicitAmount = baseMatch[1] ? parseInt(baseMatch[1], 10) : null;
    const incPct = baseMatch[2] ? parseInt(baseMatch[2], 10) : null;
    const decPct = baseMatch[3] ? parseInt(baseMatch[3], 10) : null;
    const newBase = explicitAmount
      ? explicitAmount * (explicitAmount < 1000 ? 1000 : 1)
      : incPct
        ? Math.round(offer.base * (1 + incPct / 100))
        : decPct
          ? Math.round(offer.base * (1 - decPct / 100))
          : offer.base;
    const bs = bandStatus(newBase, offer.band);
    return {
      body: (
        <Box>
          <BodyText size="small">
            Updated: <strong>Base {formatMoney(offer.base, offer.currency)} → {formatMoney(newBase, offer.currency)}</strong>.
          </BodyText>
          <BodyText size="small" style={{ marginTop: 6 }}>
            Pay-band check ({offer.band.name}): {bs.withinBand ? <strong style={{ color: colors.greenery500 }}>within range</strong> : <strong style={{ color: colors.cinnamon500 }}>{Math.abs(bs.deltaPct)}% {bs.deltaPct > 0 ? 'above' : 'below'} band midpoint</strong>}.
            {!bs.withinBand && ' Comp Partner approval will be added.'}
          </BodyText>
        </Box>
      ),
      mutate: (prev) => {
        return {
          ...applyCompensationPackage(prev, {
            base: newBase,
            bonusTargetPct: prev.bonusTargetPct,
            equityUnits: prev.equityUnits,
            signOn: prev.signOn,
            currency: prev.currency,
          }),
          selectedCounterOfferProfile: 'balanced',
        };
      },
      affectsSteps: ['compensation', 'country-and-approvers', 'offer-document'],
    };
  }

  // Counter-offer modelling / market-rate guidance
  if (/counter.?offer|market.?rate|market\s+model|compensation\s+model/.test(text)) {
    return {
      body: (
        <Box>
          <BodyText size="small">
            I’ve added a <strong>Counter-offer model</strong> on step 2 with three explainable options:
            Conservative, Balanced, and Competitive.
          </BodyText>
          <BodyText size="small" style={{ marginTop: 6 }}>
            Recommendations are advisory only. You stay in control and can apply or edit any package.
          </BodyText>
          <BodyText size="small" style={{ marginTop: 6 }}>
            Try: <strong>"apply balanced recommendation"</strong> or open step 2 and press <strong>Apply</strong>.
          </BodyText>
        </Box>
      ),
      affectsSteps: ['compensation'],
    };
  }

  const recProfileMatch = text.match(/(apply|use|pick)\s+(the\s+)?(conservative|balanced|competitive)/);
  if (recProfileMatch) {
    const profile = recProfileMatch[3] as CounterOfferProfile;
    const scenario = buildCounterOfferScenarios(offer).find((s) => s.profile === profile);
    if (scenario) {
      return {
        body: (
          <Box>
            <BodyText size="small">
              Applied <strong>{scenario.label}</strong> recommendation: base{' '}
              <strong>{formatMoney(scenario.base, offer.currency)}</strong>, bonus{' '}
              <strong>{scenario.bonusTargetPct}%</strong>, equity{' '}
              <strong>{scenario.equityUnits.toLocaleString()} RSUs</strong>, sign-on{' '}
              <strong>{formatMoney(scenario.signOn, offer.currency)}</strong>.
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Confidence: <strong>{scenario.confidence}</strong>. {scenario.approvalImpact}
            </BodyText>
          </Box>
        ),
        mutate: (prev) => ({
          ...applyCompensationPackage(prev, {
            base: scenario.base,
            bonusTargetPct: scenario.bonusTargetPct,
            equityUnits: scenario.equityUnits,
            signOn: scenario.signOn,
            currency: prev.currency,
          }),
          selectedCounterOfferProfile: scenario.profile,
        }),
        affectsSteps: ['compensation', 'country-and-approvers', 'review-and-send', 'offer-document'],
      };
    }
  }

  // Date change
  const dateMatch = text.match(/\b(start|begin|join)\b.*?\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{1,2})/);
  if (dateMatch) {
    const monthName = dateMatch[2];
    const day = parseInt(dateMatch[3], 10);
    const monthIdx = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ].findIndex((m) => monthName.startsWith(m));
    const year = new Date().getFullYear();
    const candidateIso = new Date(Date.UTC(year, monthIdx, day)).toISOString().slice(0, 10);
    const futureCandidate = new Date(candidateIso) < new Date()
      ? new Date(Date.UTC(year + 1, monthIdx, day)).toISOString().slice(0, 10)
      : candidateIso;
    const safe = payrollSafeAdjust(futureCandidate);
    return {
      body: (
        <Box>
          {safe.adjusted ? (
            <>
              <BodyText size="small">
                You asked for <strong>{formatHumanDate(futureCandidate)}</strong>, but that lands on a weekend. I’ve aligned to the next payroll-safe date: <strong>{formatHumanDate(safe.iso)}</strong>.
              </BodyText>
              <BodyText size="small" style={{ marginTop: 6 }}>
                You can override this in the form if you need the exact date.
              </BodyText>
            </>
          ) : (
            <BodyText size="small">
              Updated start date to <strong>{formatHumanDate(safe.iso)}</strong>. That date is payroll-safe.
            </BodyText>
          )}
        </Box>
      ),
      mutate: (prev) => {
        const nextOffer = { ...prev, startDate: safe.iso, startDatePayrollSafe: true };
        return { ...nextOffer, draftedLetter: SAMPLE_LETTER_BODY(nextOffer) };
      },
      affectsSteps: ['candidate-and-req', 'offer-document'],
    };
  }

  // Draft / regenerate letter
  if (text.includes('draft') || text.includes('regenerate') || text.includes('letter')) {
    return {
      body: (
        <Box>
          <BodyText size="small">
            Regenerated from the admin template <strong>{offer.letterTemplate}</strong> and personalised for <strong>{offer.candidate.name}</strong>.
          </BodyText>
          <BodyText size="small" style={{ marginTop: 6, fontStyle: 'italic', color: SANA_SECONDARY_TAB_INACTIVE_FG }}>
            Legal and contingency clauses stay locked to the approved template.
          </BodyText>
        </Box>
      ),
      mutate: (prev) => ({ ...prev, draftedLetter: SAMPLE_LETTER_BODY(prev) }),
      affectsSteps: ['offer-document'],
    };
  }

  // Idea 1a — Overlap toggle (enable / disable)
  if (/(enable|turn on|allow)\s+overlap/.test(text)) {
    const incumbent = offer.overlapIncumbent;
    const wouldBreach =
      offer.overlapPositionControl && offer.overlapPositionControl.used >= offer.overlapPositionControl.cap;
    return {
      body: (
        <Box>
          <BodyText size="small">
            Overlap on. {incumbent ? (
              <>
                {offer.candidate.name} starts <strong>{formatHumanDate(offer.startDate)}</strong> and{' '}
                <strong>{incumbent.name}</strong> leaves <strong>{formatHumanDate(incumbent.leaveDate)}</strong>. Overlap
                keeps the team covered through the handover. No net change to headcount budget.
              </>
            ) : (
              'Overlap is now enabled for this offer.'
            )}
          </BodyText>
          {wouldBreach && offer.overlapPositionControl && (
            <BodyText size="small" style={{ marginTop: 6, color: colors.cinnamon500 }}>
              Heads up — this would put {offer.overlapPositionControl.costCentre} at{' '}
              {offer.overlapPositionControl.used + 1} of {offer.overlapPositionControl.cap} positions. HRBP approval is
              required to overlap.
            </BodyText>
          )}
        </Box>
      ),
      mutate: (prev) => ({ ...prev, overlapEnabled: true }),
      affectsSteps: ['candidate-and-req'],
    };
  }

  if (/(disable|turn off)\s+overlap/.test(text)) {
    const incumbent = offer.overlapIncumbent;
    return {
      body: (
        <BodyText size="small">
          Overlap off. {incumbent ? (
            <>
              {offer.candidate.name} now starts <strong>{formatHumanDate(offer.startDate)}</strong>, the day after{' '}
              <strong>{incumbent.name}</strong>’s last day.
            </>
          ) : (
            'Overlap is disabled for this offer.'
          )}
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, overlapEnabled: false }),
      affectsSteps: ['candidate-and-req'],
    };
  }

  // Idea 1b — Approval map narration / delegation / ping
  if (/who(’|')?s?\s+(blocking|holding|got)|where\s+is\s+this\s+stuck/.test(text)) {
    const holder = offer.approvalMap.find((a) => a.status === 'in_progress') ?? offer.approvalMap.find((a) => a.status !== 'approved');
    if (!holder) {
      return {
        body: (
          <BodyText size="small">
            Nobody’s blocking right now. The approval chain hasn’t started yet — it’ll kick off when you press Send on step 5.
          </BodyText>
        ),
      };
    }
    return {
      body: (
        <Box>
          <BodyText size="small">
            <strong>{holder.name}</strong> ({holder.role}) has it
            {holder.heldSinceLabel ? <> — held since <strong>{holder.heldSinceLabel}</strong></> : null}.
          </BodyText>
          {holder.oooUntil && (
            <BodyText size="small" style={{ marginTop: 6 }}>
              They’re out of office until <strong>{formatHumanDate(holder.oooUntil)}</strong>.{' '}
              {holder.delegate ? (
                <>
                  Delegated to <strong>{holder.delegate.name}</strong> ({holder.delegate.role}). I can route to the
                  delegate or ping <strong>{holder.name}</strong> directly.
                </>
              ) : (
                <>No delegate on file — pick a different approver, or skip this optional one.</>
              )}
            </BodyText>
          )}
        </Box>
      ),
    };
  }

  const delegateMatch = text.match(/(delegate|route)\s+to\s+([a-z][a-z\s’'-]{1,40})/i);
  if (delegateMatch) {
    const delegateName = delegateMatch[2].trim().replace(/\s+/g, ' ');
    const holder = offer.approvalMap.find((a) => a.status === 'in_progress') ?? offer.approvalMap.find((a) => a.delegate);
    if (!holder) {
      return {
        body: (
          <BodyText size="small">
            Nothing to delegate yet — the approval chain starts when you Send.
          </BodyText>
        ),
      };
    }
    const delegate = holder.delegate ?? { name: toTitleCase(delegateName), role: 'Delegate' };
    return {
      body: (
        <BodyText size="small">
          Routed to <strong>{delegate.name}</strong>. <strong>{holder.name}</strong> stays copied on the audit trail.
        </BodyText>
      ),
      mutate: (prev) => ({
        ...prev,
        approvalMap: prev.approvalMap.map((a) =>
          a.id === holder.id
            ? { ...a, status: 'in_progress', delegate: delegate, heldSinceLabel: 'just now' }
            : a
        ),
      }),
      affectsSteps: ['country-and-approvers', 'review-and-send'],
    };
  }

  if (/ping\s+(aoife|diane|conor|klaus|yuki|approver|them)/.test(text)) {
    const holder = offer.approvalMap.find((a) => a.status === 'in_progress') ?? offer.approvalMap[0];
    if (!holder) {
      return { body: <BodyText size="small">Nobody to ping yet — the approval chain starts when you Send.</BodyText> };
    }
    return {
      body: (
        <BodyText size="small">
          Ping sent to <strong>{holder.name}</strong>.
        </BodyText>
      ),
    };
  }

  // Idea 2 — QA narration
  if (/what(’|')?s\s+wrong|run\s+qa|quality\s+check|check\s+the\s+document/.test(text)) {
    const fails = offer.docQaChecks.filter((c) => c.status === 'fail');
    const warns = offer.docQaChecks.filter((c) => c.status === 'warn');
    const passes = offer.docQaChecks.filter((c) => c.status === 'pass');
    return {
      body: (
        <Box>
          <BodyText size="small">
            I ran <strong>{offer.docQaChecks.length}</strong> checks. <strong>{passes.length}</strong> passed,{' '}
            <strong>{warns.length}</strong> worth a look, <strong>{fails.length}</strong> blocking send.
          </BodyText>
          {(fails.length > 0 || warns.length > 0) && (
            <ul style={{ margin: '6px 0 0 18px', fontSize: 13, color: colors.blackPepper600, lineHeight: 1.5 }}>
              {fails.map((c) => (
                <li key={c.id}>
                  <strong>Blocks send</strong> — {c.message.replace(/^Blocks send —\s*/, '')}
                </li>
              ))}
              {warns.map((c) => (
                <li key={c.id}>
                  <strong>Worth a look</strong> — {c.message.replace(/^Worth a look —\s*/, '')}
                </li>
              ))}
            </ul>
          )}
        </Box>
      ),
    };
  }

  // Idea 3 — DE collective-agreement narration
  if (/collective\s+agreement|wage\s+group|works\s+council/.test(text) && offer.country === 'DE') {
    return {
      body: (
        <BodyText size="small">
          Wage group <strong>E14</strong> is the senior-professional tier under <strong>Metall NRW 2024</strong>. Base
          minimum is around <strong>€78,400</strong> a year. Your offer of{' '}
          <strong>{formatMoney(offer.base, offer.currency)}</strong> sits above the minimum. Works-council review
          typically adds about <strong>5 business days</strong> to the cycle.
        </BodyText>
      ),
    };
  }

  // Idea 4 — AI approver-summary toggle + tone edits
  if (/(include|show|turn on)\s+(ai\s+)?summary/.test(text)) {
    if (!offer.tenantAllowsAiApproverSummary) {
      return {
        body: (
          <Box>
            <BodyText size="small">
              I can’t turn this on for your tenant.
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Your Workday Setup has AI summaries in approver notifications switched off.
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Ask your Workday admin to enable AI summaries, or send the packet without one.
            </BodyText>
          </Box>
        ),
      };
    }
    return {
      body: (
        <BodyText size="small">
          AI summary on. Approvers will see a 3-line summary with live citations back to the source data. You can tune
          the tone in chat — try "shorten", "make more formal", or "plain English".
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, includeAiApproverSummary: true }),
      affectsSteps: ['review-and-send'],
    };
  }

  if (/(hide|turn off|remove)\s+(ai\s+)?summary/.test(text)) {
    return {
      body: (
        <BodyText size="small">
          AI summary off. Approvers will see the packet only — no AI-generated text goes to them.
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, includeAiApproverSummary: false }),
      affectsSteps: ['review-and-send'],
    };
  }

  if (/^shorten\b|make\s+it\s+shorter|tighten/.test(text) && offer.includeAiApproverSummary) {
    return {
      body: (
        <BodyText size="small">
          Shortened. The summary is now tighter. I kept the citations.
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, aiSummaryTone: 'shorter' }),
      affectsSteps: ['review-and-send'],
    };
  }

  if (/more\s+formal|make.*formal/.test(text) && offer.includeAiApproverSummary) {
    return {
      body: (
        <BodyText size="small">
          Made it more formal. I removed the contractions and kept the structure.
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, aiSummaryTone: 'formal' }),
      affectsSteps: ['review-and-send'],
    };
  }

  if (/plain\s+english|simpler|less\s+jargon/.test(text) && offer.includeAiApproverSummary) {
    return {
      body: (
        <BodyText size="small">
          Plainer. Same facts, fewer words, no jargon.
        </BodyText>
      ),
      mutate: (prev) => ({ ...prev, aiSummaryTone: 'plain' }),
      affectsSteps: ['review-and-send'],
    };
  }

  // Help / capability
  if (text.includes('help') || text.includes('what can') || text === '?') {
    return {
      body: (
        <Box>
          <BodyText size="small">Here’s what I can do here:</BodyText>
          <ul style={{ margin: '6px 0 0 18px', fontSize: 13, color: colors.blackPepper600, lineHeight: 1.5 }}>
            <li>"Switch country to Germany" / "to Japan" / "to India"</li>
            <li>"Increase base by 8%" / "Set base to 105000"</li>
            <li>"Model a counter-offer" / "Show market-rate options"</li>
            <li>"Apply balanced recommendation" / "Use competitive"</li>
            <li>"Change start date to June 16th"</li>
            <li>"Draft the offer letter" / "Regenerate the letter"</li>
            <li>"Enable overlap" / "Who’s blocking?" / "Delegate to Ciara"</li>
            <li>"Run QA" / "What’s wrong with the document"</li>
            <li>"Include AI summary" / "Shorten" / "Make more formal"</li>
            <li>"Send the offer" (also the Send button on Step 5)</li>
          </ul>
          <BodyText size="small" style={{ marginTop: 8 }}>
            Every change shows in the right pane. Nothing is sent until you confirm on step 5.
          </BodyText>
        </Box>
      ),
    };
  }

  // Send intent
  if (text.includes('send') && (text.includes('offer') || text.includes('it'))) {
    return {
      body: (
        <BodyText size="small">
          Open <strong>Step 5: Review &amp; send</strong> on the right and confirm the summary. I’ll show you exactly what happens before anything goes out.
        </BodyText>
      ),
    };
  }

  // Out-of-scope decline
  if (text.includes('reject') || text.includes('withdraw') || text.includes('delete') || text.includes('purge')) {
    return {
      body: (
        <BodyText size="small">
          That isn’t something I can do here. To withdraw or reject a candidate, open <strong>{offer.candidate.name}</strong>’s profile.
        </BodyText>
      ),
    };
  }

  // Generic fallback (AI 3-part shape: Problem / Reason / Next steps — per 319)
  return {
    body: (
      <Box>
        <BodyText size="small">
          I didn’t catch that.
        </BodyText>
        <BodyText size="small" style={{ marginTop: 6 }}>
          From this conversation I can only change country, compensation, the start date, or the offer letter draft.
        </BodyText>
        <BodyText size="small" style={{ marginTop: 6 }}>
          Type <strong>"help"</strong> for examples, or use the form on the right.
        </BodyText>
      </Box>
    ),
  };
}

/* ----------------------------------------------------------------------- *\
 * Starter Suggestions — the canonical SSA "↳ prompt" list shown below the
 * agent's welcome message in cold-start. Reference: ov-1800.png. Each pill is
 * a <button> with leading arrowCornerDownRightIcon; "See other suggestions"
 * rotates between sets.
 *
 * Two tiers of starter sets:
 *   - COLD_START_SUGGESTION_SETS: shown on the default SSA home (mode = cold-start).
 *     Generic SSA prompts; only the "Create an offer…" rows transition into the
 *     Offer canvas. Others echo a friendly "not wired up in this prototype" reply.
 *   - SUGGESTION_SETS: shown once the Offer canvas is open (mode = in-task).
 *     Offer-specific intents that already drive the right pane.
\* ----------------------------------------------------------------------- */

const COLD_START_SUGGESTION_SETS: string[][] = [
  [
    'Create an offer for a candidate',
    'Show my team’s open requisitions',
    'What’s the approval status of my requisitions?',
    'Help — what can you do?',
  ],
  [
    'Draft an offer letter for Sarah Chen',
    'Create an offer for JR-12345',
    'Compare medical plan options',
    'What is my time-off balance?',
  ],
];

const SUGGESTION_SETS: string[][] = [
  [
    'Enable overlap',
    'Model a counter-offer',
    'Who’s blocking?',
    'Run QA on the document',
  ],
  [
    'Switch country to Germany',
    'Apply balanced recommendation',
    'Change start date to June 16th',
    'Include AI summary',
  ],
  [
    'Switch country to Japan',
    'Use competitive recommendation',
    'Draft the offer letter',
    'Help — what can you do?',
  ],
];

/* ----------------------------------------------------------------------- *\
 * Stepper (pill-style horizontal, replaces Canvas Tabs to keep state local)
\* ----------------------------------------------------------------------- */

/* ----------------------------------------------------------------------- *\
 * HeaderCard — top-of-pane context card. Pattern: location icon + title +
 * subtitle + close X. Mirrors the canonical SSA reference (Backfill: Portland
 * Overlap / Senior Analyst).
\* ----------------------------------------------------------------------- */

function HeaderCard({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose?: () => void;
}) {
  return (
    <Flex
      alignItems="center"
      gap="s"
      padding="m"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        boxShadow: SANA_CARD_SHADOW,
        marginBottom: 16,
      }}
    >
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <SystemIcon icon={locationIcon} size={18} color={colors.greenery500} />
      </Box>
      <Box flex={1}>
        <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600, fontSize: 15 }}>
          {title}
        </BodyText>
        <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12 }}>
          {subtitle}
        </BodyText>
      </Box>
      <ToolbarIconButton icon={xIcon} aria-label="Close header" onClick={onClose} />
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * ChipStepper — wizard-style stepper rendered as compact pills. WAI-ARIA
 * pattern: `<nav>` + `<ol>` + `aria-current="step"`.
 * Active = dark filled chip with white text; done = green check + label;
 * upcoming = grey label. Matches the canonical SSA reference.
\* ----------------------------------------------------------------------- */

function ChipStepper({
  current,
  completed,
  changedSinceVisited,
  onSelect,
}: {
  current: StepId;
  completed: Set<StepId>;
  /** Steps the agent has mutated via chat that the user hasn't yet re-opened — surfaces a "review" dot. */
  changedSinceVisited: Set<StepId>;
  onSelect: (id: StepId) => void;
}) {
  return (
    <nav aria-label="Create offer steps" style={{ marginBottom: 20 }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 4,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {STEPS.map((s, idx) => {
          const isActive = s.id === current;
          const isDone = completed.has(s.id);
          const isChanged = changedSinceVisited.has(s.id);
          const stateLabel = isActive
            ? 'in progress'
            : isDone
              ? 'done'
              : isChanged
                ? 'updated by Self-Service Agent — review'
                : 'upcoming';
          return (
            <li key={s.id} style={{ margin: 0 }}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${idx + 1} of ${STEPS.length}: ${s.longLabel} (${stateLabel})`}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: isActive ? '5px 12px' : '5px 10px',
                  border: `1px solid ${isActive ? colors.blackPepper600 : colors.soap300}`,
                  borderRadius: SANA_TAB_PILL_RADIUS,
                  backgroundColor: isActive ? colors.blackPepper600 : isDone ? '#E8F8EE' : SANA_SECONDARY_TAB_ACTIVE_BG,
                  color: isActive
                    ? '#FFFFFF'
                    : isDone
                      ? colors.greenery600
                      : SANA_SECONDARY_TAB_ACTIVE_FG,
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13,
                  fontFamily: '"Roboto", sans-serif',
                  cursor: 'pointer',
                  minHeight: 30,
                }}
              >
                {isDone && (
                  <SystemIcon icon={checkCircleIcon} size={14} color={colors.greenery500} />
                )}
                <span>{s.longLabel}</span>
                {isChanged && !isActive && (
                  <span
                    aria-hidden
                    title="Updated by Self-Service Agent — review"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: SANA_LINK_ACCENT,
                    }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ----------------------------------------------------------------------- *\
 * DisplayCard — the canonical "agent pre-filled, user can edit" card.
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │ [icon] LABEL                                  [Edit]   │
 *   │ Value (bold)        [optional inline pills]            │
 *   │ optional sub-info                                       │
 *   │ ── (optional separator)                                  │
 *   │ when isEditing: <renderEditor /> + Save / Cancel        │
 *   └────────────────────────────────────────────────────────┘
 *
 * Ref: SSA Position Confirmation card (REFERENCE-position-confirmation-...png).
\* ----------------------------------------------------------------------- */

function DisplayCard({
  icon,
  label,
  value,
  pills,
  subInfo,
  editable = false,
  isEditing = false,
  onEdit,
  onCancel,
  onSave,
  renderEditor,
  children,
}: {
  icon?: typeof locationIcon;
  label: string;
  value?: React.ReactNode;
  pills?: React.ReactNode;
  subInfo?: React.ReactNode;
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  renderEditor?: () => React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Box
      padding="s"
      paddingLeft="m"
      paddingRight="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex alignItems="center" gap="xxs" marginBottom="xxxs">
        {icon && <SystemIcon icon={icon} size={14} color={SSA_MICRO_LABEL_COLOR} />}
        <BodyText
          as="span"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
          }}
        >
          {label}
        </BodyText>
        <Box flex={1} />
        {editable && !isEditing && (
          <TertiaryButton size="small" icon={editIcon} onClick={onEdit}>
            Edit
          </TertiaryButton>
        )}
      </Flex>
      {!isEditing && (
        <>
          {value !== undefined && (
            <Flex alignItems="center" gap="xs" flexWrap="wrap">
              <BodyText
                as="span"
                size="small"
                style={{ fontSize: 15, fontWeight: 600, color: colors.blackPepper600 }}
              >
                {value}
              </BodyText>
              {pills}
            </Flex>
          )}
          {subInfo && (
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
              {subInfo}
            </BodyText>
          )}
          {children}
        </>
      )}
      {isEditing && renderEditor && (
        <Box marginTop="xxs">
          {renderEditor()}
          <Flex gap="xs" marginTop="s">
            <PrimaryButton size="small" onClick={onSave}>Save</PrimaryButton>
            <SecondaryButton size="small" onClick={onCancel}>Cancel</SecondaryButton>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * ToggleRow — the canonical "agent set this default — here's why, you can
 * override" pattern. Title + info icon + Switch on the right; rationale
 * underneath in subtle blue. Direct match to the "Enable Overlap" row in
 * the SSA Position Confirmation reference frame.
\* ----------------------------------------------------------------------- */

function ToggleRow({
  title,
  rationale,
  on,
  onChange,
  disabled,
}: {
  title: string;
  rationale: string;
  on: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Box
      padding="s"
      paddingLeft="m"
      paddingRight="m"
      style={{
        backgroundColor: on ? colors.blueberry100 : SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${on ? colors.blueberry200 : SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex alignItems="center" gap="xs">
        <BodyText
          as="span"
          size="small"
          style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600 }}
        >
          {title}
        </BodyText>
        <SystemIcon icon={infoIcon} size={14} color={SSA_MICRO_LABEL_COLOR} />
        <Box flex={1} />
        <Switch
          checked={on}
          onChange={(e) => onChange?.((e.target as HTMLInputElement).checked)}
          disabled={disabled}
          aria-label={title}
        />
      </Flex>
      <BodyText
        size="small"
        style={{
          fontSize: 12,
          color: SSA_RATIONALE_COLOR,
          marginTop: 4,
          lineHeight: 1.4,
        }}
      >
        {rationale}
      </BodyText>
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * Idea 1b — ApprovalMap: live per-approver status with OOO + delegate +
 * inline Delegate / Ping actions. Replaces the legacy approver list on step 3
 * and renders read-only on step 5.
 *
 * Source: XO Developer research — BP introspection (`remainingSteps`, `toDo`,
 * `inProgressSteps`) + delegate registry. Mocked here.
\* ----------------------------------------------------------------------- */

function ApprovalMap({
  entries,
  readOnly = false,
  onDelegate,
  onPing,
}: {
  entries: ApproverMapEntry[];
  readOnly?: boolean;
  onDelegate?: (entry: ApproverMapEntry) => void;
  onPing?: (entry: ApproverMapEntry) => void;
}) {
  return (
    <Flex flexDirection="column" gap="xxs">
      {entries.map((a) => {
        const statusLabel: Record<ApproverMapEntry['status'], string> = {
          pending: 'Pending',
          in_progress: 'In progress',
          approved: 'Approved',
          rejected: 'Rejected',
          overdue: 'Overdue',
        };
        const statusType =
          a.status === 'approved'
            ? StatusIndicatorType.Green
            : a.status === 'rejected' || a.status === 'overdue'
              ? StatusIndicatorType.Red
              : a.status === 'in_progress'
                ? StatusIndicatorType.Blue
                : StatusIndicatorType.Orange;
        const microcopy: React.ReactNode[] = [];
        if (a.heldSinceLabel) microcopy.push(<>Held since {a.heldSinceLabel}</>);
        if (a.oooUntil) {
          microcopy.push(
            a.delegate
              ? <>Out of office until {formatHumanDate(a.oooUntil)} · Delegated to {a.delegate.name}</>
              : <>Out of office until {formatHumanDate(a.oooUntil)} · No delegate on file</>
          );
        }
        return (
          <Flex
            key={a.id}
            alignItems="center"
            gap="s"
            padding="s"
            paddingLeft="m"
            paddingRight="m"
            style={{
              backgroundColor: SSA_DISPLAY_CARD_BG,
              borderRadius: SSA_DISPLAY_CARD_RADIUS,
              border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
              flexWrap: 'wrap',
            }}
          >
            <Avatar size={Avatar.Size.s} as="div" />
            <Box flex={1} style={{ minWidth: 220 }}>
              <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600, fontSize: 14 }}>
                {a.name}
              </BodyText>
              <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12 }}>
                {a.role}{a.required ? ' · Required' : ''}
              </BodyText>
              {microcopy.length > 0 && (
                <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
                  {microcopy.map((m, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && ' · '}
                      {m}
                    </React.Fragment>
                  ))}
                </BodyText>
              )}
            </Box>
            <span style={{ display: 'inline-flex' }}>
              <StatusIndicator
                type={statusType}
                emphasis={StatusIndicatorEmphasis.Low}
                label={statusLabel[a.status]}
              />
            </span>
            {!readOnly && (
              <Flex gap="xxs">
                <SecondaryButton size="small" onClick={() => onDelegate?.(a)}>Delegate</SecondaryButton>
                <TertiaryButton size="small" onClick={() => onPing?.(a)}>Ping</TertiaryButton>
              </Flex>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * Idea 2 — DocQaDeck: vertical list of quality-check rows against the
 * structured worksheet + Embedded BI. Collapsed-by-default when all pass;
 * expanded-by-default when any warn or fail present (PASS 4 tweak §2).
 *
 * Source: hrrecruiting/offerWorksheet + Employment-Agreement Embedded BI.
 * Mocked here.
\* ----------------------------------------------------------------------- */

function DocQaDeck({ checks }: { checks: QaCheck[] }) {
  const passes = checks.filter((c) => c.status === 'pass');
  const warns = checks.filter((c) => c.status === 'warn');
  const fails = checks.filter((c) => c.status === 'fail');
  const anyNonPass = warns.length > 0 || fails.length > 0;
  const [expanded, setExpanded] = useState<boolean>(anyNonPass);
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      {fails.length > 0 && (
        <AlertBanner
          type="error"
          message={`I can’t send this offer yet. ${fails.length} check${fails.length === 1 ? '' : 's'} didn’t pass. See the QA deck below.`}
        />
      )}
      <Flex alignItems="center" justifyContent="space-between" marginBottom="xs">
        <Flex alignItems="center" gap="xs">
          <BodyText
            as="span"
            size="small"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: SSA_MICRO_LABEL_COLOR,
            }}
          >
            Quality check
          </BodyText>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator
              type={fails.length > 0 ? StatusIndicatorType.Red : warns.length > 0 ? StatusIndicatorType.Orange : StatusIndicatorType.Green}
              emphasis={StatusIndicatorEmphasis.Low}
              label={
                fails.length > 0
                  ? `${fails.length} blocking`
                  : warns.length > 0
                    ? `${passes.length} of ${checks.length} passed · ${warns.length} worth a look`
                    : `${passes.length} of ${checks.length} passed`
              }
            />
          </span>
        </Flex>
        <TertiaryButton size="small" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Collapse' : 'Expand'}
        </TertiaryButton>
      </Flex>
      <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginBottom: expanded ? 8 : 0 }}>
        I checked the draft against the structured worksheet. {passes.length} of {checks.length} checks passed.
      </BodyText>
      {expanded && (
        <Flex flexDirection="column" gap="xs">
          {checks.map((c) => {
            const statusType =
              c.status === 'pass'
                ? StatusIndicatorType.Green
                : c.status === 'warn'
                  ? StatusIndicatorType.Orange
                  : StatusIndicatorType.Red;
            const statusLabel =
              c.status === 'pass' ? 'Passes' : c.status === 'warn' ? 'Worth a look' : 'Blocks send';
            return (
              <Flex
                key={c.id}
                alignItems="flex-start"
                gap="s"
                padding="s"
                paddingLeft="m"
                paddingRight="m"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
                }}
              >
                <span style={{ display: 'inline-flex', marginTop: 2 }}>
                  <StatusIndicator
                    type={statusType}
                    emphasis={StatusIndicatorEmphasis.Low}
                    label={statusLabel}
                  />
                </span>
                <Box flex={1}>
                  <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600, fontSize: 13 }}>
                    {c.label}
                  </BodyText>
                  <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
                    {c.message}
                  </BodyText>
                </Box>
                {c.evidenceLabel && (
                  <TertiaryButton
                    size="small"
                    aria-label={`${c.label} evidence — ${c.evidenceLabel}`}
                  >
                    Open in Writer
                  </TertiaryButton>
                )}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * Idea 3 — CollectiveAgreementCard: DE-only on-glass read of
 * Pre_Hire_Collective_Agreement_Data. Required-acknowledgement checkbox
 * gates Continue.
 *
 * Source: Pre_Hire_Collective_Agreement_Data (DE). Mocked here.
\* ----------------------------------------------------------------------- */

function CollectiveAgreementCard({
  agreement,
  onToggleAcknowledge,
}: {
  agreement: CollectiveAgreement;
  onToggleAcknowledge: (next: boolean) => void;
}) {
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${agreement.acknowledged ? colors.greenery200 : SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex alignItems="center" gap="xs" marginBottom="xxs">
        <SystemIcon icon={globeIcon} size={14} color={SSA_MICRO_LABEL_COLOR} />
        <BodyText
          as="span"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
          }}
        >
          Collective agreement (Germany)
        </BodyText>
      </Flex>
      <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginBottom: 10 }}>
        I’m reading these from your tenant’s Pre-Hire Collective Agreement record. They’re authoritative — edit the
        source record in Setup to change them.
      </BodyText>
      <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <CompField label="Wage group" value={agreement.wageGroup} />
        <CompField label="Collective agreement" value={agreement.agreementName} />
        <CompField label="Works council" value={agreement.worksCouncilLabel} />
      </Box>
      <Box
        padding="s"
        paddingLeft="m"
        paddingRight="m"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          border: `1px solid ${agreement.acknowledged ? colors.greenery200 : SSA_DISPLAY_CARD_BORDER}`,
        }}
      >
        <Flex alignItems="flex-start" gap="s">
          <input
            type="checkbox"
            id="collective-agreement-ack"
            checked={agreement.acknowledged}
            onChange={(e) => onToggleAcknowledge(e.target.checked)}
            style={{ marginTop: 4, width: 18, height: 18 }}
          />
          <Box flex={1}>
            <label
              htmlFor="collective-agreement-ack"
              style={{ fontSize: 13, fontWeight: 600, color: colors.blackPepper600, cursor: 'pointer' }}
            >
              I’ve reviewed the collective-agreement terms with the candidate or will before Send.
            </label>
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
              This is your tenant’s works-council compliance gate. Continue is locked until you tick it.
            </BodyText>
          </Box>
        </Flex>
      </Box>
      <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 11, marginTop: 10 }}>
        Sourced from Pre-Hire Collective Agreement record <strong>{agreement.id}</strong>.
      </BodyText>
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * Idea 4 — ApproverPacketPreview: what approvers will see in their Workday
 * inbox. Switch toggles AI summary (disabled when tenant forbids). Collapsible
 * sections per packet part. Citation chips are focusable buttons with
 * aria-label (PASS 4 tweak §4).
 *
 * TODO 060 — AI approver-summary disclosure: confirm GDPR retention posture
 * for AI-generated approver-facing text + tenant-level AI-summary toggle.
\* ----------------------------------------------------------------------- */

function ApproverPacketPreview({
  sections,
  includeAiSummary,
  tenantAllowsAiSummary,
  tone,
  onToggleAiSummary,
  selectedScenario,
  summaryContext,
}: {
  sections: PacketSection[];
  includeAiSummary: boolean;
  tenantAllowsAiSummary: boolean;
  tone: OfferState['aiSummaryTone'];
  onToggleAiSummary: (next: boolean) => void;
  selectedScenario: CounterOfferScenario;
  summaryContext: {
    candidateName: string;
    roleTitle: string;
    location: string;
    base: number;
    currency: string;
    bonusTargetPct: number;
    equityUnits: number;
    startDate: string;
  };
}) {
  const summaryBody = renderAiSummaryByTone(tone, summaryContext);
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex alignItems="center" gap="xs" marginBottom="xxs">
        <SystemIcon icon={userIcon} size={14} color={SSA_MICRO_LABEL_COLOR} />
        <BodyText
          as="span"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
          }}
        >
          What approvers will see
        </BodyText>
      </Flex>
      <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginBottom: 10 }}>
        A live preview of the packet each approver will open in their Workday inbox.
      </BodyText>

      <Box
        padding="s"
        paddingLeft="m"
        paddingRight="m"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
          marginBottom: 10,
        }}
      >
        <Flex alignItems="center" gap="s">
          <Box flex={1}>
            <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600, fontSize: 13 }}>
              Include AI summary in approver notification
            </BodyText>
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
              {!tenantAllowsAiSummary
                ? 'Your tenant doesn’t allow AI summaries in approver notifications. Approvers will see the packet only.'
                : includeAiSummary
                  ? 'Approvers will see a concise, cited AI summary with links back to source data. You can tune the tone.'
                  : 'Approvers will see the packet only. No AI-generated text goes to them.'}
            </BodyText>
          </Box>
          <Switch
            checked={includeAiSummary && tenantAllowsAiSummary}
            disabled={!tenantAllowsAiSummary}
            onChange={(e) => onToggleAiSummary((e.target as HTMLInputElement).checked)}
            aria-label="Include AI summary in approver notification"
          />
        </Flex>
        {includeAiSummary && tenantAllowsAiSummary && (
          <Box marginTop="s">
            <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13, lineHeight: 1.55 }}>
              {summaryBody}
            </BodyText>
            <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13, lineHeight: 1.55, marginTop: 6 }}>
              Counter-offer profile used: <strong>{selectedScenario.label}</strong>. {selectedScenario.approvalImpact}
            </BodyText>
            <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13, lineHeight: 1.55, marginTop: 6 }}>
              Approval recommendation is advisory. It cites the offer worksheet, pay band, scorecard, and market model so
              each approver can verify the source before acting.
            </BodyText>
            <Flex gap="xxs" flexWrap="wrap" marginTop="xs">
              {ALL_SUMMARY_CITATIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-label={`${c.label} evidence — ${c.tooltip}`}
                  title={c.tooltip}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: colors.blueberry100,
                    color: colors.blueberry500,
                    border: `1px solid ${colors.blueberry200}`,
                    fontSize: 12,
                    fontFamily: '"Roboto", sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                  <span aria-hidden style={{ fontSize: 11 }}>↗</span>
                </button>
              ))}
            </Flex>
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>
              Generated with Workday AI. Every number is a live link back to the source data. You can tune the tone in
              chat.
            </BodyText>
          </Box>
        )}
      </Box>

      <Flex flexDirection="column" gap="xxs">
        {sections.map((s) => (
          <Box
            key={s.id}
            padding="s"
            paddingLeft="m"
            paddingRight="m"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
            }}
          >
            <CollapsibleSection title={s.title} defaultOpen={false}>
              <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13, lineHeight: 1.5 }}>
                {s.body}
              </BodyText>
              {s.compRestricted && (
                <Box marginTop="xs">
                  <span style={{ display: 'inline-flex' }}>
                    <StatusIndicator
                      type={StatusIndicatorType.Gray}
                      emphasis={StatusIndicatorEmphasis.Low}
                      label="Comp data not shared with this approver"
                    />
                  </span>
                </Box>
              )}
              {s.citations.length > 0 && (
                <Flex gap="xxs" flexWrap="wrap" marginTop="xs">
                  {s.citations.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      aria-label={`${c.label} evidence — ${c.tooltip}`}
                      title={c.tooltip}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: colors.soap200,
                        color: colors.blackPepper500,
                        border: `1px solid ${colors.soap300}`,
                        fontSize: 12,
                        fontFamily: '"Roboto", sans-serif',
                        cursor: 'pointer',
                      }}
                    >
                      {c.label}
                      <span aria-hidden style={{ fontSize: 11 }}>↗</span>
                    </button>
                  ))}
                </Flex>
              )}
            </CollapsibleSection>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

function renderAiSummaryByTone(
  tone: OfferState['aiSummaryTone'],
  ctx: {
    candidateName: string;
    roleTitle: string;
    location: string;
    base: number;
    currency: string;
    bonusTargetPct: number;
    equityUnits: number;
    startDate: string;
  }
): string {
  const base = formatMoney(ctx.base, ctx.currency);
  const equity = ctx.equityUnits.toLocaleString();
  const start = formatHumanDate(ctx.startDate);

  if (tone === 'shorter') {
    return `${ctx.candidateName} — ${ctx.roleTitle}, ${ctx.location}. ${base} base · ${ctx.bonusTargetPct}% bonus · ${equity} RSUs. Starts ${start}.`;
  }

  if (tone === 'formal') {
    return `We are extending an offer of employment to ${ctx.candidateName} for the position of ${ctx.roleTitle} in ${ctx.location}. Base salary is ${base}, bonus target is ${ctx.bonusTargetPct}%, and equity is ${equity} RSUs. The proposed start date is ${start}.`;
  }

  if (tone === 'plain') {
    return `${ctx.candidateName} gets the ${ctx.roleTitle} role in ${ctx.location}. ${base} base, ${ctx.bonusTargetPct}% bonus, ${equity} shares. Starts ${start}.`;
  }

  return `${ctx.candidateName} is offered ${ctx.roleTitle} in ${ctx.location} at ${base} base, ${ctx.bonusTargetPct}% bonus target, and ${equity} RSUs. Proposed start date: ${start}.`;
}

const ALL_SUMMARY_CITATIONS: Citation[] = [
  { id: 's-band', label: 'Pay band', tooltip: 'Source: Senior PM IE — Band 4. Opens in a new tab.' },
  { id: 's-scorecard', label: 'Scorecard', tooltip: 'Source: interview scorecard summary.' },
  { id: 's-worksheet', label: 'Offer worksheet', tooltip: 'Source: hrrecruiting/offerWorksheet for JR-12345.' },
  { id: 's-market', label: 'Market model', tooltip: 'Source: internal peer context model; external benchmark feed is phase-2.' },
];

/* ----------------------------------------------------------------------- *\
 * Step panels (right pane content) — display-by-default with inline edit.
\* ----------------------------------------------------------------------- */

function StepIntro({ children }: { children: React.ReactNode }) {
  return (
    <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ marginBottom: 12 }}>
      {children}
    </BodyText>
  );
}

function CandidateAndReqStep({
  offer,
  setOffer,
  editingCard,
  onEditCard,
  onCancelEdit,
}: {
  offer: OfferState;
  setOffer: React.Dispatch<React.SetStateAction<OfferState>>;
  editingCard: string | null;
  onEditCard: (id: string) => void;
  onCancelEdit: () => void;
}) {
  const [draftHM, setDraftHM] = useState(offer.hiringManager);
  const [draftLoc, setDraftLoc] = useState(offer.workLocation);

  return (
    <>
      <StepIntro>
        Pre-filled from requisition {offer.req.id}. Edit a card or tell me what to change in chat.
      </StepIntro>
      <DisplayCard
        icon={userIcon}
        label="Candidate"
        value={offer.candidate.name}
        subInfo={offer.candidate.email}
      />
      <DisplayCard
        icon={documentIcon}
        label="Requisition"
        value={`${offer.req.id} · ${offer.req.title}`}
        pills={
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label={offer.req.level} />
          </span>
        }
        subInfo={offer.req.location}
      />
      <DisplayCard
        icon={userIcon}
        label="Hiring manager"
        value={offer.hiringManager}
        subInfo="Auto-routed for approval — you can delegate on step 3."
        editable
        isEditing={editingCard === 'hiring-manager'}
        onEdit={() => {
          setDraftHM(offer.hiringManager);
          onEditCard('hiring-manager');
        }}
        onCancel={onCancelEdit}
        onSave={() => {
          setOffer((p) => {
            const nextOffer = { ...p, hiringManager: draftHM };
            return { ...nextOffer, draftedLetter: SAMPLE_LETTER_BODY(nextOffer) };
          });
          onCancelEdit();
        }}
        renderEditor={() => (
          <FormTextInput
            id="hm"
            label="Hiring manager"
            value={draftHM}
            onChange={setDraftHM}
            placeholder="e.g. Aoife Murphy"
          />
        )}
      />
      <DisplayCard
        icon={locationIcon}
        label="Work location"
        value={offer.workLocation}
        subInfo="Determines country-specific requirements (Japan, Germany, India, EU pay transparency)."
        editable
        isEditing={editingCard === 'work-location'}
        onEdit={() => {
          setDraftLoc(offer.workLocation);
          onEditCard('work-location');
        }}
        onCancel={onCancelEdit}
        onSave={() => {
          setOffer((p) => {
            const nextOffer = { ...p, workLocation: draftLoc };
            return { ...nextOffer, draftedLetter: SAMPLE_LETTER_BODY(nextOffer) };
          });
          onCancelEdit();
        }}
        renderEditor={() => (
          <FormTextInput
            id="wloc"
            label="Work location"
            value={draftLoc}
            onChange={setDraftLoc}
            placeholder="e.g. Dublin, Ireland"
          />
        )}
      />

      {/* Idea 1a — Overlap-aware confirmation card */}
      {offer.overlapIncumbent && (
        <>
          <ToggleRow
            title="Overlap with outgoing employee"
            on={offer.overlapEnabled}
            rationale={
              offer.overlapEnabled
                ? `${offer.candidate.name} starts ${formatHumanDate(offer.startDate)}; ${offer.overlapIncumbent.name} leaves ${formatHumanDate(offer.overlapIncumbent.leaveDate)}. Overlap keeps the team covered through the handover. No net change to headcount budget.`
                : `An overlap lets ${offer.candidate.name} start before ${offer.overlapIncumbent.name} leaves.`
            }
            onChange={(next) => setOffer((p) => ({ ...p, overlapEnabled: next }))}
          />
          {offer.overlapEnabled &&
            offer.overlapPositionControl &&
            offer.overlapPositionControl.used >= offer.overlapPositionControl.cap && (
              <AlertBanner
                type="warning"
                message={`Overlap would put ${offer.overlapPositionControl.costCentre} at ${offer.overlapPositionControl.used + 1} of ${offer.overlapPositionControl.cap} positions. HRBP approval is required to overlap.`}
                actionText="Add HRBP approval"
                onClick={() => {
                  setOffer((p) => ({
                    ...p,
                    approvalMap: p.approvalMap.map((a) =>
                      a.id === 'a3' ? { ...a, required: true } : a
                    ),
                  }));
                }}
              />
            )}
        </>
      )}
    </>
  );
}

function CompensationStep({
  offer,
  setOffer,
  editingCard,
  onEditCard,
  onCancelEdit,
}: {
  offer: OfferState;
  setOffer: React.Dispatch<React.SetStateAction<OfferState>>;
  editingCard: string | null;
  onEditCard: (id: string) => void;
  onCancelEdit: () => void;
}) {
  const bs = bandStatus(offer.base, offer.band);
  const scenarios = buildCounterOfferScenarios(offer);
  const selectedScenario =
    scenarios.find((s) => s.profile === offer.selectedCounterOfferProfile) ??
    scenarios.find((s) => s.profile === 'balanced') ??
    scenarios[0];
  const [draftBase, setDraftBase] = useState(String(offer.base));
  const [draftBonus, setDraftBonus] = useState(String(offer.bonusTargetPct));
  const [draftEquity, setDraftEquity] = useState(String(offer.equityUnits));
  const [draftSignOn, setDraftSignOn] = useState(String(offer.signOn));
  const [draftCcy, setDraftCcy] = useState(offer.currency);
  const totalY1 = offer.base + Math.round((offer.base * offer.bonusTargetPct) / 100) + offer.signOn;

  const applyScenario = (scenario: CounterOfferScenario) => {
    setOffer((prev) => ({
      ...applyCompensationPackage(prev, {
        base: scenario.base,
        bonusTargetPct: scenario.bonusTargetPct,
        equityUnits: scenario.equityUnits,
        signOn: scenario.signOn,
        currency: prev.currency,
      }),
      selectedCounterOfferProfile: scenario.profile,
    }));
  };

  return (
    <>
      <StepIntro>
        Pre-filled from the requisition and pay band {offer.band.name}. I’ll flag values outside policy.
      </StepIntro>

      <DisplayCard
        icon={dollarIcon}
        label="Compensation"
        editable
        isEditing={editingCard === 'compensation'}
        onEdit={() => {
          setDraftBase(String(offer.base));
          setDraftBonus(String(offer.bonusTargetPct));
          setDraftEquity(String(offer.equityUnits));
          setDraftSignOn(String(offer.signOn));
          setDraftCcy(offer.currency);
          onEditCard('compensation');
        }}
        onCancel={onCancelEdit}
        onSave={() => {
          const next = (s: string, fb: number) => {
            const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
            return Number.isFinite(n) ? n : fb;
          };
          setOffer((p) =>
            ({
              ...applyCompensationPackage(p, {
                base: next(draftBase, p.base),
                bonusTargetPct: next(draftBonus, p.bonusTargetPct),
                equityUnits: next(draftEquity, p.equityUnits),
                signOn: next(draftSignOn, p.signOn),
                currency: draftCcy,
              }),
              selectedCounterOfferProfile: 'balanced',
            })
          );
          onCancelEdit();
        }}
        renderEditor={() => (
          <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormSelect
              id="currency"
              label="Currency"
              value={draftCcy}
              onChange={setDraftCcy}
              options={[
                { value: 'EUR', label: 'EUR — Euro' },
                { value: 'GBP', label: 'GBP — Pound sterling' },
                { value: 'USD', label: 'USD — US dollar' },
                { value: 'JPY', label: 'JPY — Japanese yen' },
                { value: 'INR', label: 'INR — Indian rupee' },
              ]}
            />
            <FormTextInput id="base" label="Base salary" value={draftBase} onChange={setDraftBase} />
            <FormTextInput id="bonus" label="Bonus target (%)" value={draftBonus} onChange={setDraftBonus} />
            <FormTextInput id="equity" label="Equity (RSU units)" value={draftEquity} onChange={setDraftEquity} />
            <FormTextInput id="signon" label="Sign-on bonus" value={draftSignOn} onChange={setDraftSignOn} />
          </Box>
        )}
      >
        {/* Compensation summary grid (visible when not editing) */}
        <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
          <CompField label="Base salary" value={formatMoney(offer.base, offer.currency)} sub="Annual" />
          <CompField label="Bonus target" value={`${offer.bonusTargetPct}%`} sub="Of base, paid annually" />
          <CompField label="Equity (RSU)" value={`${offer.equityUnits.toLocaleString()} units`} sub="Vests over 4 years" />
          <CompField label="Sign-on" value={offer.signOn ? formatMoney(offer.signOn, offer.currency) : '—'} sub={offer.signOn ? 'One-time' : 'None'} />
          <CompField label="Total cash (year 1)" value={formatMoney(totalY1, offer.currency)} sub="Excludes equity" />
          <CompField
            label="Pay band"
            value={`${formatMoney(offer.band.min, offer.currency)} – ${formatMoney(offer.band.max, offer.currency)}`}
            sub={offer.band.name}
          />
        </Box>
        <Flex marginTop="s" flexWrap="wrap" gap="xxs">
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label="Base salary" />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label={`Annual bonus ${offer.bonusTargetPct}%`} />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label="RSU eligible" />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label="Benefits (med/dental/vision)" />
          </span>
        </Flex>
      </DisplayCard>

      <ToggleRow
        title="Pay-band check"
        on={true}
        rationale={
          bs.withinBand
            ? `Base ${formatMoney(offer.base, offer.currency)} is within band — no Comp Partner approval needed.`
            : `Base ${formatMoney(offer.base, offer.currency)} is ${Math.abs(bs.deltaPct)}% ${bs.deltaPct > 0 ? 'above' : 'below'} band midpoint. Comp Partner approval has been added on step 3.`
        }
      />

      <details
        style={{
          marginBottom: 8,
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            listStyle: 'none',
            fontFamily: '"Roboto", sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: SANA_LINK_ACCENT,
            margin: '8px 0',
          }}
        >
          Compare recommendation options
        </summary>
        <Box
        padding="m"
        style={{
          backgroundColor: SSA_DISPLAY_CARD_BG,
          borderRadius: SSA_DISPLAY_CARD_RADIUS,
          border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
          marginBottom: 8,
        }}
      >
        <Flex alignItems="center" justifyContent="space-between" marginBottom="xxs">
          <Box>
            <BodyText
              as="div"
              size="small"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                color: SSA_MICRO_LABEL_COLOR,
              }}
            >
              Counter-offer model
            </BodyText>
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 4 }}>
              Non-binding, explainable recommendation based on internal pay band and peer context.
            </BodyText>
          </Box>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator
              type={StatusIndicatorType.Gray}
              emphasis={StatusIndicatorEmphasis.Low}
              label="External market feed: planned (phase 2)"
            />
          </span>
        </Flex>

        <Flex flexDirection="column" gap="xs" marginTop="xs">
          {scenarios.map((s) => {
            const isSelected = s.profile === offer.selectedCounterOfferProfile;
            const optionYear1 = s.base + Math.round((s.base * s.bonusTargetPct) / 100) + s.signOn;
            return (
              <Box
                key={s.profile}
                padding="s"
                paddingLeft="m"
                paddingRight="m"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: `1px solid ${isSelected ? colors.blueberry300 : SSA_DISPLAY_CARD_BORDER}`,
                }}
              >
                <Flex justifyContent="space-between" alignItems="flex-start" gap="s">
                  <Box flex={1}>
                    <Flex alignItems="center" gap="xxs" flexWrap="wrap">
                      <BodyText size="small" style={{ fontWeight: 700, fontSize: 13, color: colors.blackPepper600 }}>
                        {s.label}
                      </BodyText>
                      <span style={{ display: 'inline-flex' }}>
                        <StatusIndicator
                          type={StatusIndicatorType.Gray}
                          emphasis={StatusIndicatorEmphasis.Low}
                          label={`Confidence: ${s.confidence}`}
                        />
                      </span>
                      {isSelected && (
                        <span style={{ display: 'inline-flex' }}>
                          <StatusIndicator
                            type={StatusIndicatorType.Blue}
                            emphasis={StatusIndicatorEmphasis.Low}
                            label="Selected"
                          />
                        </span>
                      )}
                    </Flex>
                    <BodyText size="small" style={{ marginTop: 6, fontSize: 13 }}>
                      Base <strong>{formatMoney(s.base, offer.currency)}</strong> · Bonus <strong>{s.bonusTargetPct}%</strong> · Equity{' '}
                      <strong>{s.equityUnits.toLocaleString()} RSUs</strong> · Sign-on <strong>{formatMoney(s.signOn, offer.currency)}</strong>
                    </BodyText>
                    <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ marginTop: 4, fontSize: 12 }}>
                      Year 1 cash: {formatMoney(optionYear1, offer.currency)} · {s.approvalImpact}
                    </BodyText>
                    <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ marginTop: 4, fontSize: 12 }}>
                      {s.marketAnchor}
                    </BodyText>
                    <ul style={{ margin: '6px 0 0 18px', paddingLeft: 0, fontSize: 12, color: colors.blackPepper500, lineHeight: 1.5 }}>
                      {s.rationale.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </Box>
                  <SecondaryButton size="small" onClick={() => applyScenario(s)}>
                    Apply
                  </SecondaryButton>
                </Flex>
              </Box>
            );
          })}
        </Flex>

        <BodyText size="small" color={SANA_SECONDARY_TAB_INACTIVE_FG} style={{ marginTop: 10, fontStyle: 'italic', fontSize: 11 }}>
          Advisory recommendation only. Recruiter remains the decision owner and can override any value.
        </BodyText>
        </Box>
      </details>

      <ToggleRow
        title="Selected recommendation summary"
        on={true}
        rationale={`${selectedScenario.label}: ${selectedScenario.approvalImpact} Confidence ${selectedScenario.confidence}.`}
      />
    </>
  );
}

/** Compact label/value cell used inside the Compensation summary grid. */
function CompField({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <Box>
      <BodyText
        as="div"
        size="small"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: SSA_MICRO_LABEL_COLOR,
          marginBottom: 2,
        }}
      >
        {label}
      </BodyText>
      <BodyText as="div" size="small" style={{ fontSize: 14, fontWeight: 600, color: colors.blackPepper600 }}>
        {value}
      </BodyText>
      {sub && (
        <BodyText as="div" size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 11, marginTop: 1 }}>
          {sub}
        </BodyText>
      )}
    </Box>
  );
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

function extractDynamicFieldHealth(html: string): DynamicFieldHealth[] {
  const resolved = new Map<string, string>();
  const pattern = /<span[^>]*data-crf="([^"]+)"[^>]*>(.*?)<\/span>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    resolved.set(match[1], stripHtml(match[2]));
  }

  return REQUIRED_DYNAMIC_FIELDS.map((label) => {
    const value = resolved.get(label) ?? '';
    return {
      label,
      value,
      status: value ? 'resolved' : 'missing',
      source: dynamicFieldSource(label),
    };
  });
}

function dynamicFieldSource(label: string): string {
  if (['Candidate name'].includes(label)) return 'Candidate profile';
  if (['Job title', 'Work location'].includes(label)) return 'Requisition';
  if (['Hiring manager'].includes(label)) return 'Business process';
  if (['Admin template'].includes(label)) return 'Tenant template registry';
  if (['Start date'].includes(label)) return 'Offer worksheet';
  return 'Compensation worksheet';
}

function buildApprovalConditions(offer: OfferState): ApprovalCondition[] {
  const bs = bandStatus(offer.base, offer.band);
  return [
    {
      label: 'Hiring manager approval',
      status: 'triggered',
      reason: `${offer.hiringManager} is the requisition owner for ${offer.req.id}.`,
    },
    {
      label: 'TA Director approval',
      status: 'triggered',
      reason: 'Required by the tenant offer policy for senior product roles.',
    },
    {
      label: 'Comp Partner review',
      status: bs.withinBand ? 'skipped' : 'triggered',
      reason: bs.withinBand
        ? `Base salary is within ${offer.band.name}.`
        : `Base salary is ${Math.abs(bs.deltaPct)}% ${bs.deltaPct > 0 ? 'above' : 'below'} band midpoint.`,
    },
    {
      label: 'Country / legal review',
      status: offer.worksCouncilRequired || offer.twoStepCountry || offer.aadhaarESign ? 'triggered' : 'skipped',
      reason: offer.worksCouncilRequired
        ? 'Germany works-council acknowledgement is required.'
        : offer.twoStepCountry
          ? 'Japan two-step offer flow is required.'
          : offer.aadhaarESign
            ? 'India Aadhaar / Adobe Sign e-signature is required.'
            : `${COUNTRY_LABELS[offer.country]} uses the standard permanent-salaried flow.`,
    },
  ];
}

function buildReadinessItems(offer: OfferState, dynamicFields: DynamicFieldHealth[]) {
  const fails = offer.docQaChecks.filter((c) => c.status === 'fail').length;
  const warns = offer.docQaChecks.filter((c) => c.status === 'warn').length;
  const missingFields = dynamicFields.filter((f) => f.status === 'missing').length;
  const approvalConditions = buildApprovalConditions(offer);
  const triggeredApprovals = approvalConditions.filter((c) => c.status === 'triggered').length;

  return [
    { label: 'Template fit passed', type: StatusIndicatorType.Green },
    {
      label: missingFields ? `${missingFields} CRF missing` : 'CRFs complete',
      type: missingFields ? StatusIndicatorType.Red : StatusIndicatorType.Green,
    },
    {
      label: fails ? `${fails} QA blocking` : warns ? `${warns} QA warning` : 'QA passed',
      type: fails ? StatusIndicatorType.Red : warns ? StatusIndicatorType.Orange : StatusIndicatorType.Green,
    },
    { label: `${triggeredApprovals} approvals triggered`, type: StatusIndicatorType.Blue },
    { label: 'Comp access scoped', type: StatusIndicatorType.Gray },
    { label: 'Candidate preview ready', type: StatusIndicatorType.Green },
  ];
}

function StatusChip({ label, type }: { label: string; type: StatusIndicatorType }) {
  return (
    <span style={{ display: 'inline-flex' }}>
      <StatusIndicator type={type} emphasis={StatusIndicatorEmphasis.Low} label={label} />
    </span>
  );
}

function OfferReadinessStrip({ offer, dynamicFields }: { offer: OfferState; dynamicFields: DynamicFieldHealth[] }) {
  return (
    <Box
      padding="s"
      paddingLeft="m"
      paddingRight="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 10,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" gap="s" flexWrap="wrap">
        <BodyText
          as="div"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
          }}
        >
          Offer readiness
        </BodyText>
        <Flex gap="xxs" flexWrap="wrap">
          {buildReadinessItems(offer, dynamicFields).map((item) => (
            <StatusChip key={item.label} label={item.label} type={item.type} />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}

function ApprovalConditionExplainer({ offer, compact = false }: { offer: OfferState; compact?: boolean }) {
  const conditions = buildApprovalConditions(offer);
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: compact ? '#FFFFFF' : SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" gap="s" marginBottom="xs" flexWrap="wrap">
        <Box>
          <BodyText
            as="div"
            size="small"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: SSA_MICRO_LABEL_COLOR,
            }}
          >
            Approval logic
          </BodyText>
          <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 3 }}>
            Conditions are visible before send, including skipped steps.
          </BodyText>
        </Box>
      </Flex>
      <Flex flexDirection="column" gap="xxs">
        {conditions.map((condition) => (
          <Flex
            key={condition.label}
            alignItems="flex-start"
            gap="s"
            padding="s"
            paddingLeft="m"
            paddingRight="m"
            style={{
              backgroundColor: compact ? SSA_DISPLAY_CARD_BG : '#FFFFFF',
              borderRadius: 10,
              border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
            }}
          >
            <StatusChip
              label={condition.status === 'triggered' ? 'Triggered' : 'Skipped'}
              type={condition.status === 'triggered' ? StatusIndicatorType.Blue : StatusIndicatorType.Gray}
            />
            <Box flex={1}>
              <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600, fontSize: 13 }}>
                {condition.label}
              </BodyText>
              <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 2 }}>
                {condition.reason}
              </BodyText>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

function DynamicFieldHealthPanel({ fields }: { fields: DynamicFieldHealth[] }) {
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <BodyText
        as="div"
        size="small"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: SSA_MICRO_LABEL_COLOR,
          marginBottom: 8,
        }}
      >
        Dynamic field health
      </BodyText>
      <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {fields.map((field) => (
          <Box
            key={field.label}
            padding="s"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              border: `1px solid ${field.status === 'resolved' ? colors.greenery200 : colors.cinnamon300}`,
            }}
          >
            <Flex justifyContent="space-between" alignItems="center" gap="xs">
              <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600, fontSize: 13 }}>
                {field.label}
              </BodyText>
              <StatusChip
                label={field.status === 'resolved' ? 'Resolved' : 'Missing'}
                type={field.status === 'resolved' ? StatusIndicatorType.Green : StatusIndicatorType.Red}
              />
            </Flex>
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 3 }}>
              {field.value || 'No value found'} · {field.source}
            </BodyText>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function TemplateEligibilityCard({ offer }: { offer: OfferState }) {
  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex justifyContent="space-between" gap="s" flexWrap="wrap">
        <Box flex={1} style={{ minWidth: 240 }}>
          <BodyText
            as="div"
            size="small"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: SSA_MICRO_LABEL_COLOR,
              marginBottom: 4,
            }}
          >
            Template eligibility
          </BodyText>
          <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600 }}>
            {offer.letterTemplate}
          </BodyText>
          <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 4 }}>
            Selected because this is a {COUNTRY_LABELS[offer.country]}, {offer.req.level}, permanent salaried offer.
          </BodyText>
        </Box>
        <Flex gap="xxs" flexWrap="wrap">
          <StatusChip label="Current approved template" type={StatusIndicatorType.Green} />
          <StatusChip label="Locked clauses protected" type={StatusIndicatorType.Gray} />
          <StatusChip label="Other regions hidden" type={StatusIndicatorType.Gray} />
        </Flex>
      </Flex>
    </Box>
  );
}

function OfferLetterPreview({
  offer,
  html,
  variant,
}: {
  offer: OfferState;
  html: string;
  variant: 'candidate' | 'recruiter';
}) {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        boxShadow: SANA_CARD_SHADOW,
        marginBottom: 8,
        overflow: 'hidden',
      }}
    >
      <Box
        padding="l"
        style={{
          background: 'linear-gradient(135deg, #F7FBFF 0%, #FFFFFF 54%, #EEF6FA 100%)',
          borderBottom: `1px solid ${colors.soap300}`,
        }}
      >
        <Flex justifyContent="space-between" alignItems="flex-start" gap="m">
          <Flex alignItems="center" gap="s">
            <WorkdayWMark size={42} />
            <Box>
              <Heading size="small" style={{ margin: 0, color: colors.blackPepper600 }}>
                Offer of employment
              </Heading>
              <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 3 }}>
                {offer.req.title} · {offer.workLocation}
              </BodyText>
            </Box>
          </Flex>
          <Flex gap="xxs" flexWrap="wrap" justifyContent="flex-end">
            <StatusChip label="Workday branded" type={StatusIndicatorType.Blue} />
            <StatusChip label={variant === 'candidate' ? 'Candidate view' : 'Recruiter view'} type={StatusIndicatorType.Gray} />
          </Flex>
        </Flex>
        <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 18 }}>
          <CompField label="Candidate" value={offer.candidate.name} sub={offer.candidate.email} />
          <CompField label="Start date" value={formatHumanDate(offer.startDate)} sub={offer.startDatePayrollSafe ? 'Payroll-safe' : 'Review payroll'} />
          <CompField label="Template" value={offer.letterTemplate} sub="Admin configured" />
        </Box>
      </Box>
      <Box
        padding="xl"
        style={{
          maxHeight: 520,
          overflowY: 'auto',
          fontFamily: '"Roboto", sans-serif',
          fontSize: 14,
          lineHeight: 1.7,
          color: colors.blackPepper600,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Box>
      <BodyText
        as="div"
        size="small"
        color={SANA_SECONDARY_TAB_INACTIVE_FG}
        style={{ fontStyle: 'italic', fontSize: 12, padding: '0 24px 20px' }}
      >
        Generated with Workday AI from an admin template. Legal and compensation clauses remain controlled by your template and worksheet.
      </BodyText>
    </Box>
  );
}

function CountryAndApproversStep({
  offer,
  setOffer,
}: {
  offer: OfferState;
  setOffer: React.Dispatch<React.SetStateAction<OfferState>>;
}) {
  const flowLabel = offer.twoStepCountry
    ? 'Two-step (Japan)'
    : offer.worksCouncilRequired
      ? 'Works council (Germany)'
      : offer.aadhaarESign
        ? 'Aadhaar / Adobe Sign (India)'
        : 'Standard';
  return (
    <>
      <StepIntro>
        Country requirements are based on work location. Tell me in chat to switch countries.
      </StepIntro>

      <DisplayCard
        icon={globeIcon}
        label="Country"
        value={COUNTRY_LABELS[offer.country]}
        pills={
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label={flowLabel} />
          </span>
        }
      />

      {offer.twoStepCountry && (
        <ToggleRow
          title="Two-step Japan flow"
          on={true}
          rationale="Japan labour-law requires a two-step offer. I've added Local HR as an approver; step 2 issues the final letter on candidate consent."
        />
      )}
      {offer.aadhaarESign && (
        <ToggleRow
          title="Aadhaar / Adobe Sign e-signature"
          on={true}
          rationale="India requires Aadhaar e-signature. The candidate will receive an Aadhaar OTP after you send."
        />
      )}

      {/* Idea 3 — DE Collective-Agreement card (only when country === 'DE') */}
      {offer.country === 'DE' && offer.collectiveAgreement && (
        <CollectiveAgreementCard
          agreement={offer.collectiveAgreement}
          onToggleAcknowledge={(next) =>
            setOffer((p) =>
              p.collectiveAgreement
                ? { ...p, collectiveAgreement: { ...p.collectiveAgreement, acknowledged: next } }
                : p
            )
          }
        />
      )}

      {/* Idea 1b — Live approval map (replaces legacy approver list) */}
      <Box marginTop="m" marginBottom="xxs">
        <BodyText
          as="div"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
            marginBottom: 6,
          }}
        >
          Approval map
        </BodyText>
        <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginBottom: 8 }}>
          Live status from the business process. I’ll ping or delegate when you tell me to.
        </BodyText>
      </Box>
      <ApprovalMap
        entries={offer.approvalMap}
        onDelegate={(entry) =>
          setOffer((p) => ({
            ...p,
            approvalMap: p.approvalMap.map((a) =>
              a.id === entry.id
                ? {
                    ...a,
                    status: 'in_progress',
                    heldSinceLabel: 'just now',
                    delegate: a.delegate ?? { name: 'Ciara Flaherty', role: 'Engineering Director' },
                  }
                : a
            ),
          }))
        }
        onPing={() => {
          /* Demo: no-op; the agent narrates a confirmation via chat intent. */
        }}
      />
      <Box marginTop="xs">
        <TertiaryButton
          onClick={() =>
            setOffer((prev) => ({
              ...prev,
              approvalMap: [
                ...prev.approvalMap,
                {
                  id: `a-extra-${prev.approvalMap.length}`,
                  name: 'Extra approver (you to choose)',
                  role: 'Optional',
                  status: 'pending',
                  required: false,
                },
              ],
            }))
          }
        >
          + Add an extra approver
        </TertiaryButton>
      </Box>
    </>
  );
}

function PersonalisationAppliedCard({ offer }: { offer: OfferState }) {
  const sourceChips = [
    'Candidate',
    'Requisition',
    'Compensation',
    'Reporting line',
    'Start date',
    'Country rules',
  ];

  return (
    <Box
      padding="m"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap="s" flexWrap="wrap">
        <Box flex={1} style={{ minWidth: 280 }}>
          <BodyText
            as="div"
            size="small"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: SSA_MICRO_LABEL_COLOR,
              marginBottom: 6,
            }}
          >
            Personalisation applied
          </BodyText>
          <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600 }}>
            Generated from the admin template and tailored for {offer.candidate.name}.
          </BodyText>
          <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 4 }}>
            The opening and worksheet merge fields were personalised. Legal, contingency, and disclosure clauses stay locked to the template.
          </BodyText>
        </Box>
        <Flex gap="xxs" flexWrap="wrap">
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label="Template fit passed" />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label="No missing fields" />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Blue} emphasis={StatusIndicatorEmphasis.Low} label="Within accepted range" />
          </span>
          <span style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label="Template clauses locked" />
          </span>
        </Flex>
      </Flex>

      <Flex gap="xxs" flexWrap="wrap" marginTop="s">
        {sourceChips.map((source) => (
          <span key={source} style={{ display: 'inline-flex' }}>
            <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label={source} />
          </span>
        ))}
      </Flex>

      <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 10 }}>
        Compensation is visible for this active requisition. Access revokes when the candidacy ends.
      </BodyText>

      <Box
        padding="s"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          border: `1px solid ${colors.soap300}`,
          marginTop: 10,
        }}
      >
        <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600 }}>
          Agent-proposed edits
        </BodyText>
        <Box as="ul" style={{ margin: '6px 0 0 18px', padding: 0, fontSize: 12, color: colors.blackPepper500, lineHeight: 1.5 }}>
          <li>Added a warmer, values-led opening that connects the role to team impact and belonging.</li>
          <li>Kept legal, contingency, compensation, and disclosure clauses locked to the admin template.</li>
          <li>Estimated impact: +8–12% offer-response lift for similar accepted offers; confidence medium. Recruiter remains the decision owner.</li>
        </Box>
      </Box>

      <details style={{ marginTop: 8 }}>
        <summary
          style={{
            cursor: 'pointer',
            listStyle: 'none',
            fontFamily: '"Roboto", sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: SANA_LINK_ACCENT,
          }}
        >
          Show personalisation
        </summary>
        <Box as="ul" style={{ margin: '8px 0 0 18px', padding: 0, fontSize: 12, color: colors.blackPepper500, lineHeight: 1.5 }}>
          <li>Matched {offer.letterTemplate} to {COUNTRY_LABELS[offer.country]}, {offer.req.level}, and permanent salaried offer rules.</li>
          <li>Personalised the opening with {offer.candidate.name}, {offer.req.title}, {offer.workLocation}, and {offer.hiringManager}.</li>
          <li>Highlighted dynamic fields from CRFs so admins and recruiters can see which values resolve at generation time.</li>
          <li>Merged compensation, start date, reporting line, and e-sign route from the offer worksheet.</li>
          <li>Kept legal, background-check, and AI disclosure clauses under admin/legal control.</li>
        </Box>
      </details>
    </Box>
  );
}

function OfferDocumentStep({
  offer,
  setOffer,
}: {
  offer: OfferState;
  setOffer: React.Dispatch<React.SetStateAction<OfferState>>;
}) {
  const draft = offer.draftedLetter ?? '';
  const [isEditing, setIsEditing] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const [previewMode, setPreviewMode] = useState<'candidate' | 'approver'>('candidate');
  const dynamicFields = extractDynamicFieldHealth(draft);
  const qaFails = offer.docQaChecks.filter((c) => c.status === 'fail');
  const qaWarns = offer.docQaChecks.filter((c) => c.status === 'warn');
  const selectedScenario = selectedCounterOfferScenario(offer);

  return (
    <>
      <StepIntro>
        I generated a branded offer from <strong>{offer.letterTemplate}</strong>. Review the candidate view first, then edit only if needed.
      </StepIntro>

      {qaFails.length > 0 && (
        <AlertBanner
          type="error"
          message={`I can’t send this offer yet. ${qaFails.length} quality check${qaFails.length === 1 ? '' : 's'} didn’t pass.`}
          actionText="Show checks"
          onClick={() => setShowChecks(true)}
        />
      )}

      <OfferReadinessStrip offer={offer} dynamicFields={dynamicFields} />

      <Box marginBottom="s">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="xs"
          flexWrap="wrap"
        >
          <Flex gap="xxs" flexWrap="wrap">
            <button
              type="button"
              onClick={() => {
                setPreviewMode('candidate');
                setIsEditing(false);
              }}
              style={{
                border: `1px solid ${previewMode === 'candidate' && !isEditing ? colors.blueberry300 : colors.soap300}`,
                background: previewMode === 'candidate' && !isEditing ? SANA_SECONDARY_TAB_ACTIVE_BG : '#FFFFFF',
                color: previewMode === 'candidate' && !isEditing ? SANA_SECONDARY_TAB_ACTIVE_FG : colors.blackPepper500,
                borderRadius: SANA_TAB_PILL_RADIUS,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Candidate preview
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewMode('approver');
                setIsEditing(false);
              }}
              style={{
                border: `1px solid ${previewMode === 'approver' && !isEditing ? colors.blueberry300 : colors.soap300}`,
                background: previewMode === 'approver' && !isEditing ? SANA_SECONDARY_TAB_ACTIVE_BG : '#FFFFFF',
                color: previewMode === 'approver' && !isEditing ? SANA_SECONDARY_TAB_ACTIVE_FG : colors.blackPepper500,
                borderRadius: SANA_TAB_PILL_RADIUS,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Approver preview
            </button>
          </Flex>
          <Flex gap="xxs" flexWrap="wrap">
            <SecondaryButton
              size="small"
              icon={editIcon}
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setShowChecks(false);
                } else {
                  setIsEditing(true);
                  setShowChecks(true);
                }
              }}
            >
              {isEditing ? 'Close edit' : 'Edit letter'}
            </SecondaryButton>
            <TertiaryButton size="small" onClick={() => setShowChecks((v) => !v)}>
              {showChecks ? 'Hide checks' : qaWarns.length ? 'Show checks' : 'Show details'}
            </TertiaryButton>
            <TertiaryButton
              size="small"
              icon={rotateIcon}
              onClick={() => setOffer((p) => ({ ...p, draftedLetter: SAMPLE_LETTER_BODY(p) }))}
            >
              Regenerate
            </TertiaryButton>
          </Flex>
        </Flex>
      </Box>

      {isEditing ? (
        <Box
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: SANA_CARD_RADIUS_LG,
            border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
            boxShadow: SANA_CARD_SHADOW,
            marginBottom: 8,
            overflow: 'hidden',
          }}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap="s"
            padding="s"
            paddingLeft="m"
            paddingRight="m"
            style={{
              backgroundColor: colors.soap100,
              borderBottom: `1px solid ${colors.soap300}`,
            }}
          >
            <Flex alignItems="center" gap="xs">
              <WorkdayWMark size={28} />
              <Box>
                <BodyText size="small" style={{ fontWeight: 700, color: colors.blackPepper600 }}>
                  Workday Docs
                </BodyText>
                <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12 }}>
                  Editing mode · Dynamic fields highlighted · Locked clauses protected
                </BodyText>
              </Box>
            </Flex>
            <StatusChip label="Recruiter edit" type={StatusIndicatorType.Blue} />
          </Flex>
          <Box padding="m">
            <RichTextEditor
              value={draft}
              onChange={(html) => setOffer((p) => ({ ...p, draftedLetter: html }))}
              placeholder="Generated offer letter will appear here."
              minHeight={300}
              maxHeight={560}
              showGenAI
              candidateData={{
                name: offer.candidate.name,
                firstName: offer.candidate.name.split(' ')[0],
                email: offer.candidate.email,
                jobTitle: offer.req.title,
                requisitionId: offer.req.id,
                recruiterName: 'Priya Sharma',
                companyName: 'Workday',
              }}
            />
          </Box>
          <BodyText
            as="div"
            size="small"
            color={SANA_SECONDARY_TAB_INACTIVE_FG}
            style={{ fontStyle: 'italic', fontSize: 12, padding: '0 16px 16px' }}
          >
            Generated with Workday AI from an admin template — review before sending. Candidate-facing AI disclosure remains pending 060 legal review.
          </BodyText>
        </Box>
      ) : previewMode === 'candidate' ? (
        <OfferLetterPreview offer={offer} html={draft} variant="candidate" />
      ) : (
        <ApproverPacketPreview
          sections={offer.approverPacketSections}
          includeAiSummary={offer.includeAiApproverSummary}
          tenantAllowsAiSummary={offer.tenantAllowsAiApproverSummary}
          tone={offer.aiSummaryTone}
          onToggleAiSummary={(next) => setOffer((p) => ({ ...p, includeAiApproverSummary: next }))}
          selectedScenario={selectedScenario}
          summaryContext={{
            candidateName: offer.candidate.name,
            roleTitle: offer.req.title,
            location: offer.workLocation,
            base: offer.base,
            currency: offer.currency,
            bonusTargetPct: offer.bonusTargetPct,
            equityUnits: offer.equityUnits,
            startDate: offer.startDate,
          }}
        />
      )}

      {showChecks && (
        <>
          <TemplateEligibilityCard offer={offer} />
          <DynamicFieldHealthPanel fields={dynamicFields} />
          <ApprovalConditionExplainer offer={offer} />
          <DocQaDeck checks={offer.docQaChecks} />
          <PersonalisationAppliedCard offer={offer} />
        </>
      )}
    </>
  );
}

function ReviewAndSendStep({
  offer,
  setOffer,
  onSend,
  sending,
  onJumpToStep,
}: {
  offer: OfferState;
  setOffer: React.Dispatch<React.SetStateAction<OfferState>>;
  onSend: () => void;
  sending: boolean;
  onJumpToStep: (id: StepId) => void;
}) {
  const totalY1 = offer.base + Math.round((offer.base * offer.bonusTargetPct) / 100) + offer.signOn;
  const selectedScenario = selectedCounterOfferScenario(offer);
  const qaFails = offer.docQaChecks.filter((c) => c.status === 'fail');
  const deGateOpen = offer.country !== 'DE' || !!offer.collectiveAgreement?.acknowledged;
  const sendBlocked = qaFails.length > 0 || !deGateOpen;
  const requiredApproverNames = offer.approvalMap
    .filter((a) => a.required)
    .map((a) => a.name)
    .join(', ');
  const sideEffects: { icon: typeof mailIcon; label: string }[] = [
    { icon: mailIcon, label: `Email offer letter to ${offer.candidate.name} for e-signature.` },
    { icon: userIcon, label: `Route approval to ${requiredApproverNames}.` },
    { icon: lockIcon, label: 'Trigger background check (provider per tenant config).' },
    { icon: documentIcon, label: 'Append the offer letter PDF to the candidate audit trail.' },
  ];
  if (offer.aadhaarESign) sideEffects.push({ icon: documentIcon, label: 'Send Aadhaar OTP for India e-signature.' });
  if (offer.twoStepCountry) sideEffects.push({ icon: documentIcon, label: 'Two-step Japan flow: step 2 issues the final letter on candidate consent.' });
  if (offer.country === 'DE') sideEffects.push({ icon: documentIcon, label: 'Works-council review: expect approx. 5 business days of additional cycle time.' });

  return (
    <>
      <StepIntro>
        Review before sending. You can still revise anything in chat or by selecting a step.
      </StepIntro>

      {qaFails.length > 0 && (
        <AlertBanner
          type="error"
          message={`I can’t send this offer yet. ${qaFails.length} quality check${qaFails.length === 1 ? '' : 's'} didn’t pass.`}
          actionText="See what’s wrong"
          onClick={() => onJumpToStep('offer-document')}
        />
      )}
      {offer.country === 'DE' && !offer.collectiveAgreement?.acknowledged && (
        <AlertBanner
          type="warning"
          message="Collective-agreement acknowledgement is required before Send."
          actionText="Go to country and approvers"
          onClick={() => onJumpToStep('country-and-approvers')}
        />
      )}

      <DisplayCard icon={userIcon} label="Candidate" value={offer.candidate.name} subInfo={offer.candidate.email} />
      <DisplayCard
        icon={documentIcon}
        label="Requisition"
        value={`${offer.req.id} · ${offer.req.title}`}
        subInfo={`${offer.req.level} · ${offer.req.location}`}
      />
      <DisplayCard
        icon={locationIcon}
        label="Work location"
        value={offer.workLocation}
        subInfo={`${COUNTRY_LABELS[offer.country]}${offer.overlapEnabled && offer.overlapIncumbent ? ` · Overlap with ${offer.overlapIncumbent.name}` : ''}`}
      />
      <DisplayCard
        icon={calendarIcon}
        label="Start date"
        value={formatHumanDate(offer.startDate)}
        subInfo={offer.startDatePayrollSafe ? 'Payroll-safe' : 'Not payroll-aligned — review'}
      />
      <DisplayCard
        icon={dollarIcon}
        label="Compensation (year 1)"
        value={formatMoney(totalY1, offer.currency)}
        subInfo={`Base ${formatMoney(offer.base, offer.currency)} · Bonus ${offer.bonusTargetPct}% · Equity ${offer.equityUnits.toLocaleString()} units · Sign-on ${formatMoney(offer.signOn, offer.currency)}`}
      />
      <DisplayCard
        icon={infoIcon}
        label="Counter-offer recommendation applied"
        value={selectedScenario.label}
        subInfo={`${selectedScenario.approvalImpact} Confidence ${selectedScenario.confidence}. Recommendation is advisory only.`}
      >
        <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 6 }}>
          {selectedScenario.marketAnchor}
        </BodyText>
      </DisplayCard>
      <DisplayCard
        icon={userIcon}
        label="Approvers"
        value={offer.approvalMap.map((a) => a.name).join(', ')}
        subInfo={offer.approvalMap.map((a) => a.role).join(' · ')}
      />
      <DisplayCard icon={documentIcon} label="Letter template" value={offer.letterTemplate} />

      <ApprovalConditionExplainer offer={offer} compact />

      {/* Idea 4 — Approver Packet Preview (what approvers will see) */}
      <details style={{ marginBottom: 8 }}>
        <summary
          style={{
            cursor: 'pointer',
            listStyle: 'none',
            fontFamily: '"Roboto", sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: SANA_LINK_ACCENT,
            margin: '8px 0',
          }}
        >
          Preview approver packet
        </summary>
        <ApproverPacketPreview
          sections={offer.approverPacketSections}
          includeAiSummary={offer.includeAiApproverSummary}
          tenantAllowsAiSummary={offer.tenantAllowsAiApproverSummary}
          tone={offer.aiSummaryTone}
          onToggleAiSummary={(next) => setOffer((p) => ({ ...p, includeAiApproverSummary: next }))}
          selectedScenario={selectedScenario}
          summaryContext={{
            candidateName: offer.candidate.name,
            roleTitle: offer.req.title,
            location: offer.workLocation,
            base: offer.base,
            currency: offer.currency,
            bonusTargetPct: offer.bonusTargetPct,
            equityUnits: offer.equityUnits,
            startDate: offer.startDate,
          }}
        />
      </details>

      {/* Idea 1b — Approval map re-rendered read-only so the recruiter sees live status */}
      <Box marginTop="s" marginBottom="xxs">
        <BodyText
          as="div"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
            marginBottom: 6,
          }}
        >
          Approval map — live status
        </BodyText>
      </Box>
      <ApprovalMap entries={offer.approvalMap} readOnly />

      <Box marginTop="s">
        <ToggleRow
          title="AI disclosure on the candidate’s copy"
          on={true}
          rationale="Drafted with Workday AI — reviewed and sent by you. The candidate-facing letter will include a one-line disclosure (pending 060 legal review). This is separate from the approver-summary switch above."
        />
      </Box>

      <Box
        padding="m"
        style={{
          backgroundColor: SSA_DISPLAY_CARD_BG,
          borderRadius: SSA_DISPLAY_CARD_RADIUS,
          border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
          marginBottom: 8,
        }}
      >
        <BodyText
          as="div"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
            marginBottom: 8,
          }}
        >
          What happens when you send
        </BodyText>
        <Flex flexDirection="column" gap="xs">
          {sideEffects.map((se, i) => (
            <Flex key={i} alignItems="center" gap="s">
              <SystemIcon icon={se.icon} size={18} color={colors.blueberry500} />
              <BodyText size="small" color={colors.blackPepper600} style={{ fontSize: 13 }}>{se.label}</BodyText>
            </Flex>
          ))}
        </Flex>
      </Box>

      <Flex gap="s" marginTop="s">
        <PrimaryButton onClick={onSend} disabled={sending || sendBlocked}>
          {sending ? 'Sending offer…' : 'Send offer'}
        </PrimaryButton>
        <SecondaryButton disabled={sending}>Save draft</SecondaryButton>
        <TertiaryButton disabled={sending}>Cancel</TertiaryButton>
      </Flex>
      {sendBlocked && !sending && (
        <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 6 }}>
          Send is locked until you resolve the items above.
        </BodyText>
      )}
    </>
  );
}

function SuccessState({
  offer,
  txnId,
  onSendAnother,
}: {
  offer: OfferState;
  txnId: string;
  onSendAnother: () => void;
}) {
  return (
    <Box
      padding="l"
      style={{
        backgroundColor: SSA_DISPLAY_CARD_BG,
        borderRadius: SSA_DISPLAY_CARD_RADIUS,
        border: `1px solid ${SSA_DISPLAY_CARD_BORDER}`,
        marginBottom: 8,
      }}
    >
      <Flex flexDirection="column" alignItems="center" gap="s" padding="l">
        <SystemIcon icon={checkCircleIcon} size={48} color={colors.greenery500} />
        <Heading size="medium" style={{ textAlign: 'center', margin: 0 }}>
          Offer sent to {offer.candidate.name}.
        </Heading>
        <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ textAlign: 'center' }}>
          Transaction <strong>{txnId}</strong> · Sent {nowTimestamp()} · {offer.req.id} · Offer PDF (87 KB)
        </BodyText>
        <Flex gap="s" marginTop="s">
          <PrimaryButton>View offer</PrimaryButton>
          <SecondaryButton onClick={onSendAnother}>Send another</SecondaryButton>
        </Flex>
      </Flex>
      <Box marginTop="l">
        <BodyText
          as="div"
          size="small"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: SSA_MICRO_LABEL_COLOR,
            marginBottom: 8,
          }}
        >
          What just happened
        </BodyText>
        <Flex flexDirection="column" gap="xs">
          <Flex alignItems="center" gap="s">
            <span style={{ display: 'inline-flex' }}>
              <StatusIndicator type={StatusIndicatorType.Green} emphasis={StatusIndicatorEmphasis.Low} label={`Offer letter sent to ${offer.candidate.name}`} />
            </span>
          </Flex>
          <Flex alignItems="center" gap="s">
            <span style={{ display: 'inline-flex' }}>
              <StatusIndicator type={StatusIndicatorType.Orange} emphasis={StatusIndicatorEmphasis.Low} label={`Approval routed to ${offer.approvers[0]?.name ?? 'approver'}`} />
            </span>
          </Flex>
          <Flex alignItems="center" gap="s">
            <span style={{ display: 'inline-flex' }}>
              <StatusIndicator type={StatusIndicatorType.Blue} emphasis={StatusIndicatorEmphasis.Low} label="Background check kicked off" />
            </span>
          </Flex>
          <Flex alignItems="center" gap="s">
            <span style={{ display: 'inline-flex' }}>
              <StatusIndicator type={StatusIndicatorType.Gray} emphasis={StatusIndicatorEmphasis.Low} label="Logged to candidate audit trail" />
            </span>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * Main component
\* ----------------------------------------------------------------------- */

/* ----------------------------------------------------------------------- *\
 * Generic SSA cold-start welcome — shown when `mode === 'cold-start'`.
 * Mirrors the canonical SSA home (reference image 2026-05-01 + ov-1800.png):
 * sparkle mark + greeting + capability subtitle. No offer context yet.
\* ----------------------------------------------------------------------- */

const SSA_COLD_START_WELCOME: ChatMessage = {
  id: 'm-cold-start-welcome',
  role: 'agent',
  timestamp: '',
  body: (
    <Box>
      <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>
        Hi, I’m Self-Service Agent!
      </BodyText>
      <BodyText size="small" style={{ marginTop: 4 }}>
        I can help answer general policy questions and help get things done.
      </BodyText>
      <BodyText size="small" style={{ marginTop: 4 }}>
        Explore suggestions below or ask me anything.
      </BodyText>
    </Box>
  ),
};

export const CreateOfferSsaV01: React.FC = () => {
  /** SSA shell mode. Cold-start renders the generic centred chat home (no
   *  right pane). The "create offer" intent flips this to in-task and the
   *  split-pane canvas materialises on the right. See reference:
   *  design/references/ssa-create-req-videos/frames-overlap/ov-1800.png →
   *  ov-2700.png. */
  const [mode, setMode] = useState<'cold-start' | 'in-task'>('cold-start');
  const [offer, setOffer] = useState<OfferState>(SEED_OFFER);
  const [step, setStep] = useState<StepId>('candidate-and-req');
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  /** Steps that the agent has mutated via chat that the user hasn't yet re-opened.
   *  Surfaces a "review" dot on the stepper to close the trust gap when chat silently
   *  edits a non-current step (318 finding). */
  const [changedSinceVisited, setChangedSinceVisited] = useState<Set<StepId>>(new Set());
  /** Per-card edit state. null = no card open for editing. Keeps display-by-default
   *  behaviour while letting the user open one card at a time. */
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [composer, setComposer] = useState('');
  const [suggestionSet, setSuggestionSet] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { ...SSA_COLD_START_WELCOME, timestamp: nowTimestamp() },
  ]);
  const [sending, setSending] = useState(false);
  const [sentTxnId, setSentTxnId] = useState<string | null>(null);
  /** After Send for Approval, we flip the canvas to a Microsoft Teams mockup
   *  so the user sees what the approver receives. Holds the draft transaction
   *  id until the approver (mock) clicks "Approve offer" in Teams. Then
   *  `teamsPreviewTxnId` is cleared and `sentTxnId` is set → SuccessState renders.
   *  Reference frame: design/references/ssa-create-req-videos/frames-overlap/ov-2700.png. */
  const [teamsPreviewTxnId, setTeamsPreviewTxnId] = useState<string | null>(null);

  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: focus the start of the latest assistant response (per 015-sana-style-ui.md guidance).
  useEffect(() => {
    if (!threadRef.current) return;
    const last = threadRef.current.lastElementChild;
    if (last) (last as HTMLElement).scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [messages]);

  const submitUserText = (rawText: string) => {
    const userText = rawText.trim();
    if (!userText) return;
    const userMsg: ChatMessage = {
      id: nextChatId(),
      role: 'user',
      timestamp: nowTimestamp(),
      text: userText,
      body: <BodyText size="small">{userText}</BodyText>,
    };
    const reply = processUserIntent(userText, offer, mode);
    if (reply.mutate) setOffer((prev) => reply.mutate!(prev));
    if (reply.enterTaskMode) setMode('in-task');
    if (reply.affectsSteps && reply.affectsSteps.length) {
      setChangedSinceVisited((prev) => {
        const next = new Set(prev);
        for (const s of reply.affectsSteps!) {
          if (s !== step) next.add(s);
        }
        return next;
      });
    }
    const agentMsg: ChatMessage = {
      id: nextChatId(),
      role: 'agent',
      timestamp: nowTimestamp(),
      body: reply.body,
    };
    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setComposer('');
  };

  const onSend = () => submitUserText(composer);

  const goToStep = (next: StepId) => {
    if (next === step) return;
    const currentIdx = STEPS.findIndex((s) => s.id === step);
    const nextIdx = STEPS.findIndex((s) => s.id === next);
    if (nextIdx > currentIdx) {
      setCompleted((prev) => new Set(prev).add(step));
    }
    setChangedSinceVisited((prev) => {
      if (!prev.has(next)) return prev;
      const n = new Set(prev);
      n.delete(next);
      return n;
    });
    setStep(next);
  };

  const advance = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx < STEPS.length - 1) {
      setCompleted((prev) => new Set(prev).add(step));
      const next = STEPS[idx + 1].id;
      setChangedSinceVisited((prev) => {
        if (!prev.has(next)) return prev;
        const n = new Set(prev);
        n.delete(next);
        return n;
      });
      setStep(next);
    }
  };

  const goBack = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx > 0) {
      const prevStep = STEPS[idx - 1].id;
      setChangedSinceVisited((prev) => {
        if (!prev.has(prevStep)) return prev;
        const n = new Set(prev);
        n.delete(prevStep);
        return n;
      });
      setStep(prevStep);
    }
  };

  const sendOffer = () => {
    setSending(true);
    setTimeout(() => {
      const id = `WD-OFR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setTeamsPreviewTxnId(id);
      setSending(false);
      setCompleted(new Set(STEPS.map((s) => s.id)));
      const approverName = offer.approvers[0]?.name ?? offer.hiringManager;
      setMessages((prev) => [
        ...prev,
        {
          id: nextChatId(),
          role: 'agent',
          timestamp: nowTimestamp(),
          body: (
            <Box>
              <BodyText size="small">
                Sent to <strong>{approverName}</strong> for approval. Here&rsquo;s what she sees in Microsoft Teams →
              </BodyText>
              <BodyText size="small" style={{ marginTop: 6 }}>
                I&rsquo;ll send the letter to <strong>{offer.candidate.name}</strong> as soon as she approves.
              </BodyText>
            </Box>
          ),
        },
      ]);
    }, 900);
  };

  const approveInTeams = () => {
    if (!teamsPreviewTxnId) return;
    const id = teamsPreviewTxnId;
    setSentTxnId(id);
    setTeamsPreviewTxnId(null);
    const approverName = offer.approvers[0]?.name ?? offer.hiringManager;
    setMessages((prev) => [
      ...prev,
      {
        id: nextChatId(),
        role: 'agent',
        timestamp: nowTimestamp(),
        body: (
          <Box>
            <BodyText size="small">
              Approved by <strong>{approverName}</strong>. Offer letter is with <strong>{offer.candidate.name}</strong> for signature. Background check kicked off.
            </BodyText>
            <BodyText size="small" style={{ marginTop: 6 }}>
              Transaction <strong>{id}</strong>. Anything else I can help with?
            </BodyText>
          </Box>
        ),
      },
    ]);
  };

  const sendAnother = () => {
    setOffer(SEED_OFFER);
    setStep('candidate-and-req');
    setCompleted(new Set());
    setChangedSinceVisited(new Set());
    setSentTxnId(null);
    setTeamsPreviewTxnId(null);
    setSuggestionSet(0);
    setMode('cold-start');
    setMessages([
      { ...SSA_COLD_START_WELCOME, id: nextChatId(), timestamp: nowTimestamp() },
    ]);
  };

  const stepIdx = STEPS.findIndex((s) => s.id === step);

  /* ----------------------------------------------------------------------- *
   * Slots for <SsaShell>. Cold-start and in-task layouts are now handled by
   * the shared shell; this prototype supplies the slot contents.
   *   - coldStartContent: sparkle hero + generic greeting + starter set +
   *     composer, mirroring the SSA home reference (ov-1800.png + attached
   *     2026-05-01 frame).
   *   - chatPaneContent:  thread + composer + AI disclosure (left pane of
   *     the split-pane; ov-2700.png).
   *   - canvasContent:    header card + stepper + active step, or success
   *     state (right pane; ov-9900.png).
   * --------------------------------------------------------------------- */

  const coldStartContent = (
    <>
      <Box
        ref={threadRef}
        style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}
      >
        {messages.map((m, idx) => {
          const isColdStartWelcome =
            (idx === 0 && m.id.startsWith('m-cold-start-welcome')) ||
            (idx === 0 && messages.length === 1);
          if (isColdStartWelcome) {
            return (
              <React.Fragment key={m.id}>
                <Flex alignItems="flex-start" gap="xs" marginBottom="xs">
                  <SparkleMark size={20} />
                </Flex>
                <Box marginBottom="s">{m.body}</Box>
                {messages.length === 1 && !sending && (
                  <SsaStarterSuggestions
                    setIndex={suggestionSet}
                    suggestionSets={COLD_START_SUGGESTION_SETS}
                    onPick={(text) => submitUserText(text)}
                    onRotate={() => setSuggestionSet((s) => s + 1)}
                    disabled={sending}
                    variant="cold-start"
                  />
                )}
              </React.Fragment>
            );
          }
          return m.role === 'agent' ? (
            <SsaAgentTurn key={m.id}>{m.body}</SsaAgentTurn>
          ) : (
            <SsaUserPromptPill key={m.id} text={m.text ?? ''} maxWidth="480px" />
          );
        })}
      </Box>
      <Box style={{ padding: '16px 0 20px' }}>
        <SanaCommComposer
          value={composer}
          onChange={setComposer}
          onSend={onSend}
          placeholder="Ask me anything."
          sendDisabled={!composer.trim() || sending}
        />
        <BodyText
          as="div"
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{
            marginTop: 8,
            fontSize: 11,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>
    </>
  );

  const chatPaneContent = (
    <>
      <Box
        ref={threadRef}
        padding="m"
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
      >
        {messages.map((m, idx) => (
          <React.Fragment key={m.id}>
            {m.role === 'agent' ? (
              <SsaAgentTurn hideFeedback={idx === 0 && m.id.startsWith('m-cold-start-welcome')}>
                {m.body}
              </SsaAgentTurn>
            ) : (
              <SsaUserPromptPill text={m.text ?? ''} maxWidth="380px" />
            )}
            {/* In-task starter suggestions: unreachable under the cold-start-first flow
                but kept for parity with the canonical pattern (ov-2700.png mid-flow). */}
            {idx === 0 && m.role === 'agent' && messages.length === 1 && !sentTxnId && (
              <SsaStarterSuggestions
                setIndex={suggestionSet}
                suggestionSets={SUGGESTION_SETS}
                onPick={(text) => submitUserText(text)}
                onRotate={() => setSuggestionSet((s) => s + 1)}
                disabled={sending}
              />
            )}
          </React.Fragment>
        ))}
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
          onSend={onSend}
          placeholder="What would you like to do?"
          sendDisabled={!composer.trim() || sending || sentTxnId !== null || teamsPreviewTxnId !== null}
        />
        <BodyText
          as="div"
          size="small"
          color={SANA_SECONDARY_TAB_INACTIVE_FG}
          style={{
            marginTop: 10,
            fontSize: 12,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          This content was generated by AI. Review before use.
        </BodyText>
      </Box>
    </>
  );

  const approverName = offer.approvers[0]?.name ?? offer.hiringManager;
  const approverRole = offer.approvers[0]?.role ?? 'Hiring manager';
  const teamsCompensationSummary = `${offer.currency} ${offer.base.toLocaleString()} base · ${offer.bonusTargetPct}% bonus target`;

  const canvasContent = (
    <>
      {teamsPreviewTxnId ? (
        <>
          <HeaderCard
            title={`Offer sent — awaiting approval in Microsoft Teams`}
            subtitle={`${offer.candidate.name} · ${offer.req.id} · Approver: ${approverName} (${approverRole})`}
            onClose={sendAnother}
          />
          <Box marginBottom="s" style={{ maxWidth: 720 }}>
            <BodyText
              size="small"
              color={SSA_MICRO_LABEL_COLOR}
              style={{ fontSize: 12, lineHeight: 1.45 }}
            >
              Workday routed the approval to {approverName} in Microsoft Teams. This is the approver&rsquo;s
              view &mdash; click <strong>Approve offer</strong> to finish the demo. Transaction{' '}
              <strong>{teamsPreviewTxnId}</strong>.
            </BodyText>
          </Box>
          <Box style={{ minHeight: 560 }}>
            <TeamsApprovalCard
              offer={{
                candidateName: offer.candidate.name,
                role: offer.req.title,
                requisitionId: offer.req.id,
                workLocation: offer.workLocation,
                startDate: new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(offer.startDate)),
                compensationSummary: teamsCompensationSummary,
                approverName,
                approverRole,
                txnId: teamsPreviewTxnId,
              }}
              onApprove={approveInTeams}
            />
          </Box>
        </>
      ) : !sentTxnId ? (
        <>
          <HeaderCard
            title={`Offer: ${offer.req.title}`}
            subtitle={`${offer.candidate.name} · ${offer.req.id} · ${offer.workLocation}`}
            onClose={() => { /* TODO: wire close — would route back to candidate profile */ }}
          />

          <ChipStepper
            current={step}
            completed={completed}
            changedSinceVisited={changedSinceVisited}
            onSelect={goToStep}
          />

          {step === 'candidate-and-req' && (
            <CandidateAndReqStep
              offer={offer}
              setOffer={setOffer}
              editingCard={editingCard}
              onEditCard={setEditingCard}
              onCancelEdit={() => setEditingCard(null)}
            />
          )}
          {step === 'compensation' && (
            <CompensationStep
              offer={offer}
              setOffer={setOffer}
              editingCard={editingCard}
              onEditCard={setEditingCard}
              onCancelEdit={() => setEditingCard(null)}
            />
          )}
          {step === 'country-and-approvers' && (
            <CountryAndApproversStep offer={offer} setOffer={setOffer} />
          )}
          {step === 'offer-document' && <OfferDocumentStep offer={offer} setOffer={setOffer} />}
          {step === 'review-and-send' && (
            <ReviewAndSendStep
              offer={offer}
              setOffer={setOffer}
              onSend={sendOffer}
              sending={sending}
              onJumpToStep={goToStep}
            />
          )}

          {step !== 'review-and-send' && (
            <Flex gap="s" marginTop="m">
              <PrimaryButton
                onClick={advance}
                disabled={step === 'country-and-approvers' && offer.country === 'DE' && !offer.collectiveAgreement?.acknowledged}
              >
                Continue
              </PrimaryButton>
              {stepIdx > 0 && <SecondaryButton onClick={goBack}>Back</SecondaryButton>}
            </Flex>
          )}
          {step === 'country-and-approvers' && offer.country === 'DE' && !offer.collectiveAgreement?.acknowledged && (
            <BodyText size="small" color={SSA_MICRO_LABEL_COLOR} style={{ fontSize: 12, marginTop: 6 }}>
              Continue is locked until you tick the collective-agreement acknowledgement above.
            </BodyText>
          )}
        </>
      ) : (
        <>
          <HeaderCard
            title={`Offer sent: ${offer.req.title}`}
            subtitle={`${offer.candidate.name} · ${offer.req.id} · ${offer.workLocation}`}
            onClose={sendAnother}
          />
          <SuccessState offer={offer} txnId={sentTxnId} onSendAnother={sendAnother} />
        </>
      )}

      <BodyText
        size="small"
        color={SANA_SECONDARY_TAB_INACTIVE_FG}
        style={{ marginTop: 24, fontStyle: 'italic', fontSize: 11 }}
      >
        Mock prototype. No real candidates, comp data, approvals, or eSign actions are triggered.
        See <code>design/create-offer-ssa-design-brief.md</code>.
      </BodyText>
    </>
  );

  return (
    <SsaShell
      mode={mode}
      tenantLabel="acme-prod"
      agentName="Self-Service Agent"
      onTogglePane={() => { /* TODO: wire pane toggle when needed */ }}
      onMinimise={() => { /* TODO: wire minimise when needed */ }}
      onClose={() => { /* TODO: wire close when needed */ }}
      coldStart={coldStartContent}
      chat={chatPaneContent}
      canvas={canvasContent}
    />
  );
};

export default CreateOfferSsaV01;
